<template>
    <div class="dept-wrap">
        <el-card class="top-card-wrap">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
                <el-form-item :label="$t('system.dept.780956-0')" prop="deptName">
                    <el-input v-model="queryParams.deptName" :placeholder="$t('system.dept.780956-1')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('status')" prop="status">
                    <el-select v-model="queryParams.status" :placeholder="$t('system.dept.780956-2')" clearable>
                        <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
                        <!--  -->
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">{{ $t('role.index.094567-18') }}</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
        </el-card>

        <el-card class="card-wrap">
            <el-table v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId" :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="deptName" :label="$t('role.index.094567-7')" width="260" align="left"></el-table-column>
                <el-table-column prop="deptType" :label="$t('system.dept.780956-3')" width="200" align="left">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.department_type" :value="scope.row.deptType" />
                    </template>
                </el-table-column>
                <el-table-column prop="status" :label="$t('status')" width="200" align="center">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
                    </template>
                </el-table-column>
                <el-table-column prop="leader" :label="$t('system.dept.780956-4')" width="200" align="left"></el-table-column>
                <el-table-column :label="$t('creatTime')" align="center" prop="createTime" width="300">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']">{{ $t('system.dept.780956-5') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">{{ $t('system.dept.780956-6') }}</el-button>
                        <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">
                            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">{{ $t('system.dept.780956-7') }}</el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="handleUserManage" icon="el-icon-user" v-hasPermi="['system:user:edit']">{{ $t('system.dept.780956-8') }}</el-dropdown-item>
                                <el-dropdown-item command="handleRoleManage" icon="el-icon-circle-check">{{ $t('system.dept.780956-9') }}</el-dropdown-item>
                                <el-dropdown-item command="handleDelete" size="mini" type="text" icon="el-icon-delete" v-if="scope.row.parentId != 0" v-hasPermi="['system:dept:remove']">{{ $t('del') }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加或修改机构对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
                <div style="margin-top: -55px">
                    <el-divider style="margin-top: -30px"></el-divider>
                    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                        <el-row>
                            <el-col :span="24" v-if="form.parentId !== 0">
                                <el-form-item :label="$t('system.dept.780956-10')" prop="parentId">
                                    <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" disabled :placeholder="$t('system.dept.780956-11')" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item :label="$t('system.dept.780956-0')" prop="deptName">
                            <el-input v-model="form.deptName" :placeholder="$t('system.dept.780956-1')" />
                        </el-form-item>
                        <el-form-item :label="$t('system.dept.780956-3')" prop="deptType">
                            <el-select v-model="form.deptType" :placeholder="$t('system.dept.780956-12')" clearable size="small" style="width: 100%" :disabled="this.form.deptId != null">
                                <el-option v-for="option in deptTypeList" :key="option.value" :label="option.label" :value="option.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('system.dept.780956-4')" prop="leader">
                            <el-input v-model="form.leader" :placeholder="$t('system.dept.780956-13')" maxlength="20" />
                        </el-form-item>
                        <el-form-item :label="$t('system.dept.780956-2')">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">
                                    {{ dict.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="title-wrap">{{ $t('system.dept.780956-14') }}</div>
                        <el-form-item prop="userName">
                            <span slot="label">
                                <span class="span-box">
                                    <span>{{ $t('system.dept.780956-15') }}</span>
                                    <el-tooltip :content="$t('system.dept.780956-16')" placement="top"><i class="el-icon-warning-outline"></i></el-tooltip>
                                </span>
                            </span>
                            <el-input v-model="form.userName" :placeholder="$t('system.dept.780956-17')" :disabled="this.form.deptId != null" />
                        </el-form-item>
                        <el-form-item :label="$t('system.dept.780956-18')" prop="password" v-if="this.form.deptId == null">
                            <el-input v-model="form.password" :placeholder="$t('system.dept.780956-19')" type="password" show-password />
                        </el-form-item>
                        <el-form-item :label="$t('system.dept.780956-20')" prop="confirmPassword" v-if="this.form.deptId == null">
                            <el-input v-model="form.confirmPassword" :placeholder="$t('system.dept.780956-19')" type="password" show-password />
                        </el-form-item>
                        <el-form-item :label="$t('system.dept.780956-21')" prop="phone">
                            <el-input v-model="form.phone" :placeholder="$t('system.dept.780956-22')" maxlength="11" :disabled="this.form.deptId != null" />
                        </el-form-item>
                        <!-- <el-form-item label="地址" prop="location">
            <el-input v-model="form.location" placeholder="请输入地址" type="textarea" />
          </el-form-item> -->
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('confirm') }}</el-button>
                    <el-button @click="cancel">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild, getDeptType } from '@/api/system/dept';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
    name: 'Dept',
    dicts: ['sys_normal_disable', 'department_type'],
    components: { Treeselect },
    data() {
        const equalToPassword = (rule, value, callback) => {
            if (this.form.password !== value) {
                callback(new Error(this.$t('system.dept.780956-23')));
            } else {
                callback();
            }
        };
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 表格树数据
            deptList: [],
            // 机构树选项
            deptOptions: [],
            deptType: '',
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 是否展开，默认全部展开
            isExpandAll: true,
            // 重新渲染表格状态
            refreshTable: true,
            deptTypeList: [],
            // 查询参数
            queryParams: {
                deptName: undefined,
                status: undefined,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                parentId: [{ required: true, message: this.$t('system.dept.780956-24'), trigger: 'blur' }],
                deptName: [{ required: true, message: this.$t('system.dept.780956-25'), trigger: 'blur' }],
                deptType: [{ required: true, message: this.$t('system.dept.780956-26'), trigger: 'blur' }],
                leader: [{ required: true, message: this.$t('system.dept.780956-27'), trigger: 'blur' }],
                userName: [{ required: true, message: this.$t('system.dept.780956-28'), trigger: 'blur' }],
                password: [
                    { required: true, message: this.$t('system.dept.780956-29'), trigger: 'blur' },
                    { min: 5, max: 20, message: this.$t('user.index.098976-35'), trigger: 'blur' },
                    {
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            var passwordreg = /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/;
                            if (!passwordreg.test(value)) {
                                callback(new Error(this.$t('system.dept.780956-30')));
                            } else {
                                callback();
                            }
                        },
                    },
                ],
                confirmPassword: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: this.$t('system.dept.780956-31'),
                    },
                    {
                        required: true,
                        validator: equalToPassword,
                        trigger: 'blur',
                    },
                ],
                phone: [
                    { required: true, message: this.$t('system.dept.780956-32'), trigger: 'blur' },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: this.$t('user.index.098976-39'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询机构列表 */
        getList() {
            this.loading = true;
            listDept(this.queryParams).then((response) => {
                this.deptList = this.handleTree(response.data, 'deptId');
                this.loading = false;
            });
        },
        /** 转换机构数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.deptId,
                label: node.deptName,
                children: node.children,
            };
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                deptId: null,
                parentId: undefined,
                deptName: undefined,
                orderNum: 0,
                leader: undefined,
                phone: undefined,
                email: undefined,
                status: '0',
                deptType: 0,
                showOwner: false,
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.reset();
            this.form.deptType = null;
            if (row != undefined) {
                this.form.parentId = row.deptId;
            }
            this.open = true;
            this.title = this.$t('system.dept.780956-33');
            //查询机构类型
            if (row.deptType == null) {
                row.deptType = '';
                this.deptType = row.deptType;
                this.getDeptType();
            } else {
                this.deptType = row.deptType;
                this.getDeptType();
            }
            listDept().then((response) => {
                this.deptOptions = this.handleTree(response.data, 'deptId');
            });
        },
        //获取机构类型
        getDeptType() {
            getDeptType(this.deptType, this.form.showOwner).then((response) => {
                this.deptTypeList = response.data.map((item) => {
                    return { value: item.deptType, label: item.deptTypeName };
                });
            });
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            getDept(row.deptId).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('system.dept.780956-34');
                this.form.showOwner = true;
                if (row.deptType == null) {
                    row.deptType = '';
                    this.deptType = row.deptType;
                    this.getDeptType();
                } else {
                    this.deptType = row.deptType;
                    this.getDeptType();
                }
                listDeptExcludeChild(row.deptId).then((response) => {
                    this.deptOptions = this.handleTree(response.data, 'deptId');
                    if (this.deptOptions.length == 0) {
                        const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
                        this.deptOptions.push(noResultsOptions);
                    }
                });
            });
        },
        // 更多操作触发
        handleCommand(command, row) {
            switch (command) {
                case 'handleUserManage':
                    this.handleUserManage(row);
                    break;
                case 'handleRoleManage':
                    this.handleRoleManage(row);
                    break;
                case 'handleDelete':
                    this.handleDelete(row);
                    break;
                default:
                    break;
            }
        },
        /** 用户管理操作 */
        handleUserManage: function (row) {
            const deptId = row.deptId;
            this.$router.push('/system/user-manage/user/' + deptId);
        },
        /** 角色管理操作 */
        handleRoleManage: function (row) {
            const deptId = row.deptId;
            this.$router.push('/system/role-manage/role/' + deptId);
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.deptId != null) {
                        updateDept(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addDept(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('addSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$modal
                .confirm(this.$t('system.menu.034890-42', [row.deptName]))
                .then(function () {
                    return delDept(row.deptId);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.text-wrap {
    font-size: 16px;
    margin: -10px 0 10px 0;
    font-weight: 500;
}

.dept-wrap {
    padding: 6px;
}

.top-card-wrap {
    margin-bottom: 5px;
}

.card-wrap {
    padding-bottom: 100px;
}

.title-wrap {
    position: relative;
    padding-left: 10px;
    font-size: 16px;
    color: #303133;
    font-weight: 700;
    margin-bottom: 25px;

    &:before {
        content: '';
        background-color: #3796ec;
        width: 3px;
        height: 18px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -9px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }
}
</style>
