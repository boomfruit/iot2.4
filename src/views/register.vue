<template>
  <div class="register">
    <el-row>
      <el-col :xs="24">
        <div
          style="color: #fff; background-color: #0f73ee; width: 100%; height: 200px; text-align: center; padding: 15px; font-family: '微软雅黑'">
          <div style="font-size: 42px; padding-top: 40px; width: 300px; margin: 0 auto">
            <img :src="logo" alt="logo" style="width: 100px; height: 100px; float: left" />
            <div style="float: left; margin-top: 13px; width: 200px; text-align: left">
              <div>SUNSEEN</div>
              <div style="letter-spacing: 1.5px; font-size: 20px; font-weight: 600; margin-top: 5px; margin-left: 3px">
                {{ $t('register.platForm') }}</div>
            </div>
          </div>
        </div>
        <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form"
          style="z-index: 1000">
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" type="text" auto-complete="off"
              :placeholder="$t('login.989807-1')">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="phonenumber">
            <el-input v-model="registerForm.phonenumber" type="text" auto-complete="off"
              :placeholder="$t('register.phone')">
              <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" auto-complete="off"
              :placeholder="$t('login.989807-5')" @keyup.enter.native="handleRegister">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" auto-complete="off"
              :placeholder="$t('register.confirm')" @keyup.enter.native="handleRegister">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item v-if="captchaOnOff" prop="code">
            <el-input v-model="registerForm.code" auto-complete="off" :placeholder="$t('login.989807-6')"
              style="width: 63%" @keyup.enter.native="handleRegister">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="register-code">
              <img :src="codeUrl" @click="getCode" />
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button v-if="!bindAccount" :loading="loading" type="primary" style="width: 100%"
              @click.native.prevent="handleRegister">
              <span v-if="!loading">{{ $t('register.register') }}</span>
              <span v-else>{{ $t('register.register') }}</span>
            </el-button>
            <el-button v-else :loading="loading" type="primary" style="width: 100%"
              @click.native.prevent="handleRegister">
              <span v-if="!loading">{{ $t('register.bind') }}</span>
              <span v-else>{{ $t('register.binding') }}</span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-link href="https://fastbee.cn/" :underline="false" target="_blank" style="float: left">{{
              $t('register.return') }}</el-link>
            <el-link href="https://fastbee.cn/doc" :underline="false" target="_blank"
              style="float: left; margin-left: 20px">{{ $t('register.view') }}</el-link>
            <router-link :to="{ path: '/login', query: this.$route.query }" style="float: left; margin-left: 20px">{{
              $t('register.account') }}</router-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>
        Copyright © 2023
        <a target="_blank" href="http://fastbee.cn">FastBee</a>
        All Rights Reserved.
      </span>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css';
import logo from '@/assets/logo/logo.gif';
import { getCodeImg, checkBindId, bindRegister } from '@/api/login';
import { register } from '@/api/iot/tool';

export default {
  name: 'Register',
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error(this.$t('register.inconsistent')));
      } else {
        callback();
      }
    };
    return {
      logo,
      codeUrl: '',
      registerForm: {
        username: '',
        phonenumber: '',
        password: '',
        confirmPassword: '',
        code: '',
        uuid: '',
        bindId: '',
        sourceType: 1,
      },
      registerRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('login.989807-20'),
          },
          {
            min: 2,
            max: 20,
            message: this.$t('register.accountCount'),
            trigger: 'blur',
          },
        ],
        phonenumber: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('register.enterPhone'),
          },
          {
            min: 11,
            max: 11,
            message: this.$t('register.phoneLength'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('login.989807-21'),

          },
          {
            min: 5,
            max: 20,
            message: this.$t('register.passWordlength'),
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('register.passwordAgain'),
          },
          {
            required: true,
            validator: equalToPassword,
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('login.989807-22'),
          },
        ],
      },
      loading: false,
      captchaOnOff: true,
      bindAccount: false,
    };
  },
  created() {
    this.checkBind();
    this.getCode();
  },
  methods: {
    checkBind() {
      const query = this.$route.query;
      const bindId = query.bindId;
      if (bindId === undefined || bindId === null) {
        this.bindAccount = false;
      } else {
        this.bindAccount = true;
        checkBindId(bindId).then((res) => {
          this.bindAccount = res.bindAccount === undefined ? true : res.bindAccount;
          if (this.bindAccount) {
            this.registerForm.bindId = bindId;
          } else {
            this.registerForm.bindId = '';
            this.$router.push({
              query: {},
            });
          }
        });
      }
    },

    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img;
          this.registerForm.uuid = res.uuid;
        }
      });
    },
    qqLogin() {
      window.location.href = 'http://localhost:8080/auth/render/qq';
    },
    authLogin() {
      this.$alert('第三方登录正在集成中...', '提示消息', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.$message({
            type: 'info',
            message: `action: ${action}`,
          });
        },
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.bindAccount) {
            bindRegister(this.registerForm)
              .then((res) => {
                this.innerRegister(res);
              })
              .catch(() => {
                this.loading = false;
                if (this.captchaOnOff) {
                  this.getCode();
                }
              });
          } else {
            register(this.registerForm)
              .then((res) => {
                this.innerRegister(res);
              })
              .catch(() => {
                this.loading = false;
                if (this.captchaOnOff) {
                  this.getCode();
                }
              });
          }
        }
      });
    },
    innerRegister(res) {
      const username = this.registerForm.username;
      this.$alert("<font color='red'> " + this.$t('register.congratulations') + username + this.$t('register.registered') + ' </font>', this.$t('register.system'), {
        dangerouslyUseHTMLString: true,
        type: 'success',
      })
        .then(() => {
          this.$router.push('/login');
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss">
.register {
  height: 100%;
  overflow: auto;
}

.register-form {
  margin: 30px auto 0 auto;
  padding: 15px;
  z-index: 1000;
  max-width: 350px;

  input {
    height: 38px;
    background-color: #f1f1f1;
    color: #666;
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.register-code {
  width: 33%;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
    border-radius: 3px;
    height: 38px;
  }
}

.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #333;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
