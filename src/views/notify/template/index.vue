<template>
    <div class="template-wrap">
        <el-card class="top-card-wrap">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item :label="$t('notify.template.index.333542-0')" prop="name">
                    <el-input v-model="queryParams.name" :placeholder="$t('notify.template.index.333542-1')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('notify.channel.index.333541-2')" prop="channelType">
                    <el-select v-model="queryParams.channelType" :placeholder="$t('notify.channel.index.333541-3')" clearable size="small" style="width: 100%">
                        <el-option v-for="option in channelTypeList" :key="option.value" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('notify.template.index.333542-2')" prop="serviceCode">
                    <el-select v-model="queryParams.serviceCode" :placeholder="$t('notify.template.index.333542-3')" clearable style="width: 100%; display: inline-block">
                        <el-option v-for="dict in dict.type.notify_service_code" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['notify:template:add']">{{ $t('notify.template.index.333542-4') }}</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
        </el-card>

        <el-card class="card-wrap">
            <el-table v-loading="loading" :data="templateList">
                <el-table-column :label="$t('notify.template.index.333542-0')" align="left" prop="name" min-width="100" />
                <el-table-column :label="$t('notify.channel.index.333541-2')" align="left" prop="channelType">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.notify_channel_type" :value="scope.row.channelType" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('notify.template.index.333542-5')" align="left" prop="channelName"></el-table-column>
                <el-table-column :label="$t('notify.channel.index.333541-7')" align="left" prop="provider"></el-table-column>
                <el-table-column :label="$t('notify.template.index.333542-2')" align="left" prop="serviceCode">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.notify_service_code" :value="scope.row.serviceCode" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('notify.template.index.333542-6')" align="center" prop="status">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="handleStatus(scope.row)" :active-value="1" :inactive-value="0" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('notify.channel.index.333541-8')" align="left" prop="createTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-s-promotion" @click="getVariablesList(scope.row)">{{ $t('notify.template.index.333542-7') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['notify:template:query']">{{ $t('detail') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['notify:template:remove']">{{ $t('del') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改通知模版对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
                <div style="margin-top: -55px">
                    <el-divider style="margin-top: -30px"></el-divider>
                    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                        <el-form-item :label="$t('notify.template.index.333542-0')" prop="name">
                            <el-input v-model="form.name" :placeholder="$t('notify.template.index.333542-1')" />
                        </el-form-item>
                        <el-form-item :label="$t('notify.template.index.333542-2')" prop="serviceCode">
                            <el-select v-model="form.serviceCode" :placeholder="$t('notify.template.index.333542-3')" style="width: 100%; display: inline-block">
                                <el-option v-for="dict in dict.type.notify_service_code" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="$t('notify.channel.index.333541-2')" prop="channelType">
                                    <el-select v-model="form.channelType" :placeholder="$t('notify.channel.index.333541-3')" clearable size="small" style="width: 100%" @change="changeChannel">
                                        <el-option v-for="option in channelTypeList" :key="option.value" :label="option.label" :value="option.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('notify.channel.index.333541-9')" prop="provider">
                                    <el-select
                                        :placeholder="$t('notify.channel.index.333541-10')"
                                        clearable
                                        size="small"
                                        style="width: 100%"
                                        v-model="form.provider"
                                        :disabled="form.channelType == null"
                                        @change="changeService"
                                    >
                                        <el-option v-for="item in providersList" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item :label="$t('notify.template.index.333542-5')" prop="channelId">
                            <el-select
                                v-model="form.channelId"
                                :placeholder="$t('notify.template.index.333542-9')"
                                style="width: 100%; display: inline-block"
                                :disabled="this.form.provider == null"
                                @change="getTemplateMsg"
                            >
                                <el-option v-for="item in channelIdList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            :label="$t('notify.template.index.333542-10')"
                            prop="msgType"
                            v-if="this.form.channelType == 'wechat' && this.form.provider != 'mini_program' && this.form.provider != 'public_account' && this.form.channelId != null"
                        >
                            <el-select :placeholder="$t('notify.template.index.333542-11')" style="width: 100%; display: inline-block" @change="getTemplateMsg" v-model="form.msgType">
                                <el-option v-for="dict in dict.type.wecom_msg_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('notify.template.index.333542-10')" v-if="this.form.channelType == 'dingtalk' && this.form.channelId != null" prop="msgType">
                            <el-select :placeholder="$t('notify.template.index.333542-12')" v-model="form.msgType" style="width: 100%; display: inline-block" @change="getTemplateMsg">
                                <el-option v-for="dict in dict.type.dingtalk_msg_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <div></div>
                        <el-form-item v-for="(item, index) in configList" :key="index" :label="item.label">
                            <el-input v-model="item.value" :placeholder="$t('notify.template.index.333542-13')" v-if="item.type == 'string'" />
                            <el-input v-model="item.value" :placeholder="$t('notify.template.index.333542-13')" type="number" v-if="item.type == 'int'" />
                            <editor v-model="item.value" :min-height="192" v-if="item.type == 'text'" :url_type="url_type" />
                            <el-switch v-model="item.value" active-color="#13ce66" inactive-color="#c0c0c0" v-if="item.type == 'boolean'"></el-switch>
                            <fileUpload
                                ref="upload"
                                :value="form.filePath"
                                :limit="1"
                                :fileSize="10"
                                :uploadFileUrl="uploadUrl"
                                :fileType="['docx', 'xlsx', 'ppt', 'txt', 'pdf', 'zip', 'jpg', 'png']"
                                @input="getFilePath($event)"
                                v-if="item.type == 'file' && item.attribute == 'attachment'"
                            ></fileUpload>
                            <fileUpload
                                ref="upload"
                                :value="form.filePath"
                                :limit="1"
                                :fileSize="10"
                                :uploadFileUrl="uploadUrl"
                                :fileType="['jpg', 'png']"
                                @input="getFilePath($event)"
                                v-if="item.type == 'file' && item.attribute == 'picUrl'"
                            ></fileUpload>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm" v-hasPermi="['notify:template:edit']" v-show="form.id">{{ $t('update') }}</el-button>
                    <el-button type="primary" @click="submitForm" v-hasPermi="['notify:template:add']" v-show="!form.id">{{ $t('add') }}</el-button>
                    <el-button @click="cancel">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="title" :visible.sync="testModel" width="700px" append-to-body>
                <div style="margin-top: -55px">
                    <el-divider style="margin-top: -30px"></el-divider>
                    <el-form ref="testForm" :model="testForm" :rules="testRules" label-width="120px">
                        <el-form-item :label="$t('notify.template.index.333542-14')" prop="account" v-if="this.testForm.account != null">
                            <el-input v-model="testForm.account" :placeholder="$t('notify.template.index.333542-15')" />
                        </el-form-item>
                        <div v-for="(value, index) in variablesList" :key="index">
                            <el-form-item :label="index">
                                <el-input v-model="variablesList[index]" :placeholder="$t('notify.template.index.333542-16')" clearable style="width: 100%"></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitTest">{{ $t('confirm') }}</el-button>
                    <el-button @click="cancelTest">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate, getUsableTempate, updateState, notifyTestTemplate, templateParams, getVariablesList } from '@/api/notify/template';
import { listChannel, getChannelMessage } from '@/api/notify/channel';

export default {
    name: 'Template',
    dicts: ['notify_channel_type', 'notify_message_type', 'iot_yes_no', 'notify_service_code', 'dingtalk_msg_type', 'wecom_msg_type'],
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
            // 通知模版表格数据
            templateList: [],
            //通知模版参数变量
            variablesList: [],
            variable: '',
            channelIdList: [],
            modelList: [],
            channelMsgList: [],
            channelChildren: [],
            providersList: [],
            url_type: 1,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            testModel: false,
            value: '',
            uploadUrl: process.env.VUE_APP_BASE_API + '/common/upload',
            newContent: '',
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: null,
                serviceCode: null,
                channelType: null,
                msgContent: null,
                redirectUri: null,
                ptovider: null,
            },
            configList: [],
            //服务商
            notifyTestId: '',
            // 表单参数
            form: {
                status: 1,
                filePath: '',
            },
            channelTypeList: [],
            newSrc: '',
            testForm: {
                account: '',
            },
            // 表单校验
            rules: {
                name: [{ required: true, message: this.$t('notify.template.index.333542-17'), trigger: 'blur' }],
                serviceCode: [{ required: true, message: this.$t('notify.template.index.333542-18'), trigger: 'blur' }],
                msgContent: [{ required: true, message: this.$t('notify.template.index.333542-19'), trigger: 'blur' }],
                msgParams: [{ required: true, message: this.$t('notify.template.index.333542-20'), trigger: 'blur' }],
                channelType: [{ required: true, message: this.$t('notify.template.index.333542-21'), trigger: 'blur' }],
                channelId: [{ required: true, message: this.$t('notify.template.index.333542-22'), trigger: 'blur' }],
                provider: [{ required: true, message: this.$t('notify.template.index.333542-23'), trigger: 'blur' }],
            },
            testRules: {
                account: [{ required: true, message: this.$t('notify.template.index.333542-24'), trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getList();
        this.getInfo();
    },
    methods: {
        /** 查询通知模版列表 */
        getList() {
            this.loading = true;
            listTemplate(this.queryParams).then((response) => {
                this.templateList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        //获取渠道具体信息
        getInfo() {
            this.loading = true;
            getChannelMessage().then((response) => {
                this.channelMsgList = response.data;
                //渠道类型
                this.channelTypeList = response.data.map((item) => {
                    return { value: item.channelType, label: item.channelName };
                });
            });
            this.loading = false;
        },
        //服务商发生改变后获取配置内容
        changeService() {
            this.getServiceList();
            this.getTemplateParams(true);
        },
        //渠道发生改变
        changeChannel() {
            this.getServiceList();
            this.form.provider = '';
            this.configList = [];
        },
        //获取服务商列表
        getServiceList() {
            const selectedChannel = this.form.channelType;
            this.channelChildren = this.channelMsgList.filter((item) => selectedChannel.includes(item.channelType)).map((item) => item.providerList);
            for (var i = 0; i < this.channelChildren.length; i++) {
                this.providersList = this.channelChildren[i].map((item) => {
                    return { value: item.provider, label: item.providerName, config: item.configContent };
                });
            }
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        //测试取消按钮
        cancelTest() {
            this.testModel = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                name: null,
                serviceCode: null,
                channelCode: null,
                msgContent: null,
                redirectUri: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                delFlag: null,
                provider: null,
                msgParams: null,
                msgType: null,
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.configList = [];
            this.title = this.$t('notify.template.index.333542-25');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            this.open = true;
            this.title = this.$t('notify.template.index.333542-26');
            //获取模板参数信息
            this.$nextTick(() => {
                this.form.channelId = row.channelId;
                this.getTemplateMsg();
            });
            getTemplate(id).then((response) => {
                this.form = response.data;
                //获取账号列表
                this.getTemplateParams(false);
                //获取配置内容
                this.getParamsMsg();
                //获取服务商列表
                this.getServiceList();
            });
        },
        //获取配置内容
        getParamsMsg() {
            if (this.form.msgParams != null) {
                const msgParamsList = JSON.parse(this.form.msgParams);
                if (this.form.channelType == 'dingtalk' || (this.form.channelType == 'wechat' && this.form.provider != 'mini_program') || (this.form.channelType == 'wechat' && this.form.provider != 'public_account')) {
                    this.form.msgType = msgParamsList.msgType; // 获取 id 字段值
                    this.$delete(msgParamsList, 'msgType');
                    this.$nextTick(() => {
                        this.getTemplateMsg();
                    });
                }
                setTimeout(() => {
                    for (let j = 0; j < this.configList.length; j++) {
                        for (const key in msgParamsList) {
                            if (this.configList[j].attribute === 'attachment') {
                                this.form.filePath = this.configList[j].value;
                            }
                            if (this.configList[j].attribute === 'picUrl') {
                                this.form.filePath = msgParamsList[key];
                            }
                            if (this.configList[j].attribute == key) {
                                this.configList[j].value = msgParamsList[key];
                            }
                        }
                    }
                }, 500);
            } else {
                this.configList = [];
                this.form.filePath = '';
            }
        },
        // 获取文件路径
        getFilePath(data) {
            this.form.filePath = 'http://' + window.location.host + process.env.VUE_APP_BASE_API + data;
            for (let i = 0; i < this.configList.length; i++) {
                if (this.configList[i].attribute === 'attachment' || this.configList[i].attribute === 'picUrl') {
                    this.configList[i].value = this.form.filePath;
                }
            }
        },
        /** 提交按钮 */
        submitForm() {
            const configMsgList = this.configList.map((item) => {
                return [item.attribute, item.value];
            });
            //Object.fromEntries方法把键值对列表转换为一个对象
            const object = Object.fromEntries(configMsgList);
            if (this.form.msgType != null) {
                this.$set(object, 'msgType', this.form.msgType);
            }
            this.form.msgParams = JSON.stringify(object);
            const query = {
                id: this.form.id,
                name: this.form.name,
                channelId: this.form.channelId,
                channelType: this.form.channelType,
                provider: this.form.provider,
                serviceCode: this.form.serviceCode,
                msgParams: this.form.msgParams,
            };
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateTemplate(query).then((response) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addTemplate(query).then((response) => {
                            this.$modal.msgSuccess(this.$t('addSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(this.$t('notify.template.index.333542-27', [ids]))
                .then(function () {
                    return delTemplate(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'notify/template/export',
                {
                    ...this.queryParams,
                },
                `template_${new Date().getTime()}.xlsx`
            );
        },

        /**更新可用状态*/
        handleStatus(row) {
            //由未启用变为已启用
            if (row.status == 1) {
                //查询是否可用类型的模板
                getUsableTempate(row).then((response) => {
                    if (response.data > 0) {
                        this.$confirm(this.$t('notify.template.index.333542-28'), {
                            confirmButtonText: this.$t('confirm'),
                            cancelButtonText: this.$t('cancel'),
                            type: 'warning',
                        })
                            .then(() => {
                                //更新可用渠道
                                updateState(row).then((response) => {
                                    if (response.code == 200) {
                                        //刷新列表
                                        this.getList();
                                        this.$message({
                                            type: 'success',
                                            message: this.$t('notify.template.index.333542-29'),
                                        });
                                    } else {
                                        this.$message({
                                            type: 'warning',
                                            message: this.$t('notify.template.index.333542-30'),
                                        });
                                    }
                                });
                            })
                            .catch(() => {
                                row.status = false;
                                this.$message({
                                    type: 'info',
                                    message: this.$t('notify.template.index.333542-31'),
                                });
                            });
                    } else {
                        //更新可用渠道
                        updateState(row).then((response) => {
                            if (response.code == 200) {
                                //刷新列表
                                this.getList();
                                this.$message({
                                    type: 'success',
                                    message: this.$t('notify.template.index.333542-29'),
                                });
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: this.$t('notify.template.index.333542-30'),
                                });
                            }
                        });
                    }
                });
            } else {
                //已启用变为未启用，直接更新
                const data = {
                    channelType: row.channelType,
                    serviceCode: row.serviceCode,
                    id: row.id,
                    status: row.status,
                };
                updateTemplate(data).then((response) => {
                    if (response.code == 200) {
                        //刷新列表
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: this.$t('notify.template.index.333542-32'),
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: this.$t('notify.template.index.333542-33'),
                        });
                    }
                });
            }
        },
        /**获取账号列表（渠道来源更改后）*/
        getTemplateParams(isTrue) {
            const params = {
                channelType: this.form.channelType,
                provider: this.form.provider,
            };
            listChannel(params).then((response) => {
                this.channelIdList = response.rows.map((item) => {
                    return { value: item.id, label: item.name, provider: item.provider };
                });
            });
            if (isTrue == true) {
                this.form.channelId = '';
                this.configList = [];
                this.form.filePath = '';
            }
        },
        //获取模板参数（渠道账号更改后）
        getTemplateMsg() {
            this.form.filePath = '';
            if ((this.form.channelType == 'dingtalk' || (this.form.channelType == 'dingtalk' && this.form.provider != 'mini_program')) && this.form.msgType == null) {
            } else {
                const params = {
                    channelId: this.form.channelId,
                    msgType: this.form.msgType,
                };
                templateParams(params).then((response) => {
                    this.configList = response.data.map((item) => {
                        return { value: item.value, label: item.name, attribute: item.attribute, type: item.type };
                    });
                });
            }
        },
        //获取消息通知模板参数变量（测试时）
        getVariablesList(row) {
            this.testForm.account = '';
            const channelType = row.channelType;
            const provider = row.provider;
            this.notifyTestId = row.id || this.ids;
            getVariablesList(this.notifyTestId, channelType, provider).then((response) => {
                if (response.code == 200) {
                    if (response.data == '') {
                        this.submitTest();
                        this.testModel = false;
                    } else {
                        this.testForm.account = response.data.sendAccount;
                        if (response.data.variables !== '') {
                            this.variablesList = JSON.parse(response.data.variables);
                        } else {
                            this.variablesList = '';
                        }
                        this.testModel = true;
                        this.title = this.$t('notify.template.index.333542-7');
                    }
                } else {
                    this.$message.error(response.msg);
                }
            });
        },
        //发送测试
        submitTest() {
            if (this.variablesList == '') {
                console.log(this.variablesList);
            } else {
                this.variable = JSON.stringify(this.variablesList);
            }
            const params = {
                sendAccount: this.testForm.account,
                id: this.notifyTestId,
                variables: this.variable,
            };
            notifyTestTemplate(params).then((response) => {
                if (response.code == 200) {
                    this.$message.success(this.$t('notify.template.index.333542-34'));
                    this.testModel = false;
                } else {
                    this.$message.error(response.msg);
                    this.testModel = false;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

.template-wrap {
    padding: 6px;

    .top-card-wrap {
        margin-bottom: 5px;
    }

    .card-wrap {
        padding-bottom: 100px;
    }
}
</style>
