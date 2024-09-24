<template>
    <div style="padding-left: 20px">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAlertUser"
                    v-hasPermi="['iot:device:alert:user:add']">{{ $t('add') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-refresh" size="mini"
                    @click="getList">{{ $t('refresh') }}</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="deviceUserList" size="mini">
            <el-table-column :label="$t('user.index.098976-30')" align="center" prop="userId" />
            <el-table-column :label="$t('user.profile.index.894502-1')" align="center" prop="userName" />
            <el-table-column :label="$t('user.index.098976-3')" align="center" prop="phoneNumber" />
            <el-table-column :label="$t('opation')" align="center" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['iot:device:alert:user:remove']">{{ $t('del') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--选择告警用户对话框-->
        <el-dialog :title="$t('alert-user.837395-0')" :visible.sync="open" width="800px">
            <div style="margin-top:-55px;">
                <el-divider style="margin-top:-30px;"></el-divider>
                <el-form :model="permParams" ref="permForm" :inline="true" label-width="68px">
                    <el-form-item :label="$t('user.profile.index.894502-1')" prop="userName">
                        <el-input v-model="permParams.userName" :placeholder="$t('online.093480-2')" clearable
                            size="small" @keyup.enter.native="handleUserQuery" />
                    </el-form-item>
                    <el-form-item :label="$t('user.index.098976-3')" prop="phonenumber">
                        <el-input v-model="permParams.phonenumber" :placeholder="$t('user.index.098976-4')" clearable
                            size="small" @keyup.enter.native="handleUserQuery" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini"
                            @click="handleUserQuery">{{ $t('search') }}</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                    </el-form-item>
                </el-form>

                <el-table v-loading="loading" ref="singleTable" :data="UserList" highlight-current-row size="mini"
                    @selection-change="changeCheckBoxValue" :row-key="getRowKeys">
                    <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
                    <el-table-column :label="$t('user.index.098976-30')" align="center" prop="userId" width="100" />
                    <el-table-column :label="$t('user.profile.index.894502-1')" align="center" prop="userName" />
                    <el-table-column :label="$t('user.index.098976-3')" align="center" prop="phonenumber" />
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="permParams.pageNum"
                    :limit.sync="permParams.pageSize" @pagination="getUserList" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm"
                    v-hasPermi="['iot:device:user:edit']">{{ $t('confirm') }}</el-button>
                <el-button @click="closeSelectUser">{{ $t('close') }}</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import { alertUserList, listUser, addAlertUser, delAlertUser } from '@/api/iot/alertUser';

export default {
    name: 'alert-user',
    props: {
        device: {
            type: Object,
            default: null,
        },
    },
    watch: {
        // 获取到父组件传递的device后，刷新列表
        device: {
            handler(newVal) {
                this.deviceInfo = newVal;
                if (this.deviceInfo && this.deviceInfo.deviceId != 0) {
                    this.queryParams.deviceId = this.deviceInfo.deviceId;
                    this.getList();
                }
            }
        },
    },
    data() {
        return {
            total: 0,
            // 是否显示选择用户弹出层
            open: false,
            UserList: [],
            // 查询参数
            permParams: {
                pageNum: 1,
                pageSize: 10,
                userName: undefined,
                phonenumber: undefined,
                deviceId: null,
            },
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 设备用户表格数据
            deviceUserList: [],
            // 设备信息
            deviceInfo: {},
            //用户id
            userIds: [],
            //选中的数据
            tableData: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 999,
            },
            // 表单参数
            form: {},
        };
    },
    created() {
        this.queryParams.deviceId = this.device.deviceId;
        this.getList();
    },
    methods: {
        /** 查询设备用户列表 */
        getList() {
            this.loading = true;
            listUser(this.queryParams).then((response) => {
                this.deviceUserList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        getRowKeys(row) {
            return row.userId;
        },
        // 表单重置
        reset() {
            this.form = {
                deviceId: null,
                userId: null,
                userName: null,
                phoneNumber: null,
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 告警用户弹框搜索按钮操作 */
        handleUserQuery() {
            this.permParams.pageNum = 1;
            this.getUserList();
        },
        //告警用户查询重置
        resetQuery() {
            this.resetForm("permForm");
            this.handleUserQuery();
        },
        changeCheckBoxValue(selection) {
            this.tableData = selection;
        },
        // 选择告警用户弹框
        handleAlertUser() {
            this.open = true;
            this.getUserList();
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$modal
                .confirm(this.$t('alert-user.837395-1'))
                .then(function () {
                    return delAlertUser(row.deviceId, row.userId)
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => { });
        },
        /** 查询用户 */
        getUserList() {
            alertUserList(this.permParams).then((response) => {
                this.UserList = response.rows;
                this.total = response.total;
            });
        },
        // 重置查询
        resetUserQuery() {
            this.resetForm('queryForm');
            this.reset();
        },
        // 关闭选择用户
        closeSelectUser() {
            this.open = false;
            this.resetUserQuery();
        },
        /** 确定按钮 */
        submitForm() {
            this.userIds = this.tableData.map((item) => item.userId);
            const useridStr = JSON.parse(JSON.stringify(this.userIds));
            const params = {
                userIdList: useridStr,
                deviceId: this.device.deviceId
            }
            addAlertUser(params).then((response) => {
                if (response.code == 200) {
                    this.$modal.msgSuccess(response.msg);
                    this.resetUserQuery();
                    this.open = false;
                    this.getList();
                    this.$refs.singleTable.clearSelection();
                } else {
                    this.$modal.msgError(response.msg);
                }
            });
        }

    },
};
</script>
