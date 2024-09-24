<template>
    <el-dialog :title="$t('firmware.deviceList.index.222542-0')" :visible.sync="openDeviceList" width="800px"
        append-to-body>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item :label="$t('firmware.deviceList.index.222542-1')" prop="deviceName">
                <el-input v-model="queryParams.deviceName" :placeholder="$t('firmware.deviceList.index.222542-2')"
                    clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('firmware.deviceList.index.222542-3')" prop="firmwareVersion">
                <el-input v-model="queryParams.firmwareVersion" :placeholder="$t('firmware.deviceList.index.222542-4')"
                    clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search')
                    }}</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="deviceList" @select="handleSelectionChange"
            @select-all="handleSelectionAll" ref="multipleTable" size="mini" border>
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('firmware.deviceList.index.222542-1')" align="center" prop="deviceName" />
            <el-table-column :label="$t('firmware.deviceList.index.222542-5')" align="center" prop="serialNumber" />
            <el-table-column :label="$t('firmware.deviceList.index.222542-3')" align="center" prop="firmwareVersion">
                <template slot-scope="scope">
                    <span>Version </span> {{ scope.row.firmwareVersion }}
                </template>
            </el-table-column>
            <el-table-column :label="$t('firmware.deviceList.index.222542-6')" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.isOwner == 0">{{ $t('firmware.deviceList.index.222542-7')
                        }}</el-tag>
                    <el-tag type="primary" v-else>{{ $t('firmware.deviceList.index.222542-8') }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('firmware.deviceList.index.222542-9')" align="center" prop="status">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.iot_device_status" :value="scope.row.status" />
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleDeviceSelected">{{ $t('confirm') }}</el-button>
            <el-button @click="closeSelectDeviceList">{{ $t('cancel') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {
    listDeviceByGroup,
} from "@/api/iot/device";

export default {
    name: "device-list",
    dicts: ['iot_device_status'],
    props: {
        upGrade: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            // 设备分组
            formUpGrade: {},
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 是否显示设备列表
            openDeviceList: false,
            // 总条数
            total: 0,
            // 设备表格数据
            deviceList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deviceName: null,
                productId: null,
                productName: null,
                firmwareVersion: null,
                userId: null,
                userName: null,
                tenantId: null,
                tenantName: null,
                serialNumber: null,
                status: null,
                networkAddress: null,
                activeTime: null,
            },
        };
    },
    watch: {
        // 获取到父组件传递的group后，刷新列表
        upGrade: {
            handler(newVal, oldVal) {
                if (newVal.flag) {
                    this.formUpGrade = newVal
                    this.queryParams.productId = this.formUpGrade.productId;
                    this.queryParams.firmwareVersion = this.formUpGrade.firmwareVersion;
                    this.ids = this.formUpGrade.deviceList;
                    this.queryParams.pageNum = 1;
                    this.getList();
                }
            },
            immediate: true,
            deep: true
        }
    },
    created() {

    },
    methods: {
        /** 查询设备列表 */
        getList() {
            this.loading = true;
            listDeviceByGroup(this.queryParams).then(response => {
                this.deviceList = response.rows;
                this.total = response.total;
                this.loading = false;
                // 设置分组关联的设备选中
                this.deviceList.forEach(row => {
                    this.$nextTick(() => {
                        if (this.ids.some(x => x === row.serialNumber)) {
                            this.$refs.multipleTable.toggleRowSelection(row, true);
                        }
                    })
                });
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 多选框选中数据
        handleSelectionChange(selection, row) {
            // 设备ID是否存在于原始设备ID数组中
            let index = this.ids.indexOf(row.serialNumber);
            // 是否选中
            let value = selection.indexOf(row);
            if (index == -1 && value != -1) {
                // 不存在且选中
                this.ids.push(row.serialNumber);
            } else if (index != -1 && value == -1) {
                // 存在且取消选中
                this.ids.splice(index, 1);
            }
        },
        // 全选事件处理
        handleSelectionAll(selection) {
            for (let i = 0; i < this.deviceList.length; i++) {
                // 设备ID是否存在于原始设备ID数组中
                let index = this.ids.indexOf(this.deviceList[i].serialNumber);
                // 是否选中
                let value = selection.indexOf(this.deviceList[i]);
                if (index == -1 && value != -1) {
                    // 不存在且选中
                    this.ids.push(this.deviceList[i].serialNumber);
                } else if (index != -1 && value == -1) {
                    // 存在且取消选中
                    this.ids.splice(index, 1);
                }
            }
        },
        // 关闭选择设备列表
        closeSelectDeviceList() {
            this.openDeviceList = false;
            this.formUpGrade.flag = false;
        },
        // 更新分组下的设备
        handleDeviceSelected() {
            this.formUpGrade.deviceList = this.ids;
            this.formUpGrade.deviceAmount = this.ids.length
            this.formUpGrade.flag = false;
            // this.$emit();
            this.$modal.msgSuccess(this.$t('firmware.deviceList.index.222542-10'));
            this.openDeviceList = false;
        }
    }
};
</script>
