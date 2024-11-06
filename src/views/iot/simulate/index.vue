<template>
    <div style="padding: 6px">
        <el-row :gutter="5">
            <el-col :xs="24" :sm="12" :md="12" :lg="7" :xl="6">
                <el-card style="min-height: 800px; margin-bottom: 5px">
                    <el-form :model="queryParams" ref="queryForm" :inline="true" style="margin-bottom: -10px" size="mini">
                        <el-form-item prop="deviceName">
                            <el-input v-model="queryParams.deviceName" :placeholder="$t('simulate.index.111543-0')" clearable size="mini" @keyup.enter.native="handleQuery" style="width: 150px" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table v-loading="loading" :data="deviceList" @row-click="rowClick" highlight-current-row size="mini">
                        <el-table-column :label="$t('simulate.index.111543-1')" width="50" align="center">
                            <template slot-scope="scope">
                                <input type="radio" :checked="scope.row.isSelect" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('simulate.index.111543-2')" align="center" header-align="center" prop="deviceName,serialNumber">
                            <template slot-scope="scope">
                                {{ scope.row.deviceName }}
                                <br />
                                ({{ scope.row.serialNumber }})
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('simulate.index.111543-3')" align="center" prop="subDeviceCount" width="60">
                            <template slot-scope="scope">
                                {{ scope.row.subDeviceCount }}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('simulate.index.111543-4')" align="center" prop="status" width="140">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.status" :active-value="3" :inactive-value="4" @change="handleStatusChange(scope.row)" :disabled="!editPermission"></el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination
                        v-show="total > 0"
                        small
                        style="margin: 0 0 10px"
                        layout="total,prev, pager, next"
                        :total="total"
                        :page.sync="queryParams.pageNum"
                        :limit.sync="queryParams.pageSize"
                        @pagination="getList"
                    />
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="9" :xl="8">
                <el-card style="min-height: 800px; margin-bottom: 5px; padding: 0 10px">
                    <div class="phone">
                        <div class="phone-container">
                            <div class="phone-title">{{ $t('simulate.index.111543-5') }}</div>
                            <div class="messageContent" ref="messageContent">
                                <div v-for="(item, index) in messageList" :key="index">
                                    <div :class="item.direction == 'receive' ? 'messageReceive' : 'messageSend'">
                                        <div style="display: flex; align-items: center; justify-content: space-between">
                                            <div style="width: 190px">
                                                <span style="font-weight: 600; line-height: 24px">{{ $t('simulate.index.111543-6') }}</span>
                                                {{ item.ts }}
                                            </div>
                                            <div style="width: 50px">Qos: {{ item.qos }}</div>
                                        </div>
                                        <div>
                                            <span style="font-weight: 600; line-height: 24px">{{ $t('simulate.index.111543-7') }}</span>
                                            {{ item.topic }}
                                        </div>
                                        <div>
                                            <span style="font-weight: 600; line-height: 24px">{{ $t('simulate.index.111543-8') }}</span>
                                            {{ item.data }}
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                                <div style="height: 200px; display: flex; width: 100%"></div>
                            </div>
                            <div class="messageBottom">
                                <el-form :inline="true" size="mini" form="simulateForm">
                                    <el-form-item style="width: 100%" class="adaptWidth">
                                        <el-row :gutter="10">
                                            <el-col :span="8">
                                                <el-select v-model="simulateForm.payloadType" :placeholder="$t('simulate.index.111543-9')" style="width: 100%" @change="payloadTypeChange">
                                                    <el-option label="JSON" value="json"></el-option>
                                                    <el-option label="Hex" value="hex"></el-option>
                                                    <el-option label="Base64" value="base64"></el-option>
                                                    <el-option label="Plaintext" value="plaintext"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-select v-model="simulateForm.qos" :placeholder="$t('simulate.index.111543-10')" style="width: 100%" @change="qosChange">
                                                    <el-option :label="$t('simulate.index.111543-11')" value="0"></el-option>
                                                    <el-option :label="$t('simulate.index.111543-12')" value="1"></el-option>
                                                    <el-option :label="$t('simulate.index.111543-13')" value="2"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item style="margin-top: -10px; width: 100%" class="adaptWidth">
                                        <el-row :gutter="10">
                                            <el-col :span="16">
                                                <el-select v-model="simulateForm.topicSuffix" style="width: 100%" @change="topicChange" :placeholder="$t('simulate.index.111543-14')">
                                                    <el-option v-for="topic in topics" :key="topic.topicName" :label="topic.desc" :value="topic.topicName"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="7">
                                                <el-button type="primary" @click="enDecode">{{ $t('simulate.index.111543-15') }}</el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item style="margin-top: -10px; width: 100%" class="adaptWidth">
                                        <el-row :gutter="10">
                                            <el-col :span="16">
                                                <el-input disabled type="textarea" rows="3" :placeholder="$t('simulate.index.111543-16')" resize="none" style="" v-model="simulateForm.data"></el-input>
                                            </el-col>
                                            <el-col :span="7">
                                                <el-button type="success" style="margin-top: 2px; width: 92px; height: 62px" @click="simulateSend">{{ $t('simulate.index.111543-17') }}</el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="10">
                <!-- tabs多时，可以自己新建组件，免重复代码   -->
                <el-tabs type="border-card" v-model="thingsType" @tab-click="handleClick" style="flex: 1; height: 800px; margin-bottom: 5px">
                    <el-tab-pane :label="$t('simulate.index.111543-18')" name="prop">
                        <el-main v-loading="loading" style="position: relative" class="H100">
                            <el-row :gutter="20" class="row-list">
                                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8" v-for="(item, index) in runningData" :key="index" style="margin-bottom: 10px">
                                    <el-card shadow="hover" class="elcard" style="padding: 0px; height: auto">
                                        <div class="head">
                                            <div class="title">
                                                {{ item.name }}
                                            </div>
                                            <div class="name">
                                                <span style="color: #0f73ee">{{ item.value }}</span>
                                                <span v-if="item.value">{{ item.datatype.unit || item.datatype.unitName }}</span>
                                            </div>
                                        </div>
                                        <div>{{ item.ts }}</div>
                                        <div v-if="item.name == null" style="background-color: #0f73ee; height: 10px; width: 10px"></div>
                                        <div v-if="item.value == null || item.value == ''" style="height: 20px; width: 10px"></div>
                                        <div v-if="item.ts == null" style="height: 10px; width: 10px"></div>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </el-main>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('simulate.index.111543-19')" name="function">
                        <el-main v-loading="loading" style="position: relative" class="H100">
                            <el-row :gutter="20" class="row-list">
                                <el-col ::xs="24" :sm="12" :md="12" :lg="12" :xl="8" v-for="(item, index) in runningData" :key="index" style="margin-bottom: 10px">
                                    <el-card shadow="hover" class="elcard" style="height: auto">
                                        <div class="head">
                                            <div class="title">
                                                {{ item.name }}
                                            </div>
                                            <div class="name">
                                                <span style="color: #0f73ee">{{ item.value }}</span>
                                                <span v-if="item.value">{{ item.datatype.unit }}</span>
                                                <el-button type="primary" plain icon="el-icon-s-promotion" size="mini" style="float: right; margin-right: -5px; padding: 3px 5px" @click.stop="editFunc(item)">
                                                    发送
                                                </el-button>
                                            </div>
                                        </div>
                                        <div class="card-bottom">
                                            <span>{{ item.ts }}</span>
                                        </div>
                                        <div v-if="item.name == null" style="background-color: #0f73ee; height: 10px; width: 10px"></div>
                                        <div v-if="item.value == null || item.value == ''" style="height: 20px; width: 10px"></div>
                                        <div v-if="item.ts == null" style="height: 10px; width: 10px"></div>
                                    </el-card>
                                </el-col>
                                <el-empty :description="$t('simulate.index.111543-20')" v-show="runningData.length == 0"></el-empty>
                            </el-row>
                        </el-main>
                    </el-tab-pane>

                    <el-tab-pane disabled name="slave">
                        <span slot="label" style="margin-left: 0px">
                            <el-select v-model="params.slaveId" :placeholder="$t('simulate.index.111543-21')" @change="selectSlave" size="mini">
                                <el-option v-for="slave in slaveList" :key="slave.slaveId" :label="`${slave.deviceName}   (${slave.slaveId})`" :value="slave.slaveId"></el-option>
                            </el-select>
                        </span>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>

        <el-dialog style="float: right" :title="$t('simulate.index.111543-22')" :visible.sync="dialogValue" width="30%">
            <el-form v-model="from" size="mini" style="height: 100%; padding: 0 20px">
                <el-form-item :label="from.name" label-width="180px">
                    <el-input v-model="from.value" type="number" @input="justicNumber()" v-if="from.datatype.type == 'integer' || from.datatype.type == 'decimal'" style="width: 50%"></el-input>
                    <el-select v-if="from.datatype.type == 'enum'" v-model="from.value" @change="changeSelect()">
                        <el-option v-for="option in from.datatype.enumList" :key="option.value" :label="option.text" :value="option.value"></el-option>
                    </el-select>
                    <el-switch v-if="from.datatype.type === 'bool'" v-model="from.value" inline-prompt />
                    <span v-if="(from.datatype.type == 'integer' || from.datatype.type == 'decimal') && from.datatype.type.unit && from.datatype.type.unit != 'un' && from.datatype.type.unit != '/'">
                        （{{ from.unit }}）
                    </span>
                    <div class="range" v-if="from.datatype.type == 'integer' || from.datatype.type == 'decimal'">
                        ({{ $t('simulate.index.111543-23') + from.datatype.max == 'null' ? (from.datatype.type == 'bool' ? 0 : '') : from.datatype.min }} ~
                        {{ from.datatype.max == 'null' ? (from.datatype.type == 'bool' ? 1 : '') : from.datatype.max }})
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogValue = false">{{ $t('cancel') }}</el-button>
                <el-button type="primary" @click="sendService" :loading="btnLoading" :disabled="!canSend">{{ $t('confirm') }}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('simulate.index.111543-15')" :visible.sync="encodeDiaLog" width="50%">
            <el-form>
                <el-form-item :label="$t('simulate.index.111543-24')">
                    <el-select disabled v-model="codeFrom.protocolCode" :placeholder="$t('simulate.index.111543-25')" style="width: 150px" @change="changeProductCode">
                        <el-option v-for="p in protocolList" :key="p.protocolCode" :label="p.protocolName" :value="p.protocolCode" />
                    </el-select>
                    <span style="color: #ffba00; margin-left: 20px">{{ $t('simulate.index.111543-26') }}</span>
                </el-form-item>
            </el-form>
            <el-tabs type="border-card" value="first" @tab-click="encodeTagClick">
                <el-tab-pane :label="$t('simulate.index.111543-27')" name="first">
                    <el-form :inline="true" :model="codeFrom" label-width="70px">
                        <el-form-item>
                            <el-input type="textarea" rows="5" style="width: 600px" v-model="codeFrom.payload" :placeholder="$t('simulate.index.111543-28')"></el-input>
                        </el-form-item>
                        <el-form-item style="display: block">
                            <el-button style="width: 120px" type="primary" @click="onSubmit(1, false)">{{ $t('simulate.index.111543-29') }}</el-button>
                        </el-form-item>
                        <el-form-item v-if="codeFrom.result">
                            <div style="width: 700px; color: #00bb00" v-html="codeFrom.result"></div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$t('simulate.index.111543-30')" name="second">
                    <el-form v-model="codeFrom" label-width="85px">
                        <el-form-item :label="$t('simulate.index.111543-31')" prop="slaveId" size="small">
                            <el-input style="width: 250px" v-model="codeFrom.slaveId" :placeholder="$t('simulate.index.111543-32')" />
                        </el-form-item>
                        <el-form-item :label="$t('simulate.index.111543-33')" prop="address" size="small">
                            <el-input style="width: 250px" v-model="codeFrom.address" :placeholder="$t('simulate.index.111543-33')" />
                        </el-form-item>
                        <el-form-item :label="$t('simulate.index.111543-34')" prop="code" size="small">
                            <el-select style="width: 250px" v-model="codeFrom.code" :placeholder="$t('simulate.index.111543-35')">
                                <el-option :label="$t('simulate.index.111543-36')" value="3" />
                                <el-option :label="$t('simulate.index.111543-37')" value="4" />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('simulate.index.111543-38')" prop="count" size="small">
                            <el-input style="width: 250px" v-model="codeFrom.count" :placeholder="$t('simulate.index.111543-38')" />
                        </el-form-item>
                        <el-form-item style="display: block">
                            <el-button style="width: 100px" type="primary" @click="onSubmit(2, false)">{{ $t('simulate.index.111543-39') }}</el-button>
                            <el-button style="width: 200px; margin-left: 20px" type="success" @click="onSubmit(2, true)">{{ $t('simulate.index.111543-40') }}</el-button>
                        </el-form-item>
                        <el-form-item v-if="codeFrom.result">
                            <div>
                                {{ $t('simulate.index.111543-41') }}
                                <span style="color: #00bb00">{{ codeFrom.result }}</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$t('simulate.index.111543-42')" name="third">
                    <el-form v-model="codeFrom" label-width="85px">
                        <el-form-item :label="$t('simulate.index.111543-31')" prop="slaveId" size="small">
                            <el-input style="width: 250px" v-model="codeFrom.slaveId" :placeholder="$t('simulate.index.111543-32')" />
                        </el-form-item>
                        <el-form-item :label="$t('simulate.index.111543-33')" prop="address" size="small">
                            <el-input style="width: 250px" v-model="codeFrom.address" :placeholder="$t('simulate.index.111543-33')" />
                        </el-form-item>
                        <el-form-item :label="$t('simulate.index.111543-43')" prop="value" size="small">
                            <el-input style="width: 250px" v-model="codeFrom.writeData" :placeholder="$t('simulate.index.111543-44')" />
                        </el-form-item>
                        <el-form-item :label="$t('simulate.index.111543-34')" prop="code" size="small">
                            <div style="color: #0f73ee">06</div>
                        </el-form-item>
                        <el-form-item style="display: block">
                            <el-button style="width: 100px" type="primary" @click="onSubmit(3, false)">{{ $t('simulate.index.111543-41') }}</el-button>
                            <el-button style="width: 200px; margin-left: 20px" type="success" @click="onSubmit(3, true)">{{ $t('simulate.index.111543-40') }}</el-button>
                        </el-form-item>
                        <el-form-item v-if="codeFrom.result">
                            <div style="width: 200px; height: 40px">
                                {{ $t('simulate.index.111543-41') }}
                                <span style="color: #00bb00">{{ codeFrom.result }}</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$t('simulate.index.111543-45')" name="four">
                    <el-form :inline="true" :model="codeFrom" label-width="70px">
                        <el-form-item>
                            <el-input type="textarea" rows="5" style="width: 600px" v-model="codeFrom.payload" :placeholder="$t('simulate.index.111543-46')"></el-input>
                        </el-form-item>
                        <el-form-item style="display: block">
                            <el-button style="width: 120px" type="primary" @click="onSubmit(4, false)">{{ $t('simulate.index.111543-39') }}</el-button>
                            <el-button style="width: 120px; margin-left: 20px" type="success" @click="onSubmit(5, false)">{{ $t('simulate.index.111543-47') }}</el-button>
                        </el-form-item>
                        <el-form-item v-if="codeFrom.result">
                            <div>
                                {{ $t('simulate.index.111543-48') }}
                                <span style="color: #0f73ee" v-html="codeFrom.result"></span>
                            </div>
                        </el-form-item>
                        <el-form-item style="width: 700px"></el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
import { listDeviceShort, delDevice, getGwDevCode, getDevice } from '@/api/iot/device';
import { serviceInvoke, funcLog } from '@/api/iot/runstatus';
import { formatDate2 } from '@/utils/index';
import { listByPid } from '@/api/iot/salve';
import { getDeviceRunningStatus } from '@/api/iot/device';
import { listSimulateLog } from '@/api/iot/simulate';
import { updateDevice } from '../../../api/iot/device';
import { listProtocol } from '../../../api/iot/protocol';
import { decode, getTopics, simulateDown } from '../../../api/iot/tool';
import { checkPermi } from '@/utils/permission';

const INTEGER = 'integer';
const DECIMAL = 'decimal';
const BOOL = 'bool';
const ENUM = 'enum';

export default {
    name: 'Simulate',
    dicts: ['iot_device_status', 'iot_is_enable'],
    components: {},
    data() {
        return {
            // 遮罩层
            loading: false,
            // 总条数
            total: 0,
            // 设备列表数据
            deviceList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 12,
                deviceName: null,
                productId: null,
                groupId: null,
                productName: null,
                isSimulate: 1,
            },
            editPermission: false, // 是否有设备编辑权限
            /**设备模拟消息列表**/
            messageList: [],
            /**设备模拟发送消息表单**/
            simulateForm: {
                payloadType: 'hex',
                qos: '0',
            },
            selectDevice: {}, // 设备信息
            dialogValue: false, // 查看详情弹框
            encodeDiaLog: false, // 编解码弹窗
            gridData: [], // 事件数据
            groupId: 1,
            treeData: [],
            runningData: [], // 实时状态列表
            debounceGetRuntime: '',
            runtimeName: '',
            serialNumber: '',
            params: {
                serialNumber: undefined,
                type: 1,
                slaveId: '',
            },
            slaveList: [],
            thingsType: 'prop',
            opationList: [], // 指令数值数组
            funVal: {},
            canSend: false, //是否可以下发，主要判断数值在不在范围
            functionName: {},
            btnLoading: false,
            logList: [],
            showValue: '',
            from: {
                datatype: {
                    type: '',
                },
            },
            /*所有可用topic列表*/
            topics: [],
            /*编解码参数*/
            codeFrom: {
                protocolCode: 'MODBUS',
            },
            /*协议列表*/
            protocolList: [],
            /*设备详情*/
            device: {},
        };
    },
    created() {
        this.connectMqtt();
        // 判断是否有设备编辑权限
        let hasPermission = checkPermi(['iot:device:edit']);
        if (hasPermission) {
            this.editPermission = true;
        }
    },
    methods: {
        /* 连接Mqtt消息服务器 */
        async connectMqtt() {
            if (this.$mqttTool.client == null) {
                await this.$mqttTool.connect();
            }
            // 删除所有message事件监听器
            this.$mqttTool.client.removeAllListeners('message');
            // 添加message事件监听器
            this.mqttCallback();
            this.getList();
            this.getDownTopics();
            this.getProtocol();
        },
        /* Mqtt回调处理  */
        mqttCallback() {
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                let topics = topic.split('/');
                let productId = topics[1];
                let deviceNum = topics[2];
                message = JSON.parse(message.toString());
                if (!message) {
                    return;
                }
                /*发送设备上报到子模块*/
                if (topic.endsWith('ws/service')) {
                    // console.log('接收到【设备数据上报】主题：', topic)
                    console.log('接收到【设备数据上报】主题：', message);
                    this.updateData(message);
                }
                /*发送设备上报到子模块*/
                if (topic.endsWith('ws/post/simulate')) {
                    // console.log('接收到【modbus报文上报】主题：', topic)
                    // console.log('接收到【modbus报文上报】主题：', message)
                    this.messageList.push(...message);
                    this.messageList.splice(0, message.length - 1);
                    if (this.messageList.length > 30) {
                        this.messageList.splice(0, 10);
                    }
                    this.scrollBottom();
                }
            });
        },

        /** Mqtt订阅主题 */
        mqttSubscribe(device) {
            // 订阅当前设备状态和实时监测
            let topicSimulateLog = '/' + device.productId + '/' + device.serialNumber + '/ws/post/simulate';
            let topics = [];
            //订阅ws推送
            if (device.subDeviceList.length > 0) {
                device.subDeviceList.forEach((value) => {
                    let devTopic = '/' + device.productId + '/' + value.serialNumber + '/ws/service';
                    topics.push(devTopic);
                });
            }
            topics.push(topicSimulateLog);
            this.$mqttTool.subscribe(topics);
        },
        /** 查询所有简短设备列表 */
        getList() {
            this.loading = true;
            this.queryParams.params = {};
            listDeviceShort(this.queryParams).then((response) => {
                //设备列表初始化isSelect值，用于单选
                for (let i = 0; i < response.rows.length; i++) {
                    response.rows[i].isSelect = false;
                }
                this.deviceList = response.rows;
                this.total = response.total;
                this.loading = false;
                //选中第一个
                // this.rowClick(this.deviceList[0]);
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
            this.runningData.length = 0;
            this.slaveList = null;
            this.params.slaveId = '';
        },
        /*获取所有可下发topic*/
        getDownTopics() {
            const params = { isSimulate: true };
            getTopics(params).then((response) => {
                this.topics = response.data;
            });
        },
        /** 单选数据 */
        async rowClick(device) {
            if (device != null) {
                this.setRadioSelected(device.deviceId);
                this.selectDevice = device;
                this.serialNumber = this.selectDevice.serialNumber;
                this.params.productId = this.selectDevice.productId;
                this.params.deviceId = this.selectDevice.deviceId;
                this.device = await this.getDeviceDetail();
                this.slaveList = this.device.subDeviceList;
                this.params.serialNumber = this.selectDevice.serialNumber + '_' + this.device.slaveId;
                this.params.slaveId = this.device.slaveId;
                this.getRuntimeStatus();
                this.getSimulateLog();
                this.mqttSubscribe(this.device);
            }
        },
        /** 设置单选按钮选中 */
        setRadioSelected(deviceId) {
            for (let i = 0; i < this.deviceList.length; i++) {
                if (this.deviceList[i].deviceId == deviceId) {
                    this.deviceList[i].isSelect = true;
                } else {
                    this.deviceList[i].isSelect = false;
                }
            }
        },
        /** 获取设备日志 **/
        getSimulateLog() {
            const params = {
                serialNumber: this.params.serialNumber,
            };
            listSimulateLog(params).then((response) => {
                this.messageList = response.rows;
                this.$nextTick(function () {
                    this.scrollBottom();
                });
            });
        },
        /** 设备模拟发送 **/
        simulateSend() {
            if (!this.params.serialNumber || !this.params.productId) {
                this.$modal.alert(this.$t('simulate.index.111543-49'));
                return;
            }
            if (!this.simulateForm.topicSuffix) {
                this.$modal.alert(this.$t('simulate.index.111543-50'));
                return;
            }
            if (!this.simulateForm.data) {
                this.$modal.alert(this.$t('simulate.index.111543-51'));
                return;
            }
            //拼接topic
            this.simulateForm.topic = '/' + this.params.productId + '/' + this.params.serialNumber + this.simulateForm.topicSuffix;
            // 模拟数据
            this.simulateForm.direction = 'send';
            this.simulateForm.ts = this.getTime();
            this.messageList.push(JSON.parse(JSON.stringify(this.simulateForm)));
            this.scrollBottom();
            this.pushSimulateDown();
        },
        /*模拟设备下发指令*/
        pushSimulateDown() {
            const params = { topic: this.simulateForm.topic, message: this.simulateForm.data, qos: this.simulateForm.qos };
            simulateDown(params).then((response) => {
                this.$modal.success(this.$t('simulate.index.111543-52'));
            });
        },

        /** 滑动到容器底部 **/
        scrollBottom() {
            let messageContent = this.$refs.messageContent;
            messageContent.scroll({
                top: messageContent.scrollHeight,
                behavior: 'smooth',
            });
        },
        /** qos改变事件 **/
        qosChange(data) {},
        /*topic更改*/
        topicChange(data) {},
        /*编码器*/
        enDecode() {
            this.encodeDiaLog = true;
            this.reset();
        },
        /** 载体改变事件 **/
        payloadTypeChange(data) {},
        /** 获取当前时间 **/
        getTime() {
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let H = date.getHours();
            let mm = date.getMinutes();
            let s = date.getSeconds();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            H = H < 10 ? '0' + H : H;
            return y + '-' + m + '-' + d + ' ' + H + ':' + mm + ':' + s;
        },
        /*获取运行状态*/
        getRuntimeStatus() {
            getDeviceRunningStatus(this.params).then((response) => {
                this.runningData = response.data.thingsModels;
            });
        },

        /*根据产品获取从机列表*/
        getDeviceDetail() {
            return new Promise((resolve, reject) => {
                getDevice(this.params.deviceId)
                    .then((res) => {
                        resolve(res.data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        /**根据产品id获取从机列表*/
        getSlaveList() {
            this.getRuntimeStatus();
        },
        /*选择从机*/
        selectSlave() {
            this.params.serialNumber = this.serialNumber + '_' + this.params.slaveId;
            this.getRuntimeStatus();
        },
        /*tabs切换*/
        handleClick() {
            if (!this.selectDevice) {
                return;
            }
            if (this.thingsType === 'prop') {
                this.params.type = 1;
            } else if (this.thingsType === 'function') {
                this.params.type = 2;
            }
            // this.getRuntimeStatus();
        },
        // 更新参数值
        updateParam(data) {},
        //指令下发
        editFunc(item) {
            console.log('item', item);
            this.dialogValue = true;
            this.canSend = true;
            this.funVal = {};
            this.getValueName(item);
            item.id = parseInt(item.id);
            this.from = item;
        },

        // 解析值
        getValueName(item) {
            console.log('item', item);
            switch (item.datatype.type) {
                case ENUM:
                    let list = item.datatype.enumList;
                    list.forEach((m) => {
                        if (m.text === item.logValue) {
                            this.funVal[item.id] = m.text;
                        }
                    });
                    break;
                case INTEGER:
                case DECIMAL:
                case BOOL:
                    this.funVal[item.id] = item.logValue;
                    break;
            }
        },
        //发送指令
        sendService() {
            console.log('service', this.from);
            try {
                this.getShowValue(Object.values(this.funVal)[0]);
                const params = {
                    topic: '/' + this.params.productId + '/' + this.params.serialNumber + '/property/set/simulate',
                    slaveId: this.params.slaveId,
                    value: this.from.value,
                    address: this.from.id,
                };
                simulateDown(params).then((response) => {
                    if (response.code == 200) {
                        this.$message({
                            type: 'success',
                            message: this.$t('simulate.index.111543-53'),
                        });
                    }
                });
            } finally {
                this.dialogValue = false;
            }
        },

        getShowValue(value) {
            switch (this.from.datatype.type) {
                case ENUM:
                    let list = this.from.datatype.enumList;
                    list.forEach((m) => {
                        if (m.value === value) {
                            this.showValue = m.text;
                        }
                    });
                    break;
                case INTEGER:
                case DECIMAL:
                    this.showValue = value;
                case BOOL:
                    this.showValue = value == 1 ? this.from.datatype.trueText : this.from.datatype.falseText;
                    break;
            }
        },

        //下拉选择修改触发
        changeSelect() {
            this.$forceUpdate();
        },

        //判断输入是否超过范围
        justicNumber() {
            this.canSend = true;
            if (this.from.datatype.max < this.funVal[this.from.identity] || this.from.datatype.min > this.funVal[this.from.identity]) {
                this.canSend = false;
                return true;
            }
            this.$forceUpdate();
        },

        updateData(msg) {},
        //启动模拟
        handleStatusChange(row) {
            let text = row.status === 3 ? this.$t('simulate.index.111543-54') : this.$t('simulate.index.111543-55');
            const data = { deviceId: row.deviceId, status: row.status, serialNumber: row.serialNumber, productId: row.productId };
            updateDevice(data)
                .then((res) => {
                    this.$modal.msgSuccess(text + this.$t('simulate.index.111543-56'));
                })
                .catch(function () {});
        },
        //编解码页面切换
        encodeTagClick() {
            this.reset();
        },
        //提交解析
        onSubmit(type, copy) {
            this.codeFrom.type = type;
            if (type == 2) {
                this.codeFrom.writeData = 0;
            } else if (type == 3) {
                this.codeFrom.code = 6;
                this.codeFrom.count = 0;
            }
            decode(this.codeFrom).then((response) => {
                this.codeFrom.result = response.msg;
                if (copy) {
                    this.simulateForm.data = this.codeFrom.result;
                }
            });
        },
        //获取设备协议
        getProtocol() {
            const data = { status: 1 };
            listProtocol(data).then((res) => {
                this.protocolList = res.rows;
            });
        },
        // 选择协议变更
        changeProductCode() {},

        // 表单重置
        reset() {
            this.codeFrom = {
                payload: null,
                slaveId: undefined,
                address: null,
                code: null,
                count: null,
                writeData: null,
                type: null,
                result: null,
                protocolCode: 'MODBUS',
            };
            this.resetForm('codeFrom');
        },
    },
};
</script>

<style>
.specsColor {
    background-color: #fcfcfc;
}
</style>

<style lang="scss" scoped>
.adaptWidth ::v-deep .el-form-item__content {
    width: 100%;
}

.phone {
    height: 729px;
    width: 100%;
    background-image: url('../../../assets/images/phone.png');
    background-size: 100% 100%;
}

.phone-container {
    height: 618px;
    width: 94%;
    position: relative;
    top: 46px;
    left: 2.5%;
    background-color: #fff;

    .phone-title {
        line-height: 40px;
        color: #fff;
        background-color: #007aff;
        text-align: center;
    }

    .messageContent {
        height: 440px;
        overflow-y: scroll;
        word-wrap: break-word;
        padding: 6px 0;
        color: #fff;
    }

    .messageBottom {
        height: 150px;
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: #eef3f7;
        padding: 5px;
        border-top: 1px solid #d2dae1;
    }

    .messageReceive {
        float: left;
        background-color: #409eff;
        border-radius: 6px;
        padding: 10px;
        width: 70%;
        font-size: 12px;
        margin-bottom: 15px;
        border-style: dotted;
    }

    .messageSend {
        float: right;
        background-color: #13ce66;
        border-radius: 10px;
        padding: 10px;
        width: 70%;
        font-size: 12px;
        margin-bottom: 15px;
        border-right-style: double;
    }
}

.H100 {
    //height: 100%;
    overflow: hidden;
    margin-left: 10px;
}

.row-list {
    height: calc(100% - 20px);
    height: 700px;
    overflow: auto;
    margin: -20px -30px -30px -30px !important;
    font-size: 12px;
    line-height: 20px;
}

.running-status {
    .select {
        margin-bottom: 15px;
    }

    .title-icon {
        position: absolute;
        top: 0px;
        // right: 0;
        line-height: 1;
        cursor: pointer;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
    }

    .elcard:hover {
        background-color: #e1ecea;
    }

    .head {
        .title {
            height: 15px;
            color: rgb(80, 93, 92, 0.85);
            line-height: 15px;
            position: relative;
            font-weight: 600;
            font-size: 12px;
        }

        .name {
            height: 28px;
            margin-top: 5px;
            margin-bottom: 0;
            margin-right: 30px;
            overflow: hidden;
            color: rgba(0, 0, 0, 0.85);
            font-size: 12px;
            line-height: 20px;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            color: darkgrey;
        }

        .value_class {
            font-size: 17px;
            color: #36a4ea;
        }
    }

    .card-bottom {
        color: darkgrey;
        font-size: 10px;
        //font-variant: tabular-nums;
        //line-height: 1.5;
        //list-style: none;
        font-feature-settings: 'tnum';
        margin-top: 12px;
        display: inline;

        .time-class {
            width: 180px;
        }
    }

    .edit-class {
        margin-top: 10px;
    }

    .msgbox {
        padding: 0px;
        line-height: 20px;
        overflow: hidden;
        border: 0.4px solid #36a4ea;
        background: #fff;
        width: 90%;
        height: 700px;
        margin: 0 auto 20px;

        .box-title {
            text-align: center;
            font-size: 14px;
            background-color: #eff1f3;
            padding: 6px;
        }

        .log-content {
            // height: 550px;
            padding: 2px;
            height: calc(100% - 36px);
            overflow: auto;
            // margin-bottom: 30px;
        }

        ul {
            padding: 0;
            margin: 4px 0;
            list-style: none;
        }

        a {
            width: 100%;
            color: #333;
            //border: 1px solid #fff;
            flex-wrap: wrap;
            padding: 5px 5px 1px 5px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;

            .time {
                font-size: 9px;
                font-weight: 200;
                color: #9f9b9b;
            }

            div {
                color: #36a4ea;

                .lable-s1 {
                    color: gray;
                }
            }

            .fail {
                color: #f56c6c;
            }

            .wait {
                color: #909399;
            }
        }

        a:last-child {
            color: #333;
            //border: 1px solid #C3DFF4;
            text-decoration: none;
            background: #f5fafd;
        }
    }
}
</style>
