<template>
  <div style="padding-left:20px;">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['iot:firmware:add']" v-if="productInfo.isOwner != 0">{{ $t('product.product-firmware.420545-0')
          }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-refresh" size="mini" @click="getList"
          v-hasPermi="['iot:firmware:list']">{{ $t('product.product-firmware.420545-1') }}</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="firmwareList" @selection-change="handleSelectionChange" size="small">
      <el-table-column :label="$t('product.product-firmware.420545-2')" align="center" prop="firmwareName" />
      <el-table-column :label="$t('product.product-authorize.314975-41')" align="center" prop="version" width="120">
        <template slot-scope="scope">
          <span>Version </span> {{ scope.row.version }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('status')" align="center" prop="isLatest" width="80">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isLatest == 1">{{ $t('product.product-firmware.420545-5') }}</el-tag>
          <el-tag type="info" v-else>{{ $t('product.product-firmware.420545-6') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-firmware.420545-7')" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-firmware.420545-8')" align="center" prop="filePath" min-width="100">
        <template slot-scope="scope">
          <el-link :href="getDownloadUrl(scope.row.filePath)" :underline="false" type="success">{{
            getDownloadUrl(scope.row.filePath) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-firmware.420545-9')" align="center" prop="remark" min-width="200" />
      <el-table-column :label="$t('product.product-firmware.420545-10')" align="center"
        class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="primary" style="padding:5px;" icon="el-icon-view"
            @click="handleUpdate(scope.row)" v-hasPermi="['iot:firmware:query']" v-if="productInfo.isOwner != 0">{{
              $t('product.product-firmware.420545-11') }}</el-button>
          <el-button size="small" type="danger" style="padding:5px;" icon="el-icon-delete"
            @click="handleDelete(scope.row)" v-hasPermi="['iot:firmware:remove']" v-if="productInfo.isOwner != 0">{{
              $t('product.product-firmware.420545-12') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改产品固件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('product.product-firmware.420545-2')" prop="firmwareName">
          <el-input v-model="form.firmwareName" :placeholder="$t('product.product-firmware.420545-13')" />
        </el-form-item>
        <el-form-item :label="$t('product.product-firmware.420545-3')" prop="version">
          <el-input v-model="form.version" :placeholder="$t('product.product-firmware.420545-14')" type="number"
            step="0.1" />
        </el-form-item>
        <el-form-item :label="$t('product.product-firmware.420545-15')" prop="isLatest">
          <el-switch v-model="form.isLatest" active-text="" inactive-text="" :active-value="1" :inactive-value="0">
          </el-switch>
          <el-link type="info" :underline="false" style="font-size:12px;margin-left:15px;">{{
            $t('product.product-firmware.420545-16') }}</el-link>
        </el-form-item>
        <el-form-item :label="$t('product.product-firmware.420545-17')" prop="filePath">
          <fileUpload ref="file-upload" :value="form.filePath" :limit="1" :fileSize="10"
            :fileType='["bin", "zip", "pdf"]' @input="getFilePath($event)"></fileUpload>
        </el-form-item>
        <el-form-item :label="$t('product.product-firmware.420545-9')" prop="remark">
          <el-input v-model="form.remark" type="textarea" rows="4"
            :placeholder="$t('product.product-firmware.420545-18')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-hasPermi="['iot:firmware:add']" v-show="!form.firmwareId">{{
          $t('product.product-firmware.420545-19') }}</el-button>
        <el-button type="primary" @click="submitForm" v-hasPermi="['iot:firmware:edit']" v-show="form.firmwareId">{{
          $t('product.product-firmware.420545-20') }}</el-button>
        <el-button @click="cancel">{{ $t('product.product-firmware.420545-21') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import fileUpload from '../../../components/FileUpload/index'
import {
  listFirmware,
  getFirmware,
  delFirmware,
  addFirmware,
  updateFirmware
} from "@/api/iot/firmware";
import {
  getToken
} from "@/utils/auth";

export default {
  name: "product-firmware",
  dicts: ["iot_yes_no"],
  components: {
    fileUpload
  },
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  watch: {
    // 获取到父组件传递的productId后，刷新列表
    product: function (newVal, oldVal) {
      this.productInfo = newVal;
      if (this.productInfo && this.productInfo.productId != 0) {
        this.queryParams.productId = this.productInfo.productId;
        this.form.productId = this.productInfo.productId;
        this.form.productName = this.productInfo.productName;
        this.getList();
      }
    }
  },
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
      // 产品固件表格数据
      firmwareList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        firmwareName: null,
        productName: null,
        productId: 0,
        isSys: null,
      },
      // 产品
      productInfo: {},
      // 表单参数
      form: {
        version: 1.0
      },
      // 表单校验
      rules: {
        firmwareName: [{
          required: true,
          message: this.$t('product.product-firmware.420545-24'),
          trigger: "blur"
        }],
        version: [{
          required: true,
          message: this.$t('product.product-firmware.420545-25'),
          trigger: "blur"
        }],
        filePath: [{
          required: true,
          message: this.$t('product.product-firmware.420545-26'),
          trigger: "blur"
        }],
      },
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: {
          Authorization: "Bearer " + getToken()
        },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/iot/tool/upload",
        // 上传的文件列表
        fileList: []
      },

    };
  },
  created() { },
  methods: {
    getDownloadUrl(path) {
      return window.location.origin + process.env.VUE_APP_BASE_API + path;
    },
    /** 查询产品固件列表 */
    getList() {
      this.loading = true;
      listFirmware(this.queryParams).then(response => {
        this.firmwareList = response.rows;
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
        firmwareId: null,
        firmwareName: null,
        tenantId: null,
        tenantName: null,
        productId: this.form.productId,
        productName: this.form.productName,
        isSys: null,
        isLatest: 0,
        version: 1.0,
        filePath: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.firmwareId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = this.$t('product.product-firmware.420545-27');
      this.upload.fileList = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const firmwareId = row.firmwareId || this.ids
      getFirmware(firmwareId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t('product.product-firmware.420545-28');
        this.upload.fileList = [{
          name: this.form.firmwareName,
          url: this.form.filePath
        }];
      });

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.firmwareId != null) {
            updateFirmware(this.form).then(response => {
              this.$modal.msgSuccess(this.$t('product.product-firmware.420545-29'));
              this.open = false;
              this.getList();
            });
          } else {
            addFirmware(this.form).then(response => {
              this.$modal.msgSuccess(this.$t('product.product-firmware.420545-30'));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const firmwareIds = row.firmwareId || this.ids;
      this.$modal.confirm(this.$t('product.product-firmware.420545-31', [firmwareIds])).then(function () {
        return delFirmware(firmwareIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.$t('product.product-firmware.420545-32'));
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('iot/firmware/export', {
        ...this.queryParams
      }, `firmware_${new Date().getTime()}.xlsx`)
    },
    // 获取文件路径
    getFilePath(data) {
      this.form.filePath = data;
    },

    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.form.filePath = response.url;
      this.$modal.msgSuccess(response.msg);
    },
    // 文件下载处理
    handleDownload(row) {
      window.open(process.env.VUE_APP_BASE_API + row.filePath);
    }

  },

};
</script>
