<template>
    <el-row :gutter="10">
        <!--机构-设备数据-->
        <el-col :span="5" :xs="24">
            <el-card style="margin: 6px">
                <div class="menu-wrap">
                    <el-input v-model="deptName" :placeholder="$t('device.device-linkage.188958-0')" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px; margin-right: 10px" />
                    <el-tree
                        :data="deptOptions"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree"
                        node-key="id"
                        default-expand-all
                        highlight-current
                        @node-click="handleNodeClick"
                    />
                </div>
            </el-card>
            <el-card style="margin: 6px">
                <div style="height: 445px">
                    <el-tabs v-model="activeName1" @tab-click="handleClick">
                        <el-tab-pane :label="$t('device.device-linkage.188958-1')" name="first"></el-tab-pane>
                        <el-tab-pane :label="$t('device.device-linkage.188958-2')" name="second"></el-tab-pane>
                        <el-tab-pane :label="$t('device.device-linkage.188958-3')" name="third"></el-tab-pane>
                    </el-tabs>
                    <el-input
                        v-model="queryParams.deviceName"
                        :placeholder="$t('device.device-edit.148398-2')"
                        clearable
                        size="small"
                        prefix-icon="el-icon-search"
                        style="margin-bottom: 20px; margin-right: 10px"
                        @keydown.enter.native="getDeviceList"
                    />
                    <el-menu class="menu-wrap" :default-active="deviceList[0] && deviceList[0].devcieId" :default-openeds="defaultOpeneds" @open="handleOpen" style="margin-right: 10px">
                        <el-submenu index="1" style="margin-left: -5px">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span style="font-size: 14px; padding: 0">{{ $t('device.device-linkage.188958-5') }}</span>
                            </template>
                            <el-menu-item
                                v-for="item in deviceList"
                                :key="item.devcieId"
                                :index="item.devcieId"
                                class="custom-menu-item"
                                :label="item.devcieName"
                                :value="item.devcieId"
                                @click="handleTypeClick(item.deviceId)"
                            >
                                {{ item.deviceName }}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
            </el-card>
        </el-col>

        <el-col :span="18" :xs="24">
            <el-card style="margin: 6px">
                <div class="head-container">
                    <el-tabs v-model="activeName" tab-position="top" @tab-click="tabChange" style="min-height: 400px">
                        <el-tab-pane name="basic">
                            <span slot="label">{{ $t('device.device-edit.148398-0') }}</span>
                            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                                <el-row :gutter="30">
                                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                                        <el-form-item :label="$t('device.device-edit.148398-1')" prop="deviceName">
                                            <el-input v-model="form.deviceName" :placeholder="$t('device.device-edit.148398-2')">
                                                <el-button slot="append" @click="openSummaryDialog" v-if="form.deviceId != 0">{{ $t('device.device-edit.148398-3') }}</el-button>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="" prop="productName">
                                            <template slot="label">
                                                <span style="color: red">*</span>
                                                {{ $t('device.device-edit.148398-4') }}
                                            </template>
                                            <el-input readonly v-model="form.productName" :placeholder="$t('device.allot-import-dialog.060657-1')" disabled>
                                                <el-button slot="append" @click="selectProduct()" disabled>{{ $t('device.device-edit.148398-6') }}</el-button>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="" prop="serialNumber">
                                            <template slot="label">
                                                <span style="color: red">*</span>
                                                {{ $t('device.device-edit.148398-7') }}
                                            </template>
                                            <el-input v-model="form.serialNumber" :placeholder="$t('device.device-edit.148398-8')" disabled maxlength="32">
                                                <el-button v-if="form.deviceType !== 3" slot="append" @click="generateNum" :loading="genDisabled" disabled v-hasPermi="['iot:device:add']">
                                                    {{ $t('device.device-edit.148398-9') }}
                                                </el-button>
                                                <el-button v-if="form.deviceType === 3" slot="append" @click="genSipID()" disabled v-hasPermi="['iot:device:add']">{{ $t('device.device-edit.148398-9') }}</el-button>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item v-if="openServerTip">
                                            <template>
                                                <el-alert type="info" show-icon :description="$t('device.device-edit.148398-10')"></el-alert>
                                            </template>
                                        </el-form-item>
                                        <el-form-item v-if="openTip">
                                            <template>
                                                <el-alert type="success" show-icon :description="$t('device.device-edit.148398-11')"></el-alert>
                                            </template>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-edit.148398-12')" prop="firmwareVersion">
                                            <el-input v-model="form.firmwareVersion" :placeholder="$t('device.device-edit.148398-13')" type="number" step="0.1" :disabled="form.status != 1 || form.deviceType === 3">
                                                <template slot="prepend">Version</template>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-edit.148398-14')" prop="isSimulate">
                                            <el-switch v-model="form.isSimulate" active-text="" inactive-text="" :active-value="1" :inactive-value="0" disabled></el-switch>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-edit.148398-15')" prop="isShadow">
                                            <el-switch v-model="form.isShadow" active-text="" inactive-text="" :active-value="1" :inactive-value="0" disabled></el-switch>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-edit.148398-16')" prop="deviceStatus">
                                            <el-switch v-model="deviceStatus" active-text="" inactive-text="" disabled :active-value="1" :inactive-value="0" active-color="#F56C6C"></el-switch>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-edit.148398-17')" prop="remark">
                                            <el-input v-model="form.remark" type="textarea" :placeholder="$t('plzInput')" rows="1" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                                        <el-form-item :label="$t('device.device-edit.148398-19')" prop="locationWay">
                                            <el-select v-model="form.locationWay" :placeholder="$t('device.device-linkage.188958-25')" clearable size="small" style="width: 100%" :disabled="form.deviceType === 3">
                                                <el-option v-for="dict in dict.type.iot_location_way" :key="dict.value" :label="dict.label" :value="Number(dict.value)" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-linkage.188958-26')" prop="longitude">
                                            <el-input v-model="form.longitude" :placeholder="$t('device.device-linkage.188958-27')" type="number" disabled>
                                                <el-link slot="append" :underline="false" href="https://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" :disabled="form.locationWay != 3">
                                                    {{ $t('device.device-linkage.188958-28') }}
                                                </el-link>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-linkage.188958-29')" prop="latitude">
                                            <el-input v-model="form.latitude" :placeholder="$t('device.device-linkage.188958-30')" type="number" disabled>
                                                <el-link slot="append" :underline="false" href="https://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" :disabled="form.locationWay != 3">
                                                    {{ $t('device.device-linkage.188958-28') }}
                                                </el-link>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-linkage.188958-31')" prop="networkAddress">
                                            <el-input v-model="form.networkAddress" :placeholder="$t('device.device-linkage.188958-32')" disabled />
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-linkage.188958-33')" prop="networkIp">
                                            <el-input v-model="form.networkIp" :placeholder="$t('device.device-linkage.188958-34')" disabled />
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-linkage.188958-35')" prop="activeTime">
                                            <el-date-picker
                                                clearable
                                                v-model="form.activeTime"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                :placeholder="$t('device.device-linkage.188958-36')"
                                                disabled
                                                style="width: 100%"
                                            ></el-date-picker>
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-linkage.188958-37')" prop="rssi">
                                            <el-input v-model="form.rssi" :placeholder="$t('device.device-linkage.188958-38')" disabled />
                                        </el-form-item>
                                        <el-form-item :label="$t('device.device-linkage.188958-39')" prop="remark" v-if="form.deviceId != 0">
                                            <dict-tag :options="dict.type.iot_device_status" :value="form.status" style="display: inline-block; margin-right: 8px" />
                                            <el-button size="small" @click="handleViewMqtt()">{{ $t('device.device-linkage.188958-40') }}</el-button>
                                            <el-button size="small" @click="openCodeDialog()">{{ $t('device.device-linkage.188958-41') }}</el-button>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" v-if="form.deviceId != 0">
                                        <div style="border: 1px solid #dfe4ed; border-radius: 5px; padding: 5px; text-align: center; line-height: 400px">
                                            <div id="map" style="height: 435px; width: 100%">{{ $t('device.device-linkage.188958-42') }}</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <!-- 选择产品 -->
                            <product-list ref="productList" :productId="form.productId" @productEvent="getProductData($event)" />

                            <sipid ref="sipidGen" :product="form" @addGenEvent="getSipIDData($event)" />
                        </el-tab-pane>

                        <el-tab-pane name="runningStatus" v-if="form.deviceType !== 3">
                            <span slot="label">{{ $t('device.device-edit.148398-42') }}</span>
                            <!-- <real-time-status ref="realTimeStatus" :device="form" @statusEvent="getDeviceStatusData($event)" /> -->
                            <running-status ref="runningStatus" :device="form" @statusEvent="getDeviceStatusData($event)" />
                        </el-tab-pane>
                        <el-tab-pane name="deviceSub" :disabled="form.deviceId == 0" v-if="form.deviceType == 2" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-43') }}</span>
                            <device-sub ref="deviceSub" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="sipChannel" :disabled="form.deviceId == 0" v-if="form.deviceType === 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-44') }}</span>
                            <channel ref="deviceChannel" :device="form" @playerEvent="getPlayerData($event)" />
                        </el-tab-pane>

                        <el-tab-pane :disabled="form.deviceId == 0" v-if="form.deviceType === 3" name="sipPlayer" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-45') }}</span>
                            <device-live-stream ref="deviceLiveStream" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane :disabled="form.deviceId == 0" v-if="form.deviceType === 3" name="sipVideo" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-46') }}</span>
                            <deviceVideo ref="deviceVideo" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="ossRecord" :disabled="form.deviceId == 0" v-if="form.deviceType === 3">
                            <span slot="label">{{ $t('device.device-edit.148398-79') }}</span>
                            <OssRecord ref="OssRecord" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="deviceTimer" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-47') }}</span>
                            <device-timer ref="deviceTimer" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="deviceUser" :disabled="form.deviceId == 0" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-48') }}</span>
                            <device-user ref="deviceUser" :device="form" @userEvent="getUserData($event)" />
                        </el-tab-pane>

                        <el-tab-pane name="deviceLog" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-49') }}</span>
                            <device-log ref="deviceLog" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="alertUser" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3">
                            <span slot="label" v-hasPermi="['iot:device:alert:user:list']">{{ $t('device.device-edit.148398-80') }}</span>
                            <alert-user ref="alertUser" :device="form" />
                        </el-tab-pane>
                        <el-tab-pane name="deviceAlert" :disabled="form.deviceId == 0">
                            <span slot="label" v-hasPermi="['iot:alertLog:list']">{{ $t('device.device-edit.148398-81') }}</span>
                            <device-alert ref="deviceAlert" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="deviceFuncLog" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-50') }}</span>
                            <device-func ref="deviceFuncLog" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="deviceMonitor" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3">
                            <span slot="label">{{ $t('device.device-edit.148398-51') }}</span>
                            <device-monitor ref="deviceMonitor" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="deviceStastic" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3">
                            <span slot="label">{{ $t('device.device-edit.148398-52') }}</span>
                            <device-statistic ref="deviceStatistic" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="deviceModbusTask" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-77') }}</span>
                            <device-modbus-task ref="deviceModbusTask" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="instructionParsing" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-76') }}</span>
                            <instruction-parsing ref="instructionParsing" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="scada" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3 && isShowScada == true" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-73') }}</span>
                            <device-scada ref="deviceScada" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="variable" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-74') }}</span>
                            <device-variable ref="deviceVariable" :device="form" />
                        </el-tab-pane>

                        <el-tab-pane name="inlineVideo" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3" lazy>
                            <span slot="label">{{ $t('device.device-edit.148398-75') }}</span>
                            <device-inline-video ref="deviceInlineVideo" :sipRelationList="form.sipRelationList" />
                        </el-tab-pane>

                        <!-- 用于设置间距 -->
                        <el-tab-pane disabled>
                            <span slot="label">
                                <div style="margin-top: 350px"></div>
                            </span>
                        </el-tab-pane>

                        <!-- <el-tab-pane name="device04" v-if="form.deviceType !== 3" disabled>
                <span slot="label">
                    <el-tooltip class="item" effect="dark" content="用于查看发送的指令，设备是否已经响应" placement="right-start">
                        <el-button type="warning" size="mini" @click="deviceSynchronization()" :disabled="form.deviceId == 0">数据同步</el-button>
                    </el-tooltip>
                </span>
            </el-tab-pane> -->
                    </el-tabs>

                    <!-- 设备配置JSON -->
                    <el-dialog :title="$t('device.device-linkage.188958-54')" :visible.sync="openSummary" width="700px" append-to-body>
                        <el-row :gutter="20">
                            <el-col :span="14">
                                <div style="border: 1px solid #ccc; margin-top: -15px; height: 350px; width: 360px; overflow: scroll">
                                    <json-viewer :value="summary" :expand-depth="10" copyable>
                                        <template v-slot:copy>{{ $t('device.device-linkage.188958-55') }}</template>
                                    </json-viewer>
                                </div>
                            </el-col>
                            <el-col :span="10">
                                <div style="border: 1px solid #ccc; width: 200px; text-align: center; margin-left: 20px; margin-top: -10px">
                                    <vue-qr :text="qrText" :size="200"></vue-qr>
                                    <div style="padding-bottom: 10px">{{ $t('device.device-linkage.188958-56') }}</div>
                                </div>
                            </el-col>
                        </el-row>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="info" @click="closeSummaryDialog">{{ $t('device.device-linkage.188958-57') }}</el-button>
                        </div>
                    </el-dialog>
                    <!-- {{ $t('device.device-linkage.188958-41') }} -->
                    <el-dialog :visible.sync="openCode" width="300px" append-to-body>
                        <div style="border: 1px solid #ccc; width: 220px; text-align: center; margin: 0 auto; margin-top: -15px">
                            <vue-qr :text="qrText" :size="200"></vue-qr>
                            <div style="padding-bottom: 10px">{{ $t('device.device-linkage.188958-56') }}</div>
                        </div>
                    </el-dialog>
                    <el-dialog :title="$t('device.device-linkage.188958-58')" :visible.sync="openViewMqtt" width="600px" append-to-body>
                        <el-form ref="listQuery" :model="listQuery" :rules="rules" label-width="150px">
                            <el-form-item label="clientId" prop="clientId">
                                <el-input v-model="listQuery.clientId" disabled style="width: 80%" />
                            </el-form-item>
                            <el-form-item label="username" prop="username">
                                <el-input v-model="listQuery.username" disabled style="width: 80%" />
                            </el-form-item>
                            <el-form-item label="passwd" prop="passwd">
                                <el-input clearable v-model="listQuery.passwd" disabled style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="port" prop="port">
                                <el-input clearable v-model="listQuery.port" disabled style="width: 80%"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button class="btns" type="primary" @click="doCopy(2)">{{ $t('device.device-linkage.188958-59') }}</el-button>
                            <el-button @click="closeSummaryDialog">{{ $t('device.device-linkage.188958-57') }}</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import JsonViewer from 'vue-json-viewer';
import 'vue-json-viewer/style.css';
import productList from './product-list';
import deviceLog from './device-log';
import deviceUser from './device-user';
import runningStatus from './running-status';
import deviceMonitor from './device-monitor';
import deviceStatistic from './device-statistic';
import deviceTimer from './device-timer';
import channel from '../sip/channel';
import player from '@/views/components/player/player.vue';
import deviceVideo from '@/views/components/player/deviceVideo.vue';
import deviceLiveStream from '@/views/components/player/deviceLiveStream';
import sipid from '../sip/sipidGen.vue';
import deviceFuncLog from './device-functionlog';
import deviceSub from './device-sub';
import alertUser from './alert-user';
import vueQr from 'vue-qr';
import { loadBMap } from '@/utils/map.js';
import { deviceSynchronization, getDevice, addDevice, updateDevice, generatorDeviceNum, getMqttConnect } from '@/api/iot/device';
import { getDeviceUser } from '@/api/iot/deviceuser';
import { getUserId } from '@/utils/auth';
import { getDeviceRunningStatus } from '@/api/iot/device';
import { cacheJsonThingsModel } from '@/api/iot/model';
import DeviceFunc from '@/views/iot/device/device-functionlog';
import { getDeviceTemp } from '@/api/iot/temp';
import RealTimeStatus from '@/views/iot/device/realTime-status';
import { clientOut } from '@/api/iot/netty';
import { deptsTreeSelect } from '@/api/system/user';
import { listDeviceShort } from '@/api/iot/device';
import OssRecord from '@/views/iot/record/record-oss.vue';
import defaultSettings from '@/settings';
import instructionParsing from './instruction-parsing';
import deviceModbusTask from './device-modbus-task';
import deviceScada from './device-scada';
import deviceVariable from './device-variable';
import deviceInlineVideo from './device-inline-video';
import deviceAlert from './device-alert';

export default {
    name: 'DeviceEdit',
    dicts: ['iot_device_status', 'iot_location_way'],
    components: {
        OssRecord,
        RealTimeStatus,
        DeviceFunc,
        deviceLog,
        deviceUser,
        deviceMonitor,
        deviceStatistic,
        runningStatus,
        productList,
        deviceTimer,
        deviceFuncLog,
        deviceVideo,
        player,
        deviceLiveStream,
        deviceSub,
        alertUser,
        JsonViewer,
        vueQr,
        channel,
        sipid,
        deviceModbusTask,
        instructionParsing,
        deviceScada,
        deviceVariable,
        deviceInlineVideo,
        deviceAlert,
    },
    watch: {
        activeName(val) {
            if (val == 'deviceStastic') {
                this.$nextTick(() => {
                    // TODO 重置统计表格的尺寸
                });
            }
        },
    },
    computed: {
        deviceStatus: {
            set(val) {
                if (val == 1) {
                    // 1-未激活，2-禁用，3-在线，4-离线
                    this.form.status = 2;
                } else if (val == 0) {
                    this.form.status = 4;
                } else {
                    this.form.status = this.oldDeviceStatus;
                }
            },
            get() {
                if (this.form.status == 2) {
                    return 1;
                }
                return 0;
            },
        },
    },
    data() {
        return {
            // 二维码内容
            qrText: 'SUNSEEN',
            // 打开设备配置对话框
            openSummary: false,
            //二维码
            openCode: false,
            deptName: '',
            deviceName1: '',
            openViewMqtt: false,
            // 生成设备编码是否禁用
            genDisabled: false,
            // 选中选项卡
            activeName: 'basic',
            //查看mqtt参数
            mqttList: [],
            activeName1: 'first', // 当前激活的标签页
            // 遮罩层
            loading: true,
            // 设备开始状态
            oldDeviceStatus: null,
            deviceId: 0,
            channelId: '',
            // 表单参数
            form: {
                productId: 0,
                status: 1,
                locationWay: 1,
                firmwareVersion: 1.0,
                serialNumber: '',
                deviceType: 1,
                isSimulate: 0,
            },
            //默认展开菜单项
            defaultOpeneds: ['1'],
            defaultProps: {
                children: 'children',
                label: 'label',
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 999,
                deptId: undefined,
                status: '',
                deviceName: '',
            },
            deviceList: [],
            // 机构树选项
            deptOptions: undefined,
            //mqtt参数查看
            listQuery: {
                clientId: 0,
                username: '',
                passwd: '',
                port: '',
            },
            openTip: false,
            openServerTip: false,
            serverType: 1,
            //用于判断是否是设备组(modbus)
            isSubDev: false,
            // 设备摘要
            summary: [],
            // 地址
            baseUrl: process.env.VUE_APP_BASE_API,
            // 地图相关
            map: null,
            mk: null,
            latitude: '',
            longitude: '',
            //组态相关按钮是否显示，true显示，false不显示
            isShowScada: defaultSettings.isShowScada,
            // 表单校验
            rules: {
                deviceName: [
                    {
                        required: true,
                        message: this.$t('device.device-linkage.188958-60'),
                        trigger: 'blur',
                    },
                    {
                        min: 2,
                        max: 32,
                        message: this.$t('device.device-linkage.188958-61'),
                        trigger: 'blur',
                    },
                ],
                firmwareVersion: [
                    {
                        required: true,
                        message: this.$t('device.device-linkage.188958-62'),
                        trigger: 'blur',
                    },
                ],
            },
            isMediaDevice: false,
        };
    },
    watch: {
        // 根据名称筛选机构树
        deptName(val) {
            this.$refs.tree.filter(val);
        },
    },
    created() {
        this.isSubDev = this.$route.query.isSubDev == 1 ? true : false;
        this.getDeptTree();
        this.$nextTick(() => {
            this.getDeviceList();
        });
    },
    activated() {
        // 跳转选项卡
        let activeName = this.$route.query.activeName;
        if (activeName != null && activeName != '') {
            this.activeName = activeName;
        }
    },
    destroyed() {
        // 取消订阅主题
        this.mqttUnSubscribe(this.form);
    },
    methods: {
        /* 连接Mqtt消息服务器 */
        async connectMqtt() {
            if (this.$mqttTool.client == null) {
                await this.$mqttTool.connect(this.vuex_token);
            }
            // 删除所有message事件监听器
            this.$mqttTool.client.removeAllListeners('message');
            // 添加message事件监听器
            this.mqttCallback();
        },
        //切换设备在线状态的事件
        handleClick(tab, event) {
            // 点击标签页的逻辑处理
            if (tab.name === 'first') {
                //全部包括在线，离线，未激活和禁用状态
                this.queryParams.status = '';
                this.getDeviceList();
            } else if (tab.name === 'second') {
                this.queryParams.status = 3;
                this.getDeviceList();
            } else if (tab.name === 'third') {
                this.queryParams.status = 4;
                this.getDeviceList();
            }
        },
        handleOpen(index, indexPath) {
            this.defaultOpeneds = [index];
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        /** 查询机构下拉树结构 */
        getDeptTree() {
            deptsTreeSelect().then((response) => {
                this.deptOptions = response.data;
            });
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.deptId = data.id;
            this.getDeviceList();
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
                if (topics[3] == 'status' || topics[2] == 'status') {
                    console.log(this.$t('device.device-linkage.188958-63'), topic);
                    console.log(this.$t('device.device-linkage.188958-64'), message);
                    // 更新列表中设备的状态
                    if (this.form.serialNumber == deviceNum) {
                        this.oldDeviceStatus = message.status;
                        this.form.status = message.status;
                        this.form.isShadow = message.isShadow;
                        this.form.rssid = message.rssid;
                    }
                }
                //不是modbus不转发到子页面，其他设备的页面有回调方法
                if (this.isSubDev) {
                    /*发送设备上报到子模块*/
                    if (topic.endsWith('ws/service')) {
                        this.$busEvent.$emit('updateData', {
                            serialNumber: topics[2],
                            productId: this.form.productId,
                            data: message,
                        });
                    }
                    if (topic.endsWith('service/reply')) {
                        this.$busEvent.$emit('updateLog', {
                            serialNumber: topics[2],
                            productId: this.form.productId,
                            data: message,
                        });
                    }
                }
                /*发送设备上报到子模块*/
                if (topic.endsWith('ws/post/simulate')) {
                    this.$busEvent.$emit('logData', {
                        serialNumber: topics[1],
                        productId: this.form.productId,
                        data: message,
                    });
                }
            });
        },
        /** Mqtt订阅主题 */
        mqttSubscribe(device) {
            // 订阅当前设备状态和实时监测
            let topicStatus = '/' + device.productId + '/' + device.serialNumber + '/status/post';
            let topicProperty = '/' + device.productId + '/' + device.serialNumber + '/property/post';
            let topicFunction = '/' + device.productId + '/' + device.serialNumber + '/function/post';
            let topicMonitor = '/' + device.productId + '/' + device.serialNumber + '/monitor/post';
            let topicReply = '/' + device.productId + '/' + device.serialNumber + '/service/reply';
            let topics = [];
            let serviceTop = '/' + device.productId + '/' + device.serialNumber + '/ws/service';
            topics.push(serviceTop);
            topics.push(topicStatus);
            topics.push(topicFunction);
            topics.push(topicMonitor);
            topics.push(topicReply);
            /*modbus设备不订阅此topic*/
            if (!this.isSubDev) {
                // topics.push(topicProperty);
            }
            this.$mqttTool.subscribe(topics);
        },
        /** Mqtt取消订阅主题 */
        mqttUnSubscribe(device) {
            // 订阅当前设备状态和实时监测
            let topicStatus = '/' + device.productId + '/' + device.serialNumber + '/status/post';
            let topicProperty = '/' + device.productId + '/' + device.serialNumber + '/property/post';
            let topicFunction = '/' + device.productId + '/' + device.serialNumber + '/function/post';
            let topicMonitor = '/' + device.productId + '/' + device.serialNumber + '/monitor/post';
            let topicReply = '/' + device.productId + '/' + device.serialNumber + '/service/reply';
            let topics = [];
            let serviceTop = '/' + device.productId + '/' + device.serialNumber + '/ws/service';
            topics.push(serviceTop);

            topics.push(topicStatus);
            topics.push(topicFunction);
            topics.push(topicMonitor);
            topics.push(topicReply);
            /*modbus设备不订阅此topic*/
            if (!this.isSubDev) {
                /*通过网关再转发*/
                // topics.push(topicProperty);
            }
            this.$mqttTool.unsubscribe(topics);
        },
        // 获取子组件订阅的设备状态
        getDeviceStatusData(status) {
            this.form.status = status;
        },
        // 获取直播子组件传递的激活选项卡名称
        getPlayerData(data) {
            this.activeName = data.tabName;
            this.channelId = data.channelId;
            if (this.channelId) {
                this.$refs.deviceLiveStream.channelId = this.channelId;
                this.$refs.deviceLiveStream.changeChannel();
            }
        },
        //获取机构所对应的设备列表
        getDeviceList() {
            this.loading = true;
            if (this.queryParams.deptId == undefined) {
                //默认机构
                this.queryParams.deptId = 100;
            }
            listDeviceShort(this.queryParams).then((response) => {
                this.deviceList = response.rows;
                if (this.deviceId === 0) {
                    this.deviceId = this.deviceList[0].deviceId;
                }
                this.getDevice();
                // 订阅消息
                if (this.deviceList && this.deviceList.length > 0) {
                    this.mqttSubscribe(this.deviceList);
                }
                this.loading = false;
            });
        },
        /** 选项卡改变事件*/
        tabChange(panel) {
            if (this.form.deviceType == 3 && panel.name != 'deviceReturn') {
                if (panel.name === 'sipPlayer') {
                    this.$refs.deviceVideo.destroy();
                    if (this.channelId) {
                        this.$refs.deviceLiveStream.channelId = this.channelId;
                        this.$refs.deviceLiveStream.changeChannel();
                    }
                    if (this.$refs.deviceLiveStream.channelId) {
                        this.$refs.deviceLiveStream.changeChannel();
                    }
                } else if (panel.name === 'sipVideo') {
                    this.$refs.deviceLiveStream.destroy();
                    if (this.$refs.deviceVideo.channelId && this.$refs.deviceVideo.queryDate) {
                        this.$refs.deviceVideo.loadDevRecord();
                    }
                } else if (panel.name === 'sipChannel') {
                    this.$refs.deviceChannel.getList();
                }
                //关闭直播流
                if (panel.name !== 'sipPlayer') {
                    if (this.$refs.deviceLiveStream.playing) {
                        this.$refs.deviceLiveStream.closeDestroy(false);
                    }
                }
                //关闭录像流
                if (panel.name !== 'sipVideo') {
                    if (this.$refs.deviceVideo.playing) {
                        this.$refs.deviceVideo.closeDestroy();
                    }
                }
            }
            this.$nextTick(() => {
                // 获取监测统计数据
                if (panel.name === 'deviceStastic') {
                    this.$refs.deviceStatistic.getListHistory();
                } else if (panel.name === 'deviceTimer') {
                    this.$refs.deviceTimer.getList();
                } else if (panel.name === 'deviceSub') {
                    if (this.form.serialNumber) {
                        this.$refs.deviceSub.queryParams.gwDevCode = this.form.serialNumber;
                        this.$refs.deviceSub.getList();
                    }
                }
            });
        },
        /** 数据同步*/
        deviceSynchronization() {
            deviceSynchronization(this.form.serialNumber).then(async (response) => {
                // 获取缓存物模型
                response.data.cacheThingsModel = await this.getCacheThingsModdel(response.data.productId);
                // 获取设备运行状态
                response.data.thingsModels = await this.getDeviceStatus(this.form);
                // 格式化物模型，拆分出监测值,数组添加前缀
                this.formatThingsModel(response.data);
                this.form = response.data;
                // 选项卡切换
                this.activeName = 'runningStatus';
                this.oldDeviceStatus = this.form.status;
                this.loadMap();
            });
        },
        handleTypeClick(deviceId) {
            this.deviceId = deviceId;
            this.activeName = 'basic';
            this.getDevice();
        },
        /**获取设备详情*/
        getDevice(deviceId) {
            getDevice(this.deviceId).then(async (response) => {
                // 获取设备状态和物模型
                this.getDeviceStatusWitchThingsModel(response);
            });
        },
        /**用户是否拥有分享设备权限*/
        // hasShrarePerm(permission) {
        //     if (this.form.isOwner == 0) {
        //         // 分享设备权限
        //         if (this.form.userPerms.indexOf(permission) == -1) {
        //             return false;
        //         }
        //     }
        //     return true;
        // },
        /** 获取缓存物模型*/
        getCacheThingsModdel(productId) {
            return new Promise((resolve, reject) => {
                cacheJsonThingsModel(productId)
                    .then((response) => {
                        resolve(JSON.parse(response.data));
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        /**获取设备运行状态*/
        getDeviceStatus(data) {
            const params = {
                deviceId: data.deviceId,
                slaveId: data.slaveId,
            };
            return new Promise((resolve, reject) => {
                getDeviceRunningStatus(params)
                    .then((response) => {
                        resolve(response.data.thingsModels);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        formatThingsModel(data) {
            data.chartList = [];
            data.monitorList = [];
            data.staticList = [];
            // 物模型格式化
            for (let i = 0; i < data.thingsModels.length; i++) {
                // 数字类型设置默认值并转换未数值
                if (data.thingsModels[i].datatype.type == 'integer' || data.thingsModels[i].datatype.type == 'decimal') {
                    if (data.thingsModels[i].shadow == '') {
                        data.thingsModels[i].shadow = Number(data.thingsModels[i].datatype.min);
                    } else {
                        data.thingsModels[i].shadow = Number(data.thingsModels[i].shadow);
                    }
                }

                // 物模型分类放置
                if (data.thingsModels[i].datatype.type == 'array') {
                    if (data.thingsModels[i].datatype.arrayType == 'object') {
                        for (let k = 0; k < data.thingsModels[i].datatype.arrayParams.length; k++) {
                            for (let j = 0; j < data.thingsModels[i].datatype.arrayParams[k].length; j++) {
                                // 数组元素中参数ID添加前缀，例如：array_00_
                                let index = k > 9 ? String(k) : '0' + k;
                                let prefix = 'array_' + index + '_';
                                data.thingsModels[i].datatype.arrayParams[k][j].id = prefix + data.thingsModels[i].datatype.arrayParams[k][j].id;
                                // 图表、实时监测、监测统计分类放置
                                if (data.thingsModels[i].datatype.arrayParams[k][j].isChart == 1) {
                                    // 图表
                                    data.thingsModels[i].datatype.arrayParams[k][j].name = '[' + data.thingsModels[i].name + (k + 1) + '] ' + data.thingsModels[i].datatype.arrayParams[k][j].name;
                                    data.thingsModels[i].datatype.arrayParams[k][j].datatype.arrayType = 'object';
                                    data.chartList.push(data.thingsModels[i].datatype.arrayParams[k][j]);
                                    if (data.thingsModels[i].datatype.arrayParams[k][j].isHistory == 1) {
                                        // 监测统计
                                        data.staticList.push(data.thingsModels[i].datatype.arrayParams[k][j]);
                                    }
                                    if (data.thingsModels[i].datatype.arrayParams[k][j].isMonitor == 1) {
                                        // 实时监测
                                        data.monitorList.push(data.thingsModels[i].datatype.arrayParams[k][j]);
                                    }
                                    data.thingsModels[i].datatype.arrayParams[k].splice(j--, 1);
                                }
                            }
                        }
                    } else {
                        // 字符串拆分为物模型数组 model=id/name/type/isReadonly/value/shadow
                        let values = data.thingsModels[i].value != '' ? data.thingsModels[i].value.split(',') : [];
                        let shadows = data.thingsModels[i].shadow != '' ? data.thingsModels[i].shadow.split(',') : [];
                        for (let j = 0; j < data.thingsModels[i].datatype.arrayCount; j++) {
                            if (!data.thingsModels[i].datatype.arrayModel) {
                                data.thingsModels[i].datatype.arrayModel = [];
                            }
                            // 数组里面的ID需要添加前缀和索引，例如：array_00_temperature
                            let index = j > 9 ? String(j) : '0' + j;
                            let prefix = 'array_' + index + '_';
                            data.thingsModels[i].datatype.arrayModel[j] = {
                                id: prefix + data.thingsModels[i].id,
                                name: data.thingsModels[i].name,
                                type: data.thingsModels[i].type,
                                isReadonly: data.thingsModels[i].isReadonly,
                                value: values[j] ? values[j] : '',
                                shadow: shadows[j] ? shadows[j] : '',
                            };
                        }
                    }
                } else if (data.thingsModels[i].datatype.type == 'object') {
                    for (let j = 0; j < data.thingsModels[i].datatype.params.length; j++) {
                        // 图表、实时监测、监测统计分类放置
                        if (data.thingsModels[i].datatype.params[j].isChart == 1) {
                            // 图表
                            data.thingsModels[i].datatype.params[j].name = '[' + data.thingsModels[i].name + '] ' + data.thingsModels[i].datatype.params[j].name;
                            data.chartList.push(data.thingsModels[i].datatype.params[j]);
                            if (data.thingsModels[i].datatype.params[j].isHistory == 1) {
                                // 监测统计
                                data.staticList.push(data.thingsModels[i].datatype.params[j]);
                            }
                            if (data.thingsModels[i].datatype.params[j].isMonitor == 1) {
                                // 实时监测
                                data.monitorList.push(data.thingsModels[i].datatype.params[j]);
                            }
                            data.thingsModels[i].datatype.params.splice(j--, 1);
                        }
                    }
                } else if (data.thingsModels[i].isChart == 1) {
                    // // 图表、实时监测、监测统计分类放置
                    data.chartList.push(data.thingsModels[i]);
                    if (data.thingsModels[i].isHistory == 1) {
                        // 监测统计
                        data.staticList.push(data.thingsModels[i]);
                    }
                    if (data.thingsModels[i].isMonitor == 1) {
                        // 实时监测
                        data.monitorList.push(data.thingsModels[i]);
                    }
                    // 使用i--解决索引变更问题
                    data.thingsModels.splice(i--, 1);
                }
            }
        },
        /**加载地图*/
        loadMap() {
            this.$nextTick(() => {
                loadBMap().then(() => {
                    this.getmap();
                });
            });
        },
        /** 返回按钮 */
        goBack() {
            const obj = {
                path: '/iot/device',
                query: {
                    t: Date.now(),
                    pageNum: this.$route.query.pageNum,
                },
            };
            this.$tab.closeOpenPage(obj);
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                deviceId: 0,
                deviceName: null,
                productId: null,
                productName: null,
                userId: null,
                userName: null,
                tenantId: null,
                tenantName: null,
                serialNumber: '',
                firmwareVersion: 1.0,
                status: 1,
                rssi: null,
                networkAddress: null,
                networkIp: null,
                longitude: null,
                latitude: null,
                activeTime: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                locationWay: 1,
                clientId: 0,
            };
            this.deviceStatus = 0;
            this.resetForm('form');
        },
        /** 提交按钮 */
        async submitForm() {
            if (this.form.serialNumber == null || this.form.serialNumber == 0) {
                this.$modal.alertError(this.$t('device.device-linkage.188958-65'));
                return;
            }
            let reg = /^[0-9a-zA-Z]+$/;
            if (!reg.test(this.form.serialNumber)) {
                this.$modal.alertError(this.$t('device.device-linkage.188958-66'));
                return;
            }
            if (this.form.productId == null || this.form.productId == 0) {
                this.$modal.alertError(this.$t('device.device-linkage.188958-67'));
                return;
            }

            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.deviceId != 0) {
                        updateDevice(this.form).then((response) => {
                            if (response.data == 0) {
                                this.$modal.alertError(response.msg);
                            } else {
                                this.$modal.alertSuccess(this.$t('device.device-linkage.188958-68'));
                                this.form = JSON.parse(JSON.stringify(this.form));
                                this.loadMap();
                                //是否设备设置为禁用状态，则踢出设备
                                if (this.form.status === 2) {
                                    const params = { clientId: this.form.serialNumber };
                                    clientOut(params).then((res) => {});
                                }
                            }
                        });
                    } else {
                        addDevice(this.form).then(async (response) => {
                            // 获取设备状态
                            await this.getDeviceStatusWitchThingsModel(response);
                            if (this.form.deviceId == null || this.form.deviceId == 0) {
                                this.$modal.alertError(this.$t('device.device-linkage.188958-69'));
                            } else {
                                if (this.form.status == 2) {
                                    this.deviceStatus = 1;
                                }

                                this.$modal.alertSuccess(this.$t('device.device-linkage.188958-70'));
                                this.loadMap();
                            }
                        });
                    }
                }
            });
        },
        /** 获取设备状态和物模型 **/
        async getDeviceStatusWitchThingsModel(response) {
            // 获取缓存物模型
            response.data.cacheThingsModel = await this.getCacheThingsModdel(response.data.productId);
            // 获取设备运行状态
            response.data.thingsModels = await this.getDeviceStatus(response.data);
            //分享设备过滤没有权限的物模型
            // if (response.data.isOwner == 0) {
            //     for (let i = 0; i < response.data.thingsModels.length; i++) {
            //         if (response.data.userPerms.indexOf(response.data.thingsModels[i].id) == -1) {
            //             response.data.thingsModels.splice(i--, 1);
            //         }
            //     }
            // }
            // 格式化物模型，拆分出监测值,数组添加前缀
            this.formatThingsModel(response.data);
            this.form = response.data;
            // 解析设备摘要
            if (this.form.summary != null && this.form.summary != '') {
                this.summary = JSON.parse(this.form.summary);
            }
            this.isSubDev = this.form.subDeviceList && this.form.subDeviceList.length > 0;
            this.oldDeviceStatus = this.form.status;
            this.loadMap();
            //Mqtt订阅
            this.connectMqtt();
            this.mqttSubscribe(this.form);
        },
        /**选择产品 */
        selectProduct() {
            this.$refs.productList.open = true;
            this.$refs.productList.getDeviceList();
        },
        genSipID() {
            this.$refs.sipidGen.open = true;
        },
        /**获取选中的产品 */
        getProductData(product) {
            this.form.productId = product.productId;
            this.form.productName = product.productName;
            this.form.deviceType = product.deviceType;
            this.getDeviceTemp();
            this.form.tenantId = product.tenantId;
            this.form.tenantName = product.tenantName;
            if (product.transport === 'TCP') {
                this.openServerTip = true;
                this.serverType = 3;
            } else {
                this.openServerTip = false;
                this.serverType = 1;
            }
        },
        getSipIDData(devsipid) {
            this.form.serialNumber = devsipid;
        },
        getDeviceTemp(productId) {
            getDeviceTemp(this.form).then((response) => {
                if (response.data && this.form.deviceType == 2) {
                    this.openTip = true;
                } else {
                    this.openTip = false;
                }
            });
        },
        // 获取选中的用户
        getUserData(user) {},
        /**关闭物模型 */
        openSummaryDialog() {
            let json = {
                type: 1, // 1=扫码关联设备
                deviceNumber: this.form.serialNumber,
                productId: this.form.productId,
                // productName: this.form.productName,
            };
            this.qrText = JSON.stringify(json);
            this.openSummary = true;
        },
        /**关闭物模型 */
        closeSummaryDialog() {
            this.openSummary = false;
            this.openViewMqtt = false;
        },
        doCopy(type) {
            if (type == 2) {
                const input = document.createElement('input');
                input.value = '{clientId:' + this.listQuery.clientId + ',username:' + this.listQuery.username + ',passwd:' + this.listQuery.passwd + ',port:' + this.listQuery.port + '}';
                document.body.appendChild(input);
                input.select(); //选中输入框
                document.execCommand('Copy'); //复制当前选中文本到前切板
                document.body.removeChild(input);
                this.$message.success(this.$t('device.device-linkage.188958-71'));
            }
        },
        openCodeDialog() {
            let json = {
                type: 1, // 1=扫码关联设备
                deviceNumber: this.form.serialNumber,
                productId: this.form.productId,
                productName: this.form.productName,
            };
            this.qrText = JSON.stringify(json);
            this.openCode = true;
        },
        // 地图定位
        getmap() {
            this.map = new BMap.Map('map');
            let point = null;
            if (this.form.longitude != null && this.form.longitude != '' && this.form.latitude != null && this.form.latitude != '') {
                point = new BMap.Point(this.form.longitude, this.form.latitude);
            } else {
                point = new BMap.Point(116.404, 39.915);
            }
            this.map.centerAndZoom(point, 19);
            this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            this.map.addControl(new BMap.NavigationControl());
            // 标注设备位置
            this.mk = new BMap.Marker(point);
            this.map.addOverlay(this.mk);
            this.map.panTo(point);
        },
        // 生成随机字母和数字
        generateNum() {
            if (!this.form.productId || this.form.productId == 0) {
                this.$modal.alertError(this.$t('device.device-linkage.188958-72'));
                return;
            }
            this.genDisabled = true;
            const params = { type: this.serverType };
            generatorDeviceNum(params).then((response) => {
                this.form.serialNumber = response.data;
                this.genDisabled = false;
            });
        },
        //mqtt参数查看
        handleViewMqtt() {
            this.openViewMqtt = true;
            this.loading = true;
            const params = {
                deviceId: this.form.deviceId,
            };
            getMqttConnect(params).then((response) => {
                if (response.code == 200) {
                    this.listQuery = response.data;
                    this.loading = false;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.head-container {
    height: 830px;
    overflow-x: hidden;
    overflow-y: auto;
}

.menu-wrap {
    margin-top: -5px;
    height: 345px;
    overflow-x: auto;
    overflow-y: auto;
    padding-left: 0 !important;
}

.menu-wrap .el-submenu__title {
    padding-left: 0 !important;
}

.custom-menu-item {
    font-size: 12px;
    /* 设置字体大小 */
    color: #000;
    margin-top: -10px;
    margin-left: -15px;
}
</style>
