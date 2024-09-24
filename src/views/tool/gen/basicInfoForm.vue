<template>
  <el-form ref="basicInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item :label="$t('gen.basicInfoForm.235609-0')" prop="tableName">
          <el-input :placeholder="$t('gen.basicInfoForm.235609-1')" v-model="info.tableName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('gen.basicInfoForm.235609-2')" prop="tableComment">
          <el-input :placeholder="$t('gen.basicInfoForm.235609-3')" v-model="info.tableComment" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('gen.basicInfoForm.235609-4')" prop="className">
          <el-input :placeholder="$t('gen.basicInfoForm.235609-3')" v-model="info.className" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('gen.basicInfoForm.235609-5')" prop="functionAuthor">
          <el-input :placeholder="$t('gen.basicInfoForm.235609-3')" v-model="info.functionAuthor" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('remark')" prop="remark">
          <el-input type="textarea" :rows="3" v-model="info.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        tableName: [
          { required: true, message: this.$t('gen.basicInfoForm.235609-6'), trigger: "blur" }
        ],
        tableComment: [
          { required: true, message: this.$t('gen.basicInfoForm.235609-7'), trigger: "blur" }
        ],
        className: [
          { required: true, message: this.$t('gen.basicInfoForm.235609-8'), trigger: "blur" }
        ],
        functionAuthor: [
          { required: true, message: this.$t('gen.basicInfoForm.235609-9'), trigger: "blur" }
        ]
      }
    };
  }
};
</script>
