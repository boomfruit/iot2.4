<template>
    <div class="running-status beautify-scroll-def" v-loading="loading">
        <el-main v-loading="loading" style="position: relative" class="H100">
            <el-row :gutter="12" class="row-list" v-if="!loading && runningData.length > 0">
                <el-col :span="6" v-for="(item, index) in runningData" :key="index" style="margin-bottom: 10px; height: 110px">
                    <el-card shadow="hover" class="elcard">
                        <div class="head">
                            <div class="title">
                                {{ item.name || '--' }}
                                <el-tooltip :content="$t('device.realTime-status.845353-0')" v-if="item.isReadonly == 0" class="title_send">
                                    <span class="el-icon-s-promotion" @click.stop="editFunc(item)">
                                        <span class="send_title">{{ $t('device.realTime-status.845353-1') }}</span>
                                    </span>
                                </el-tooltip>
                            </div>
                            <div class="name">
                                <span class="value_class">{{ item.valueName || '-' }}</span>
                                <span v-if="item.datatype.unit && item.datatype.unit != 'un'">
                                    {{ item.datatype.unit || item.datatype.unitName }}
                                </span>
                            </div>
                        </div>
                        <div class="card-bottom">{{ $t('device.realTime-status.845353-2') }}{{ item.ts || '--' }}</div>
                    </el-card>
                </el-col>
            </el-row>
            <el-empty :image-size="200" v-if="!loading && runningData.length === 0"></el-empty>
        </el-main>
        <el-dialog :title="$t('device.realTime-status.845353-3')" :visible.sync="dialogValue" width="30%">
            <el-form size="mini" style="height: 100%; padding: 0 20px">
                <el-form-item v-for="(item, index) in opationList" :label="`${item.label}：`" :key="index" label-width="180px">
                    <el-input
                        v-model="funVal[item.key]"
                        :precision="0"
                        :controls="false"
                        @input="justicNumber(item)"
                        type="number"
                        v-if="item.dataTypeName == 'integer' || item.dataTypeName == 'decimal'"
                        style="width: 50%"
                    ></el-input>
                    <el-select v-if="item.dataTypeName == 'enum' || item.dataTypeName == 'singleBoolean' || item.dataTypeName == 'bool'" v-model="funVal[item.key]" @change="changeSelect()">
                        <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                    <span v-if="(item.dataTypeName == 'integer' || item.dataTypeName == 'decimal') && item.unit && item.unit != 'un' && item.unit != '/'">（{{ item.unit }}）</span>
                    <span class="range" v-if="item.dataTypeName == 'integer' || item.dataTypeName == 'decimal'">({{ item.min }} ~ {{ item.max }})</span>
                </el-form-item>
                <el-form-item style="display: none">
                    <el-input v-model="functionName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogValue = false">{{ $t('device.realTime-status.845353-4') }}</el-button>
                <el-button type="primary" @click="sendService" :loading="btnLoading" :disabled="!canSend">{{ $t('device.realTime-status.845353-5') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { serviceInvoke, runningStatus } from '@/api/iot/runstatus';

export default {
    props: {
        device: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    watch: {
        device: {
            handler(newVal) {
                if (newVal && newVal.serialNumber) {
                    this.params.serialNumber = newVal.serialNumber;
                    this.serialNumber = newVal.serialNumber;
                    this.params.productId = newVal.productId;
                    this.params.slaveId = newVal.slaveId;
                    this.params.deviceId = newVal.deviceId;
                    this.deviceInfo = newVal;
                    this.updateDeviceStatus(this.deviceInfo);
                    this.slaveList = newVal.subDeviceList;
                    this.getSlaveList(this.deviceInfo);
                    this.$busEvent.$on('updateData', (params) => {
                        if (params.data && params.data[0].remark) {
                            this.getDeviceFuncLog();
                            params.data[0].ts = params.data[0].remark;
                        }
                        this.updateData(params);
                    });
                    this.$busEvent.$on('updateLog', (params) => {
                        this.getDeviceFuncLog();
                    });
                    // 添加message事件监听器
                    this.mqttCallback();
                }
            },
        },
    },
    data() {
        return {
            activeGroup: '',
            groupList: [],
            runningData: [],
            loading: false,
            dialogValue: false,
            canSend: false, //是否可以下发，主要判断数值在不在范围
            btnLoading: false,
            funVal: {},
            chooseFun: {},
            opationList: [],
            functionName: '',
        };
    },
    methods: {
        /** qos改变事件 **/
        qosChange(data) {},
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
                this.runningData.forEach((item) => {
                    if (item.datatype.type == 'enum') {
                        item.datatype.enumList.forEach((val) => {
                            if (val.value == item.value) {
                                item.value = val.text;
                            }
                        });
                    } else if (item.datatype.type == 'bool') {
                        item.value = item.value == 0 ? item.falseText : item.trueText;
                    }
                });
                //筛选读写物模型
                this.functionData = this.runningData.filter((item) => item.isReadonly == 0);
            });
        },

        getGateway() {
            getDeviceRunningStatus(this.params).then((response) => {
                this.deviceInfo.thingsModels = response.data.thingsModels;
            });
        },

        /**根据产品id获取从机列表*/
        getSlaveList() {
            this.getRuntimeStatus();
            this.getDeviceFuncLog();
        },
        /*选择从机*/
        selectSlave() {
            this.params.serialNumber = this.serialNumber + '_' + this.params.slaveId;
            this.getRuntimeStatus();
        },
        /*tabs切换*/
        handleClick() {
            if (this.thingsType === 'prop') {
                this.params.type = 1;
            } else if (this.thingsType === 'function') {
                this.params.type = 2;
                //筛选读写物模型
                this.functionData = this.runningData.filter((item) => item.isReadonly == 0);
            }
        },
        //切换实时状态
        runtimeClick() {
            if (this.runtimeName === 'gateway') {
                this.params.serialNumber = this.serialNumber;
                this.slaveId = this.params.slaveId;
                this.params.slaveId = undefined;
                this.getGateway();
            } else {
                this.params.serialNumber = this.serialNumber + '_' + this.slaveId;
                this.params.slaveId = this.slaveId;
                this.getRuntimeStatus();
            }
        },
        // 更新参数值
        updateParam(data) {},
        //指令下发
        editFunc(item) {
            this.dialogValue = true;
            this.canSend = true;
            this.funVal = {};
            this.getValueName(item);
            this.from = item;
            console.log(this.runningData);
        },

        /** 更新设备状态 */
        updateDeviceStatus(device) {
            if (device.status == 3) {
                this.statusColor.background = '#12d09f';
                this.title = '在线模式';
            } else {
                if (device.isShadow == 1) {
                    this.statusColor.background = '#409EFF';
                    this.title = '影子模式';
                } else {
                    this.statusColor.background = '#909399';
                    this.title = '离线模式';
                    this.shadowUnEnable = true;
                }
            }
            this.$emit('statusEvent', this.deviceInfo.status);
        },

        // 解析值
        getValueName(item) {
            this.funVal[item.id] = item.value;
        },
        // 发送指令
        sendService() {
            console.log('下发指令', this.from.shadow);
            try {
                this.funVal[this.from.id] = this.from.shadow;
                const data = {
                    serialNumber: this.serialNumber,
                    productId: this.params.productId,
                    remoteCommand: this.funVal,
                    identifier: this.from.id,
                    slaveId: this.params.slaveId,
                    modelName: this.from.name,
                    isShadow: this.device.status != 3,
                    type: this.from.type,
                };
                serviceInvoke(data).then((response) => {
                    if (response.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '服务调用成功!',
                        });
                        this.getDeviceFuncLog();
                    }
                });
            } finally {
                this.dialogValue = false;
            }
        },

        //发送指令
        mqttPublish(device, model) {
            const command = {};
            command[model.id] = model.shadow;
            const data = {
                serialNumber: device.serialNumber,
                productId: device.productId,
                remoteCommand: command,
                identifier: model.id,
                modelName: model.name,
                isShadow: device.status != 3,
                type: model.type,
            };
            serviceInvoke(data).then((response) => {
                if (response.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '服务调用成功!',
                    });
                }
            });
        },

        getShowValue(value) {
            switch (this.from.datatype.type) {
                case ENUM:
                    const list = this.from.datatype.enumList;
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

        //  获取设备服务下发日志
        getDeviceFuncLog() {
            const params = {
                serialNumber: this.serialNumber,
            };
            console.log('params --', params);
            funcLog(params).then((response) => {
                this.logList = response.rows;
            });
        },
        updateData(msg) {
            if (msg.data) {
                msg.data.forEach((d) => {
                    this.runningData.some((old, index) => {
                        if (d.slaveId === old.slaveId && d.id == old.id) {
                            const template = this.runningData[index];
                            template.ts = d.ts;
                            template.value = d.value;
                            if (old.datatype.type == 'enum') {
                                old.datatype.enumList.forEach((val) => {
                                    if (val.value == template.value) {
                                        template.value = val.text;
                                    }
                                });
                            } else if (old.datatype.type == 'bool') {
                                template.value = template.value == 0 ? old.datatype.falseText : old.datatype.trueText;
                            }
                            this.$set(this.runningData, index, template);
                            return true;
                        }
                    });
                });
            }
        },

        /* Mqtt回调处理 */
        mqttCallback() {
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                let topics = topic.split('/');
                let productId = topics[1];
                let deviceNum = topics[2];
                message = JSON.parse(message.toString());
                if (!message) {
                    return;
                }
                if (topics[3] == 'status') {
                    console.log('接收到【设备状态-运行】主题：', topic);
                    console.log('接收到【设备状态-运行】内容：', message);
                    // 更新列表中设备的状态
                    if (this.deviceInfo.serialNumber == deviceNum) {
                        this.deviceInfo.status = message.status;
                        this.deviceInfo.isShadow = message.isShadow;
                        this.deviceInfo.rssi = message.rssi;
                        this.updateDeviceStatus(this.deviceInfo);
                    }
                }
                //兼容设备回复
                if (topics[4] == 'reply') {
                    this.$modal.notifySuccess(message);
                }
                if (topic.endsWith('ws/service')) {
                    // console.log('接收到【物模型】主题1：', topic);
                    // console.log('接收到【物模型】内容：', message);
                    // 更新列表中设备的属性
                    if (this.deviceInfo.serialNumber == deviceNum) {
                        for (let j = 0; j < message.length; j++) {
                            let isComplete = false;
                            // 设备状态
                            for (let k = 0; k < this.deviceInfo.thingsModels.length && !isComplete; k++) {
                                if (this.deviceInfo.thingsModels[k].id == message[j].id) {
                                    // 普通类型(小数/整数/字符串/布尔/枚举)
                                    if (this.deviceInfo.thingsModels[k].datatype.type == 'decimal' || this.deviceInfo.thingsModels[k].datatype.type == 'integer') {
                                        this.deviceInfo.thingsModels[k].shadow = Number(message[j].value);
                                    } else {
                                        this.deviceInfo.thingsModels[k].shadow = message[j].value;
                                    }
                                    isComplete = true;
                                    break;
                                } else if (this.deviceInfo.thingsModels[k].datatype.type == 'object') {
                                    // 对象类型
                                    for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.params.length; n++) {
                                        if (this.deviceInfo.thingsModels[k].datatype.params[n].id == message[j].id) {
                                            this.deviceInfo.thingsModels[k].datatype.params[n].shadow = message[j].value;
                                            isComplete = true;
                                            break;
                                        }
                                    }
                                } else if (this.deviceInfo.thingsModels[k].datatype.type == 'array') {
                                    // 数组类型
                                    if (this.deviceInfo.thingsModels[k].datatype.arrayType == 'object') {
                                        // 1.对象类型数组,id为数组中一个元素,例如：array_01_gateway_temperature
                                        if (String(message[j].id).indexOf('array_') == 0) {
                                            for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.arrayParams.length; n++) {
                                                for (let m = 0; m < this.deviceInfo.thingsModels[k].datatype.arrayParams[n].length; m++) {
                                                    if (this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].id == message[j].id) {
                                                        this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].shadow = message[j].value;
                                                        isComplete = true;
                                                        break;
                                                    }
                                                }
                                                if (isComplete) {
                                                    break;
                                                }
                                            }
                                        } else {
                                            // 2.对象类型数组，例如：gateway_temperature,消息ID添加前缀后匹配
                                            for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.arrayParams.length; n++) {
                                                for (let m = 0; m < this.deviceInfo.thingsModels[k].datatype.arrayParams[n].length; m++) {
                                                    let index = n > 9 ? String(n) : '0' + k;
                                                    let prefix = 'array_' + index + '_';
                                                    if (this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].id == prefix + message[j].id) {
                                                        this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].shadow = message[j].value;
                                                        isComplete = true;
                                                    }
                                                }
                                                if (isComplete) {
                                                    break;
                                                }
                                            }
                                        }
                                    } else {
                                        // 整数、小数和字符串类型数组
                                        for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.arrayModel.length; n++) {
                                            if (this.deviceInfo.thingsModels[k].datatype.arrayModel[n].id == message[j].id) {
                                                this.deviceInfo.thingsModels[k].datatype.arrayModel[n].shadow = message[j].value;
                                                isComplete = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            // 图表数据
                            for (let k = 0; k < this.deviceInfo.chartList.length; k++) {
                                if (this.deviceInfo.chartList[k].id.indexOf('array_') == 0) {
                                    // 数组类型匹配,例如：array_00_gateway_temperature
                                    if (this.deviceInfo.chartList[k].id == message[j].id) {
                                        // let shadows = message[j].value.split(",");
                                        this.deviceInfo.chartList[k].shadow = message[j].value;
                                        // 更新图表
                                        for (let m = 0; m < this.monitorChart.length; m++) {
                                            if (message[j].id == this.monitorChart[m].data.id) {
                                                let data = [
                                                    {
                                                        value: message[j].value,
                                                        name: this.monitorChart[m].data.name,
                                                    },
                                                ];
                                                this.monitorChart[m].chart.setOption({
                                                    series: [
                                                        {
                                                            data: data,
                                                        },
                                                    ],
                                                });
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    // 普通类型匹配
                                    if (this.deviceInfo.chartList[k].id == message[j].id) {
                                        this.deviceInfo.chartList[k].shadow = message[j].value;
                                        // 更新图表
                                        for (let m = 0; m < this.monitorChart.length; m++) {
                                            if (message[j].id == this.monitorChart[m].data.id) {
                                                isComplete = true;
                                                let data = [
                                                    {
                                                        value: message[j].value,
                                                        name: this.monitorChart[m].data.name,
                                                    },
                                                ];
                                                this.monitorChart[m].chart.setOption({
                                                    series: [
                                                        {
                                                            data: data,
                                                        },
                                                    ],
                                                });
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (isComplete) {
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.phone-main {
    float: right;
}

.phone {
    height: 729px;
    width: 370px;
    background-image: url('../../../assets/images/phone.png');
    background-size: cover;
}

.phone-container {
    height: 618px;
    width: 343px;
    position: relative;
    top: 46px;
    left: 12px;
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

.log-content {
    padding: 2px;
    height: calc(100% - 44px);
    overflow: auto;

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

        .time {
            font-size: 10px;
            color: gray;
        }

        div {
            color: #1b93e0;

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
}

.H100 {
    //overflow: hidden;
    margin-left: 10px;
}

.row-list {
    height: calc(100% - 20px);
    height: 700px;
    overflow: auto;
    margin: -20px -20px -20px -30px !important;
    font-size: 12px;
    line-height: 20px;
}

.running-status {
    .select {
        margin-bottom: 15px;
    }

    .edit-class {
        margin-top: 10px;
    }
}
</style>
