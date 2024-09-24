<template>
    <div class="login">
        <el-row>
            <el-col :xs="24">
                <div
                    style="color: #fff; background-color: #0f73ee; width: 100%; height: 200px; text-align: center; padding: 15px; font-family: '微软雅黑'">
                    <div style="font-size: 42px; padding-top: 40px; width: 300px; margin: 0 auto">
                        <img :src="logo" alt="logo" style="width: 100px; height: 100px; float: left" />
                        <div style="float: left; margin-top: 13px; width: 200px; text-align: left">
                            <div>FastBee</div>
                            <div
                                style="letter-spacing: 1.5px; font-size: 20px; font-weight: 600; margin-top: -8px; margin-left: 3px">
                                开源物联网平台</div>
                        </div>
                    </div>
                </div>
                <div class="tabs-login">
                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
                        <el-form-item prop="username">
                            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                                <svg-icon slot="prefix" icon-class="user" class="input-icon" />
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                                @keyup.enter.native="handleLogin">
                                <svg-icon slot="prefix" icon-class="password" class="input-icon" />
                            </el-input>
                        </el-form-item>
                        <el-form-item style="width: 100%">
                            <div style="margin-bottom: 10px">
                                <el-button :loading="loading" type="primary" style="width: 100%"
                                    @click.native.prevent="handleLogin">
                                    <span v-if="!loading">登 录</span>
                                    <span v-else>登 录 中...</span>
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>
                Copyright © 2024
                <a target="_blank" href="http://fastbee.cn">FastBee</a>
                All Rights Reserved.
            </span>
        </div>
    </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css';
import logo from '@/assets/logo/logo.gif';
import { oauthLogin } from '@/api/login';
import { setToken } from '@/utils/auth';

export default {
    name: 'oauthLogin',
    data() {
        return {
            logo,
            loginForm: {
                username: '',
                password: '',
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入您的账号',
                    },
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入您的密码',
                    },
                ],
            },
            loading: false,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                // this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    created() {
        this.params.responseType = this.$route.query.response_type
        this.params.clientId = this.$route.query.client_id
        this.params.redirectUri = this.$route.query.redirect_uri
        this.params.state = this.$route.query.state
    },
    methods: {
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    oauthLogin(this.loginForm).then((res) => {
                        setToken(res.data);
                        this.$router
                            .push(
                                {
                                    path: '/sso',
                                    query: {
                                        clientId: this.$route.query.client_id,
                                        redirectUri: this.$route.query.redirect_uri,
                                        responseType: this.$route.query.response_type,
                                        state: this.$route.query.state
                                    }
                                }
                            )
                            .catch(() => { });
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss">
.login {
    height: 100%;
    overflow: auto;
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
</style>