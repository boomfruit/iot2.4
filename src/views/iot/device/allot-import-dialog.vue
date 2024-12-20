<template>
    <!-- 导入分配设备弹窗 -->
    <el-dialog :title="upload.title" :visible.sync="upload.importAllotDialog" width="550px" append-to-body>
        <div style="margin-top: -55px">
            <el-divider style="margin-top: -30px"></el-divider>
            <el-form label-position="top" :model="allotForm" ref="allotForm" :rules="allotRules">
                <el-form-item :label="$t('device.allot-import-dialog.060657-0')" prop="productId">
                    <el-select v-model="allotForm.productId" :placeholder="$t('device.allot-import-dialog.060657-1')" filterable style="width: 100%">
                        <el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('device.allot-import-dialog.060657-2')" prop="deptId">
                    <treeselect v-model="allotForm.deptId" :options="deptOptions" :show-count="true" :placeholder="$t('device.allot-import-dialog.060657-3')" />
                </el-form-item>
                <el-form-item :label="$t('uploadFile')" prop="fileList">
                    <el-upload
                        ref="upload"
                        :limit="1"
                        accept=".xlsx, .xls"
                        :headers="upload.headers"
                        :action="upload.url + '?productId=' + allotForm.productId + '&deptId=' + allotForm.deptId"
                        :disabled="upload.isUploading"
                        :on-progress="handleFileUploadProgress"
                        :on-success="handleFileSuccess"
                        :auto-upload="false"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        drag
                        v-model="allotForm.fileList"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            {{ $t('dragFileTips') }}
                            <em>{{ $t('clickFileTips') }}</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">
                            <div style="margin-top: -5px">
                                <span>{{ $t('device.allot-import-dialog.060657-7') }}</span>
                                <div style="margin-top: -10px">
                                    <span>{{ $t('device.allot-import-dialog.060657-8') }}</span>
                                </div>
                                <div style="margin-top: -10px">
                                    <span>{{ $t('device.allot-import-dialog.060657-9') }}</span>
                                </div>
                            </div>
                        </div>
                    </el-upload>
                    <el-link type="primary" :underline="false" style="font-size: 14px; vertical-align: baseline" @click="importAllotTemplate">
                        <i class="el-icon-download"></i>
                        {{ $t('device.allot-import-dialog.060657-10') }}
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="upload.importAllotDialog = false">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="submitImportDevice">{{ $t('device.allot-import-dialog.060657-12') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { listProduct } from '@/api/iot/product';
import { getToken } from '@/utils/auth';
import { deptsTreeSelect } from '@/api/system/user';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
    name: 'allotImport',
    components: {
        Treeselect,
    },
    data() {
        return {
            type: 1,
            //导入表单
            allotForm: {
                productId: 0,
                deptId: 0,
                fileList: [],
            },
            productList: [],
            deptOptions: [],
            // 分配导入参数
            upload: {
                // 弹出层标题
                title: this.$t('device.allot-import-dialog.060657-13'),
                importAllotDialog: false,
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: { Authorization: 'Bearer ' + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/iot/device/importAssignmentData',
            },
            isSubDev: false,
            //导入分配表单校验
            allotRules: {
                productId: [{ required: true, message: this.$t('device.allot-import-dialog.060657-14'), trigger: 'change' }],
                deptId: [{ required: true, message: this.$t('device.allot-import-dialog.060657-15'), trigger: 'change' }],
                fileList: [{ required: true, message: this.$t('plzUploadFile'), trigger: 'change' }],
            },
        };
    },
    created() {
        this.getDeptTree();
        this.getProductList();
    },
    methods: {
        /** 查询机构下拉树结构 */
        getDeptTree() {
            deptsTreeSelect().then((response) => {
                this.deptOptions = response.data;
            });
        },
        /** 下载分配导入模板操作 */
        importAllotTemplate() {
            this.type = 2;
            this.download('/iot/device/uploadTemplate?type=' + this.type, {}, `allot_device_${new Date().getTime()}.xlsx`);
        },
        // 选择文件后给表单验证的prop字段赋值， 并且清除该字段的校验
        handleChange(file, fileList) {
            this.allotForm.fileList = fileList;
            if (this.allotForm.fileList) {
                this.$refs.allotForm.clearValidate('fileList');
            }
        },
        // 删除文件后重新校验该字段
        handleRemove(file, fileList) {
            this.allotForm.fileList = fileList;
            this.$refs.allotForm.validateField('fileList');
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + '</div>', this.$t('device.allot-import-dialog.060657-17'), {
                dangerouslyUseHTMLString: true,
            });
        },
        /** 查询产品列表 */
        getProductList() {
            this.loading = true;
            const params = {
                pageSize: 999,
            };
            listProduct(params).then((response) => {
                this.productList = response.rows.map((item) => {
                    return { value: item.productId, label: item.productName };
                });
                this.total = response.total;
                this.loading = false;
            });
        },
        //分配设备导入设备提交按钮
        submitImportDevice() {
            this.$refs['allotForm'].validate((valid) => {
                if (valid) {
                    this.$refs.upload.submit();
                    this.upload.importAllotDialog = false;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
