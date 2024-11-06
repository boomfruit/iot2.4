<template>
	<!-- 批量导入寄存器点 -->
	<el-dialog :title="upload.title" :visible.sync="upload.importDeviceDialog" width="30%" append-to-body v-loading="loading">
			<div style="margin-top: -55px;text-align:center">
					<el-divider style="margin-top: -30px"></el-divider>
					<el-form label-position="top" :model="importForm" ref="importForm" :rules="importRules">
						<el-form-item :label="$t('uploadFile')" prop="fileList">
								<el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
										v-model="importForm.fileList" :action="`${upload.url}?productId=${productId}`"
										:disabled="upload.isUploading" :on-progress="handleFileUploadProgress"
                    :on-error="handleError"
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
	name: 'import-thingModel',
	props: {
		productId: {
			type: Number,
			default: 0
		},
		justiceSelect:{
			type: String,
			default:'isSelectData'
		}
	},
	data() {
		return {
				type: 1,
				//导入表单
				importForm: {
						productId: null,
						fileList: [],
				},
				file: null,
				// 批量导入参数
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
        url: process.env.VUE_APP_BASE_API + "/iot/model/importData"
      },
				// 批量导入表单校验
				importRules: {
						fileList: [
								{ required: true, message: this.$t('plzUploadFile'), trigger: 'change' }
						]
				},
				//加载
				loading:false
		};
	},
	methods: {
			/** 下载模板操作 */
			importTemplate() {
				this.download('/iot/model/temp', {},
						`${new Date().getTime()}.xlsx`);
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
      //上传失败
      handleError(err, file, fileList){
        this.upload.importDeviceDialog = false;
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + err.msg + "</div>", this.$t('device.allot-import-dialog.060657-17'), { dangerouslyUseHTMLString: true });
      },
			// 文件上传成功处理
			handleFileSuccess(response, file, fileList) {
					this.upload.importDeviceDialog = false;
					this.upload.isUploading = false;
					this.loading = false;
					this.$refs.upload.clearFiles();
					this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", this.$t('device.allot-import-dialog.060657-17'), { dangerouslyUseHTMLString: true });
			},
			// 提交上传文件
			submitFileForm() {
					this.$refs['importForm'].validate((valid) => {
							if (valid) {
                this.upload.isUploading = true;
								this.$refs.upload.submit();
							}
					});
			},
	},
};
</script>
