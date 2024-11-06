<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['oss:config:add']">{{ $t('system.oss.config.185269-0') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['oss:config:edit']">{{ $t('system.oss.config.185269-1') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['oss:config:remove']">{{ $t('system.oss.config.185269-2') }}</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('system.oss.config.185269-3')" align="center" prop="configKey" />
            <el-table-column :label="$t('system.oss.config.185269-4')" align="center" prop="endpoint" width="300" />
            <el-table-column :label="$t('system.oss.config.185269-5')" align="center" prop="domain" />
            <el-table-column :label="$t('system.oss.config.185269-6')" align="center" prop="bucketName" width="150" />
            <el-table-column :label="$t('system.oss.config.185269-7')" align="center" prop="prefix" />
            <el-table-column :label="$t('system.oss.config.185269-8')" align="center" prop="region" />
            <el-table-column :label="$t('system.oss.config.185269-9')" align="center" prop="accessPolicy">
                <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.accessPolicy === '0'">private</el-tag>
                    <el-tag type="success" v-if="scope.row.accessPolicy === '1'">public</el-tag>
                    <el-tag type="info" v-if="scope.row.accessPolicy === '2'">custom</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('system.oss.config.185269-10')" align="center" prop="status">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column :label="$t('system.oss.config.185269-11')" align="center" class-name="small-padding fixed-width" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['oss:config:edit']">{{ $t('system.oss.config.185269-1') }}</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['oss:config:remove']">{{ $t('system.oss.config.185269-2') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改文件存储配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <div style="margin-top: -55px">
                <el-divider style="margin-top: -30px"></el-divider>
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item :label="$t('system.oss.config.185269-12')" prop="configKey">
                        <el-input v-model="form.configKey" :placeholder="$t('system.oss.config.185269-13')" />
                    </el-form-item>
                    <el-form-item :label="$t('system.oss.config.185269-14')" prop="endpoint">
                        <el-input v-model="form.endpoint" :placeholder="$t('system.oss.config.185269-15')" />
                    </el-form-item>
                    <el-form-item :label="$t('system.oss.config.185269-16')" prop="domain">
                        <el-input v-model="form.domain" :placeholder="$t('system.oss.config.185269-17')" />
                    </el-form-item>
                    <el-form-item label="accessKey" prop="accessKey">
                        <el-input v-model="form.accessKey" :placeholder="$t('system.oss.config.185269-18')" />
                    </el-form-item>
                    <el-form-item label="secretKey" prop="secretKey">
                        <el-input v-model="form.secretKey" :placeholder="$t('system.oss.config.185269-19')" />
                    </el-form-item>
                    <el-form-item :label="$t('system.oss.config.185269-20')" prop="bucketName">
                        <el-input v-model="form.bucketName" :placeholder="$t('system.oss.config.185269-21')" />
                    </el-form-item>
                    <el-form-item :label="$t('system.oss.config.185269-22')" prop="isHttps">
                        <el-radio-group v-model="form.isHttps">
                            <el-radio v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('system.oss.config.185269-23')">
                        <el-radio-group v-model="form.accessPolicy">
                            <el-radio label="0">private</el-radio>
                            <el-radio label="1">public</el-radio>
                            <el-radio label="2">custom</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('system.oss.config.185269-24')" prop="prefix">
                        <el-input v-model="form.prefix" :placeholder="$t('system.oss.config.185269-25')" />
                    </el-form-item>
                    <el-form-item :label="$t('system.oss.config.185269-26')" prop="region">
                        <el-input v-model="form.region" :placeholder="$t('system.oss.config.185269-27')" />
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">{{ $t('system.oss.config.185269-28') }}</el-button>
                <el-button @click="cancel">{{ $t('system.oss.config.185269-29') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig, changeOssConfigStatus } from '@/api/system/ossConfig';

export default {
    name: 'Config',
    dicts: ['sys_yes_no'],
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
            // 文件存储配置表格数据
            configList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                configKey: null,
                accessKey: null,
                secretKey: null,
                bucketName: null,
                prefix: null,
                endpoint: null,
                domain: null,
                isHttps: null,
                region: null,
                accessPolicy: null,
                status: null,
                ext1: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                configKey: [{ required: true, message: this.$t('system.oss.config.185269-30'), trigger: 'blur' }],
                accessKey: [{ required: true, message: this.$t('system.oss.config.185269-31'), trigger: 'blur' }],
                secretKey: [{ required: true, message: this.$t('system.oss.config.185269-32'), trigger: 'blur' }],
                bucketName: [{ required: true, message: this.$t('system.oss.config.185269-33'), trigger: 'blur' }],
                endpoint: [{ required: true, message: this.$t('system.oss.config.185269-34'), trigger: 'blur' }],
                isHttps: [{ required: true, message: this.$t('system.oss.config.185269-35'), trigger: 'blur' }],
                accessPolicy: [{ required: true, message: this.$t('system.oss.config.185269-36'), trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询文件存储配置列表 */
        getList() {
            this.loading = true;
            listConfig(this.queryParams).then((response) => {
                this.configList = response.rows;
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
                configKey: null,
                accessKey: null,
                secretKey: null,
                bucketName: null,
                prefix: null,
                endpoint: null,
                domain: null,
                isHttps: null,
                region: null,
                accessPolicy: null,
                status: null,
                ext1: null,
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
            this.title = this.$t('system.oss.config.185269-37');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getConfig(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('system.oss.config.185269-38');
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateConfig(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('system.oss.config.185269-39'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addConfig(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('system.oss.config.185269-40'));
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
                .confirm(this.$t('system.oss.config.185269-44', [ids]))
                .then(function () {
                    return delConfig(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('system.oss.config.185269-41'));
                })
                .catch(() => {});
        },

        handleStatusChange(row) {
            const ids = row.id || this.ids;
            if (row.status === 1) {
                this.$modal.msgError(this.$t('system.oss.config.185269-42'));
            } else {
                this.$modal
                    .confirm(this.$t('system.oss.config.185269-45', [ids]))
                    .then(function () {
                        return changeOssConfigStatus(row);
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess(this.$t('system.oss.config.185269-43'));
                    })
                    .catch(() => {});
            }
        },

        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/config/export',
                {
                    ...this.queryParams,
                },
                `config_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
