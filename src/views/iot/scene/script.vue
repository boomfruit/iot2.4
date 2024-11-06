<template>
    <div style="padding: 6px">
        <el-card v-show="showSearch" style="margin-bottom: 6px">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px" style="margin-bottom: -20px">
                <el-form-item :label="$t('script.349087-0')" prop="scriptId">
                    <el-input v-model="queryParams.scriptId" :placeholder="$t('script.349087-1')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('script.349087-2')" prop="scriptName">
                    <el-input v-model="queryParams.scriptName" :placeholder="$t('script.349087-3')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:script:add']">{{ $t('add') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card style="padding-bottom: 100px">
            <el-table v-loading="loading" :data="scriptList" @selection-change="handleSelectionChange">
                <el-table-column :label="$t('script.349087-4')" align="center" prop="scriptName" />
                <el-table-column :label="$t('script.349087-5')" align="center" prop="productName" />
                <el-table-column :label="$t('script.349087-0')" align="center" prop="scriptId" width="180" />
                <el-table-column :label="$t('script.349087-6')" align="center" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.rule_script_event" :value="scope.row.scriptEvent" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('script.349087-7')" align="center" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.rule_script_action" :value="scope.row.scriptAction" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('script.349087-8')" align="center" prop="scriptLanguage" />
                <el-table-column :label="$t('alert.index.236501-44')" align="center" prop="enable" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.enable == 1" type="success" size="small">{{ $t('alert.index.236501-45') }}</el-tag>
                        <el-tag v-if="scope.row.enable == 0" type="danger" size="small">{{ $t('alert.index.236501-46') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('script.349087-9')" align="center" prop="scriptOrder" />
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['iot:script:query']">{{ $t('look') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleLog(scope.row.scriptId)" v-hasPermi="['iot:script:query']">{{ $t('script.349087-36') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:script:remove']">{{ $t('del') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改规则引擎脚本对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
                <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                    <el-row :gutter="50" style="display: flex; flex-wrap: wrap">
                        <el-col :span="12">
                            <el-form-item :label="$t('script.349087-4')" prop="scriptName">
                                <el-input v-model="form.scriptName" :placeholder="$t('script.349087-3')" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('script.349087-9')" prop="scriptOrder">
                                <el-input-number v-model="form.scriptOrder" :placeholder="$t('script.349087-3')" type="number" controls-position="right" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('script.349087-10')" prop="scriptEvent">
                                <el-select v-model="form.scriptEvent" :placeholder="$t('script.349087-11')" style="width: 100%">
                                    <el-option v-for="dict in dict.type.rule_script_event" :key="dict.label" :label="dict.label" :value="Number(dict.value)"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item :label="$t('script.349087-7')" prop="scriptAction">
                                <el-select v-model="form.scriptAction" :placeholder="$t('script.349087-12')" style="width: 100%">
                                    <el-option v-for="dict in dict.type.rule_script_action" :key="dict.label" :label="dict.label" :value="Number(dict.value)"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('script.349087-13')" prop="enable">
                                <el-switch v-model="form.enable" :active-value="1" :inactive-value="0" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="flex: 0 0 50%" v-if="form.scriptEvent === 5 || form.scriptEvent === 6">
                            <el-form-item :label="$t('script.349087-32')" prop="bridgeName">
                                <el-input readonly v-model="form.bridgeName" size="small" :placeholder="$t('script.349087-33')" style="margin-top: 3px">
                                    <el-button slot="append" @click="handleSelectBridge()" size="small">{{ $t('script.349087-34') }}</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="form.scriptEvent !== 5 && form.scriptEvent !== 6">
                            <el-form-item :label="$t('script.349087-5')" prop="productName">
                                <el-input readonly v-model="form.productName" size="small" :placeholder="$t('script.349087-14')" style="margin-top: 3px">
                                    <el-button slot="append" @click="handleSelectProduct()" size="small">{{ $t('script.349087-15') }}</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" style="flex: 0 0 50%">
                            <el-form-item :label="$t('script.349087-28')" v-show="form.scriptAction != 1" prop="">
                                <el-button type="warning" v-if="form.scriptAction == 3" @click="handleSelectHttpClient()" size="mini">{{ $t('script.349087-29') }}</el-button>
                                <el-button type="warning" v-if="form.scriptAction == 4" @click="handleSelectMqttClient()" size="mini">{{ $t('script.349087-30') }}</el-button>
                                <el-button type="warning" v-if="form.scriptAction == 5" @click="handleSelectDbSave()" size="mini">{{ $t('script.349087-31') }}</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="float: right"></el-col>
                    </el-row>
                </el-form>
                <div style="padding: 0px 10px" @click="editClick">
                    <AceEditor ref="codeEditor" :content.sync="form.scriptData" lang="groovy" codeStyle="chrome" :read-only="false" width="100%" height="450px"></AceEditor>
                </div>
                <div style="padding: 0 10px; margin: 10px 0">
                    <el-alert :title="validateMsg" type="success" show-icon v-if="isValidate && validateMsg" :closable="false"></el-alert>
                    <el-alert :title="validateMsg" type="error" show-icon v-if="!isValidate && validateMsg" :closable="false"></el-alert>
                </div>
                <div slot="footer" class="dialog-footer">
                    <span style="float: left">
                        <el-link style="line-height: 40px; padding-left: 20px" icon="el-icon-question" :underline="false" type="primary" href="https://fastbee.cn/doc/pages/rule_engine/" target="_blank">
                            {{ $t('script.349087-16') }}
                        </el-link>
                    </span>
                    <el-button type="success" @click="handleValidate">{{ $t('script.349087-17') }}</el-button>
                    <el-button type="primary" @click="submitForm" v-hasPermi="['iot:script:edit']" v-show="form.scriptId" :disabled="!isValidate">{{ $t('update') }}</el-button>
                    <el-button type="primary" @click="submitForm" v-hasPermi="['iot:script:add']" v-show="!form.scriptId" :disabled="!isValidate">{{ $t('add') }}</el-button>
                    <el-button @click="cancel">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>

            <el-dialog :title="title" :visible.sync="openLog" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
                <div
                    ref="logContainer"
                    v-loading="logLoading"
                    :element-loading-text="$t('script.349087-39')"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="border: 1px solid #ccc; border-radius: 5px; height: 500px; background-color: #181818; color: #fff; padding: 0 5px; line-height: 20px; overflow: auto"
                >
                    <pre>
    {{ logs }}
                    </pre>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelLog">{{ $t('script.349087-38') }}</el-button>
                </div>
            </el-dialog>
        </el-card>
        <!-- 产品列表 -->
        <productList ref="productList" @productEvent="getSelectProduct($event)"></productList>
        <!-- 客户端列表 -->
        <clientList ref="clientList" @clientEvent="getSelectClient($event)"></clientList>
        <!-- 接入点列表 -->
        <bridgeList ref="bridgeList" @bridgeEvent="getSelectBridge($event)"></bridgeList>
    </div>
</template>

<script>
import { listScript, getScript, getScriptLog, delScript, addScript, updateScript, validateScript, openPublishLog, closePublishLog } from '@/api/iot/script';
import AceEditor from '@/views/components/editor/editor.vue';
import productList from './product-list';
import clientList from './client-list';
import bridgeList from '@/views/iot/scene/bridge-list.vue';
export default {
    name: 'Script',
    dicts: ['rule_script_type', 'rule_script_language', 'rule_script_event', 'rule_script_action'],
    components: {
        bridgeList,
        AceEditor,
        productList,
        clientList,
    },
    data() {
        // 自定义验证规则
        var checkScriptId = (rule, value, callback) => {
            const regex = /^[a-zA-Z]+[0-9]*[a-zA-Z]*$/; // 定义只包含字母和数字，且字母开头的正则表达式
            if (!regex.test(value)) {
                return callback(new Error('脚本标识只能输入字母和数字，且字母开头'));
            } else {
                callback();
            }
        };
        return {
            // 日志
            logs: '',
            // 脚本数据验证
            isValidate: false,
            // 脚本数据验证结果
            validateMsg: '',
            // 遮罩层
            loading: true,
            // 日志遮罩层
            logLoading: true,
            // 选中数组
            scriptIds: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 规则引擎脚本表格数据
            scriptList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 是否显示日志弹窗
            openLog: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                scriptPurpose: 1, // 只展示数据流(1=数据流，2=触发器，3=执行动作)
                scriptId: null,
                scriptName: null,
                scriptData: null,
                scriptType: null,
                scriptLanguage: null,
                enable: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                scriptId: [{ required: true, message: this.$t('script.349087-19'), trigger: 'blur' }],
                productName: [{ required: true, message: this.$t('script.349087-20'), trigger: 'blur' }],
                bridgeName: [{ required: true, message: this.$t('script.349087-35'), trigger: 'blur' }],
                scriptName: [{ required: true, message: this.$t('script.349087-21'), trigger: 'blur' }],
                scriptType: [{ required: true, message: this.$t('script.349087-22'), trigger: 'change' }],
                scriptLanguage: [{ required: true, message: this.$t('script.349087-23'), trigger: 'change' }],
                scriptEvent: [{ required: true, message: '', trigger: 'change' }],
                scriptAction: [{ required: true, message: '', trigger: 'change' }],
                scriptOrder: [{ required: true, message: '', trigger: 'change' }],
                enable: [{ required: true, message: this.$t('script.349087-24'), trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        async connectMqtt() {
            if (this.$mqttTool.client == null) {
                await this.$mqttTool.connect(this.vuex_token);
            }
            // 删除所有message事件监听器
            this.$mqttTool.client.removeAllListeners('message');
            // 添加message事件监听器
            this.mqttCallback();
        },
        /* Mqtt回调处理  */
        mqttCallback() {
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                if (message instanceof Uint8Array) {
                    // 创建TextDecoder对象来转换Uint8Array到字符串
                    const decoder = new TextDecoder('utf-8');
                    const str = decoder.decode(message);
                    message = str; //转换后的字符串
                }
                console.log('🚀 ~ this.$mqttTool.client.on ~ message:', message);
                console.log('🚀 ~ this.$mqttTool.client.on ~ topic:', topic);
                if (topic.indexOf('/' + this.form.scriptId + '/ruleengine/test') != -1) {
                    message = JSON.parse(message.toString());
                    this.logs += '[' + message.time + ']' + '-' + '[' + message.requestId + ']:' + message.log + '\n';
                }
            });
        },
        /** 查询规则引擎脚本列表 */
        getList() {
            this.loading = true;
            listScript(this.queryParams).then((response) => {
                this.scriptList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 取消日志按钮
        cancelLog() {
            this.logs = '';
            this.openLog = false;
            closePublishLog(this.form.scriptId).then((response) => {
                let topic = '/' + this.form.scriptId + '/ruleengine/test';
                this.$mqttTool.unsubscribe(topic);
            });
        },
        // 表单重置
        reset() {
            this.validateMsg = '';
            this.isValidate = false;
            this.form = {
                id: null,
                applicationName: 'fastbee', // 后端配置和规则/脚本需要一致
                scriptId: null,
                productId: null,
                productName: '',
                bridgeName: '',
                scriptName: null,
                scriptType: 'script',
                remark: null,
                scriptLanguage: 'groovy',
                enable: 1,
                scriptPurpose: 1, // 脚本用途(1=数据流，2=触发器，3=执行动作)
                scriptOrder: 1, // 脚本执行顺序，数字越大越先执行
                scriptAction: 1, // 脚本动作(1=消息重发，2=消息通知，3=Http推送，4=Mqtt桥接，5=数据库存储)
                scriptEvent: 1, // 脚本事件(1=设备上报，2=平台下发，3=设备上线，4=设备离线)
                sceneId: 0,
                scriptData: `import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import cn.hutool.core.util.NumberUtil;

// 1. 获取主题和内容(必要)
String topic = msgContext.getTopic();
String payload = msgContext.getPayload();


// 2. 数据转换(自己处理)
msgContext.logger.info("数据转换处理")
String NewTopic = topic;
String NewPayload = payload;


// 3. 返回新的数据（必要）
msgContext.setTopic(NewTopic);
msgContext.setPayload(NewPayload);`,
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.scriptIds = selection.map((item) => item.scriptId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('script.349087-25');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const scriptId = row.scriptId || this.scriptIds;
            getScript(scriptId).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('script.349087-26');
            });
        },
        /** 日志按钮操作 */
        handleLog(scriptId) {
            this.logLoading = true;
            getScriptLog(scriptId).then((response) => {
                this.logs = response.msg;
                this.form.scriptId = scriptId;
                this.openLog = true;
                this.title = this.$t('script.349087-40');
                this.logLoading = false;
                // 滑动到底部
                this.$nextTick(function () {
                    let messageContent = this.$refs.logContainer;
                    messageContent.scroll({
                        top: messageContent.scrollHeight,
                    });
                });
            });

            // openPublishLog(scriptId).then((response) => {
            //     this.form.scriptId = scriptId;
            //     this.openLog = true;
            //     this.title = '日志信息';
            //     this.logLoading = false;
            //     this.connectMqtt();
            //     let topic = "/" + this.form.scriptId + "/ruleengine/test";
            //     this.$mqttTool.subscribe(topic);
            // });
        },
        /** 日志刷新操作 */
        refreshLog() {
            this.handleLog(this.form.scriptId);
        },
        /**选择产品 */
        handleSelectProduct(data) {
            // 刷新子组建
            this.$refs.productList.queryParams.pageNum = 1;
            this.$refs.productList.open = true;
            this.$refs.productList.selectProductId = this.form.productId;
            this.$refs.productList.getList();
        },
        getSelectProduct(data) {
            this.form.productId = data.productId;
            this.form.productName = data.productName;
        },
        /**选择桥接接入点 */
        handleSelectBridge() {
            this.$refs.bridgeList.queryParams.pageNum = 1;
            if (this.form.scriptEvent === 5) {
                this.$refs.bridgeList.queryParams.type = 3;
            } else if (this.form.scriptEvent === 6) {
                this.$refs.bridgeList.queryParams.type = 4;
            }
            this.$refs.bridgeList.openBridge = true;
            this.$refs.bridgeList.selectBridgeId = this.form.bridgeId;
            this.$refs.bridgeList.getList();
        },
        getSelectBridge(data) {
            this.form.bridgeId = data.id;
            this.form.bridgeName = data.name;
        },
        /**选择HTTP客户端 */
        handleSelectHttpClient(data) {
            // 刷新子组建
            this.$refs.clientList.type = 3;
            this.$refs.clientList.queryParams.pageNum = 1;
            this.$refs.clientList.queryParams.type = 3;
            this.$refs.clientList.open = true;
            this.$refs.clientList.getList();
        },
        /**选择MQTT客户端 */
        handleSelectMqttClient(data) {
            // 刷新子组建
            this.$refs.clientList.type = 4;
            this.$refs.clientList.queryParams.pageNum = 1;
            this.$refs.clientList.queryParams.type = 4;
            this.$refs.clientList.open = true;
            this.$refs.clientList.getList();
        },
        /**选择数据库存储 */
        handleSelectDbSave(data) {
            // 刷新子组建
            this.$refs.clientList.type = 5;
            this.$refs.clientList.queryParams.pageNum = 1;
            this.$refs.clientList.queryParams.type = 5;
            this.$refs.clientList.open = true;
            this.$refs.clientList.getList();
        },
        /**返回客户端数据**/
        getSelectClient(data) {
            if (this.form.scriptAction == 5) {
                var scriptaction = '\r\n// 执行Action动作参数(脚本由系统自动生成)\r\n';
                scriptaction += 'msgContext.databaseStorage(' + data.id + ');';
            } else {
                var scriptaction = '\r\n// 执行Action动作参数(脚本由系统自动生成)\r\n';
                if (this.form.scriptAction == 3) {
                    scriptaction += 'msgContext.setData("httpBridgeID", ' + data.id + ');';
                } else if (this.form.scriptAction == 4) {
                    scriptaction += 'msgContext.setData("mqttBridgeID", ' + data.id + ');';
                }
            }
            this.form.scriptData += scriptaction;
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.scriptId != null) {
                        updateScript(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addScript(this.form).then((response) => {
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
            const scriptIds = row.scriptId || this.scriptIds;
            this.$modal
                .confirm(this.$t('script.349087-27', [scriptIds]))
                .then(function () {
                    return delScript(scriptIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        /** 验证按钮操作 */
        handleValidate() {
            this.validateMsg = '';
            this.isValidate = false;
            validateScript(this.form).then((response) => {
                this.isValidate = response.data;
                this.validateMsg = response.msg;
            });
        },
        /** 编辑器单机事件 */
        editClick() {
            this.validateMsg = '';
            this.isValidate = false;
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/script/export',
                {
                    ...this.queryParams,
                },
                `script_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
