<template>
    <div class="container">
        <el-row>
            <el-col :xs="24">
                <!-- logo区域 -->
                <div class="content">
                    <div style="color: #fff; background-color: #0f73ee; width: 100%; height: 200px; text-align: center; padding: 15px; font-family: '微软雅黑'">
                        <div style="font-size: 42px; padding-top: 40px; width: 300px; margin: 0 auto">
                            <img :src="logo" alt="logo" style="width: 100px; height: 100px; float: left" />
                            <div style="float: left; margin-top: 13px; width: 200px; text-align: left">
                                <div>FastBee</div>
                                <div style="letter-spacing: 1.5px; font-size: 20px; font-weight: 600; margin-top: -8px; margin-left: 3px">开源物联网平台</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-cont">
                        <el-tabs class="form" style="float: none" value="uname">
                            <el-tab-pane :label="'三方授权（' + client.name + ')'" name="uname"></el-tab-pane>
                        </el-tabs>
                        <div>
                            <el-form ref="loginForm" :model="loginForm" class="login-form">
                                <!-- 授权范围的选择 -->
                                此第三方应用请求获得以下权限：
                                <el-form-item prop="scopes">
                                    <el-checkbox-group v-model="loginForm.scopes">
                                        <el-checkbox v-for="scope in params.scopes" :label="scope" :key="scope" style="display: block; margin-bottom: -10px">{{ formatScope(scope) }}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <!-- 下方的授权按钮 -->
                                <el-form-item style="width: 100%">
                                    <el-button :loading="loading" size="medium" type="primary" style="width: 50%" @click.native.prevent="handleAuthorize(true)">
                                        <span v-if="!loading">同意授权</span>
                                        <span v-else>授 权 中...</span>
                                    </el-button>
                                    <el-button size="medium" style="width: 36%" @click.native.prevent="handleAuthorize(false)">拒绝</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
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
import { authorize, getAuthorize } from '@/api/login';
import logo from '@/assets/logo/logo.gif';

export default {
    name: 'Login',
    data() {
        return {
            logo,
            loginForm: {
                scopes: [], // 已选中的 scope 数组
            },
            params: {
                // URL 上的 client_id、scope 等参数
                responseType: undefined,
                clientId: undefined,
                redirectUri: undefined,
                state: undefined,
                scopes: [], // 优先从 query 参数获取；如果未传递，从后端获取
            },
            client: {
                // 客户端信息
                name: '',
                logo: '',
            },
            loading: false,
        };
    },
    created() {
        // 解析参数
        // 例如说【自动授权不通过】：client_id=default&redirect_uri=https%3A%2F%2Fwww.iocoder.cn&response_type=code&scope=user.read%20user.write
        // 例如说【自动授权通过】：client_id=default&redirect_uri=https%3A%2F%2Fwww.iocoder.cn&response_type=code&scope=user.read
        this.params.responseType = this.$route.query.responseType;
        this.params.clientId = this.$route.query.clientId;
        this.params.redirectUri = this.$route.query.redirectUri;
        this.params.state = this.$route.query.state;
        if (this.$route.query.scope) {
            this.params.scopes = this.$route.query.scope.split(' ');
        }

        // 如果有 scope 参数，先执行一次自动授权，看看是否之前都授权过了。
        if (this.params.scopes.length > 0) {
            this.doAuthorize(true, this.params.scopes, []).then((res) => {
                const href = res.data;
                if (!href) {
                    console.log('自动授权未通过！');
                    return;
                }
                location.href = href;
            });
        }
        this.getAuthorize();
    },
    methods: {
        getAuthorize() {
            // 获取授权页的基本信息
            getAuthorize(this.params.clientId).then((res) => {
                this.client = res.data.client;
                // 解析 scope
                let scopes;
                // 1.1 如果 params.scope 非空，则过滤下返回的 scopes
                if (this.params.scopes.length > 0) {
                    scopes = [];
                    for (const scope of res.data.scopes) {
                        if (this.params.scopes.indexOf(scope.key) >= 0) {
                            scopes.push(scope);
                        }
                    }
                    // 1.2 如果 params.scope 为空，则使用返回的 scopes 设置它
                } else {
                    scopes = res.data.scopes;
                    for (const scope of scopes) {
                        this.params.scopes.push(scope.key);
                    }
                }
                // 生成已选中的 checkedScopes
                for (const scope of scopes) {
                    if (scope.value) {
                        this.loginForm.scopes.push(scope.key);
                    }
                }
            });
        },
        handleAuthorize(approved) {
            this.$refs.loginForm.validate((valid) => {
                if (!valid) {
                    return;
                }
                this.loading = true;
                // 计算 checkedScopes + uncheckedScopes
                let checkedScopes;
                let uncheckedScopes;
                if (approved) {
                    // 同意授权，按照用户的选择
                    checkedScopes = this.loginForm.scopes;
                    uncheckedScopes = this.params.scopes.filter((item) => checkedScopes.indexOf(item) === -1);
                } else {
                    // 拒绝，则都是取消
                    checkedScopes = [];
                    uncheckedScopes = this.params.scopes;
                }
                // 提交授权的请求
                this.doAuthorize(false, checkedScopes, uncheckedScopes)
                    .then((res) => {
                        const href = res.data;
                        if (!href) {
                            return;
                        }
                        location.href = href;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            });
        },
        doAuthorize(autoApprove, checkedScopes, uncheckedScopes) {
            return authorize(this.params.responseType, this.params.clientId, this.params.redirectUri, this.params.state, autoApprove, checkedScopes, uncheckedScopes);
        },
        formatScope(scope) {
            // 格式化 scope 授权范围，方便用户理解。
            // 这里仅仅是一个 demo，可以考虑录入到字典数据中，例如说字典类型 "system_oauth2_scope"，它的每个 scope 都是一条字典数据。
            switch (scope) {
                case 'user.read':
                    return '访问你的个人信息';
                case 'user.write':
                    return '修改你的个人信息';
                default:
                    return scope;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.oauth-login {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.oauth-login-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.form-cont {
    margin: 20px auto 0 auto;
    z-index: 1000;
    max-width: 350px;
}

.oauth-login-item img {
    height: 25px;
    width: 25px;
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

.oauth-login-item span:hover {
    text-decoration: underline red;
    color: red;
}
</style>
