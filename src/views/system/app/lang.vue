<template>
    <div style="padding: 6px">
        <el-card style="margin-bottom: 5px">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['app:language:add']">
                        {{ $t('add') }}
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['app:language:remove']">
                        {{ $t('del') }}
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button v-hasPermi="['app:language:export']" plain size="mini" :loading="exportLoading" @click="handleExport">
                        {{ $t('app.start.891644-43') }}
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-upload v-hasRole="['admin']" :show-file-list="false" ref="upload" action="" :http-request="handleImport">
                        <el-button slot="trigger" :loading="importLoading" size="mini" type="primary">
                            {{ $t('app.start.891644-44') }}
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :span="1.5">
                    <el-dropdown v-hasRole="['admin']" @command="handleExportBackendMenu($event, true)">
                        <el-button plain size="mini">
                            {{ $t('app.start.891644-47') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in translateModules" :key="item.value" :command="item.value">
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="1.5">
                    <el-dropdown v-hasRole="['admin']" @command="handleExportBackendMenu($event, false)">
                        <el-button plain size="mini">
                            {{ $t('app.start.891644-45') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in translateModules" :key="item.value" :command="item.value">
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="1.5">
                    <el-dropdown v-hasRole="['admin']" @command="handleImportTranslate">
                        <el-upload v-hasRole="['admin']" :show-file-list="false" ref="upload" action="" :http-request="handleImportBackendMenu" :disabled="true">
                            <el-button slot="trigger" size="mini" type="primary">
                                {{ $t('app.start.891644-46') }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                        </el-upload>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in translateModules" :key="item.value" :command="item.value">
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
        </el-card>

        <el-card style="padding-bottom: 100px">
            <el-table v-loading="loading" :data="languageList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column :label="$t('app.lang.755172-4')" align="center" prop="id" />
                <el-table-column :label="$t('app.lang.755172-5')" align="center" prop="language" />
                <el-table-column :label="$t('app.lang.755172-6')" align="center" prop="country" />
                <el-table-column :label="$t('app.lang.755172-7')" align="center" prop="timeZone" />
                <el-table-column :label="$t('app.lang.755172-8')" align="center" prop="langName" />
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['app:language:edit']">
                            {{ $t('update') }}
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['app:language:remove']">
                            {{ $t('del') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改app语言对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item :label="$t('app.lang.755172-5')" prop="language">
                        <el-input v-model="form.language" :placeholder="$t('app.lang.755172-11')" />
                    </el-form-item>
                    <el-form-item :label="$t('app.lang.755172-6')" prop="country">
                        <el-input v-model="form.country" :placeholder="$t('app.lang.755172-12')" />
                    </el-form-item>
                    <el-form-item :label="$t('app.lang.755172-7')" prop="timeZone">
                        <el-input v-model="form.timeZone" :placeholder="$t('app.lang.755172-13')" />
                    </el-form-item>
                    <el-form-item :label="$t('app.lang.755172-8')" prop="langName">
                        <el-input v-model="form.langName" :placeholder="$t('app.lang.755172-14')" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm">
                        {{ $t('confirm') }}
                    </el-button>
                    <el-button @click="cancel">
                        {{ $t('cancel') }}
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog title="选择指定产品的物模型" :visible.sync="productModelVisible" width="500px" append-to-body>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="产品" prop="language">
                        <el-select v-model="productId" placeholder="请选择">
                            <el-option v-for="item in prodcutModels" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitProdcutModel">
                        {{ $t('confirm') }}
                    </el-button>
                    <el-button @click="closeProductModelDialog">
                        {{ $t('cancel') }}
                    </el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { listLanguage, getLanguage, delLanguage, addLanguage, updateLanguage, exportTranslate, importTranslate } from '@/api/system/language';
import * as langTransformer from './script/langTransformer';
import * as xlsxHandler from './script/xlsx';
import * as jszip from './script/jszip';
import { downFileByBlob } from '@/utils/common.js';
import { listShortProduct } from '@/api/iot/product';
export default {
    name: 'Language',
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
            // app语言表格数据
            languageList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            // 导出语言包loading
            exportLoading: false,
            // 导入excel生成语言包loading
            importLoading: false,
            //
            currentLanguage: '',
            translateModules: [
                { name: '菜单', value: 'menu' },
                { name: '字典数据', value: 'dict_data' },
                { name: '字典类型', value: 'dict_type' },
                { name: '物模型', value: 'things_model' },
                { name: '物模型模板', value: 'things_model_template' },
            ],
            currentTranslateModule: '',
            productModelVisible: false,
            prodcutModels: [],
            productId: '',
        };
    },
    created() {
        this.getList();
        this.getProductModels();
    },
    methods: {
        /** 查询app语言列表 */
        getList() {
            this.loading = true;
            listLanguage(this.queryParams).then((response) => {
                this.languageList = response.rows;
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
                language: null,
                country: null,
                timeZone: null,
                createBy: null,
                createTime: null,
                langName: null,
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
            this.title = this.$t('app.lang.755172-17');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getLanguage(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('app.lang.755172-18');
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateLanguage(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addLanguage(this.form).then((response) => {
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
            const ids = row.id || this.ids;
            this.$modal
                .confirm(this.$t('app.lang.755172-21', [ids]))
                .then(function () {
                    return delLanguage(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        // 导出语言包
        handleExport() {
            if (this.languageList.length === 0) {
                return;
            }
            try {
                this.exportLoading = true;
                // 中英文映射
                const langs = this.languageList.reduce((obj, item) => {
                    obj[item.language] = item.country;
                    return obj;
                }, {});
                // 获取json数据
                const jsonMap = langTransformer.getLangJson();
                // 转换为excel导出需要的数据格式
                const excelData = langTransformer.transoformToExcel(jsonMap, langs);
                // 导出为excel
                xlsxHandler.exportExcel(excelData, 'lang.xlsx');
            } finally {
                this.exportLoading = false;
            }
        },
        // 导入语言包excel直接导出转换后的压缩包
        async handleImport(fileInfo) {
            try {
                this.importLoading = true;
                // 中英文映射
                const langs = this.languageList.reduce((obj, item) => {
                    obj[item.country] = item.language;
                    return obj;
                }, {});
                // 读取excel文件，解析为json数据
                const data = await xlsxHandler.parseJson(fileInfo.file);
                // 将json文件转换为以模块维度的数据，用于进一步处理成压缩包文件数据
                const jsonData = jszip.parseJsonZipData(data, langs);
                // 生成zip的文件列表
                const files = jszip.generateJsonZipFiles(jsonData);
                // 下载为压缩包
                jszip.downloadFiles2Zip({
                    zipName: 'lang',
                    files: files,
                });
            } finally {
                this.importLoading = false;
            }
        },
        // 导出菜单名称翻译列表
        async handleExportBackendMenu(value, isSource = false) {
            this.currentTranslateModule = value;
            const exportFn = () => {
                const isThingsModel = this.currentTranslateModule === 'things_model';
                exportTranslate(value, isSource, isThingsModel ? this.productId : null).then((response) => {
                    let name = this.translateModules.find((item) => item.value === value).name;
                    if (isThingsModel) {
                        name += '_' + this.prodcutModels.find((item) => item.id === this.productId).name;
                    }
                    if (response.type === 'application/json') {
                        this.$modal.msgError(`导出异常`);
                        return;
                    }
                    const fileName = isSource ? `${name}原表数据.xlsx` : `${name}翻译数据.xlsx`;
                    downFileByBlob(response, fileName);
                    isThingsModel && this.closeProductModelDialog();
                });
            };
            if (value === 'things_model') {
                this.productModelVisible = true;
                this.callback = () => {
                    exportFn();
                };
            } else {
                exportFn();
            }
        },
        async handleImportBackendMenu(fileInfo) {
            let formData = new FormData();
            formData.append('file', fileInfo.file);
            const isThingsModel = this.currentTranslateModule === 'things_model';
            const productId = isThingsModel && this.productId ? this.productId : '';
            importTranslate(formData, this.currentTranslateModule, productId).then((res) => {
                this.$modal.msgSuccess('导入成功');
                isThingsModel && this.closeProductModelDialog();
            });
        },
        handleImportTranslate(value) {
            this.currentTranslateModule = value;
            if (value === 'things_model') {
                this.productModelVisible = true;
                this.callback = () => {
                    this.$refs.upload.$el.querySelector('input').click();
                };
            } else {
                this.$refs.upload.$el.querySelector('input').click();
            }
        },
        async getProductModels() {
            const res = await listShortProduct();
            console.log(res);
            if (res.code === 200) {
                this.prodcutModels = res.data || [];
            }
        },
        closeProductModelDialog() {
            this.productModelVisible = false;
            this.productId = '';
        },
        submitProdcutModel() {
            if (!this.productId) {
                this.$message.warning('请选择产品后再确认');
                return;
            }
            this.callback && this.callback(this.productId);
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
