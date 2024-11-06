<template>
  <!-- 批量导入设备 -->
  <el-dialog :title="upload.title" :visible.sync="upload.importDeviceDialog" width="550px" append-to-body>
    <div style="margin-top: -55px">
      <el-divider style="margin-top: -30px"></el-divider>
      <el-form label-position="top" :model="importForm" ref="importForm" :rules="importRules">
        <el-form-item :label="$t('device.allot-import-dialog.060657-0')" prop="productId">
          <el-select v-model="importForm.productId" :placeholder="$t('device.allot-import-dialog.060657-1')" style="width: 100%" filterable>
            <el-option v-for="item in productList" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('uploadFile')" prop="fileList">
          <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                     v-model="importForm.fileList" :action="upload.url + '?productId=' + importForm.productId"
                     :disabled="upload.isUploading" :on-progress="handleFileUploadProgress"
                     :on-success="handleFileSuccess" :auto-upload="false" :on-change="handleChange"
                     :on-remove="handleRemove" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">{{ $t('dragFileTips') }}<em>{{ $t('clickFileTips') }}</em></div>
            <div class="el-upload__tip" slot="tip">
              <div style="margin-top: 10px;">
                <span>{{ $t('device.batch-import-dialog.850870-5') }}</span>
              </div>
            </div>
          </el-upload>
          <el-link type="primary" :underline="false" style="font-size:14px;vertical-align: baseline;"
                   @click="importTemplate"><i class="el-icon-download"></i>{{ $t('device.batch-import-dialog.850870-6') }}</el-link>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">{{ $t('confirm') }}</el-button>
      <el-button @click="upload.importDeviceDialog = false">{{ $t('cancel') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { listProduct } from "@/api/iot/product";
import { getToken } from "@/utils/auth";
export default {
  name: 'batchImport',
  data() {
    return {
      type: 1,
      //导入表单
      importForm: {
        productId: null,
        fileList: [],
      },
      productList: [],
      file: null,
      // 批量导入参数
      upload: {
        // 是否显示弹出层
        importDeviceDialog: false,
        // 弹出层标题
        title: this.$t('batchImport'),
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/iot/device/importData"
      },
      // 批量导入表单校验
      importRules: {
        productId: [{ required: true, message: this.$t('device.allot-import-dialog.060657-14'), trigger: 'change' }],
        fileList: [
          { required: true, message: this.$t('plzUploadFile'), trigger: 'change' }
        ]
      },
    };
  },
  created() {
    this.getProductList();
  },
  methods: {
    /** 下载模板操作 */
    importTemplate() {
      this.download('/iot/device/uploadTemplate?type=' + this.type, {},
        `device_template_${new Date().getTime()}.xlsx`);
    },
    // 选择文件后给表单验证的prop字段赋值， 并且清除该字段的校验
    handleChange(file, fileList) {
      this.importForm.fileList = fileList;
      // 防止用户打开了文件选择框之后不选择文件而出现效验失败
      if (this.importForm.fileList) {
        this.$refs.importForm.clearValidate('fileList');
      }
    },
    // 删除文件后重新校验该字段
    handleRemove(file, fileList) {
      this.importForm.fileList = fileList;
      this.$refs.importForm.validateField('fileList');
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.importDeviceDialog = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", this.$t('device.allot-import-dialog.060657-17'), { dangerouslyUseHTMLString: true });
    },
    /** 查询产品列表 */
    getProductList() {
      this.loading = true;
      const params = {
        pageSize: 999,
      }
      listProduct(params).then(response => {
        this.productList = response.rows.map((item) => {
          return { value: item.productId, label: item.productName };
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs['importForm'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit();
          this.upload.importDeviceDialog = false;
        }
      });
    },
  },
};
</script>
