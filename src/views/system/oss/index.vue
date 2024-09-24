<template>
    <div class="oss-wrap">
        <el-card class="top-card-wrap">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="85px">
                <el-form-item :label="$t('system.oss.index.987541-0')" prop="fileSuffix">
                    <el-input v-model="queryParams.fileSuffix" :placeholder="$t('system.oss.index.987541-1')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('system.oss.index.987541-2')" prop="fileName">
                    <el-input v-model="queryParams.fileName" :placeholder="$t('system.oss.index.987541-3')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('system.oss.index.987541-4')" prop="service">
                    <el-input v-model="queryParams.service" :placeholder="$t('system.oss.index.987541-5')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('system.oss.index.987541-6') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('system.oss.index.987541-7') }}</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['oss:detail:add']">{{ $t('system.oss.index.987541-8') }}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['oss:detail:remove']">{{ $t('system.oss.index.987541-9') }}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-edit" size="mini" @click="handleOssConfig" v-hasPermi="['oss:config:edit']">{{ $t('system.oss.index.987541-10') }}</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
        </el-card>

        <el-card class="card-wrap">
            <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column :label="$t('system.oss.index.987541-11')" align="center" prop="fileName" width="200" />
                <el-table-column :label="$t('system.oss.index.987541-12')" align="center" prop="originalName" />
                <el-table-column :label="$t('system.oss.index.987541-13')" align="center" prop="fileSuffix" />
                <el-table-column :label="$t('system.oss.index.987541-14')" align="center" prop="url" width="300" />
                <el-table-column :label="$t('system.oss.index.987541-15')" align="center" prop="service" />
                <el-table-column :label="$t('system.oss.index.987541-16')" align="center" class-name="small-padding fixed-width" width="350">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-download" @click="handleDownload(scope.row)" v-hasPermi="['oss:detail:edit']">{{ $t('system.oss.index.987541-17') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['oss:detail:remove']">{{ $t('system.oss.index.987541-18') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改OSS对象存储对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
                <div style="margin-top: -55px">
                    <el-divider style="margin-top: -30px"></el-divider>
                    <el-form ref="form" :model="form" :rules="rules" label-width="60px">
                        <el-form-item :label="$t('system.oss.index.987541-11')">
                            <fileUpload v-model="form.file" :fileSize="OssfileSize" :uploadFileUrl="uploadOssUrl" />
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('system.oss.index.987541-19') }}</el-button>
                    <el-button @click="cancel">{{ $t('system.oss.index.987541-20') }}</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { listDetail, getDetail, delDetail, addDetail, updateDetail, download } from '@/api/system/ossDetail';
import router from '@/router';
import { blobValidate } from '@/utils/ruoyi';
import FileSaver from 'file-saver';

export default {
    name: 'Detail',
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
            // 文件记录表格数据
            detailList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                fileName: null,
                originalName: null,
                fileSuffix: null,
                url: null,
                service: null,
            },
            uploadOssUrl: process.env.VUE_APP_BASE_API + '/oss/detail/upload',
            OssfileSize: 100,
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                file: [{ required: true, message: this.$t('system.oss.index.987541-21'), trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询文件记录列表 */
        getList() {
            this.loading = true;
            listDetail(this.queryParams).then((response) => {
                this.detailList = response.rows;
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
                tenantId: null,
                tenantName: null,
                fileName: null,
                originalName: null,
                fileSuffix: null,
                url: null,
                service: null,
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
            this.title = this.$t('system.oss.index.987541-22');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getDetail(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('system.oss.index.987541-23');
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.open = false;
            this.getList();
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(this.$t('system.oss.index.987541-25', [ids]))
                .then(function () {
                    return delDetail(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('system.oss.index.987541-24'));
                })
                .catch(() => {});
        },
        handleDownload(row) {
            download(row.id).then((res) => {
                console.log(res.headers);
                const isBlob = blobValidate(res.data);
                if (isBlob) {
                    const blob = new Blob([res.data], { type: 'application/octet-stream' });
                    FileSaver.saveAs(blob, row.originalName);
                }
            });
        },
        handleOssConfig() {
            router.push('/system/oss-config/index');
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.oss-wrap {
    padding: 6px;

    .top-card-wrap {
        margin-bottom: 5px;
    }

    .card-wrap {
        padding-bottom: 100px;
    }
}
</style>
