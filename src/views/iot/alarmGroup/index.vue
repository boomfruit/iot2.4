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
                <el-form-item label="通知用户">
                    <el-select v-model="bindusers" multiple allow-clear>
                        <el-option v-for="user in userList" :key="user.value" :label="user.label" :value="user.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="短信通知:">
                    <el-select v-model="dataForm.groupSmsNotify" allow-clear>
                        <el-option v-for="option in selectOpenList" :key="option.value" :label="option.label" :value="option.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="语音通知:">
                    <el-select v-model="dataForm.groupCallNotify" allow-clear>
                        <el-option v-for="option in selectOpenList" :key="option.value" :label="option.label" :value="option.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="微信推送:">
                    <el-select v-model="dataForm.groupWechatNotify" allow-clear>
                        <el-option v-for="option in selectOpenList" :key="option.value" :label="option.label" :value="option.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="额外用户">
                    <div v-for="(item, index) in dataForm.extraUsersList" :key="index" style="margin-bottom: 20px">
                        <el-row>
                            <el-col :span="3">手机号码:</el-col>
                            <el-col :span="18">
                                <el-input v-model="item.phoneNumber" placeholder="请输入手机号" style="width: 220px; margin-right: 8px" />
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">电话推送:</el-col>
                            <el-col :span="18">
                                <el-select v-model="item.notifyCall" allow-clear>
                                    <el-option v-for="option in selectOpenList" :key="option.value" :label="option.label" :value="option.value" />
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">短信推送:</el-col>
                            <el-col :span="18">
                                <el-select v-model="item.notifySms" allow-clear>
                                    <el-option v-for="option in selectOpenList" :key="option.value" :label="option.label" :value="option.value" />
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">备注:</el-col>
                            <el-col :span="18">
                                <el-input v-model="item.remark" placeholder="备注" style="width: 220px; margin-right: 8px" />
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 10px">
                            <el-col :span="9" :offset="3">
                                <el-button :disabled="dataForm.extraUsersList.length === 0 || !showMode" style="width: 60%" @click="removeDomain(item)">删除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-row>
                        <el-col :span="5" :offset="1">
                            <el-button type="dashed" style="width: 100%" @click="addDomain">
                                <i class="el-icon-plus" />
                                添加
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="报警优先级:">
                    <el-select v-model="dataForm.priority" allow-clear>
                        <el-option v-for="option in priorityOptions" :key="option.value" :label="option.label" :value="option.value" />
                    </el-select>
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
        };
    },
    beforeCreate() {
        that = this;
    },
    mounted() {
        this.getDeviceList();
        this.getUserList();
        this.getGroupList();
    },
    methods: {
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
            // const res = await listBarns();
            // const farmList = await Promise.all(
            //     res.rows.map(async (item) => {
            //         const deviceLists = await getFarmsDevice(item.id);
            //         return { name: item.name, id: item.id, deviceLists };
            //     })
            // );
            // this.treeData = farmList.map((barn) => {
            //     return {
            //         label: barn.name,
            //         id: barn.id,
            //         children: barn.deviceLists.data.map((device) => {
            //             return {
            //                 label: device.deviceName,
            //                 id: device.devicesId,
            //             };
            //         }),
            //     };
            // });
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
            this.dataForm = {
                groupName: '',
                extraUsersList: [],
                groupSmsNotify: 1,
                groupCallNotify: 1,
                groupWechatNotify: 1,
                priority: 1,
                status: 1,
            };
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
            this.bindusers = this.dataForm.innerUsersList.map((item) => item.userId);
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
        addAndEditModalOk() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    const list = this.commitKeys;
                    if (this.dataForm.alarmNotifyGroupNo) {
                        let _devicesList = [];
                        if (list.length === 0) {
                            _devicesList = this.checkedKeys.map((item) => {
                                return {
                                    deviceNo: item,
                                };
                            });
                        } else {
                            _devicesList = list.map((item) => {
                                return {
                                    deviceNo: item,
                                };
                            });
                        }

                        let _obj = {
                            ...this.dataForm,
                            devicesList: list,
                            innerUsersList: this.bindusers,
                        };
                        _obj.devicesList = _devicesList;
                        _obj.innerUsersList = _obj.innerUsersList.map((user) => {
                            const foundUser = this.userList.find((u) => u.value === user);
                            return {
                                nickName: foundUser ? foundUser.label : user,
                                userId: user,
                            };
                        });
                        let _alarmNotifyGroupNo = _obj.alarmNotifyGroupNo;
                        delete _obj.companyId;
                        delete _obj.createUserId;
                        editGroup(_obj).then((res) => {
                            this.$message.success('修改成功');
                            this.resetModal();
                        });
                        console.log(_obj, '_obj');
                    } else {
                        let _obj = {
                            ...this.dataForm,
                            devicesList: list,
                            innerUsersList: this.bindusers,
                        };
                        let _devicesList = _obj.devicesList.map((item) => {
                            return {
                                deviceNo: item,
                            };
                        });
                        _obj.devicesList = _devicesList;
                        // _obj.innerUsersList =
                        _obj.innerUsersList = _obj.innerUsersList.map((user) => {
                            const foundUser = this.userList.find((u) => u.value === user);
                            return {
                                nickName: foundUser ? foundUser.label : user,
                                userId: user,
                            };
                        });
                        addGroup(_obj).then((res) => {
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
</style>
