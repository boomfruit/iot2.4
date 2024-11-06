<template>
    <div style="padding: 6px">
        <el-card style="margin-bottom: 5px">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['order:control:add']">{{ $t('product.index.091251-10') }}</el-button>
                </el-col>
                <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            </el-row>
        </el-card>

        <el-card style="padding-bottom: 100px">
            <el-table v-loading="loading" :data="controlList">
                <el-table-column :label="$t('order.index.045965-4')" align="center" prop="modelNames" />
                <el-table-column :label="$t('order.index.045965-5')" align="center" prop="deviceName" />
                <el-table-column :label="$t('order.index.045965-6')" align="center" prop="userName" />
                <el-table-column :label="$t('order.index.045965-7')" align="center" prop="count" />
                <el-table-column :label="$t('order.index.045965-8')" align="center" prop="startTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('order.index.045965-9')" align="center" prop="endTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('iot.group.index.637432-9')" align="center" prop="remark" />
                <el-table-column :label="$t('iot.group.index.637432-10')" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-link :href="getDownloadUrl(scope.row.filePath)" :underline="false" icon="el-icon-download" size="mini" target="_blank" type="primary">
                            {{ $t('home.records') }}
                        </el-link>
                        <el-link :href="getDownloadUrl(scope.row.imgUrl)" :underline="false" icon="el-icon-download" size="mini" target="_blank" type="primary">
                            {{ $t('scada.component.302923-7') }}
                        </el-link>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="scope.row.status == '0'" v-hasPermi="['order:control:edit']">{{ $t('edit') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="scope.row.status == '0'" v-hasPermi="['order:control:remove']">{{ $t('del') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改指令权限控制对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
                <div style="margin-top: -55px">
                    <el-divider style="margin-top: -30px"></el-divider>
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        <el-form-item :label="$t('order.index.045965-10')" prop="deviceId">
                            <el-select style="width: 210px" v-model="form.deviceId" size="small" :placeholder="$t('scene.edit.202832-15')" filterable @change="getCommandList()">
                                <el-option v-for="(item, index) in deviceList" :key="index" :label="item.deviceName" :value="item.deviceId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-11')" prop="userId">
                            <el-select style="width: 210px" v-model="form.userId" size="small" :placeholder="$t('scene.edit.202832-15')" filterable>
                                <el-option v-for="(item, index) in userList" :key="index" :label="item.nickName" :value="item.userId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-12')" prop="selectOrder" v-loading="loadingSelect">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('order.index.045965-13') }}</el-checkbox>
                            <div class="select-border">
                                <el-checkbox-group v-model="checkedEqFunc" @change="handleCheckedEqFuncChange">
                                    <el-row>
                                        <el-col :span="12" v-for="command in commandsList" :key="command.modelId">
                                            <el-checkbox :label="command.modelId">{{ command.modelName }}</el-checkbox>
                                        </el-col>
                                    </el-row>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-14')" prop="count">
                            <el-input-number v-model="form.count" :min="1" :max="10000" />
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-15')" prop="startTime">
                            <el-date-picker clearable v-model="form.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('order.index.045965-16')"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-17')" prop="endTime">
                            <el-date-picker clearable v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('order.index.045965-18')"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-19')" prop="file">
                            <fileUpload ref="file-upload" :value="form.filePath" :limit="1" :fileSize="10" @input="getFilePath($event)"></fileUpload>
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-20')" prop="imgUrl">
                            <imageUpload ref="image-upload" :disabled="true" :value="form.imgUrl" :fileSize="1" @input="getImagePath($event)"></imageUpload>
                        </el-form-item>
                        <el-form-item :label="$t('order.index.045965-21')" prop="remark">
                            <el-input v-model="form.remark" type="textarea" :placeholder="$t('order.index.045965-22')" />
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('order.index.045965-23') }}</el-button>
                    <el-button @click="cancel">{{ $t('order.index.045965-24') }}</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import fileUpload from '../../../components/FileUpload/index';
import imageUpload from '../../../components/ImageUpload/index';
import { listControl, getControl, delControl, addControl, updateControl } from '@/api/iot/control';
import { listDeviceShort } from '@/api/iot/device';
import { getWriteList } from '@/api/iot/model';
import { getByDeptId } from '@/api/system/user';
import deviceList from '@/views/iot/firmware/device-list';

export default {
    name: 'Control',
    dicts: ['iot_is_enable'],

    components: {
        fileUpload,
        imageUpload,
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 指令权限控制表格数据
            controlList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            loadingSelect: false, // 加载下发指令的选择框
            isIndeterminate: false,
            checkedEqFunc: [], // 选择了的指令
            chooseAllwrList: [], // 选择了可下发所有指令
            checkAll: false,
            deviceList: [],
            userList: [],
            commandsList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                tenantId: null,
                selectOrder: null,
                status: null,
                userId: null,
                deviceId: null,
                count: null,
                file: null,
                startTime: null,
                endTime: null,
                img: null,
            },
            // 表单参数
            form: {
                status: 1,
            },
            // 表单校验
            rules: {
                deviceId: [{ required: true, message: this.$t('order.index.045965-25'), trigger: 'change' }],
                userId: [{ required: true, message: this.$t('order.index.045965-26'), trigger: 'change' }],
                count: [{ required: true, message: this.$t('order.index.045965-27'), trigger: 'blur' }],
                startTime: [{ required: true, message: this.$t('order.index.045965-28'), trigger: 'change' }],
                endTime: [{ required: true, message: this.$t('order.index.045965-29'), trigger: 'change' }],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询指令权限控制列表 */
        getList() {
            this.loading = true;
            listControl(this.queryParams).then((response) => {
                this.controlList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 获取设备列表
        getDeviceList() {
            const params = {
                showChild: true,
                pageNum: 1,
                pageSize: 9999,
            };
            listDeviceShort(params).then((res) => {
                if (res.code === 200) {
                    this.deviceList = res.rows;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取可读写物模型
        getCommandList() {
            this.loadingSelect = true;
            this.isIndeterminate = false;
            try {
                const params = {
                    deviceId: this.form.deviceId,
                    pageNum: 1,
                    pageSize: 9999,
                };
                this.chooseAllwrList = [];
                getWriteList(params).then((res) => {
                    if (res.code === 200) {
                        this.commandsList = res.rows;
                        this.commandsList.map((item) => {
                            this.chooseAllwrList.push(item.modelId);
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            } finally {
                this.loadingSelect = false;
            }
        },

        //获取本机构的用户列表
        getUserList() {
            const params = {
                pageNum: 1,
                pageSize: 9999,
            };
            getByDeptId(params).then((res) => {
                if (res.code === 200) {
                    this.userList = res.rows;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        handleCheckAllChange(val) {
            this.checkedEqFunc = val ? this.chooseAllwrList : [];
            this.isIndeterminate = false;
        },
        handleCheckedEqFuncChange(value) {
            const checkedCount = value.length;
            this.checkAll = checkedCount === this.commandsList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.commandsList.length;
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                tenantId: null,
                selectOrder: null,
                status: '1',
                userId: null,
                deviceId: null,
                count: null,
                file: null,
                startTime: null,
                endTime: null,
                img: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.checkedEqFunc = [];
            this.commandsList = [];
            this.title = this.$t('order.index.045965-1');
            this.getDeviceList();
            this.getUserList();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getControl(id).then(async (response) => {
                this.form = response.data;
                this.checkedEqFunc = response.data.selectOrder.split(',').map(Number);
                this.open = true;
                this.title = this.$t('order.index.045965-2');
                this.getDeviceList();
                this.getUserList();
                await this.getCommandList();
                // this.checkedEqFunc = [];
                // this.handleCheckedEqFuncChange(this.checkedEqFunc)
            });
        },
        // 获取文件路径
        getFilePath(data) {
            this.form.filePath = data;
        },
        /**获取上传图片的路径 */
        getImagePath(data) {
            this.form.imgUrl = data;
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.checkedEqFunc.length == 0) {
                        this.$modal.msgError(this.$t('order.index.045965-30'));
                        return;
                    }
                    this.form.selectOrder = this.checkedEqFunc.join(',');
                    if (this.form.id != null) {
                        updateControl(this.form).then((response) => {
                            this.$modal.msgSuccess('success');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addControl(this.form).then((response) => {
                            this.$modal.msgSuccess('success');
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(this.$t('order.index.045965-3', [ids]))
                .then(function () {
                    return delControl(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess('success');
                })
                .catch(() => {});
        },
        // 获取下载路径前缀
        getDownloadUrl(path) {
            console.log('url: ', window.location.origin + process.env.VUE_APP_BASE_API + path);
            return window.location.origin + process.env.VUE_APP_BASE_API + path;
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'order/control/export',
                {
                    ...this.queryParams,
                },
                `control_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.select-border {
    margin-top: 5px;
    border: 1px solid #e5e6e7;
    background: #ffffff none;
    border-radius: 4px;
    padding: 16px;
    height: 300px;
    overflow: auto;
}
</style>
