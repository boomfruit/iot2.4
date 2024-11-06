<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="品种名称" prop="breedName">
                <el-input v-model="queryParams.breedName" placeholder="请输入品种名称" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="品种来源" prop="breedSource">
                <el-input v-model="queryParams.breedSource" placeholder="请输入品种来源" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="源头厂家" prop="breedingCompany">
                <el-input v-model="queryParams.breedingCompany" placeholder="请输入源头厂家" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:breeds:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['iot:breeds:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['iot:breeds:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['iot:breeds:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="breedsList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="品种名称" align="center" prop="breedName" />
            <el-table-column label="品种来源" align="center" prop="breedSource" />
            <el-table-column label="源头厂家" align="center" prop="breedingCompany" />
            <el-table-column label="描述" align="center" prop="description" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['iot:breeds:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:breeds:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改品种管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="所属农场ID" prop="farmId">
                    <el-input v-model="form.farmId" placeholder="请输入所属农场ID" />
                </el-form-item>
                <el-form-item label="品种名称" prop="breedName">
                    <el-input v-model="form.breedName" placeholder="请输入品种名称" />
                </el-form-item>
                <el-form-item label="品种来源" prop="breedSource">
                    <el-input v-model="form.breedSource" placeholder="请输入品种来源" />
                </el-form-item>
                <el-form-item label="是否自繁自养1是0否" prop="selfBreeding">
                    <el-input v-model="form.selfBreeding" placeholder="请输入是否自繁自养1是0否" />
                </el-form-item>
                <el-form-item label="源头厂家" prop="breedingCompany">
                    <el-input v-model="form.breedingCompany" placeholder="请输入源头厂家" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listBreeds, getBreeds, delBreeds, addBreeds, updateBreeds } from '@/api/iot/breeds';

export default {
    name: 'Breeds',
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
            // 品种管理表格数据
            breedsList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                farmId: null,
                breedName: null,
                breedSource: null,
                selfBreeding: null,
                breedingCompany: null,
                description: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                farmId: [{ required: true, message: '所属农场ID不能为空', trigger: 'blur' }],
                breedName: [{ required: true, message: '品种名称不能为空', trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询品种管理列表 */
        getList() {
            this.loading = true;
            listBreeds(this.queryParams).then((response) => {
                this.breedsList = response.rows;
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
                farmId: null,
                breedName: null,
                breedSource: null,
                selfBreeding: null,
                breedingCompany: null,
                description: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
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
            this.title = '添加品种管理';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getBreeds(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = '修改品种管理';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateBreeds(this.form).then((response) => {
                            this.$modal.msgSuccess('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addBreeds(this.form).then((response) => {
                            this.$modal.msgSuccess('新增成功');
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
                .confirm('是否确认删除品种管理编号为"' + ids + '"的数据项？')
                .then(function () {
                    return delBreeds(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess('删除成功');
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/breeds/export',
                {
                    ...this.queryParams,
                },
                `breeds_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
