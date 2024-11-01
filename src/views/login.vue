<template>
    <div class="login">
        <el-row>
            <el-col :xs="24">
                <div style="color: #fff; background-color: #0f73ee; width: 100%; height: 200px; text-align: center; padding: 15px; font-family: '微软雅黑'">
                    <div class="logo-bg-box" style="font-size: 42px; padding-top: 40px; margin: 0 auto"></div>
                </div>
                <div class="tabs-login">
                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" @keyup.enter.native="bindAccount ? handleBind : handleLogin">
                        <el-form-item v-if="loginForm.bindId != null">
                            <div class="alert-box-wrap">
                                <div v-if="loginForm.bindId != null" class="alert-message-wrap">
                                    <i class="el-icon-warning" />
                                    {{ $t('login.989807-10') }}
                                </div>
                                <el-row>
                                    <el-col :span="10.5">
                                        <div v-if="loginForm.bindId != null" class="alert-message-wrap">
                                            {{ $t('login.989807-11') }}
                                        </div>
                                    </el-col>
                                    <router-link
                                        v-if="loginForm.bindId != null"
                                        :to="{ path: '/register', query: this.$route.query }"
                                        style="margin-left: 10px; font-size: 14px; font-family: '微软雅黑'; color: rgba(41, 96, 197, 0.856)"
                                    >
                                        {{ $t('login.989807-12') }}
                                    </router-link>
                                </el-row>
                            </div>
                        </el-form-item>
                        <el-form-item prop="username">
                            <el-input v-model="loginForm.username" type="text" auto-complete="off" :placeholder="$t('login.989807-4')">
                                <svg-icon slot="prefix" icon-class="user" class="input-icon" />
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="loginForm.password" type="password" auto-complete="off" :placeholder="$t('login.989807-5')" @keyup.enter.native="handleLogin">
                                <svg-icon slot="prefix" icon-class="password" class="input-icon" />
                            </el-input>
                        </el-form-item>
                        <el-form-item v-if="captchaOnOff" prop="code">
                            <el-input v-model="loginForm.code" auto-complete="off" :placeholder="$t('login.989807-6')" type="text" style="width: 66%">
                                <svg-icon slot="prefix" icon-class="smscode" class="input-icon" />
                            </el-input>
                            <div class="login-code">
                                <img :src="codeUrl" @click="getCode" style="float: right" />
                            </div>
                        </el-form-item>
                        <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px; color: #000">{{ $t('login.989807-7') }}</el-checkbox>
                        <el-form-item style="width: 100%">
                            <div style="margin-bottom: 10px">
                                <el-button v-if="!bindAccount" :loading="loading" type="primary" style="width: 100%" @click.native.prevent="handleLogin">
                                    <span v-if="!loading">{{ $t('login.989807-3') }}</span>
                                    <span v-else>{{ $t('login.989807-13') }}</span>
                                </el-button>
                                <el-button v-else :loading="loading" type="primary" style="width: 100%" @click.native.prevent="handleBind">
                                    <span v-if="!loading">{{ $t('login.989807-15') }}</span>
                                    <span v-else>{{ $t('login.989807-16') }}</span>
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
        <!--  底部  -->
    </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css';
import logo from '@/assets/logo/logo.gif';
import { getCodeImg, checkBindId, getErrorMsg, socialLogin, bindLogin, getSmsLoginCaptcha, smsLogin } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { setToken } from '@/utils/auth';
import langSelect from '@/layout/components/langSelect';

export default {
    name: 'Login',
    components: { langSelect },
    data() {
        return {
            logo,
            codeUrl: '',
            loginForm: {
                username: '',
                password: '',
                rememberMe: false,
                code: '',
                uuid: '',
                bindId: '',
            },
            smsLoginForm: {
                phonenumber: '',
                smsCode: '',
                sourceType: 1,
            },
            smsLoading: false,
            activeName: 'first',
            isPhoneValid: true, // 标记手机号码是否有效
            isDisabled: false, // 控制按钮状态
            countdownTimer: null, // 倒计时器对象
            buttonText: this.$t('login.989807-27'), // 按钮文本
            remainingSeconds: 60, // 剩余秒数
            waitTime: 61, // 获取验证码按钮失效时间
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: this.$t('login.989807-20'),
                    },
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: this.$t('login.989807-21'),
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
            smsRules: {
                phonenumber: [
                    { required: true, message: this.$t('login.989807-23'), trigger: 'blur' },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: this.$t('login.989807-24'),
                        trigger: 'blur',
                    },
                ],
                smsCode: [
                    {
                        required: true,
                        trigger: 'change',
                        message: this.$t('login.989807-25'),
                    },
                ],
            },
            loading: false,
            // 验证码开关
            captchaOnOff: true,
            bindAccount: false,
            // 注册开关
            register: true,
            redirect: undefined,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    created() {
        const loginId = this.$route.query.loginId;
        if (loginId === undefined || loginId === null) {
            this.checkBind();
            this.getCode();
            this.checkErrorMsg();
            this.getCookie();
        } else {
            this.redirectSocialLogin(loginId);
        }
    },
    methods: {
        redirectSocialLogin() {
            const query = this.$route.query;
            const loginId = query.loginId;
            socialLogin(loginId).then((res) => {
                // 保存token
                this.loading = true;
                setToken(res.token);
                this.$router
                    .push({
                        path: this.redirect || '/',
                    })
                    .catch(() => {});
                if (this.captchaOnOff) {
                    this.getCode();
                    this.loading = false;
                }
            });
        },
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
                        this.loginForm.bindId = bindId;
                    } else {
                        this.loginForm.bindId = '';
                        this.$router.push({
                            query: {},
                        });
                    }
                });
            }
        },
        checkErrorMsg() {
            const errorId = this.$route.query.errorId;
            if (errorId !== undefined && errorId !== null) {
                getErrorMsg(errorId)
                    .then((res) => {})
                    .catch((err) => {
                        this.$router.push({ query: {} });
                        console.log(err);
                    });
            }
        },
        getCode() {
            getCodeImg().then((res) => {
                // this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
                this.captchaOnOff = res.captchaEnabled;
                if (this.captchaOnOff) {
                    this.codeUrl = 'data:image/gif;base64,' + res.img;
                    this.loginForm.uuid = res.uuid;
                }
            });
        },
        getCookie() {
            const username = Cookies.get('username');
            const password = Cookies.get('password');
            const rememberMe = Cookies.get('rememberMe');
            const loginId = Cookies.get('loginId');
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password : decrypt(password),
                rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
                loginId: loginId === undefined ? this.loginForm.loginId : loginId,
            };
        },
        qqLogin() {
            window.location.href = 'http://localhost:8080/auth/render/qq';
        },
        weChatLogin() {
            const baseURL = process.env.VUE_APP_BASE_API;
            window.location.href = baseURL + '/auth/render/wechat_open_web';
        },
        //验证电话号码
        validatePhoneNumber(number) {
            const regExp = /^1[3456789]\d{9}$/; // 使用正则表达式进行校验
            return regExp.test(number);
        },
        //获取短信验证码
        getSmsCode() {
            if (this.validatePhoneNumber(this.smsLoginForm.phonenumber)) {
                getSmsLoginCaptcha(this.smsLoginForm.phonenumber).then((res) => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: this.$t('login.989807-26'),
                        });
                        this.countdownTimer = setInterval(() => {
                            if (this.remainingSeconds > 0) {
                                this.remainingSeconds--;
                                this.buttonText = `${this.remainingSeconds}秒后获取`;
                            } else {
                                clearInterval(this.countdownTimer);
                                this.buttonText = this.$t('login.989807-27');
                                this.isDisabled = false;
                            }
                        }, 1000);
                        this.isDisabled = true;
                    } else {
                        this.$message({
                            type: 'warning',
                            message: this.$t('login.989807-28'),
                        });
                    }
                });
            } else {
                this.$message({
                    type: 'warning',
                    message: this.$t('login.989807-29'),
                });
            }
        },
        //短信登录操作
        handleSmsLogin() {
            this.$refs.smsLoginForm.validate((valid) => {
                if (valid) {
                    this.smsLoading = true;
                    smsLogin(this.smsLoginForm).then((res) => {
                        setToken(res.data);
                        this.$router
                            .push({
                                path: '/',
                            })
                            .catch(() => {});
                    });
                }
            });
        },
        handleBind() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set('username', this.loginForm.username, {
                            expires: 30,
                        });
                        Cookies.set('password', encrypt(this.loginForm.password), {
                            expires: 30,
                        });
                        Cookies.set('rememberMe', this.loginForm.rememberMe, {
                            expires: 30,
                        });
                    } else {
                        Cookies.remove('username');
                        Cookies.remove('password');
                        Cookies.remove('rememberMe');
                    }
                    this.loginForm.bindId = this.$route.query.bindId;
                    bindLogin(this.loginForm)
                        .then((res) => {
                            // 保存token
                            setToken(res.token);
                            this.$router
                                .push({
                                    path: '/',
                                })
                                .catch(() => {});
                        })
                        .catch(() => {
                            this.loading = false;
                            if (this.captchaOnOff) {
                                this.loading = false;
                                this.getCode();
                            }
                        });
                }
            });
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set('username', this.loginForm.username, {
                            expires: 30,
                        });
                        Cookies.set('password', encrypt(this.loginForm.password), {
                            expires: 30,
                        });
                        Cookies.set('rememberMe', this.loginForm.rememberMe, {
                            expires: 30,
                        });
                    } else {
                        Cookies.remove('username');
                        Cookies.remove('password');
                        Cookies.remove('rememberMe');
                    }
                    this.$store
                        .dispatch('Login', this.loginForm)
                        .then(() => {
                            this.$router
                                .push({
                                    path: this.redirect || '/',
                                })
                                .catch(() => {});
                        })
                        .catch(() => {
                            this.loading = false;
                            if (this.captchaOnOff) {
                                this.getCode();
                            }
                        });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.logo-bg-box {
    background-image: url('../assets/logo/logo-bg.png');
    width: 400px;
    height: 160px;
}
.login {
    height: 100%;
    overflow: auto;

    .tabs {
        width: 400px;
        border-bottom: none;
        // border: solid white 1px;
        box-shadow: none !important;
    }

    .tabs ::v-deep .el-tabs__nav {
        background-color: white;
        box-shadow: none !important;
        text-decoration: none;
        /* 设置导航栏背景颜色 */
    }

    /*去掉切换时el-tab-pane底部的蓝色下划线*/
    ::v-deep .el-tabs__active-bar {
        background-color: transparent !important;
    }

    /*去掉tabs底部的下划线*/
    ::v-deep .el-tabs__nav-wrap::after {
        position: static !important;
    }

    .tabs ::v-deep .el-tabs__item {
        font-size: 20px;
        /* 设置字体大小 */
        border: none;
        /* 去除默认边框 */
    }

    .bindAccountTitle {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #333;
        font-size: 24px;
    }

    .tabs-login {
        margin: 20px auto 0 auto;
        z-index: 1000;
        max-width: 350px;
    }

    .login-form {
        margin: 10px 0 0 0;
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

    .login-code {
        width: 33%;
        float: right;

        img {
            cursor: pointer;
            vertical-align: middle;
            border-radius: 3px;
            height: 38px;
        }
    }

    .el-login-footer {
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

    .alert-box-wrap {
        border: 1px solid #f78e21;

        .alert-message-wrap {
            font-size: 14px;
            font-family: '微软雅黑';
            color: rgba(197, 41, 41, 0.856);
            margin-left: 10px;
        }
    }
}
</style>
