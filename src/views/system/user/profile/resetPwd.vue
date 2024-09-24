<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item :label="$t('user.resetPwd.450986-0')" prop="oldPassword">
      <el-input v-model="user.oldPassword" :placeholder="$t('user.resetPwd.450986-1')" type="password" show-password />
    </el-form-item>
    <el-form-item :label="$t('user.resetPwd.450986-2')" prop="newPassword">
      <el-input v-model="user.newPassword" :placeholder="$t('user.resetPwd.450986-3')" type="password" show-password />
    </el-form-item>
    <el-form-item :label="$t('user.resetPwd.450986-4')" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" :placeholder="$t('user.resetPwd.450986-5')" type="password"
        show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{ $t('save') }}</el-button>
      <el-button type="danger" size="mini" @click="close">{{ $t('close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error(this.$t('user.resetPwd.450986-6')));
      } else {
        callback();
      }
    };
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: this.$t('user.resetPwd.450986-7'), trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: this.$t('user.resetPwd.450986-8'), trigger: "blur" },
          { min: 6, max: 20, message: this.$t('user.resetPwd.450986-9'), trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: this.$t('user.resetPwd.450986-10'), trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess(this.$t('updateSuccess'));
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
