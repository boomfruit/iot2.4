<template>
    <div>
        <el-card :bordered="false" class="table-h">
            <div>
                <div>
                    <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-plus" @click="addGroup()">新建</el-button>
                    <p />
                </div>
                <el-table :data="tableData" size="default">
                    <el-table-column prop="groupName" label="分组名称" />
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.status === 1 ? '正常' : '禁用' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="priority" label="优先级">
                        <template slot-scope="scope">
                            {{ priorityFormatter(scope.row.priority) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button @click="showTableData(scope.row)" type="text">查看</el-button> -->
                            <el-button @click="editTableData(scope.row)" type="text">修改</el-button>

                            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="确定删除吗？" @confirm="removeTableData(scope.row)">
                                <el-button style="margin-left: 8px" type="text" slot="reference">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <!-- 增加/修改 -->
        <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false" @close="addAndEditModalCancel" :modal="false">
            <el-form v-if="visible" ref="formRef" :model="dataForm" label-width="120px">
                <el-form-item label="分组名称:">
                    <el-input style="width: 220px" v-model="dataForm.groupName" placeholder="请输入分组名称" />
                </el-form-item>
                <el-form-item label="绑定设备">
                    <el-tree style="width: 220px" ref="tree" :data="treeData" show-checkbox :default-checked-keys="checkedKeys" node-key="id" @check="handleCheckChange" />
                </el-form-item>
                <el-form-item label="通知设置">
                    <el-table :data="alarmTypeList" style="width: 100%" row-key="id" :expand-row-keys="expandRows" @expand-change="handleExpandChange">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <div class="bound-users-list">
                                    <div v-for="(user, index) in props.row.users" :key="index" style="margin-bottom: 20px">
                                        <el-row>
                                            <el-col :span="3">姓名:</el-col>
                                            <el-col :span="18">
                                                <el-input v-model="user.name" placeholder="请输入姓名" style="width: 220px; margin-right: 8px" />
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="3">手机号码:</el-col>
                                            <el-col :span="18">
                                                <el-input v-model="user.phone" placeholder="请输入手机号" style="width: 220px; margin-right: 8px" @blur="validatePhone(user)" />
                                                <span v-if="user.phoneError" style="color: red; font-size: 12px">请输入有效的手机号码</span>
                                            </el-col>
                                        </el-row>
                                        <el-row style="margin-top: 10px">
                                            <el-col :span="9" :offset="3">
                                                <el-button style="width: 60%" @click="removeUser(props.row, index)">删除</el-button>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <el-row>
                                        <el-col :span="24">
                                            <el-button type="dashed" style="width: 100%" @click="addUserToAlarmType(props.row)">
                                                <i class="el-icon-plus"></i>
                                                添加接收人
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="报警类型" prop="name"></el-table-column>
                        <el-table-column label="电话报警" width="120">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.callNotify" active-color="#13ce66" :active-value="1" :inactive-value="0" inactive-color="#ff4949"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="短信报警" width="120">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.smsNotify" active-color="#13ce66" :active-value="1" :inactive-value="0" inactive-color="#ff4949"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="微信报警" width="120">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.wechatNotify" active-color="#13ce66" :active-value="1" :inactive-value="0" inactive-color="#ff4949"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="绑定人数" width="120">
                            <template slot-scope="scope">
                                <el-tag type="info">{{ scope.row.users.length }} 人</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="报警优先级:">
                    <el-select v-model="dataForm.priority" allow-clear>
                        <el-option v-for="option in priorityOptions" :key="option.value" :label="option.label" :value="option.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="升级时间:" v-if="dataForm.priority === 1 || dataForm.priority === 2">
                    <el-input-number v-model="dataForm.upgradeTime" :min="1" placeholder="请选择升级时间" />
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="dataForm.status" allow-clear>
                        <el-option v-for="option in statusList" :key="option.value" :label="option.label" :value="option.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input style="width: 220px" v-model="dataForm.remark" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addAndEditModalCancel">取消</el-button>
                <el-button type="primary" @click="addAndEditModalOk">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getGroupById, listGroups, addGroup, editGroup, delGroup, getBarnsAlarmDevices } from '@/api/iot/alarmGroup.js';
import { getFarmsDevice } from '@/api/iot/device';
import { listBarns } from '@/api/iot/barns';
import { listUser } from '@/api/system/user';
import { listData } from '@/api/system/dict/data';
let that;

const columns = [
    {
        title: '分组名称',
        dataIndex: 'group_name',
        key: 'group_name',
    },
    {
        title: '创建用户',
        dataIndex: 'create_user',
        key: 'create_user',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    },
];

export default {
    filters: {
        priorityFilter(e) {
            let type = '';
            switch (e) {
                case '4':
                    return (type = '报警器特报');
                case '1':
                    return (type = '一般');
                case '2':
                    return (type = '中');
                case '3':
                    return (type = '高');
            }
            return type;
        },
        statusFilter(e) {
            return e === 1 ? '正常' : '禁用';
        },
    },
    data() {
        return {
            title: '添加分组',
            loading: true,
            queryParam: {},
            dataForm: {
                groupName: '',
                extraUsersList: [],
                groupSmsNotify: 1,
                groupCallNotify: 1,
                groupWechatNotify: 1,
                priority: '1',
                status: 1,
                upgradeTime: 5,
            },
            showMode: true,
            visible: false,
            columns,
            statusList: [
                { label: '正常', value: 1 },
                { label: '禁用', value: 0 },
            ],
            priorityOptions: [
                { label: '一般', value: 1 },
                { label: '中', value: 2 },
                { label: '高', value: 3 },
            ],
            checksDevices: [],
            bindusers: [],
            selectOpenList: [
                { label: '开启', value: 1 },
                { label: '关闭', value: 0 },
            ],
            treeData: [],
            checkedKeys: [], // 存储选中的节点
            commitKeys: [],
            userList: [],
            tableData: [],
            delVisible: false,
            // ----
            expandRows: [], // 当前展开的行
            alarmTypeList: [],
            originAlarmTypeList: [],
        };
    },
    beforeCreate() {
        that = this;
    },
    mounted() {
        this.getDeviceList();
        this.getUserList();
        this.getGroupList();
        this.getDictData();
    },
    methods: {
        async getDictData() {
            const res = await listData({
                dictType: 'alarm_message_type',
            });

            let _alarmTypeList = res.rows.map((item, idx) => {
                return {
                    id: idx + 1,
                    name: item.dictLabel,
                    callNotify: 1,
                    smsNotify: 1,
                    wechatNotify: 0,
                    users: [],
                };
            });
            this.alarmTypeList = res.rows.map((item, idx) => {
                return {
                    id: idx + 1,
                    name: item.dictLabel,
                    callNotify: 1,
                    smsNotify: 1,
                    wechatNotify: 0,
                    users: [],
                };
            });
            this.originAlarmTypeList = JSON.parse(JSON.stringify(_alarmTypeList));
        },
        showDeletePopover() {
            console.log('删除按钮被点击');
            this.delVisible = true;
        },
        confirmDelete() {
            console.log('确认删除');
            this.delVisible = false;
            // 在这里添加删除逻辑
        },
        // 获取分组列表
        async getGroupList() {
            const res = await listGroups();
            this.tableData = res.rows;
        },
        // 获取栏舍下设备列表
        async getDeviceList() {
            const res = await getBarnsAlarmDevices();
            console.log(res, 'res');
            this.treeData = res.data.map((barn) => {
                return {
                    label: barn.name,
                    id: barn.barnId,
                    children: barn.devices.map((device) => {
                        return {
                            label: device.deviceName,
                            id: device.serialNumber,
                        };
                    }),
                };
            });
        },
        async getUserList() {
            const res = await listUser({
                pageNum: 1,
                pageSize: 500,
                showChild: true,
            });
            this.userList = res.rows.map((item) => {
                return {
                    label: item.nickName,
                    value: item.userId,
                };
            });
            console.log(this.userList, 'this.userList');
        },
        handleCheckChange(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
            this.commitKeys = checkedKeys.checkedNodes.filter((itm) => !itm.children).map((item) => item.id);
        },
        getCheckedKey(e) {
            this.checkedKey = e;
        },
        priorityFormatter(value) {
            console.log(value, 'value');
            const priorityMap = {
                4: '报警器特报',
                1: '一般',
                2: '中',
                3: '高',
            };
            return priorityMap[value] || '未知';
        },
        addDomain() {
            this.dataForm.extraUsersList.push({
                phoneNumber: '',
                notifyCall: 1,
                notifySms: 1,
                remark: '',
            });
        },
        addGroup() {
            this.checksDevices = [];
            this.bindusers = [];
            this.checkedKeys = [];
            listData({
                dictType: 'alarm_message_type',
            }).then((res) => {
                this.alarmTypeList = res.rows.map((item, idx) => {
                    return {
                        id: idx + 1,
                        name: item.dictLabel,
                        callNotify: 1,
                        smsNotify: 1,
                        wechatNotify: 0,
                        users: [],
                    };
                });
            });
            this.dataForm.priority = 1;
            this.showMode = true;
            this.visible = true;
            this.title = '添加分组';
        },
        removeDomain(item) {
            const index = this.dataForm.extraUsersList.indexOf(item);
            if (index !== -1) {
                this.dataForm.extraUsersList.splice(index, 1);
            }
        },
        async showTableData(record) {
            const { data } = await getAlarmNotifyGroupInfo(record.alarm_notify_group_no);
            this.title = '查看信息';
            this.dataForm = data;
            this.showMode = false;
            this.checksDevices = data.devices.map((item) => item.device_no);
            this.bindusers = data.users.map((item) => item.user_id);
            this.visible = true;
        },
        async editTableData(record) {
            this.title = '修改信息';
            const res = await getGroupById(record.id);
            this.dataForm = res.data;
            this.visible = true;
            this.checkedKeys = this.dataForm.devicesList.map((item) => item.deviceNo);
            this.alarmTypeList = res.data.notifyReceiveConfigInfoList.map((item, idx) => {
                return {
                    id: item.confInfoId,
                    name: item.alarmReceiveType,
                    callNotify: item.callNotify,
                    smsNotify: item.smsNotify,
                    wechatNotify: item.wechatNotify,
                    users: item.receiveUsersList.map((user) => {
                        return {
                            name: user.receiveUserName,
                            phone: user.phoneNumber,
                        };
                    }),
                };
            });
            console.log(res.data.notifyReceiveConfigInfoList, 'this.res.data.notifyReceiveConfigInfoList');
            // 重置报警类型的用户列表
            // this.alarmTypeList.forEach((type) => {
            //     type.users = [];
            // });

            // 映射用户到报警类型
            // this.mapUsersToAlarmTypes();
        },
        async removeTableData(record) {
            const id = record.alarmNotifyGroupNo;
            const res = await delGroup({
                alarmNotifyGroupNo: id,
            });
            this.$message.success('删除成功');
            this.getGroupList();
            this.resetModal();
        },
        validatePhone(user) {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!user.phone || !phoneRegex.test(user.phone)) {
                this.$set(user, 'phoneError', true);
                return false;
            } else {
                this.$set(user, 'phoneError', false);
                return true;
            }
        },
        addAndEditModalOk() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    // 验证所有电话号码
                    let phoneValid = true;
                    this.alarmTypeList.forEach((type) => {
                        type.users.forEach((user) => {
                            if (!this.validatePhone(user)) {
                                phoneValid = false;
                            }
                        });
                    });

                    if (!phoneValid) {
                        this.$message.error('请检查并填写正确的手机号码');
                        return;
                    }
                    const list = this.commitKeys;
                    if (this.dataForm.alarmNotifyGroupNo) {
                        let obj = {};
                        obj.alarmNotifyGroupNo = this.dataForm.alarmNotifyGroupNo;
                        obj.groupName = this.dataForm.groupName;
                        obj.priority = this.dataForm.priority;
                        obj.status = this.dataForm.status;
                        obj.remark = this.dataForm.remark;
                        if (this.dataForm.priority === 1 || this.dataForm.priority === 2) {
                            obj.upgradeTime = this.dataForm.upgradeTime;
                        }
                        obj.devicesList = list.map((item) => {
                            return {
                                deviceNo: item,
                            };
                        });
                        obj.notifyReceiveConfigInfoList = this.alarmTypeList.map((item) => {
                            return {
                                confInfoId: item.id,
                                alarmReceiveType: item.name,
                                callNotify: item.callNotify,
                                smsNotify: item.smsNotify,
                                wechatNotify: item.wechatNotify,
                                receiveUsersList: item.users.map((user) => {
                                    return {
                                        receiveUserName: user.name,
                                        phoneNumber: user.phone,
                                    };
                                }),
                            };
                        });
                        editGroup(obj).then((res) => {
                            this.$message.success('修改成功');
                            this.resetModal();
                        });
                    } else {
                        let obj = {};
                        obj.groupName = this.dataForm.groupName;
                        obj.priority = this.dataForm.priority;
                        obj.status = this.dataForm.status;
                        obj.remark = this.dataForm.remark;
                        if (this.dataForm.priority === 1 || this.dataForm.priority === 2) {
                            obj.upgradeTime = this.dataForm.upgradeTime;
                        }
                        obj.devicesList = list.map((item) => {
                            return {
                                deviceNo: item,
                            };
                        });
                        obj.notifyReceiveConfigInfoList = this.alarmTypeList.map((item) => {
                            return {
                                alarmReceiveType: item.name,
                                callNotify: item.callNotify,
                                smsNotify: item.smsNotify,
                                wechatNotify: item.wechatNotify,
                                receiveUsersList: item.users.map((user) => {
                                    return {
                                        receiveUserName: user.name,
                                        phoneNumber: user.phone,
                                    };
                                }),
                            };
                        });
                        addGroup(obj).then((res) => {
                            this.$message.success('增加成功');
                            this.resetModal();
                        });
                    }
                }
            });
        },
        addAndEditModalCancel() {
            this.resetModal();
        },
        resetModal() {
            this.showMode = true;
            this.checksDevices = [];
            this.checkedKey = [];
            this.bindusers = [];
            this.dataForm = {
                extraUsersList: [],
            };

            // this.$refs.formRef.resetFields();
            this.visible = false;
            this.getGroupList();
        },
        handleExpandChange(row, expandedRows) {
            // 如果有展开的行，则记录展开的行的id
            if (expandedRows.length > 0) {
                this.expandRows = expandedRows.map((item) => item.id);
            } else {
                this.expandRows = [];
            }
        },
        // 添加用户到报警类型
        addUserToAlarmType(alarmType) {
            // 直接添加一个空用户对象
            alarmType.users.push({
                name: '',
                phone: '',
            });
        },
        // 从报警类型中移除用户
        removeUser(alarmType, index) {
            alarmType.users.splice(index, 1);
        },
        // 在提交表单时，需要将alarmTypeList中的数据映射回用户列表
        mapAlarmTypesToUsers() {
            let innerUsersList = [];
            this.alarmTypeList.forEach((alarmType) => {
                alarmType.users.forEach((user) => {
                    if (user.name && user.phone) {
                        // 只添加有姓名和电话的用户
                        innerUsersList.push({
                            nickName: user.name,
                            phoneNumber: user.phone,
                            alarmTypeId: alarmType.id,
                        });
                    }
                });
            });
            this.dataForm.innerUsersList = innerUsersList;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
@import '@/assets/styles/sunseen-btn.scss';
.table-h {
    height: calc(100vh - 200px);
}
.search-header {
    margin-bottom: 10px;
}
/* 新增样式 */
.bound-users-list {
    padding: 10px 20px;
}

.user-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;
}

.user-name {
    font-weight: 500;
}

.user-phone {
    color: #909399;
}

.add-user-btn {
    margin-top: 10px;
    padding: 8px;
    text-align: center;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    color: #409eff;
}

.add-user-btn:hover {
    background-color: #0d1827;
}

::v-deep .el-table__expanded-cell {
    background-color: #0d1827 !important;
    border-bottom: none !important;
    padding: 20px 30px !important;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05) !important;
    border-radius: 0 0 4px 4px !important;
}
</style>
