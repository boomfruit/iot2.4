<template>
	<div class="img-list">
		<div class="img" :style="`width:${totalWidth}`">
			<el-image
				:style="`width:${width};height:${height}`"
				:fit="imgFit"
				:src="baseImgUrl+ImageUrl"
				:preview-src-list="showPreviewList">
        <div slot="error" class="image-slot" :style="`font-size: ${width};color:gray`">
          <i class="el-icon-upload"></i>
        </div>
			</el-image>
			<el-upload
        v-if="!autoLoad"
        ref="upload"
        style="margin-top:12px"
				:show-file-list="false"
				:headers="headers"
				:accept="accept"
				:on-error="handleUploadError"
				:on-success="handleUploadSuccess"
        :before-upload="compressedImage"
        :auto-upload="autoLoad"
				:http-request="uploadFile"
        :on-change="change"
        :data="data"
				:action="actionUrl">
				<el-button size="mini" type="primary">点击上传</el-button></el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500k</div>
			</el-upload>
      <el-upload
        v-else
        ref="upload"
        style="margin-top:12px"
				:show-file-list="false"
				:headers="headers"
				:accept="accept"
				:on-error="handleUploadError"
				:on-success="handleUploadSuccess"
        :before-upload="beforeUpload"
        :auto-upload="autoLoad"
        :on-change="change"
        :data="data"
				:action="actionUrl">
				<el-button size="mini" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500k</div>
			</el-upload>
		</div>
	</div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { compressedImage } from '@/utils/upload'
export default {
  props: {
    ImageUrl: {
      type: String,
      default: ''
    },
    imgFit: {
      type: String,
      default: 'scale-down'
    },
    previewList: {
      type: Array,
      default: () => {
        return []
      }
    },
    width: {
      type: String,
      default: '144px'
    },
    height: {
      type: String,
      default: ''
    },
    totalWidth: {
      type: String,
      default: ''
    },
    baseImgUrl: {
      type: String,
      default: process.env.NODE_ENV == 'development' ? '' : process.env.VUE_APP_OSS_API
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    actionUrl:{
      type: String,
      default: `${process.env.NODE_ENV == 'development' ? '' : process.env.VUE_APP_BASE_API}/iot/product/uploadImage`
    },
    data:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    'before-upload':{
      type:Function,
      default:null
    }
  },
  data () {
    return {
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      accept: '.jpg, .png',
      // actionUrl: `${process.env.NODE_ENV == 'development' ? '' : window.PJ_CONFIG.uploadImg}/iot/product/uploadImage`
    }
  },
  computed: {
    showPreviewList () {
      return this.previewList.map(item => {
        return this.baseImgUrl + item
      })
    }
  },
  methods: {
    //上传前
    async beforeUploadFunc(file){
      if(this['before-upload']){
        await compressedImage()
        return this['before-upload']
      }else{
        return compressedImage
      }
    },
    // 上传失败
    handleUploadError () {
      this.$loading.close()
      this.$message.error('上传失败')
    },
		 // 上传成功
    handleUploadSuccess (res,file,fileList) {
      if (res.code == 200) {
        this.$emit('handleUploadSuccess', res,file,fileList)
      } else {
        this.$message.error(res.message)
      }
    },
    // 上传文件事件
    uploadFile (file) {
      this.$emit('uploadFile', file)
      this.$refs.upload.clearFiles()
    },
    // 修改触发的事件
    change (file, fileList) {
      this.$emit('change', { file, fileList })
    }
  }
}
</script>

<style lang="scss" scoped>
.img-list{
	.img{
		margin-top:20px;
		width: fit-content;
		text-align: center;
		// height: 60px;
	}
}
.image-slot{
	font-size: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: #f5f7fa;
	color: #909399;
  min-width: 100px;
  min-height: 100px;
}
</style>
