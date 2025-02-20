<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('user.profile.index.894502-0') }}</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />{{ $t('user.profile.index.894502-1') }}
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />{{ $t('user.index.098976-13') }}
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />{{ $t('user.profile.index.894502-2') }}
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />{{ $t('user.profile.index.894502-3') }}
                <div v-if="user.dept" class="pull-right">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />{{ $t('user.profile.index.894502-4') }}
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />{{ $t('user.profile.index.894502-5') }}
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="wechat" />{{ $t('user.profile.index.894502-6') }}
                <div v-if="wxbind" style="color:#007AFf" class="pull-right" @click="secureBind">
                  {{ $t('user.profile.index.894502-7') }}</div>
                <div v-else class="pull-right" @click="loginWxCode">{{ $t(['user.profile.index.894502-8']) }}</div>
              </li>
              <div id="weixinLogin" style="width: 150px;height: 200px;"></div>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('user.profile.index.894502-9') }}</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('user.profile.index.894502-9')" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane :label="$t('user.profile.index.894502-10')" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="$t('user.profile.index.894502-11')" :visible.sync="secureBindDialog" width="600px"
      append-to-body>
      <el-form label-width="150px">
        <el-form-item :label="$t('user.profile.index.894502-12')" prop="pasaward">
          <el-input v-model="password" style="width: 80%" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSummaryDialog">{{ $t('close') }}</el-button>
        <el-button class="btns" type="primary" @click="handleSecureBind">{{ $t('confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import userAvatar from './userAvatar';
import userInfo from './userInfo';
import resetPwd from './resetPwd';
import { getWxBindMsg } from '@/api/login';
import { getUserProfile, getLoginParam, secureBind } from '@/api/system/user';

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo',
      qrText: 'SUNSEEN',
      wxbind: '',
      secureBindDialog: false,
      password: '',
      verifyType: 1,
      userPhone: '',
      smsCode: '',
    };
  },

  created() {
    this.getUser();
    const wxBindMsgId = this.$route.query.wxBindMsgId;
    if (wxBindMsgId != null && wxBindMsgId !== undefined) {
      this.getWxBindMsg();
    } else {
      console.log('此时没有进行绑定操作！');
    }
  },
  mounted() {
    const script = document.createElement('script');
    script.type = 'text/javascript',
      script.src = 'http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js',
      document.body.appendChild(script);
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.wxbind = response.wxBind;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    },
    handleSecureBind() {
      const params = {
        password: this.password,
        verifyType: this.verifyType,
        userPhone: this.userPhone,
        smsCode: this.smsCode,
      };
      secureBind(params).then(response => {
        this.loading = true;
        this.$modal.msgSuccess(response.msg);
        this.secureBindDialog = false;
        if (response.code === 200) {
          this.getUser();
        }
      })
        .catch(() => {
          // eslint-disable-next-line no-undef
          this.$modal.msgError(response.msg);
          this.loading = false;
        });
    },
    closeSummaryDialog() {
      this.secureBindDialog = false;
    },
    // 微信绑定二维码
    loginWxCode() {
      getLoginParam().then(response => {
        // 实例微信js对象
        // eslint-disable-next-line no-undef
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
        const wxElement = document.body.appendChild(s);
        wxElement.onload = function () {
          var obj = new WxLogin({
            self_redirect: false,
            id: 'weixinLogin',
            appid: response.data.appid,
            scope: response.data.scope,
            redirect_uri: response.data.redirectUri,
            state: response.data.state,
            style: 'black',
            href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsKIGRpc3BsYXk6IG5vbmU7Cn0KLmltcG93ZXJCb3ggLnN0YXR1cy5zdGF0dXNfYnJvd3NlciB7CiBkaXNwbGF5OiBub25lOwp9Ci5pbXBvd2VyQm94IC5xcmNvZGUgewogYm9yZGVyOm5vbmU7CiB3aWR0aDogMjAwcHg7CiBoZWlnaHQ6IDIwMHB4OwogbWFyZ2luOjAgYXV0bzsKfQouaW1wb3dlckJveCAuc3RhdHVzewogZGlzcGxheTogbm9uZQp9',
          });
        };
      });
    },
    //解除微信绑定
    secureBind() {
      this.secureBindDialog = true;
    },
    // 获取微信绑定返回结果信息
    getWxBindMsg() {
      const query = this.$route.query;
      const wxBindMsgId = query.wxBindMsgId;
      getWxBindMsg(wxBindMsgId).then((res) => {
        this.$modal.msgSuccess(res.msg)
          .catch(() => {
            setTimeout(function () {
              this.$modal.msgError(res.msg);
            }, 1000);
          });
      });
    },
  },
};
</script>
<style lang="scss">
// 自定义二维码样式
.impowerBox .title {
  display: none;
}

.impowerBox .status.status_browser {
  display: none;
}

.impowerBox .qrcode {
  border: none;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.impowerBox .status {
  display: none
}
</style>
