<template>
    <div class="tab-box">
        <el-tabs v-model="activeTabName" @tab-click="handleClick" lazy>
            <el-tab-pane name="10">
                <span slot="label">{{ $t('device.device-edit.148398-0') }}</span>
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-row :gutter="100">
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
                                <el-input readonly v-model="form.productName" :placeholder="$t('device.device-edit.148398-5')" :disabled="form.status != 1">
                                    <el-button slot="append" @click="selectProduct()" :disabled="form.status != 1">{{ $t('device.device-edit.148398-6') }}</el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="" prop="serialNumber">
                                <template slot="label">
                                    <span style="color: red">*</span>
                                    {{ $t('device.device-edit.148398-7') }}
                                </template>
                                <el-input v-model="form.serialNumber" :placeholder="$t('device.device-edit.148398-8')" :disabled="form.status != 1" maxlength="32">
                                    <el-button v-if="form.deviceType !== 3" slot="append" @click="generateNum" :loading="genDisabled" :disabled="form.status != 1" v-hasPermi="['iot:device:add']">
                                        {{ $t('device.device-edit.148398-9') }}
                                    </el-button>
                                    <el-button v-if="form.deviceType === 3" slot="append" @click="genSipID()" :disabled="form.status != 1" v-hasPermi="['iot:device:add']">
                                        {{ $t('device.device-edit.148398-9') }}
                                    </el-button>
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
                            <!-- 设备影子 -->
                            <el-form-item :label="$t('device.device-edit.148398-15')" prop="isShadow">
                                <el-switch v-model="form.isShadow" active-text="" inactive-text="" :active-value="1" :inactive-value="0" :disabled="form.deviceType === 3"></el-switch>
                            </el-form-item>

                            <el-form-item v-if="form.deviceType != 4" :label="$t('device.device-edit.148398-16')" prop="deviceStatus">
                                <el-switch
                                    v-model="deviceStatus"
                                    active-text=""
                                    inactive-text=""
                                    :disabled="form.status == 1 || form.deviceType === 3"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#F56C6C"
                                ></el-switch>
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-17')" prop="remark">
                                <el-input v-model="form.remark" type="textarea" :placeholder="$t('device.device-edit.148398-18')" rows="1" />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                            <el-form-item :label="$t('device.device-edit.148398-19')" prop="locationWay">
                                <el-select v-model="form.locationWay" :placeholder="$t('device.device-edit.148398-20')" clearable size="small" style="width: 100%" :disabled="form.deviceType === 3">
                                    <el-option v-for="dict in dict.type.iot_location_way" :key="dict.value" :label="dict.label" :value="Number(dict.value)" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-21')" prop="longitude">
                                <el-input v-model="form.longitude" :placeholder="$t('device.device-edit.148398-22')" type="number" :disabled="form.locationWay != 3">
                                    <el-link slot="append" :underline="false" href="https://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" :disabled="form.locationWay != 3">
                                        {{ $t('device.device-edit.148398-23') }}
                                    </el-link>
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-24')" prop="latitude">
                                <el-input v-model="form.latitude" :placeholder="$t('device.device-edit.148398-25')" type="number" :disabled="form.locationWay != 3">
                                    <el-link slot="append" :underline="false" href="https://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" :disabled="form.locationWay != 3">
                                        {{ $t('device.device-edit.148398-23') }}
                                    </el-link>
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-26')" prop="networkAddress">
                                <el-input v-model="form.networkAddress" :placeholder="$t('device.device-edit.148398-27')" :disabled="form.locationWay != 3" />
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-28')" prop="networkIp">
                                <el-input v-model="form.networkIp" :placeholder="$t('device.device-edit.148398-29')" disabled />
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-30')" prop="activeTime">
                                <el-date-picker clearable v-model="form.activeTime" type="date" value-format="yyyy-MM-dd" :placeholder="$t('device.device-edit.148398-31')" disabled style="width: 100%"></el-date-picker>
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-32')" prop="rssi">
                                <el-input v-model="form.rssi" :placeholder="$t('device.device-edit.148398-33')" disabled />
                            </el-form-item>
                            <el-form-item :label="$t('device.device-edit.148398-34')" prop="remark" v-if="form.deviceId != 0">
                                <dict-tag :options="dict.type.iot_device_status" :value="form.status" style="display: inline-block; margin-right: 8px" />
                                <el-button size="small" @click="handleViewMqtt()">{{ $t('device.device-edit.148398-35') }}</el-button>
                                <el-button size="small" @click="openCodeDialog()">{{ $t('device.device-edit.148398-36') }}</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" v-if="form.deviceId != 0">
                            <div style="border: 1px solid #dfe4ed; border-radius: 5px; padding: 5px; text-align: center; line-height: 400px">
                                <div id="map" style="height: 435px; width: 100%">{{ $t('device.device-edit.148398-37') }}</div>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>

                <el-form label-width="100px" style="margin-top: 50px">
                    <el-form-item style="text-align: center; margin-left: -100px; margin-top: 10px">
                        <el-button type="primary" @click="submitForm" v-hasPermi="['iot:device:edit']" v-show="form.deviceId != 0">
                            {{ $t('device.device-edit.148398-38') }} {{ $t('device.device-edit.148398-39') }}
                        </el-button>
                        <el-button type="primary" @click="submitForm" v-hasPermi="['iot:device:add']" v-show="form.deviceId == 0">
                            {{ $t('device.device-edit.148398-40') }} {{ $t('device.device-edit.148398-41') }}
                        </el-button>
                    </el-form-item>
                </el-form>
                <!-- 选择产品 -->
                <product-list ref="productList" :productId="form.productId" @productEvent="getProductData($event)" />
                <sipid ref="sipidGen" :product="form" @addGenEvent="getSipIDData($event)" />
            </el-tab-pane>

            <el-tab-pane name="1" v-if="form.deviceType !== 3">
                <span slot="label">{{ $t('device.device-edit.148398-42') }}</span>
                <!-- <real-time-status ref="realTimeStatus" :device="form" @statusEvent="getDeviceStatusData($event)" /> -->
                <running-status :deviceType="deviceType" ref="runningStatus" :device="form" @statusEvent="getDeviceStatusData($event)" />
            </el-tab-pane>
            <el-tab-pane label="设备参数" name="2">
                <div class="con" v-if="getDeviceTypeJson">
                    <!--  @scroll="scrollEvent()" -->
                    <div class="pdf flex5" ref="scrollDiv">
                        <envCard v-for="cardItem in dataJson.list" :key="cardItem.id" :title="cardItem.title" lineWidth="62px" :id="cardItem.id" :ref="cardItem.id">
                            <el-row v-for="(level1Row, level1RowIdx) in cardItem.children" :key="level1RowIdx" :gutter="level1Row.gutter">
                                <el-col v-for="(level2Row, level2RowIdx) in level1Row.children" :key="level2RowIdx" :span="level2Row.span" :gutter="level1Row.gutter">
                                    <el-row :style="level2Row.style">
                                        <el-col v-for="(level3Row, level3RowIdx) in level2Row.children" :key="level3RowIdx" :span="level3Row.span" :id="level3Row.id">
                                            <el-row :style="level3Row.style" :ref="level3Row.id">
                                                <el-col v-for="(level4Row, level4RowIdx) in level3Row.children" :key="level4RowIdx" :span="level4Row.span">
                                                    <component
                                                        :ref="level4Row.id"
                                                        :is="level4Row.componentName"
                                                        :title="level4Row.title"
                                                        :titleList="level4Row.titleList"
                                                        :colTitle="level4Row.colTitle"
                                                        :gutter="level4Row.gutter"
                                                        :style="level4Row.style"
                                                        :valueIDs="level4Row.valueID"
                                                        :textDirection="level4Row.textDirection"
                                                        :childrenSpan="level4Row.childrenSpan"
                                                        :url="level4Row.img"
                                                        :selectOption="level4Row.Option"
                                                        :selectIcon="level4Row.selectIcon"
                                                        :isBit="level4Row.isBit"
                                                        :inside="level4Row.inside"
                                                        :isShowFanMode="level4Row.isShowFanMode"
                                                        :isScroll="level4Row.isScroll"
                                                        :domWidth="level4Row.domWidth"
                                                        @change="updateData"
                                                        @changeDeviceInsideValue="updateDataInside"
                                                    ></component>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </envCard>
                        <div style="width: 100%; height: 1500px" id="ID_DIV_3"></div>
                    </div>
                    <div class="Nav flex1">
                        <el-tree
                            icon-class="none"
                            :expand-on-click-node="false"
                            ref="tree"
                            style="height: calc(100% - 16px); overflow-y: auto"
                            :data="treeData"
                            :props="defaultProps"
                            highlight-current
                            default-expand-all
                            node-key="configname"
                            @node-click="handleNodeClick"
                        >
                            <span slot-scope="{ data }" class="custom-tree-node">
                                <span style="margin-left: 5px">{{ data.configname }}</span>
                            </span>
                        </el-tree>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane name="deviceSub" :disabled="form.deviceId == 0" v-if="form.deviceType == 2 && (form.protocolCode == 'MODBUS-RTU' || form.protocolCode == 'MODBUS-TCP')" lazy>
                <span slot="label">{{ $t('device.device-edit.148398-43') }}</span>
                <device-sub ref="deviceSub" :device="form" />
            </el-tab-pane>

            <el-tab-pane name="sipChannel" :disabled="form.deviceId == 0" v-if="form.deviceType === 3" lazy>
                <span slot="label">{{ $t('device.device-edit.148398-44') }}</span>
                <channel ref="Channel" :device="form" @playerEvent="getPlayerData($event)" />
            </el-tab-pane>

            <el-tab-pane name="sipPlayer" :disabled="form.deviceId == 0" v-if="form.deviceType === 3" lazy>
                <span slot="label">{{ $t('device.device-edit.148398-45') }}</span>
                <device-live-stream ref="deviceLiveStream" :device="form" />
            </el-tab-pane>

            <el-tab-pane name="sipVideo" :disabled="form.deviceId == 0" v-if="form.deviceType === 3" lazy>
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
                <BreedingSettings></BreedingSettings>
                <!-- <span slot="label">{{ $t('device.device-edit.148398-49') }}</span>
                <device-log ref="deviceLog" :device="form" /> -->
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

            <el-tab-pane name="deviceModbusTask" :disabled="form.deviceId == 0" v-if="form.deviceType !== 3 && form.deviceType !== 2 && (form.protocolCode == 'MODBUS-RTU' || form.protocolCode == 'MODBUS-TCP')" lazy>
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
                    <div style="margin-top: 150px"></div>
                </span>
            </el-tab-pane>
            <el-tab-pane name="deviceReturn" disabled>
                <span slot="label">
                    <el-button type="info" size="mini" @click="goBack()">{{ $t('device.device-edit.148398-53') }}</el-button>
                </span>
            </el-tab-pane>
        </el-tabs>

        <!-- 设备配置JSON -->
        <el-dialog :title="$t('device.device-edit.148398-54')" :visible.sync="openSummary" width="700px" append-to-body>
            <el-row :gutter="20">
                <el-col :span="14">
                    <div style="border: 1px solid #ccc; margin-top: -15px; height: 350px; width: 360px; overflow: scroll">
                        <json-viewer :value="summary" :expand-depth="10" copyable>
                            <template v-slot:copy>{{ $t('device.device-edit.148398-55') }}</template>
                        </json-viewer>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div style="border: 1px solid #ccc; width: 200px; text-align: center; margin-left: 20px; margin-top: -10px">
                        <vue-qr :text="qrText" :size="200"></vue-qr>
                        <div style="padding-bottom: 10px">{{ $t('device.device-edit.148398-56') }}</div>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="closeSummaryDialog">{{ $t('device.device-edit.148398-57') }}</el-button>
            </div>
        </el-dialog>
        <!-- {{ $t('device.device-edit.148398-36') }} -->
        <el-dialog :visible.sync="openCode" width="300px" append-to-body>
            <div style="border: 1px solid #ccc; width: 220px; text-align: center; margin: 0 auto; margin-top: -15px">
                <vue-qr :text="qrText" :size="200"></vue-qr>
                <div style="padding-bottom: 10px">{{ $t('device.device-edit.148398-56') }}</div>
            </div>
        </el-dialog>
        <el-dialog :title="$t('device.device-edit.148398-58')" :visible.sync="openViewMqtt" width="600px" append-to-body>
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
                <el-button class="btns" type="primary" @click="doCopy(2)">{{ $t('device.device-edit.148398-59') }}</el-button>
                <el-button @click="closeSummaryDialog">{{ $t('device.device-edit.148398-57') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer';
import 'vue-json-viewer/style.css';
import productList from './product-list';
import deviceLog from './device-log';
import deviceAlert from './device-alert';
import alertUser from './alert-user';
import deviceUser from './device-user';
import runningStatus from './running-status';
import deviceMonitor from './device-monitor';
import deviceStatistic from './device-statistic';
import instructionParsing from './instruction-parsing';
import deviceModbusTask from './device-modbus-task';
import deviceTimer from './device-timer';
import channel from '../sip/channel';
import player from '@/views/components/player/player.vue';
import deviceVideo from '@/views/components/player/deviceVideo.vue';
import OssRecord from '@/views/iot/record/record-oss.vue';
import deviceLiveStream from '@/views/components/player/deviceLiveStream';
import sipid from '../sip/sipidGen.vue';
import deviceScada from './device-scada';
import deviceVariable from './device-variable';
import deviceInlineVideo from './device-inline-video';
import deviceFuncLog from './device-functionlog';
import deviceSub from './device-sub';
import realTimeStatus from './realTime-status';
import vueQr from 'vue-qr';
import { loadBMap } from '@/utils/map.js';
import { deviceSynchronization, getDevice, addDevice, updateDevice, generatorDeviceNum, getMqttConnect } from '@/api/iot/device';
import { getDeviceUser } from '@/api/iot/deviceuser';
import { getUserId } from '@/utils/auth';
import { getDeviceRunningStatus } from '@/api/iot/device';
import { cacheJsonThingsModel } from '@/api/iot/model';
import { getSipDevice } from '@/api/iot/sipdevice';
import DeviceFunc from '@/views/iot/device/device-functionlog';
import RealTimeStatus from '@/views/iot/device/realTime-status';
import { clientOut } from '@/api/iot/netty';
import defaultSettings from '@/settings';

import { serviceInvoke } from '@/api/iot/runstatus';

// 定制化
import envCard from './env/components/card.vue';
import dichotomy from './env/components/dichotomy.vue';
import titleBox from './env/components/titleBox.vue';
import inputBox from './env/components/inputBox.vue';
import switchBox from './env/components/switchBox.vue';
import pureText from './env/components/pureText.vue';
import deviceSetting from './env/components/deviceSetting.vue';
// import BreedingSettings from './env/BreedingSettings.vue';
import BreedingSettings from './env/BreedingUseData.vue';
import { divideArrayIntoParts } from '@/utils/index';
import { getProductMOdelJson } from '@/api/iot/model';
export default {
    name: 'DeviceEdit',
    dicts: ['iot_device_status', 'iot_location_way'],
    components: {
        BreedingSettings,

        RealTimeStatus,
        DeviceFunc,
        deviceLog,
        deviceAlert,
        deviceUser,
        alertUser,
        deviceMonitor,
        deviceStatistic,
        runningStatus,
        productList,
        deviceTimer,
        deviceFuncLog,
        deviceVideo,
        OssRecord,
        player,
        deviceLiveStream,
        deviceSub,
        JsonViewer,
        vueQr,
        channel,
        sipid,
        deviceScada,
        deviceVariable,
        instructionParsing,
        deviceModbusTask,
        deviceInlineVideo,
        // 定制化
        envCard,
        dichotomy,
        titleBox,
        deviceSetting,
        inputBox,
        switchBox,
        pureText,
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
            qrText: '尚行科技',
            // 打开设备配置对话框
            openSummary: false,
            //二维码
            openCode: false,
            openViewMqtt: false,
            // 生成设备编码是否禁用
            genDisabled: false,
            // 选中选项卡
            activeName: 'basic',
            //查看mqtt参数
            mqttList: [],
            // 遮罩层
            loading: true,
            // 设备开始状态
            oldDeviceStatus: null,
            deviceId: '',
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
                        message: this.$t('device.device-edit.148398-60'),
                        trigger: 'blur',
                    },
                    {
                        min: 2,
                        max: 32,
                        message: this.$t('device.device-edit.148398-61'),
                        trigger: 'blur',
                    },
                ],
                firmwareVersion: [
                    {
                        required: true,
                        message: this.$t('device.device-edit.148398-62'),
                        trigger: 'blur',
                    },
                ],
            },
            isMediaDevice: false,
            dataJson: {},
            defaultProps: {
                children: 'children',
                label: 'configname',
            },
            treeData: [],
            allPdfList: [],
            activeTabName: '10',
            deviceProductId: '',
            getDeviceTypeJson: false,
            deviceType: '',
        };
    },
    created() {
        let activeName = this.$route.query.activeName;
        if (activeName != null && activeName != '') {
            this.activeName = activeName;
        }
        // 获取设备信息
        this.form.deviceId = this.$route.query && this.$route.query.deviceId;
        if (this.form.deviceId != 0) {
            this.getDevice(this.form.deviceId);
        }
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
        updateData(data) {
            serviceInvoke({
                identifier: data.itemId,
                isShadow: false,
                productId: this.form.productId,
                remoteCommand: {
                    [data.itemId]: data.itemValue,
                },
                serialNumber: this.form.serialNumber,
                type: 2,
            }).then((response) => {
                if (response.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '数据修改成功!',
                    });
                }
            });
        },
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
        /* Mqtt回调处理  */
        mqttCallback() {
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                let topics = topic.split('/');
                let productId = topics[1];
                let deviceNum = topics[2];
                if (message instanceof Uint8Array) {
                    // 创建TextDecoder对象来转换Uint8Array到字符串
                    const decoder = new TextDecoder('utf-8');
                    const str = decoder.decode(message);
                    message = str; //转换后的字符串
                }
                //  console.log('🚀 ~ this.$mqttTool.client.on ~ message:', message);
                // console.log('🚀 ~ this.$mqttTool.client.on ~ topics:', topic);
                message = JSON.parse(message.toString());

                if (!message) {
                    return;
                }
                if (topics[3] == 'status' || topics[2] == 'status') {
                    console.log('接收到【设备状态-详情】主题:', topic);
                    console.log('接收到【设备状态-详情】内容：', message);
                    // 更新列表中设备的状态
                    if (this.form.serialNumber == deviceNum) {
                        this.oldDeviceStatus = message.status;
                        this.form.status = message.status;
                        this.form.isShadow = message.isShadow;
                        this.form.rssid = message.rssid;
                    }
                }

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
                /**mqtt测试 */
                if (topic.endsWith('message/post')) {
                    this.$busEvent.$emit('updateMqttMessage', {
                        serialNumber: topics[2],
                        data: message,
                    });
                }
            });
        },

        /** Mqtt topics array */
        getMqttTopics(device) {
            // 订阅当前设备状态和实时监测
            const topicService = '/ws/service';
            const topicStatus = '/status/post';
            const topicFunction = '/function/post';
            const topicMonitor = '/monitor/post';
            const topicReply = '/service/reply';
            //订阅mqtt测试
            let messagePost = '/message/post';
            const topics = [topicService, topicStatus, topicFunction, topicMonitor, topicReply, messagePost];

            return topics.map((topic) => {
                return `/${device.productId}/${device.serialNumber}${topic}`;
            });
        },
        // 获取子组件订阅的设备状态
        getDeviceStatusData(status) {
            this.form.status = status;
        },

        /** Mqtt取消订阅主题 */
        mqttUnSubscribe(device) {
            const topics = this.getMqttTopics(device);
            this.$mqttTool.unsubscribe(topics);
        },

        /** Mqtt订阅主题 */
        mqttSubscribe(device) {
            const topics = this.getMqttTopics(device);
            this.$mqttTool.subscribe(topics);
        },

        // 获取直播子组件传递的激活选项卡名称
        getPlayerData(data) {
            this.activeName = data.tabName;
            this.channelId = data.channelId;
            // this.$set(this.form, 'channelId', this.channelId);
            this.$nextTick(() => {
                if (this.channelId) {
                    this.$refs.deviceLiveStream.channelId = this.channelId;
                    this.$refs.deviceLiveStream.changeChannel();
                }
            });
        },
        /** 选项卡改变事件*/
        tabChange(panel) {
            this.$nextTick(() => {
                if (this.form.deviceType == 3 && panel.name != 'deviceReturn') {
                    if (panel.name === 'sipPlayer') {
                        if (this.$refs.deviceVideo && this.$refs.deviceVideo.destroy) {
                            this.$refs.deviceVideo.destroy();
                        }
                        if (this.channelId) {
                            if (this.$refs.deviceLiveStream && this.$refs.deviceLiveStream.channelId !== undefined) {
                                this.$refs.deviceLiveStream.channelId = this.channelId;
                            }
                            this.$refs.deviceLiveStream.changeChannel();
                        }
                        if (this.$refs.deviceLiveStream.channelId !== undefined) {
                            this.$refs.deviceLiveStream.changeChannel();
                        }
                    } else if (panel.name === 'sipVideo') {
                        if (this.$refs.deviceLiveStream && this.$refs.deviceLiveStream.destroy) {
                            this.$refs.deviceLiveStream.destroy();
                        }
                        if (this.$refs.deviceVideo && this.$refs.deviceVideo.channelId !== undefined && this.$refs.deviceVideo.queryDate) {
                            this.$refs.deviceVideo.loadDevRecord();
                        }
                    } else if (panel.name === 'sipChannel') {
                        this.$nextTick(() => {
                            this.$refs.Channel.getList();
                        });
                    }
                    //关闭直播流
                    if (panel.name !== 'sipPlayer' && this.$refs.deviceLiveStream && this.$refs.deviceLiveStream.playing) {
                        this.$refs.deviceLiveStream.closeDestroy(false);
                    }
                    //关闭录像流
                    if (panel.name !== 'sipVideo' && this.$refs.deviceVideo && this.$refs.deviceVideo.playing) {
                        this.$refs.deviceVideo.closeDestroy();
                    }
                }
            });

            this.$nextTick(() => {
                // 获取监测统计数据
                if (panel.name === 'deviceStastic') {
                    this.$refs.deviceStatistic.getListHistory();
                } else if (panel.name === 'deviceTimer') {
                    this.$refs.deviceTimer.getList();
                } else if (panel.name === 'deviceSub') {
                    if (this.form.serialNumber) {
                        this.$refs.deviceSub.queryParams.gwDeviceId = this.form.deviceId;
                        this.$refs.deviceSub.gateway.gwDeviceId = this.form.deviceId;
                        this.$refs.deviceSub.getList();
                    }
                }
            });
            if (this.form.deviceType !== 3) {
                // 用于关闭视频推流（页面切换时候需要关闭推流）
                if (panel.name !== 'inlineVideo') {
                    this.$refs.deviceInlineVideo && this.$refs.deviceInlineVideo.handleClose();
                }
                if (panel.name !== 'scada') {
                    const scadaRef = this.$refs.deviceScada || {};
                    if (scadaRef && scadaRef.$refs && scadaRef.$refs.deviceScada) {
                        const copmRef = scadaRef.$refs.deviceScada;
                        if (copmRef.$refs && copmRef.$refs.spirit) {
                            copmRef.$refs.spirit.forEach((item) => {
                                if (item.$vnode.tag.includes('ViewInlineVideo')) {
                                    item.handleCloseJessibuca();
                                }
                            });
                        }
                    }
                }
            }
        },
        /** 数据同步*/
        deviceSynchronization() {
            deviceSynchronization(this.form.serialNumber).then(async (response) => {
                // 获取缓存物模型
                response.data.cacheThingsModel = await this.getCacheThingsModdel(response.data.productId);
                console.log(response.data, 'response');
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
        /**获取设备详情*/
        getDevice(deviceId) {
            getDevice(deviceId).then(async (response) => {
                // 获取设备状态和物模型
                console.log(response, '获取数量');
                this.getDeviceStatusWitchThingsModel(response);
            });
        },
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
                    // 获取数据配对JSON
                    .then((response) => {
                        // console.log('runningState:', response.data);
                        this.$set(this.form, 'thingsModelsValue', JSON.parse(response.data.thingsModelValue));
                        // this.form.thingsModels = [...response.data.thingsModels];
                        let _obj = {};
                        response.data.thingsModels.forEach((item) => {
                            if (item.datatype.arrayParams !== null) {
                                item.datatype.arrayParams.forEach((itm, idx) => {
                                    let arr = itm[0].id.split('_');
                                    if (arr[0] === 'array') {
                                        _obj[itm[0].id] = itm[0].value;
                                    } else {
                                        // let _iid = parseInt(idx);
                                        let _iid = parseInt(idx) < 10 ? '0' + idx : idx;
                                        let iid = 'array_' + _iid + '_' + itm[0].id;
                                        _obj[iid] = itm[0].value;
                                        console.log(_obj);
                                    }
                                });
                            } else {
                                _obj[item.id] = item.value;
                            }
                        });
                        this.$nextTick(() => {
                            // 环空器
                            if (this.deviceType === 'env') {
                                const _data = JSON.parse(JSON.stringify(this.dataJson));
                                this.dataJson = { ...this.findLevelFourObjects(_data, _obj) };
                            } else {
                                // 1-10个外部名称
                                for (let i = 1; i <= 10; i++) {
                                    const key = `external${i}`;
                                    _obj[key] = response.data[key];
                                }
                                _obj['deviceName'] = response.data.deviceName;
                                const _data = JSON.parse(JSON.stringify(this.dataJson));

                                this.dataJson = { ...this.findLevelFourObjectsAlarm(_data, _obj) };
                            }
                        });
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
            // const obj = {
            //     path: '/smartAquaculture/iot/device',
            // };
            this.$router.go(-1);
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
        updateDataInside(e) {
            let _id = e.itemId;
            if (typeof _id === 'object') {
                _id = _id.id;
            }
            this.form[_id] = e.value;
            updateDevice(this.form).then((response) => {
                if (response.data == 0) {
                    this.$modal.alertError(response.msg);
                } else {
                    this.$modal.alertSuccess(this.$t('device.device-edit.148398-68'));
                    this.form = JSON.parse(JSON.stringify(this.form));
                    this.loadMap();
                    //刷新页面
                    // this.$router.go(0);
                    //是否设备设置为禁用状态，则踢出设备
                    if (this.form.status === 2) {
                        const params = { clientId: this.form.serialNumber };
                        clientOut(params).then((res) => {});
                    }
                }
            });
        },
        /** 提交按钮 */
        async submitForm() {
            if (this.form.serialNumber == null || this.form.serialNumber == 0) {
                this.$modal.alertError(this.$t('device.device-edit.148398-65'));
                return;
            }
            let reg = /^[0-9a-zA-Z]+$/;
            if (!reg.test(this.form.serialNumber)) {
                this.$modal.alertError(this.$t('device.device-edit.148398-66'));
                return;
            }
            if (this.form.productId == null || this.form.productId == 0) {
                this.$modal.alertError(this.$t('device.device-edit.148398-67'));
                return;
            }

            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.deviceId != 0) {
                        updateDevice(this.form).then((response) => {
                            if (response.data == 0) {
                                this.$modal.alertError(response.msg);
                            } else {
                                this.$modal.alertSuccess(this.$t('device.device-edit.148398-68'));
                                this.form = JSON.parse(JSON.stringify(this.form));
                                this.loadMap();
                                //刷新页面
                                this.$router.go(0);
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
                                this.$modal.alertError(this.$t('device.device-edit.148398-69'));
                            } else {
                                if (this.form.status == 2) {
                                    this.deviceStatus = 1;
                                }

                                this.$modal.alertSuccess(this.$t('device.device-edit.148398-70'));
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
            // 获取配置JSON
            getProductMOdelJson(response.data.productId).then((res) => {
                // EC08 152
                // EC12 154
                // EC22 155
                if (response.data.productId == 152 || response.data.productId == 154 || response.data.productId == 155) {
                    this.dataJson = JSON.parse(res.data);
                    this.deviceType = 'env';
                } else {
                    this.dataJson = JSON.parse(res.data);
                    this.deviceType = 'alarm';
                }
            });
            this.getDeviceTypeJson = true;
            // 获取设备运行状态
            response.data.thingsModels = await this.getDeviceStatus(response.data);
            // 格式化物模型，拆分出监测值,数组添加前缀
            this.formatThingsModel(response.data);
            this.form = response.data;
            console.log('this.form =', response.data);
            // 解析设备摘要
            if (this.form.summary != null && this.form.summary != '') {
                this.summary = JSON.parse(this.form.summary);
            }
            this.oldDeviceStatus = this.form.status;
            this.loadMap();
            //Mqtt订阅
            this.connectMqtt();
            this.mqttSubscribe(this.form);
        },
        /**选择产品 */
        selectProduct() {
            this.$refs.productList.open = true;
            this.$refs.productList.getList();
        },
        genSipID() {
            this.$refs.sipidGen.open = true;
        },
        /**获取选中的产品 */
        getProductData(product) {
            this.form.productId = product.productId;
            this.form.productName = product.productName;
            this.form.deviceType = product.deviceType;
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
        // 获取选中的用户
        getUserData(user) {},
        /**关闭物模型 */
        openSummaryDialog() {
            let json = {
                type: 1, // 1=扫码关联设备
                deviceNumber: this.form.serialNumber,
                productId: this.form.productId,
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
                this.$message.success(this.$t('device.device-edit.148398-71'));
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
                this.$modal.alertError(this.$t('device.device-edit.148398-72'));
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
        // 获取高度偏移位置
        getJsonList() {
            this.$nextTick(() => {
                this.treeData = this.dataJson.tabs;
                this.treeData.forEach((item) => {
                    item.children.forEach((_itm) => {
                        // 获取偏移高度
                        _itm.offset = this.$refs[_itm.id][0].$el.offsetTop;
                    });
                });
            });
            this.allPdfList = []; // 无视父级，同级所需索引用到的导航数组
            this.treeData.forEach((e) => {
                if (!e?.father) {
                    this.allPdfList.push(e);
                } else if (e.children.length > 0) {
                    const childArr = e.children.map((e) => {
                        return { ...e, configname: e?.configname };
                    });
                    this.allPdfList = [...this.allPdfList, ...childArr];
                }
            });
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(this.allPdfList[0]?.configname);
            });
        },
        getElementOffsetRelativeToParent(element) {
            const parent = element.parentNode;
            return {
                left: element.offsetLeft - parent.offsetLeft,
                top: element.offsetTop - parent.offsetTop,
            };
        },
        // 跳转位置
        handleNodeClick(row) {
            // 点击锚点触发
            this.$nextTick(() => {
                console.log(row, 'rowrowrow');
                let _id = row.id;
                if (_id.split('_').length === 4) {
                    // 1.找到对应的上级
                    const Dom = this.$refs[row.id];
                    // 2. 位移
                    console.log(Dom, 'DOm');
                    this.$refs.scrollDiv.scrollTo({
                        top: row.offset - 40,
                        behavior: 'smooth',
                    });
                } else {
                    const rowName = row?.configname;
                    const names = this.allPdfList.map((e) => {
                        return e?.configname;
                    });
                    const id = 'IDDIV_' + names.indexOf(rowName);
                    const dom = document.getElementById(id);
                    if (dom && this.$refs.scrollDiv) {
                        // 嵌入式 缺少头部引用  少算60
                        this.$refs.scrollDiv.scrollTo({
                            top: dom.offsetTop - 60,
                            behavior: 'smooth',
                        });
                    }
                }
            });
        },
        // 滚动监听
        // scrollEvent() {
        //     const nowScroll = this.$refs.scrollDiv.scrollTop + 42; // h1的高度是42
        //     const allIds = this.allPdfList.map((e, index) => {
        //         return 'IDDIV_' + index;
        //     });
        //     // console.log(allIds)
        //     allIds.forEach((id, index) => {
        //         // 每一个id容器的高度获取
        //         const dom = document.getElementById(id);
        //         if (index < allIds.length - 1) {
        //             // console.log(index, allIds.length)
        //             const domNext = document.getElementById(allIds[index + 1]);
        //             // 监听至滚动在指定的模块区域中
        //             if (nowScroll > dom.offsetTop && nowScroll < domNext.offsetTop) {
        //                 // 在当前dom选中内
        //                 this.$nextTick(() => {
        //                     this.$refs.tree.setCurrentKey(this.allPdfList[index]?.configname);
        //                 });
        //             }
        //         } else {
        //             // 滚动至最后一个tree选中的条件
        //             if (nowScroll > dom.offsetTop) {
        //                 this.$nextTick(() => {
        //                     this.$refs.tree.setCurrentKey(this.allPdfList[index]?.configname);
        //                 });
        //             }
        //         }
        //     });
        // },
        handleClick() {
            if (this.activeTabName === '2') {
                this.getJsonList();
            }
        },
        // 第四层级的数据类型及数据 环控
        findLevelFourObjects(jsonData, data) {
            let result = [];
            let that = this;
            const { SystemSettingVentilationLevel, SystemSettingInitialLevelOfTunnel } = data;
            function traverse(obj) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (Array.isArray(obj[key])) {
                            obj[key].forEach((item) => traverse(item));
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            traverse(obj[key]);
                        } else if (key === 'level' && obj[key] === 4) {
                            handleComponent(obj);
                        }
                    }
                }
            }

            function handleComponent(obj) {
                if (obj.componentName === 'inputBox' || obj.componentName === 'switchBox') {
                    updateValueIDForInputOrSwitch(obj);
                } else if (obj.componentName === 'deviceSetting') {
                    updateValueIDForDeviceSetting(obj);
                }
            }

            function updateValueIDForInputOrSwitch(obj) {
                let _data = data;
                const idList = [];
                if (obj.valueID[0] !== 'null') {
                    const _id = obj.valueID[0];
                    idList.push({
                        id: _id,
                        value: _data[_id] || '',
                    });
                } else {
                    idList.push({
                        id: 'null',
                        value: 'null',
                    });
                }
                that.$refs[obj.id][0].getData(idList);
                // obj.valueID = idList;
            }

            function updateValueIDForDeviceSetting(obj) {
                const idList = [];
                const _obj = JSON.parse(JSON.stringify(obj.valueID));
                const _length = _obj.length;
                const oneArr = _obj.flat();
                oneArr.forEach((item) => {
                    idList.push({
                        id: item, // 假设 id 就是 item 中的每个元素
                        value: data[item] || '',
                    });
                });
                // 特殊处理 风机模式
                if (obj.isShowFanMode) {
                    that.$refs[obj.id][0].getModeType([SystemSettingInitialLevelOfTunnel, SystemSettingVentilationLevel]);
                }
                // 传输数据
                that.$refs[obj.id][0].getData(divideArrayIntoParts(idList, _length));
                obj.valueID = idList;
            }
            traverse(jsonData);
            return jsonData;
        },
        findLevelFourObjectsAlarm(jsonData, data) {
            let result = [];
            let that = this;
            function traverse(obj) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (Array.isArray(obj[key])) {
                            obj[key].forEach((item) => traverse(item));
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            traverse(obj[key]);
                        } else if (key === 'level' && obj[key] === 4) {
                            handleComponent(obj);
                        }
                    }
                }
            }

            function handleComponent(obj) {
                if (obj.componentName === 'inputBox' || obj.componentName === 'switchBox') {
                    // 设备内置参数
                    updateValueIDForInputOrSwitch(obj);
                } else if (obj.componentName === 'deviceSetting') {
                    updateValueIDForDeviceSetting(obj);
                }
            }

            function updateValueIDForInputOrSwitch(obj) {
                const idList = [];
                if (obj.valueID[0] !== 'null') {
                    const _id = obj.valueID[0];
                    idList.push({
                        id: _id,
                        value: data[_id] || '',
                    });
                } else {
                    idList.push({
                        id: 'null',
                        value: 'null',
                    });
                }
                that.$refs[obj.id][0].getData(idList);
            }

            function updateValueIDForDeviceSetting(obj) {
                const idList = [];
                obj.valueID.forEach((item, index) => {
                    idList.push(
                        item.map((itm) => ({
                            id: itm,
                            value: data[itm] || '',
                        }))
                    );
                });
                that.$refs[obj.id][0].getData(idList);
                obj.valueID = idList;
            }

            traverse(jsonData);
            return jsonData;
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

::v-deep .el-tabs__content {
    padding-top: 22px;
    margin-left: -34px;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    .element::-webkit-scrollbar {
        display: none; /* Chrome, Safari and Opera */
    }
}
::v-deep .el-tree {
    background-color: #0d1826;
}

::v-deep .el-tree > .el-tree-node > .el-tree-node__content {
    color: #fff;
}
::v-deep .el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content > .el-tree-node__label {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #a8aec9;
}
/* 去掉tabs标签栏下的下划线 */
::v-deep .el-tabs__nav-wrap::after {
    position: static !important;
    /* background-color: #fff; */
}
/* 下划线切换高亮 */
::v-deep .el-tabs__active-bar {
    background-color: #2f70ec;
}
/* 鼠标选中时样式 */
::v-deep .el-tabs__item.is-active {
    color: #2f70ec;
    opacity: 1;
    margin-right: 15px;
}
/* 鼠标悬浮时样式 */
::v-deep .el-tabs__item:hover {
    color: #2f70ec;
    cursor: pointer;
    opacity: 1;
}
::v-deep .el-tabs__item {
    color: #a8aec9;
}
.con {
    display: flex;
    .flex1 {
        flex: 1;
    }
    .flex5 {
        flex: 7;
    }
    .Nav {
        height: calc(100vh - 32px);
        padding: 8px;
        overflow-y: auto;
        background-color: #0d1826;
        border-radius: 10px;
        margin-top: 5px;
    }
    .pdf {
        margin-left: 8px;
        padding: 8px;
        overflow: auto;
        height: 1500px;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        .element::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }
    }
}
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    background-image: url('../../../assets/sunseen/feed/item-active.png');
}
::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    line-height: 38px;
    height: 38px;
}
.title-style1 {
    display: flex;
    align-items: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
}
.title-style2 {
    margin-top: 15px;
    display: flex;
    align-items: center;
    padding-right: 10px;
}
.tab-box {
    padding: 10px 22px 22px;
    width: 100%;
    height: 66px;
    margin-left: 30px;
    margin-top: 30px;
    background: #0d1827;
    border-radius: 10px 10px 10px 10px;
}
::v-deep .el-tree-node__content:hover {
    background-color: transparent;
}
::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: transparent;
}

::v-deep .el-input--mini .el-input__inner {
    background-color: #212a37;
    border-color: #212a37;
    color: white;
    border-radius: 16px;
}

::v-deep .el-input--medium .el-input__inner {
    background-color: #212a37;
    border-color: #212a37;
    color: white;
    border-radius: 16px;
}

::v-deep .el-input--small .el-input__inner {
    background-color: #212a37;
    border-color: #212a37;
    border-radius: 16px;
}

::v-deep .el-input__inner {
    height: 38px;
}
::v-deep .el-tree-node__content {
    background-color: #07111e !important;
}
</style>
