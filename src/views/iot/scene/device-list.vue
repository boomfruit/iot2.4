<template>
    <el-dialog :title="$t('firmware.index.222541-31')" :visible.sync="openDeviceList" width="900px" append-to-body>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item :label="$t('device.device-edit.148398-1')" prop="deviceName">
                <el-input v-model="queryParams.deviceName" :placeholder="$t('device.device-edit.148398-2')" clearable
                    size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('device.device-edit.148398-7')" prop="serialNumber">
                <el-input v-model="queryParams.serialNumber" :placeholder="$t('device.device-edit.148398-8')" clearable
                    size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini"
                    @click="handleQuery">{{ $t('search') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" v-loading="loading" :data="deviceList" @select="handleSelectionChange"
            row-key="serialNumber" size="mini">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('device.device-edit.148398-1')" align="center" prop="deviceName" />
            <el-table-column :label="$t('device.device-edit.148398-7')" align="center" prop="serialNumber" />
            <el-table-column :label="$t('firmware.index.222541-5')" align="center" prop="productName" />
            <el-table-column :label="$t('firmware.deviceList.index.222542-6')" align="center" width="75">
                <template slot-scope="scope">
                    <el-tag type="success"
                        v-if="scope.row.isOwner == 0">{{ $t('firmware.deviceList.index.222542-7') }}</el-tag>
                    <el-tag type="primary" v-else>{{ $t('firmware.deviceList.index.222542-8') }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('home.position')" align="center" prop="locationWay" width="100">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.iot_location_way" :value="scope.row.locationWay" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('firmware.deviceList.index.222542-9')" align="center" prop="status" width="80">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.iot_device_status" :value="scope.row.status" />
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList(null)" />

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmSelectDevice">{{ $t('confirm') }}</el-button>
            <el-button @click="closeSelectDeviceList">{{ $t('cancel') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { listDeviceShort } from '@/api/iot/device';
export default {
    name: 'device-list',
    dicts: ['iot_device_status', 'iot_location_way'],
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中设备
            selectDeviceNums: [],
            productId: 0,
            productName: '',
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
                serialNumber: null,
                status: null,
            },
        };
    },
    created() { },
    methods: {
        // 获取设备列表
        getList() {
            this.deviceList = [];
            this.loading = true;
            this.queryParams.productId = this.queryParams.productId == 0 ? null : this.queryParams.productId;
            listDeviceShort(this.queryParams).then((response) => {
                this.deviceList = response.rows;
                this.total = response.total;
                this.loading = false;
                // 设置选中
                if (this.selectDeviceNums) {
                    this.deviceList.forEach((row) => {
                        this.$nextTick(() => {
                            if (this.selectDeviceNums.some((x) => x === row.serialNumber)) {
                                this.$refs.multipleTable.toggleRowSelection(row, true);
                            }
                        });
                    });
                } else {
                    // 初始化
                    this.selectDeviceNums = [];
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList(null);
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 多选框选中数据 */
        handleSelectionChange(selection, row) {
            // 设备ID是否存在于原始设备ID数组中
            let index = this.selectDeviceNums.indexOf(row.serialNumber);
            // 是否选中
            let value = selection.indexOf(row);
            if (index == -1 && value != -1) {
                // 不存在且选中
                this.selectDeviceNums.push(row.serialNumber);
                this.productId = row.productId;
                this.productName = row.productName;
            } else if (index != -1 && value == -1) {
                // 存在且取消选中
                this.selectDeviceNums.splice(index, 1);
            }

            // 筛选产品下的设备比
            if (this.selectDeviceNums.length == 0) {
                this.queryParams.productId = null;
                this.getList();
            } else if (this.selectDeviceNums.length == 1) {
                this.queryParams.productId = row.productId;
                this.getList();
            }
        },
        // 全选事件处理
        handleSelectionAll(selection) {
            for (let i = 0; i < this.deviceList.length; i++) {
                // 设备ID是否存在于原始设备ID数组中
                let index = this.selectDeviceNums.indexOf(this.deviceList[i].serialNumber);
                // 是否选中
                let value = selection.indexOf(this.deviceList[i]);
                if (index == -1 && value != -1) {
                    // 不存在且选中
                    this.selectDeviceNums.push(this.deviceList[i].serialNumber);
                } else if (index != -1 && value == -1) {
                    // 存在且取消选中
                    this.selectDeviceNums.splice(index, 1);
                }
            }
        },
        // 关闭选择设备列表
        closeSelectDeviceList() {
            this.openDeviceList = false;
        },
        /**确定选择设备，设备传递给父组件 */
        confirmSelectDevice() {
            if (this.selectDeviceNums.length > 0) {
                var data = {
                    productId: this.productId,
                    productName: this.productName,
                    deviceNums: this.selectDeviceNums,
                };
                this.$emit('deviceEvent', data);
            }
            this.openDeviceList = false;
        },
    },
};
</script>

<style lang="scss" scoped>
/***隐藏全选，避免选中不同产品的设备**/
::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
}
</style>
