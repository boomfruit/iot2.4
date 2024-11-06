<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="85px">
            <el-form-item :label="$t('system.sysclient.652154-0')" prop="clientKey">
                <el-input v-model="queryParams.clientKey" :placeholder="$t('system.sysclient.652154-1')" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('system.sysclient.652154-2') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('system.sysclient.652154-3') }}</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:sysclient:add']">{{ $t('system.sysclient.652154-4') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:sysclient:edit']">{{ $t('system.sysclient.652154-5') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:sysclient:remove']">{{ $t('system.sysclient.652154-6') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:sysclient:export']">{{ $t('system.sysclient.652154-7') }}</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="sysclientList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('system.sysclient.652154-8')" align="center" prop="clientKey" />
            <el-table-column :label="$t('system.sysclient.652154-9')" align="center" prop="clientSecret" />
            <el-table-column :label="$t('system.sysclient.652154-10')" align="center" prop="token" />
            <el-table-column :label="$t('system.sysclient.652154-13')" align="center" prop="timeout" />
            <el-table-column :label="$t('system.sysclient.652154-14')" align="center" prop="enable" />
            <el-table-column :label="$t('system.sysclient.652154-15')" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:sysclient:edit']">{{ $t('system.sysclient.652154-5') }}</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:sysclient:remove']">{{ $t('system.sysclient.652154-6') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改系统授权对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item :label="$t('system.sysclient.652154-16')" prop="clientKey">
                    <el-input v-model="form.clientKey" :placeholder="$t('system.sysclient.652154-17')" />
                </el-form-item>
                <el-form-item :label="$t('system.sysclient.652154-18')" prop="clientSecret">
                    <el-input v-model="form.clientSecret" :placeholder="$t('system.sysclient.652154-19')" />
                </el-form-item>
                <el-form-item :label="$t('system.sysclient.652154-20')" prop="timeout">
                    <el-input v-model="form.timeout" size="small" :placeholder="$t('system.sysclient.652154-21')" type="number" style="width: 200px">
                        <template slot="append">{{ $t('system.sysclient.652154-21') }}</template>
                    </el-input>
                    <span>
                        <el-tooltip class="item" effect="dark" :content="$t('system.sysclient.652154-22')" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </span>
                </el-form-item>
                <el-form-item :label="$t('system.sysclient.652154-23')" prop="enable">
                    <el-switch v-model="form.enable" active-value="1" inactive-value="0" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">{{ $t('system.sysclient.652154-24') }}</el-button>
                <el-button @click="cancel">{{ $t('system.sysclient.652154-25') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listSysclient, getSysclient, delSysclient, addSysclient, updateSysclient } from '@/api/system/sysclient';

export default {
    name: 'Sysclient',
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
            // 系统授权表格数据
            sysclientList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                clientKey: null,
                clientSecret: null,
                token: null,
                grantType: null,
                deviceType: null,
                timeout: null,
                enable: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询系统授权列表 */
        getList() {
            this.loading = true;
            listSysclient(this.queryParams).then((response) => {
                this.sysclientList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                clientKey: null,
                clientSecret: null,
                token: null,
                grantType: null,
                deviceType: null,
                timeout: null,
                enable: null,
                delFlag: null,
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('system.sysclient.652154-26');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getSysclient(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('system.sysclient.652154-27');
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateSysclient(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('system.sysclient.652154-28'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addSysclient(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('system.sysclient.652154-29'));
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
                .confirm(this.$t('system.sysclient.652154-31', [ids]))
                .then(function () {
                    return delSysclient(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('system.sysclient.652154-30'));
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'system/sysclient/export',
                {
                    ...this.queryParams,
                },
                `sysclient_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
