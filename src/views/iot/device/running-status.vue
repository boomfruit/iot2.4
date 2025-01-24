<template>
    <div style="padding-left: 20px">
        <el-row :gutter="120">
            <el-col v-show="false" :xs="24" :sm="24" :md="24" :lg="14" :xl="10" style="margin-bottom: 50px">
                <el-descriptions :column="1" border style="margin-bottom: 50px">
                    <!-- 设备模式-->
                    <el-descriptions-item :labelStyle="statusColor">
                        <template slot="label">
                            <i class="el-icon-menu"></i>
                            {{ $t('device.running-status.866086-0') }}
                        </template>
                        <el-link :underline="false" style="line-height: 28px; font-size: 16px; padding-right: 10px">{{ title }}</el-link>
                    </el-descriptions-item>
                    <!-- 设备升级-->
                    <el-descriptions-item :labelStyle="statusColor">
                        <template slot="label">
                            <svg-icon icon-class="ota" />
                            {{ $t('device.running-status.866086-1') }}
                        </template>
                        <el-link :underline="false" style="line-height: 28px; font-size: 16px; padding-right: 10px">Version {{ deviceInfo.firmwareVersion }}</el-link>
                        <el-button type="success" size="mini" style="float: right" @click="getLatestFirmware(deviceInfo.deviceId)" :disabled="deviceInfo.status != 3">{{ $t('device.running-status.866086-2') }}</el-button>
                    </el-descriptions-item>

                    <!-- 设备物模型-->
                    <el-descriptions-item v-for="(item, index) in deviceInfo.thingsModels" :key="index" :labelStyle="statusColor">
                        <template slot="label">
                            <i class="el-icon-open"></i>
                            {{ item.name }}
                        </template>
                        <div v-if="item.datatype.type == 'bool'">
                            <el-switch
                                v-model="item.shadow"
                                @change="mqttPublish(deviceInfo, item)"
                                active-text=""
                                inactive-text=""
                                active-value="1"
                                inactive-value="0"
                                style="min-width: 100px"
                                :disabled="shadowUnEnable || item.isReadonly == 1"
                            />
                        </div>
                        <div v-if="item.datatype.type == 'enum'">
                            <div v-if="item.datatype.showWay && item.datatype.showWay == 'button'">
                                <el-button
                                    style="margin: 5px"
                                    size="mini"
                                    @click="enumButtonClick(deviceInfo, item, subItem.value)"
                                    v-for="subItem in item.datatype.enumList"
                                    :key="subItem.value"
                                    :disabled="shadowUnEnable || item.isReadonly == 1"
                                >
                                    {{ subItem.text }}
                                </el-button>
                            </div>
                            <el-select v-else v-model="item.shadow" :placeholder="$t('device.running-status.866086-3')" @change="mqttPublish(deviceInfo, item)" :disabled="shadowUnEnable || item.isReadonly == 1">
                                <el-option v-for="subItem in item.datatype.enumList" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
                            </el-select>
                        </div>
                        <div v-if="item.datatype.type == 'string'">
                            <el-input
                                v-model="item.shadow"
                                :placeholder="item.datatype.unit ? $t('device.running-status.866086-5', [item.datatype.unit]) : $t('device.running-status.866086-4')"
                                :disabled="shadowUnEnable || item.isReadonly == 1"
                            >
                                <el-button
                                    slot="append"
                                    icon="el-icon-s-promotion"
                                    @click="mqttPublish(deviceInfo, item)"
                                    style="font-size: 20px"
                                    :title="$t('device.running-status.866086-6')"
                                    v-if="!shadowUnEnable && item.isReadonly == 0"
                                ></el-button>
                            </el-input>
                        </div>
                        <div v-if="item.datatype.type == 'decimal'">
                            <div style="width: 80%; float: left">
                                <el-slider
                                    v-model="item.shadow"
                                    :min="item.datatype.min"
                                    :max="item.datatype.max"
                                    :step="item.datatype.step"
                                    :format-tooltip="(x) => x + ' ' + item.datatype.unit"
                                    :disabled="shadowUnEnable || item.isReadonly == 1"
                                ></el-slider>
                            </div>
                            <div style="width: 20%; float: left">
                                <el-button
                                    icon="el-icon-s-promotion"
                                    type="info"
                                    @click="mqttPublish(deviceInfo, item)"
                                    style="font-size: 16px; padding: 1px 8px; margin: 2px 0 0 5px; border-radius: 3px"
                                    :title="$t('device.running-status.866086-6')"
                                    v-if="!shadowUnEnable && item.isReadonly == 0"
                                ></el-button>
                            </div>
                        </div>
                        <div v-if="item.datatype.type == 'integer'">
                            <div style="width: 80%; float: left">
                                <el-slider
                                    v-model="item.shadow"
                                    :min="item.datatype.min"
                                    :max="item.datatype.max"
                                    :step="item.datatype.step"
                                    :format-tooltip="(x) => x + ' ' + item.datatype.unit"
                                    :disabled="shadowUnEnable || item.isReadonly == 1"
                                ></el-slider>
                            </div>
                            <div style="width: 20%; float: left">
                                <el-button
                                    icon="el-icon-s-promotion"
                                    type="info"
                                    @click="mqttPublish(deviceInfo, item)"
                                    style="font-size: 16px; padding: 1px 8px; margin: 4px 0 0 10px; border-radius: 3px"
                                    :title="$t('device.running-status.866086-6')"
                                    v-if="!shadowUnEnable && item.isReadonly == 0"
                                ></el-button>
                            </div>
                        </div>
                        <div v-if="item.datatype.type == 'object'">
                            <el-descriptions :column="1" size="mini" border>
                                <el-descriptions-item v-for="(param, index) in item.datatype.params" :key="index" :label="param.name">
                                    <div v-if="param.datatype.type == 'bool'">
                                        <el-switch
                                            v-model="param.shadow"
                                            @change="mqttPublish(deviceInfo, param)"
                                            active-text=""
                                            inactive-text=""
                                            active-value="1"
                                            inactive-value="0"
                                            style="min-width: 100px"
                                            :disabled="shadowUnEnable || param.isReadonly == 1"
                                        />
                                    </div>
                                    <div v-if="param.datatype.type == 'enum'">
                                        <div v-if="param.datatype.showWay && param.datatype.showWay == 'button'">
                                            <el-button
                                                style="margin: 5px"
                                                size="mini"
                                                @click="enumButtonClick(deviceInfo, param, subItem.value)"
                                                v-for="subItem in param.datatype.enumList"
                                                :key="subItem.value"
                                                :disabled="shadowUnEnable || param.isReadonly == 1"
                                            >
                                                {{ subItem.text }}
                                            </el-button>
                                        </div>
                                        <el-select
                                            size="small"
                                            v-else
                                            v-model="param.shadow"
                                            :placeholder="$t('device.running-status.866086-3')"
                                            @change="mqttPublish(deviceInfo, param)"
                                            :disabled="shadowUnEnable || param.isReadonly == 1"
                                        >
                                            <el-option v-for="subItem in param.datatype.enumList" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
                                        </el-select>
                                    </div>
                                    <div v-if="param.datatype.type == 'string'">
                                        <el-input v-model="param.shadow" :placeholder="$t('device.running-status.866086-4')" :disabled="shadowUnEnable || param.isReadonly == 1">
                                            <el-button
                                                slot="append"
                                                icon="el-icon-s-promotion"
                                                @click="mqttPublish(deviceInfo, param)"
                                                style="font-size: 20px"
                                                :title="$t('device.running-status.866086-6')"
                                                v-if="!shadowUnEnable && param.isReadonly == 0"
                                            ></el-button>
                                        </el-input>
                                    </div>
                                    <div v-if="param.datatype.type == 'decimal'">
                                        <el-input v-model="param.shadow" type="number" :placeholder="$t('device.running-status.866086-7')" :disabled="shadowUnEnable || param.isReadonly == 1">
                                            <el-button
                                                slot="append"
                                                icon="el-icon-s-promotion"
                                                @click="mqttPublish(deviceInfo, param)"
                                                style="font-size: 20px"
                                                :title="$t('device.running-status.866086-6')"
                                                v-if="!shadowUnEnable && param.isReadonly == 0"
                                            ></el-button>
                                        </el-input>
                                    </div>
                                    <div v-if="param.datatype.type == 'integer'">
                                        <el-input v-model="param.shadow" type="integer" :placeholder="$t('device.running-status.866086-8')" :disabled="shadowUnEnable || param.isReadonly == 1">
                                            <el-button
                                                slot="append"
                                                icon="el-icon-s-promotion"
                                                @click="mqttPublish(deviceInfo, param)"
                                                style="font-size: 20px"
                                                :title="$t('device.running-status.866086-6')"
                                                v-if="!shadowUnEnable && param.isReadonly == 0"
                                            ></el-button>
                                        </el-input>
                                    </div>
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                        <div v-if="item.datatype.type == 'array'">
                            <el-descriptions :column="1" size="mini" border v-if="item.datatype.arrayType != 'object'">
                                <el-descriptions-item v-for="(model, index) in item.datatype.arrayModel" :key="index" :label="item.name + (index + 1)">
                                    <div v-if="item.datatype.arrayType == 'string'">
                                        <el-input
                                            :placeholder="$t('device.running-status.866086-4')"
                                            size="mini"
                                            v-model="model.shadow"
                                            :disabled="shadowUnEnable || item.isReadonly == 1"
                                            @input="arrayItemChange($event, item)"
                                        >
                                            <el-button
                                                slot="append"
                                                icon="el-icon-s-promotion"
                                                @click="mqttPublish(deviceInfo, model)"
                                                style="font-size: 20px"
                                                :title="$t('device.running-status.866086-6')"
                                                v-if="!shadowUnEnable || item.isReadonly == 0"
                                            ></el-button>
                                        </el-input>
                                    </div>
                                    <div v-if="item.datatype.arrayType == 'decimal'">
                                        <el-input
                                            type="number"
                                            :placeholder="$t('device.running-status.866086-7')"
                                            size="mini"
                                            v-model="model.shadow"
                                            :disabled="shadowUnEnable || item.isReadonly == 1"
                                            @input="arrayItemChange($event, item)"
                                        >
                                            <el-button
                                                slot="append"
                                                icon="el-icon-s-promotion"
                                                @click="mqttPublish(deviceInfo, model)"
                                                style="font-size: 20px"
                                                :title="$t('device.running-status.866086-6')"
                                                v-if="!shadowUnEnable || item.isReadonly == 0"
                                            ></el-button>
                                        </el-input>
                                    </div>
                                    <div v-if="item.datatype.arrayType == 'integer'">
                                        <el-input
                                            type="integer"
                                            :placeholder="$t('device.running-status.866086-8')"
                                            size="mini"
                                            v-model="model.shadow"
                                            :disabled="shadowUnEnable || item.isReadonly == 1"
                                            @input="arrayItemChange($event, item)"
                                        >
                                            <el-button
                                                slot="append"
                                                icon="el-icon-s-promotion"
                                                @click="mqttPublish(deviceInfo, model)"
                                                style="font-size: 20px"
                                                :title="$t('device.running-status.866086-6')"
                                                v-if="!shadowUnEnable || item.isReadonly == 0"
                                            ></el-button>
                                        </el-input>
                                    </div>
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-collapse v-if="item.datatype.arrayType == 'object'">
                                <el-collapse-item v-for="(arrayParam, index) in item.datatype.arrayParams" :key="index">
                                    <template slot="title">
                                        <span style="color: #666">
                                            <i class="el-icon-tickets"></i>
                                            {{ item.name + (index + 1) }}
                                        </span>
                                    </template>
                                    <el-descriptions :column="1" size="mini" border>
                                        <el-descriptions-item v-for="(param, index) in arrayParam" :key="index" :label="param.name">
                                            <div v-if="param.datatype.type == 'bool'">
                                                <el-switch
                                                    v-model="param.shadow"
                                                    @change="mqttPublish(deviceInfo, param)"
                                                    active-text=""
                                                    inactive-text=""
                                                    active-value="1"
                                                    inactive-value="0"
                                                    style="min-width: 100px"
                                                    :disabled="shadowUnEnable || param.isReadonly == 1"
                                                />
                                            </div>
                                            <div v-if="param.datatype.type == 'enum'">
                                                <div v-if="param.datatype.showWay && param.datatype.showWay == 'button'">
                                                    <el-button
                                                        style="margin: 5px"
                                                        size="mini"
                                                        @click="enumButtonClick(deviceInfo, param, subItem.value)"
                                                        v-for="subItem in param.datatype.enumList"
                                                        :key="subItem.value"
                                                        :disabled="shadowUnEnable || param.isReadonly == 1"
                                                    >
                                                        {{ subItem.text }}
                                                    </el-button>
                                                </div>
                                                <el-select
                                                    v-else
                                                    v-model="param.shadow"
                                                    :placeholder="$t('device.running-status.866086-3')"
                                                    size="small"
                                                    @change="mqttPublish(deviceInfo, param)"
                                                    :disabled="shadowUnEnable || param.isReadonly == 1"
                                                >
                                                    <el-option v-for="subItem in param.datatype.enumList" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
                                                </el-select>
                                            </div>
                                            <div v-if="param.datatype.type == 'string'">
                                                <el-input v-model="param.shadow" :placeholder="$t('device.running-status.866086-4')" :disabled="shadowUnEnable || param.isReadonly == 1">
                                                    <el-button
                                                        slot="append"
                                                        icon="el-icon-s-promotion"
                                                        @click="mqttPublish(deviceInfo, param)"
                                                        style="font-size: 20px"
                                                        :title="$t('device.running-status.866086-6')"
                                                        v-if="!shadowUnEnable && param.isReadonly == 0"
                                                    ></el-button>
                                                </el-input>
                                            </div>
                                            <div v-if="param.datatype.type == 'decimal'">
                                                <el-input v-model="param.shadow" type="number" :placeholder="$t('device.running-status.866086-7')" :disabled="shadowUnEnable || param.isReadonly == 1">
                                                    <el-button
                                                        slot="append"
                                                        icon="el-icon-s-promotion"
                                                        @click="mqttPublish(deviceInfo, param)"
                                                        style="font-size: 20px"
                                                        :title="$t('device.running-status.866086-6')"
                                                        v-if="!shadowUnEnable && param.isReadonly == 0"
                                                    ></el-button>
                                                </el-input>
                                            </div>
                                            <div v-if="param.datatype.type == 'integer'">
                                                <el-input v-model="param.shadow" type="integer" :placeholder="$t('device.running-status.866086-8')" :disabled="shadowUnEnable || param.isReadonly == 1">
                                                    <el-button
                                                        slot="append"
                                                        icon="el-icon-s-promotion"
                                                        @click="mqttPublish(deviceInfo, param)"
                                                        style="font-size: 20px"
                                                        :title="$t('device.running-status.866086-6')"
                                                        v-if="!shadowUnEnable && param.isReadonly == 0"
                                                    ></el-button>
                                                </el-input>
                                            </div>
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>

                <!---设备状态(影子模式，value值不会更新)-->
                <el-descriptions :column="1" border size="mini" v-if="deviceInfo.isShadow == 1 && deviceInfo.status != 3">
                    <template slot="title">
                        <span style="font-size: 14px; color: #606266">{{ $t('device.running-status.866086-9') }}</span>
                    </template>

                    <!-- 设备物模型-->
                    <el-descriptions-item v-for="(item, index) in deviceInfo.thingsModels" :key="index">
                        <template slot="label">
                            <i class="el-icon-open"></i>
                            {{ item.name }}
                        </template>
                        <div v-if="item.datatype.type == 'bool'">
                            <el-switch v-model="item.value" @change="mqttPublish(deviceInfo, item)" active-text="" inactive-text="" active-value="1" inactive-value="0" style="min-width: 100px" disabled />
                        </div>
                        <div v-if="item.datatype.type == 'enum'">
                            <div v-if="item.datatype.showWay && item.datatype.showWay == 'button'">
                                <el-button style="margin: 5px" size="mini" disabled v-for="subItem in item.datatype.enumList" :key="subItem.value">{{ subItem.text }}</el-button>
                            </div>
                            <el-select v-else v-model="item.value" :placeholder="$t('device.running-status.866086-3')" @change="mqttPublish(deviceInfo, item)" disabled size="mini">
                                <el-option v-for="subItem in item.datatype.enumList" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
                            </el-select>
                        </div>
                        <div v-if="item.datatype.type == 'string'">
                            <el-input v-model="item.value" :placeholder="$t('device.running-status.866086-4')" disabled size="mini"></el-input>
                        </div>
                        <div v-if="item.datatype.type == 'decimal'">
                            <el-input v-model="item.value" type="number" :placeholder="$t('device.running-status.866086-7')" disabled size="mini"></el-input>
                        </div>
                        <div v-if="item.datatype.type == 'integer'">
                            <el-input v-model="item.value" type="integer" :placeholder="$t('device.running-status.866086-8')" disabled size="mini"></el-input>
                        </div>
                        <div v-if="item.datatype.type == 'object'">
                            <el-descriptions :column="1" size="mini" border>
                                <el-descriptions-item v-for="(param, index) in item.datatype.params" :key="index" :label="param.name">
                                    <div v-if="param.datatype.type == 'bool'">
                                        <el-switch
                                            v-model="param.value"
                                            size="mini"
                                            @change="mqttPublish(deviceInfo, param)"
                                            active-text=""
                                            inactive-text=""
                                            active-value="1"
                                            inactive-value="0"
                                            style="min-width: 100px"
                                            disabled
                                        />
                                    </div>
                                    <div v-if="param.datatype.type == 'enum'">
                                        <el-select v-model="param.value" :placeholder="$t('device.running-status.866086-3')" @change="mqttPublish(deviceInfo, param)" disabled size="mini">
                                            <el-option v-for="subItem in param.datatype.enumList" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
                                        </el-select>
                                    </div>
                                    <div v-if="param.datatype.type == 'string'">
                                        <el-input v-model="param.value" :placeholder="$t('device.running-status.866086-4')" disabled size="mini"></el-input>
                                    </div>
                                    <div v-if="param.datatype.type == 'decimal'">
                                        <el-input v-model="param.value" type="number" :placeholder="$t('device.running-status.866086-7')" disabled size="mini"></el-input>
                                    </div>
                                    <div v-if="param.datatype.type == 'integer'">
                                        <el-input v-model="param.value" type="integer" :placeholder="$t('device.running-status.866086-8')" disabled size="mini"></el-input>
                                    </div>
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                        <div v-if="item.datatype.type == 'array'">
                            <el-descriptions :column="1" size="mini" border v-if="item.datatype.arrayType != 'object'">
                                <el-descriptions-item v-for="(model, index) in item.datatype.arrayModel" :key="index" :label="item.name + (index + 1)">
                                    <div v-if="item.datatype.arrayType == 'string'">
                                        <el-input v-model="model.value" :placeholder="$t('device.running-status.866086-4')" size="mini" disabled></el-input>
                                    </div>
                                    <div v-if="item.datatype.arrayType == 'decimal'">
                                        <el-input v-model="model.value" type="number" :placeholder="$t('device.running-status.866086-7')" size="mini" disabled></el-input>
                                    </div>
                                    <div v-if="item.datatype.arrayType == 'integer'">
                                        <el-input v-model="model.value" type="integer" :placeholder="$t('device.running-status.866086-8')" size="mini" disabled></el-input>
                                    </div>
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-collapse v-if="item.datatype.arrayType == 'object'">
                                <el-collapse-item v-for="(arrayParam, index) in item.datatype.arrayParams" :key="index">
                                    <template slot="title">
                                        <span style="color: #666">
                                            <i class="el-icon-tickets"></i>
                                            {{ item.name + (index + 1) }}
                                        </span>
                                    </template>
                                    <el-descriptions :column="1" size="mini" border>
                                        <el-descriptions-item v-for="(param, index) in arrayParam" :key="index" :label="param.name">
                                            <div v-if="param.datatype.type == 'bool'">
                                                <el-switch
                                                    v-model="param.value"
                                                    @change="mqttPublish(deviceInfo, param)"
                                                    active-text=""
                                                    inactive-text=""
                                                    active-value="1"
                                                    inactive-value="0"
                                                    style="min-width: 100px"
                                                    disabled
                                                />
                                            </div>
                                            <div v-if="param.datatype.type == 'enum'">
                                                <el-select v-model="param.value" :placeholder="$t('device.running-status.866086-3')" @change="mqttPublish(deviceInfo, param)" disabled size="mini">
                                                    <el-option v-for="subItem in param.datatype.enumList" :key="subItem.value" :label="subItem.text" :value="subItem.value" />
                                                </el-select>
                                            </div>
                                            <div v-if="param.datatype.type == 'string'">
                                                <el-input v-model="param.value" :placeholder="$t('device.running-status.866086-4')" disabled size="mini"></el-input>
                                            </div>
                                            <div v-if="param.datatype.type == 'decimal'">
                                                <el-input v-model="param.value" type="number" :placeholder="$t('device.running-status.866086-7')" disabled size="mini"></el-input>
                                            </div>
                                            <div v-if="param.datatype.type == 'integer'">
                                                <el-input v-model="param.value" type="integer" :placeholder="$t('device.running-status.866086-8')" disabled size="mini"></el-input>
                                            </div>
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>

            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-row v-if="getDeviceTypeJson">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <!-- 环控器 -->
                        <div v-if="deviceType === 'env'">
                            <div class="ec22-box">
                                <div class="day-target-box">
                                    <div v-for="item in topListData" :key="item.label" class="topListData-item">
                                        <div
                                            class="topListData-item-icon"
                                            :style="{
                                                background: `url(${item.icon}) no-repeat center center / cover`,
                                            }"
                                        />
                                        <div class="topListData-item-label">
                                            {{ item.name === 't_target_temp1' ? '目标温度' : item.name }}
                                        </div>
                                        <div class="topListData-item-value">{{ item.shadow }}{{ item.unit }}</div>
                                    </div>
                                </div>
                                <div class="data-box">
                                    <div class="temp-sensor-box">
                                        <div v-for="item in leftListData" :key="item.label" class="temp-sensor-box-item" :style="{}">
                                            <div
                                                class="temp-sensor-box-item-icon"
                                                :style="{
                                                    background: `url(${item.icon}) no-repeat center center / cover`,
                                                }"
                                            />
                                            <div class="temp-sensor-box-item-label">
                                                {{ item.name }}
                                            </div>
                                            <div class="temp-sensor-box-item-value">{{ item.shadow }}{{ item.unit }}</div>
                                        </div>
                                    </div>
                                    <div class="sensor-open-box">
                                        <div v-for="item in dataJson.data.enableMap['hot']" :key="item.label" class="sensor-open-box-item">
                                            <div
                                                :class="[item.value == 1 ? 'jump-img' : '']"
                                                class="sensor-open-box-item-icon"
                                                :style="{
                                                    background: `url(${item.icon}) no-repeat center center / contain`,
                                                }"
                                            />

                                            <div class="sensor-open-box-item-value">
                                                {{ item.name }}
                                            </div>
                                        </div>

                                        <div v-for="item in dataJson.data.enableMap['cold']" :key="item.label" class="sensor-open-box-item">
                                            <div
                                                :class="[item.value == 1 ? 'jump-img' : '']"
                                                class="sensor-open-box-item-icon"
                                                :style="{
                                                    background: `url(${item.icon}) no-repeat center center / contain`,
                                                }"
                                            />

                                            <div class="sensor-open-box-item-value">
                                                {{ item.name }}
                                            </div>
                                        </div>

                                        <div v-for="item in dataJson.data.enableMap['light']" :key="item.label" class="sensor-open-box-item">
                                            <div
                                                :class="[item.value == 1 ? 'jump-img' : '']"
                                                class="sensor-open-box-item-icon"
                                                :style="{
                                                    background: `url(${item.icon}) no-repeat center center / contain`,
                                                }"
                                            />

                                            <div class="sensor-open-box-item-value">
                                                {{ item.name }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="other-sensor-box">
                                        <div v-for="item in rightListData" :key="item.label" class="other-sensor-box-item">
                                            <div class="other-sensor-box-item-value">
                                                <span>{{ item.shadow }}{{ item.unit }}</span>
                                            </div>
                                            <div class="other-sensor-box-item-label">
                                                {{ item.name }}
                                            </div>
                                            <div
                                                class="other-sensor-box-item-icon"
                                                :style="{
                                                    background: `url(${item.icon}) no-repeat center center / cover`,
                                                }"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="fan-open-box">
                                    <div v-for="item in deviceEnableIcon['fans']" :key="item.label" class="fan-open-box-item">
                                        <div
                                            :class="[item.value == 1 ? 'fan-animation' : '']"
                                            class="fan-open-box-item-icon"
                                            :style="{
                                                background: `url(${item.icon}) no-repeat center center / contain`,
                                            }"
                                        />

                                        <div class="fan-open-box-item-value">
                                            {{ item.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 4G报警器 -->
                        <div v-if="deviceType === 'alarm'">
                            <el-row class="out-box" :gutter="8">
                                <el-col v-for="(item, idx) in dataJson.data.view" :span="8" class="box-item" :key="item.title">
                                    <el-row>
                                        <el-col :span="4">
                                            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 83px">
                                                <el-image :src="item.icon" style="padding-left: 5px"></el-image>
                                                <div class="box-item-title">{{ item.title }}</div>
                                            </div>
                                        </el-col>
                                        <el-col :span="6" :offset="14">
                                            <div style="display: flex; flex-direction: column; justify-content: end; align-items: center; height: 83px">
                                                <span class="box-item-value" :style="{ color: alarmBitArray[idx] ? '#FF0000' : '#67C23A' }">{{ alarmBitArray[idx] ? '报警' : '正常' }}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- 集中报警器 -->
                        <div v-if="deviceType === 'ccAlarm'">
                            <alarmData :CC01AlarmInfo="CC01AlarmInfo" />
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="6"></el-col>
                </el-row>
            </el-col>
        </el-row>

        <!-- 添加或修改产品固件对话框 -->
        <el-dialog :title="$t('device.running-status.866086-10')" :visible.sync="openFirmware" width="600px" append-to-body>
            <div v-if="firmware == null" style="text-align: center; font-size: 16px">
                <i class="el-icon-success" style="color: #67c23a"></i>
                {{ $t('device.running-status.866086-11') }}
            </div>
            <el-descriptions :column="1" border size="large" v-if="firmware != null && deviceInfo.firmwareVersion < firmware.version" :labelStyle="{ width: '150px', 'font-weight': 'bold' }">
                <template slot="title">
                    <el-link icon="el-icon-success" type="success" :underline="false">{{ $t('device.running-status.866086-12') }}</el-link>
                </template>
                <el-descriptions-item :label="$t('device.running-status.866086-13')">{{ firmware.firmwareName }}</el-descriptions-item>
                <el-descriptions-item :label="$t('device.device-edit.148398-4')">{{ firmware.productName }}</el-descriptions-item>
                <el-descriptions-item :label="$t('device.device-edit.148398-12')">Version {{ firmware.version }}</el-descriptions-item>
                <el-descriptions-item :label="$t('device.running-status.866086-16')">
                    <el-link :href="getDownloadUrl(firmware.filePath)" :underline="false" type="primary">{{ getDownloadUrl(firmware.filePath) }}</el-link>
                </el-descriptions-item>
                <el-descriptions-item :label="$t('device.running-status.866086-17')">{{ firmware.remark }}</el-descriptions-item>
            </el-descriptions>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="otaUpgrade" v-if="firmware != null && deviceInfo.firmwareVersion < firmware.version">{{ $t('device.running-status.866086-18') }}</el-button>
                <el-button @click="cancel">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getLatestFirmware } from '@/api/iot/firmware';

import { PrefixZero, bytesToBitsArray } from '@/utils/index';
import { serviceInvoke } from '@/api/iot/runstatus';
import { getProductMOdelJson } from '@/api/iot/model';

import targetTempIcon from './img/target-temp.png';
import dayIcon from './img/day.png';

import temp1 from './img/temp1.png';
import temp2 from './img/temp2.png';

import water from './img/water.png';
import co2 from './img/co2.png';
import nh3 from './img/nh3.png';
import wind from './img/wind.png';
import presurre from './img/presurre.png';

import fire_active from './img/fire_active.png';
import fire_gray from './img/fire_gray.png';
import cold_active from './img/cold_active.png';
import cold_gray from './img/cold_gray.png';
import light_active from './img/light_active.png';
import light_gray from './img/light_gray.png';
import dust_active from './img/dust_active.png';
import dust_gray from './img/dust_gray.png';
import fan_active from './img/fan_active.png';
import fan_gray from './img/fan_gray.png';

import alarmData from './alarm/data.vue';
import alarmSetting from './alarm/setting.vue';

export default {
    name: 'running-status',
    props: {
        device: {
            type: Object,
            default: null,
        },
        deviceType: {
            type: String,
            default: '',
        },
    },
    components: {
        alarmData,
        alarmSetting,
    },
    watch: {
        // 获取到父组件传递的device后，刷新列表
        device: {
            handler(newVal) {
                if (newVal && newVal.deviceId != 0) {
                    if (newVal && newVal.deviceId != 0) {
                        this.deviceInfo = newVal;
                        // 获取JSON配置
                        getProductMOdelJson(this.deviceInfo.productId).then((res) => {
                            // EC08 152
                            // EC12 154
                            // EC22 155
                            // EC16 169
                            // EC22改 172
                            if (this.deviceInfo.productId == 152 || this.deviceInfo.productId == 154 || this.deviceInfo.productId == 155 || this.deviceInfo.productId == 169 || this.deviceInfo.productId == 172) {
                                this.dataJson = JSON.parse(res.data);
                                this.fansList.length = this.dataJson.data.enableMap['fans'].length;
                                this.fansList.fill(0);
                                setTimeout(() => {
                                    this.getEnvData();
                                }, 1000 * 3);
                                this.getDeviceTypeJson = true;
                            } else if (this.deviceInfo.productId == 153) {
                                // D06
                                setTimeout(() => {
                                    this.dataJson = JSON.parse(res.data);
                                    console.log(this.dataJson, 'this.dataJson');
                                    this.getDeviceTypeJson = true;
                                }, 1000 * 3);
                            } else if (this.deviceInfo.productId == 168) {
                                //  cc01
                                setTimeout(() => {
                                    console.log(newVal, 'newVal');
                                    this.CC01AlarmInfo = newVal;
                                    this.getDeviceTypeJson = true;
                                }, 1000 * 3);
                            }
                        });
                        // 获取到DataAlarmInfo
                        if (this.deviceInfo.staticList) {
                            const alarmMap = this.deviceInfo.staticList.find((item) => {
                                return item.id == 'DataAlarmInfo';
                            });
                            if (alarmMap) {
                                let _value = alarmMap.value;
                                const _bitArray = bytesToBitsArray([_value]).map((item) => {
                                    return item.reverse();
                                });
                                this.alarmBitArray = [..._bitArray[0]];
                                console.log(this.alarmBitArray, 'this.alarmBitArray');
                            }
                            this.updateDeviceStatus(this.deviceInfo);
                        }
                        // 添加message事件监听器
                        this.mqttCallback();
                    }
                }
            },
        },
        deviceType: {
            handler(newVal) {},
        },
    },
    data() {
        return {
            dataJson: {},
            // 控制模块标题
            title: '设备控制 ',
            // 未启用设备影子
            shadowUnEnable: false,
            // 控制项标题背景
            statusColor: {
                background: '#67C23A',
                color: '#fff',
                minWidth: '100px',
            },
            // 最新固件信息
            firmware: {},
            // 打开固件对话框
            openFirmware: false,
            // 遮罩层
            loading: true,
            // 设备信息
            deviceInfo: {
                boolList: [],
                enumList: [],
                stringList: [],
                integerList: [],
                decimalList: [],
                arrayList: [],
                thingsModels: [],
                chartList: [],
            },
            remoteCommand: {},
            deviceEnableIcon: {},
            getDeviceTypeJson: false,
            alarmBitArray: [],
            // 环控图列
            timer: null,
            datalist: [],
            leftList: [],
            leftListData: [],
            rightList: [],
            rightListData: [],
            bottomList: [],
            bottomListData: [],
            topListData: [],
            swtichData: '',
            fansList: [],
            // 当前日龄
            currentAge: '',
            // 目标温度
            targetTemperature: '',
            fansListT22: [],
            curtainListT22: [],
            // 帘、窗、变频
            curtainList: [],

            // CC01集中报警器\
            CC01AlarmInfo: {},
        };
    },
    created() {},
    methods: {
        getEnvData() {
            if (this.deviceInfo.productId != 169) {
                // 非EC16
                // 设备开关数据 需要展示的是（风机开关、开度一，二、制冷、加热、光照....）以实际情况而定
                // 传感器探头 --- 温度传感器
                const sensors = JSON.parse(this.deviceInfo.thingsModelValue).filter((item) => {
                    // 温度探头
                    // DataTemperatureSensor
                    // 二氧化碳
                    // DataCO2Sensor
                    // 压力
                    // DataPressureSensor
                    // 氨气
                    // DataNH3Sensor
                    // 风速
                    // DataWindSpeedSensor
                    // 室内外温度
                    // DataTemperatureAva
                    // 室内外湿度
                    // DataHumidityAva
                    const sensorTypes = ['DataTemperatureSensor', 'DataHumiditySensor', 'DataCO2Sensor', 'DataPressureSensor', 'DataNH3Sensor', 'DataWindSpeedSensor', 'DataTemperatureAva', 'DataHumidityAva'];
                    return sensorTypes.some((type) => item.id.includes(type));
                });

                // 其他 数据

                const otherData = JSON.parse(this.deviceInfo.thingsModelValue).filter((item) => {
                    // 变频
                    // DataFrequencyConversion
                    // 通风等级
                    // DataCurrentWindLevel
                    const sensorTypes = ['DataFrequencyConversion', 'DataCurrentWindLevel'];
                    return sensorTypes.some((type) => item.id.includes(type));
                });

                const topData = JSON.parse(this.deviceInfo.thingsModelValue).filter((item) => {
                    // 目标温度
                    // DataTargetTemperature
                    // 日龄
                    const sensorTypes = ['DataTargetTemperature', 'DataDayLive'];
                    return sensorTypes.some((type) => item.id.includes(type));
                });
                // 风机开关
                const enable = JSON.parse(this.deviceInfo.thingsModelValue).find((item) => {
                    return item.id === 'DataAllDeviceStatus';
                });

                const _item = PrefixZero(parseInt(enable.value).toString(2), this.dataJson.data.mapLength).split('');
                this.deviceEnableIcon = this.dataJson.data.enableMap;

                // 根据数据源制定左边，右边，下边，上边的数据显示
                this.dataJson.data.enableMap.fans.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['fans'][idx] = {
                            icon: fan_active,
                            value: 1,
                            name: '风机' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['fans'][idx] = {
                            icon: fan_gray,
                            value: 0,
                            name: '风机' + (idx + 1),
                        };
                    }
                });
                // 加热
                this.dataJson.data.enableMap.hot.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['hot'][idx] = {
                            icon: fire_active,
                            value: 1,
                            name: '加热' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['hot'][idx] = {
                            icon: fire_gray,
                            value: 0,
                            name: '加热' + (idx + 1),
                        };
                    }
                });
                // 制冷
                this.dataJson.data.enableMap.cold.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['cold'][idx] = {
                            icon: cold_active,
                            value: 1,
                            name: '制冷' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['cold'][idx] = {
                            icon: cold_gray,
                            value: 0,
                            name: '制冷' + (idx + 1),
                        };
                    }
                });
                // 光照
                this.dataJson.data.enableMap.light.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['light'][idx] = {
                            icon: light_active,
                            value: 1,
                            name: '光照' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['light'][idx] = {
                            icon: light_gray,
                            value: 0,
                            name: '光照' + (idx + 1),
                        };
                    }
                });
                this.topListData = [...topData];
                this.topListData.forEach((item) => {
                    if (item.id === 'DataTargetTemperature') {
                        item.icon = targetTempIcon;
                    } else {
                        item.icon = dayIcon;
                    }
                });
                const allDataShowList = [...otherData, ...sensors];

                console.log(_allDataShowList, '_allDataShowList');
                allDataShowList.forEach((item) => {
                    if (item.id.includes('DataTemperatureSensor')) {
                        item.icon = temp1;
                    } else if (item.id.includes('DataCO2Sensor')) {
                        item.icon = co2;
                    } else if (item.id.includes('DataPressureSensor')) {
                        item.icon = presurre;
                    } else if (item.id.includes('DataNH3Sensor')) {
                        item.icon = nh3;
                    } else if (item.id.includes('DataWindSpeedSensor')) {
                        item.icon = wind;
                    } else if (item.id.includes('DataTemperatureAva')) {
                        item.icon = temp2;
                    } else if (item.id.includes('DataHumidityAva')) {
                        item.icon = water;
                    } else if (item.id.includes('DataFrequencyConversion')) {
                        item.icon = fan_active;
                    } else if (item.id.includes('DataCurrentWindLevel')) {
                        item.icon = fan_active;
                    }
                });

                // 拆分数据
                const half = Math.floor(allDataShowList.length / 2);
                const firstList = allDataShowList.slice(0, half);
                this.leftListData = [...firstList];
                const secondList = allDataShowList.slice(half);
                this.rightListData = [...secondList];
            } else {
                // EC16
                // 设备开关数据 需要展示的是（风机开关、开度一，二、制冷、加热、光照....）以实际情况而定
                // 传感器探头 --- 温度传感器
                const sensors = JSON.parse(this.deviceInfo.thingsModelValue)
                    .filter((item) => {
                        // 温度探头
                        // t_temp
                        // 二氧化碳
                        // carbonca
                        // 压力
                        // t_negative_pressureca
                        // 氨气
                        // ammoniaca
                        // 风速
                        // wind_speedca
                        // 室内外温度
                        // t_temp_
                        // 室内外湿度
                        // indoor_humca
                        const sensorTypes = ['t_temp', 'carbonca', 'DataCO2Sensor', 't_negative_pressureca', 'ammoniaca', 'wind_speedca', 't_temp_', 'indoor_humca'];
                        return sensorTypes.some((type) => item.id.includes(type));
                    })
                    .filter((sensor) => {
                        const validSensorNames = ['温度1', '温度2', '温度3', '温度4', '温度5', '温度6', '湿度一', '湿度二', '二氧化碳', '氨气', '负压', '风速'];
                        return validSensorNames.includes(sensor.name);
                    });
                // 其他 数据

                const otherData = JSON.parse(this.deviceInfo.thingsModelValue).filter((item) => {
                    // 变频
                    // bianpin
                    // 通风等级
                    // level_run
                    const sensorTypes = ['bianpin', 'level_run'];
                    return sensorTypes.some((type) => item.id.includes(type));
                });

                const topData = JSON.parse(this.deviceInfo.thingsModelValue)
                    .filter((item) => {
                        // 目标温度
                        // t_target_temp1
                        // 日龄
                        const sensorTypes = ['t_target_temp1', 'age1'];
                        return sensorTypes.some((type) => item.id.includes(type));
                    })
                    .filter((sensor) => {
                        return sensor.name === 't_target_temp1' || sensor.name === '日龄';
                    });
                // 风机开关
                const enable = JSON.parse(this.deviceInfo.thingsModelValue).find((item) => {
                    return item.id === 'fan_status1';
                });

                const _item = PrefixZero(parseInt(enable.value).toString(2), this.dataJson.data.mapLength).split('');
                this.deviceEnableIcon = this.dataJson.data.enableMap;

                // 根据数据源制定左边，右边，下边，上边的数据显示
                this.dataJson.data.enableMap.fans.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['fans'][idx] = {
                            icon: fan_active,
                            value: 1,
                            name: '风机' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['fans'][idx] = {
                            icon: fan_gray,
                            value: 0,
                            name: '风机' + (idx + 1),
                        };
                    }
                });
                // 加热
                this.dataJson.data.enableMap.hot.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['hot'][idx] = {
                            icon: fire_active,
                            value: 1,
                            name: '加热' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['hot'][idx] = {
                            icon: fire_gray,
                            value: 0,
                            name: '加热' + (idx + 1),
                        };
                    }
                });
                // 制冷
                this.dataJson.data.enableMap.cold.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['cold'][idx] = {
                            icon: cold_active,
                            value: 1,
                            name: '制冷' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['cold'][idx] = {
                            icon: cold_gray,
                            value: 0,
                            name: '制冷' + (idx + 1),
                        };
                    }
                });
                // 光照
                this.dataJson.data.enableMap.light.forEach((item, idx) => {
                    if (_item[parseInt(item)] == '1') {
                        // 开启状态
                        this.deviceEnableIcon['light'][idx] = {
                            icon: light_active,
                            value: 1,
                            name: '光照' + (idx + 1),
                        };
                    } else {
                        // 关闭状态
                        this.deviceEnableIcon['light'][idx] = {
                            icon: light_gray,
                            value: 0,
                            name: '光照' + (idx + 1),
                        };
                    }
                });
                this.topListData = [...topData];
                this.topListData.forEach((item) => {
                    if (item.id === 'DataTargetTemperature') {
                        item.icon = targetTempIcon;
                    } else {
                        item.icon = dayIcon;
                    }
                });
                const allDataShowList = [...otherData, ...sensors];
                console.log(allDataShowList, 'allDataShowList');
                // const _allDataShowList = allDataShowList.sort((a, b) => {
                //     const order = [
                //         'DataCurrentWindLevel',
                //         'DataTemperatureSensor1',
                //         'DataTemperatureSensor2',
                //         'DataTemperatureSensor3',
                //         'DataTemperatureSensor4',
                //         'DataTemperatureSensor5',
                //         'DataTemperatureSensor6',
                //         'DataFrequencyConversion1',
                //         'DataFrequencyConversion2',
                //         'DataFrequencyConversion3',
                //         'DataFrequencyConversion4',
                //         'DataCO2Sensor',
                //         'DataNH3Sensor',
                //         'DataNegativePressureWindSpeed',
                //     ];
                //     return order.indexOf(a.id) - order.indexOf(b.id);
                // });

                allDataShowList.forEach((item) => {
                    if (item.id.includes('t_temp')) {
                        item.icon = temp1;
                        let key = item.id.split('t_tempca')[1];
                        item.sort = 8 + parseInt(key);
                    } else if (item.id.includes('carbonca')) {
                        item.icon = co2;
                        item.sort = 50;
                    } else if (item.id.includes('t_negative_pressureca')) {
                        item.icon = presurre;
                        item.sort = 53;
                    } else if (item.id.includes('ammoniaca')) {
                        item.icon = nh3;
                        item.sort = 52;
                    } else if (item.id.includes('wind_speedca')) {
                        item.icon = wind;
                        item.sort = 55;
                    } else if (item.id.includes('t_temp_')) {
                        item.icon = temp2;
                        item.sort = 50;
                    } else if (item.id.includes('indoor_humca')) {
                        item.icon = water;
                        item.sort = 54;
                    } else if (item.id.includes('bianpin')) {
                        item.icon = fan_active;
                        let key = item.id.split('bianpin')[1];
                        item.sort = 2 + parseInt(key);
                    } else if (item.id.includes('level_run')) {
                        item.name = '通风级别';
                        item.icon = fan_active;
                        item.sort = 1;
                    }
                });
                const _allDataShowList = allDataShowList.sort((a, b) => {
                    return a.sort - b.sort;
                });

                // // 拆分数据
                const half = Math.floor(_allDataShowList.length / 2);
                const firstList = _allDataShowList.slice(0, half);
                this.leftListData = [...firstList];
                const secondList = _allDataShowList.slice(half);
                this.rightListData = [...secondList];
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
                    console.log('接收到【物模型】主题1：', topic);
                    console.log('接收到【物模型】内容：', message);
                    // 更新列表中设备的属性
                    if (this.deviceInfo.serialNumber == deviceNum) {
                        for (let j = 0; j < message.message.length; j++) {
                            let isComplete = false;
                            // 设备状态
                            for (let k = 0; k < this.deviceInfo.thingsModels.length && !isComplete; k++) {
                                if (this.deviceInfo.thingsModels[k].id == message.message[j].id) {
                                    // 普通类型(小数/整数/字符串/布尔/枚举)
                                    if (this.deviceInfo.thingsModels[k].datatype.type == 'decimal' || this.deviceInfo.thingsModels[k].datatype.type == 'integer') {
                                        this.deviceInfo.thingsModels[k].shadow = Number(message.message[j].value);
                                    } else {
                                        this.deviceInfo.thingsModels[k].shadow = message.message[j].value;
                                    }
                                    isComplete = true;
                                    break;
                                } else if (this.deviceInfo.thingsModels[k].datatype.type == 'object') {
                                    // 对象类型
                                    for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.params.length; n++) {
                                        if (this.deviceInfo.thingsModels[k].datatype.params[n].id == message.message[j].id) {
                                            this.deviceInfo.thingsModels[k].datatype.params[n].shadow = message.message[j].value;
                                            isComplete = true;
                                            break;
                                        }
                                    }
                                } else if (this.deviceInfo.thingsModels[k].datatype.type == 'array') {
                                    // 数组类型
                                    if (this.deviceInfo.thingsModels[k].datatype.arrayType == 'object') {
                                        // 1.对象类型数组,id为数组中一个元素,例如：array_01_gateway_temperature
                                        if (String(message.message[j].id).indexOf('array_') == 0) {
                                            for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.arrayParams.length; n++) {
                                                for (let m = 0; m < this.deviceInfo.thingsModels[k].datatype.arrayParams[n].length; m++) {
                                                    if (this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].id == message.message[j].id) {
                                                        this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].shadow = message.message[j].value;
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
                                                    if (this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].id == prefix + message.message[j].id) {
                                                        this.deviceInfo.thingsModels[k].datatype.arrayParams[n][m].shadow = message.message[j].value;
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
                                            if (this.deviceInfo.thingsModels[k].datatype.arrayModel[n].id == message.message[j].id) {
                                                this.deviceInfo.thingsModels[k].datatype.arrayModel[n].shadow = message.message[j].value;
                                                isComplete = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
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
                        message: this.$t('device.running-status.866086-25'),
                    });
                }
            });
        },
        /** 枚举类型按钮单击 */
        enumButtonClick(device, model, value) {
            model.shadow = value;
            this.mqttPublish(device, model);
        },

        /** 更新设备状态 */
        updateDeviceStatus(device) {
            if (device.status == 3) {
                this.statusColor.background = '#12d09f';
                this.title = this.$t('device.running-status.866086-26');
            } else {
                if (device.isShadow == 1) {
                    this.statusColor.background = '#409EFF';
                    this.title = this.$t('device.running-status.866086-27');
                } else {
                    this.statusColor.background = '#909399';
                    this.title = this.$t('device.running-status.866086-28');
                    this.shadowUnEnable = true;
                }
            }
            this.$emit('statusEvent', this.deviceInfo.status);
        },
        /** 物模型数组元素值改变事件 */
        arrayItemChange(value, thingsModel) {
            let shadow = '';
            for (let i = 0; i < thingsModel.datatype.arrayCount; i++) {
                shadow += thingsModel.datatype.arrayModel[i].shadow + ',';
            }
            shadow = shadow.substring(0, shadow.length - 1);
            thingsModel.shadow = shadow;
        },
        /** 物模型中数组值改变事件 */
        arrayInputChange(value, thingsModel) {
            let arrayModels = value.split(',');
            if (arrayModels.length != thingsModel.datatype.arrayCount) {
                this.$modal.alertWarning(this.$t('device.running-status.866086-29') + thingsModel.datatype.arrayCount + this.$t('device.running-status.866086-30'));
            } else {
                for (let i = 0; i < thingsModel.datatype.arrayCount; i++) {
                    thingsModel.datatype.arrayModel[i].shadow = arrayModels[i];
                }
            }
        },
        /** 设备升级 */
        otaUpgrade() {
            // OTA升级
            let topic = '/' + this.deviceInfo.productId + '/' + this.deviceInfo.serialNumber + '/ota/get';
            let message = '{"version":' + this.firmware.version + ',"downloadUrl":"' + this.getDownloadUrl(this.firmware.filePath) + '"}';
            // 发布
            this.$mqttTool
                .publish(topic, message, this.$t('device.running-status.866086-31'))
                .then((res) => {
                    this.$modal.notifySuccess(res);
                })
                .catch((res) => {
                    this.$modal.notifyError(res);
                });
            this.openFirmware = false;
        },
        /** 获取最新固件 */
        getLatestFirmware(deviceId) {
            getLatestFirmware(deviceId).then((response) => {
                this.firmware = response.data;
                this.openFirmware = true;
            });
        },
        // 取消按钮
        cancel() {
            this.openFirmware = false;
        },
        // 获取下载路径前缀
        getDownloadUrl(path) {
            return window.location.origin + process.env.VUE_APP_BASE_API + path;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

.ec22-box {
    height: 657px;
    background-image: url('./img/shack-bg.png');
    .data-box {
        display: flex;
        justify-content: space-between;
        align-items: end;
        .temp-sensor-box {
            width: 280px;
            height: 450px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            display: grid;
            grid-template-columns: 1fr; /* 只有一列 */
            grid-template-rows: repeat(9, 1fr); /* 八行 */
            grid-gap: 10px; /* 间距 */
            padding: 10px; /* 边距 */
            .temp-sensor-box-item {
                padding-left: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-image: url('./img/left-bg.png');
                background-size: contain;
                background-repeat: no-repeat;
                .temp-sensor-box-item-icon {
                    width: 30px;
                    height: 30px;
                    margin-right: 8px;
                }
                .temp-sensor-box-item-label {
                    width: 80px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    font-size: 14px;
                    color: #ffffff;
                }
                .temp-sensor-box-item-value {
                    width: 100px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    font-size: 20px;
                    color: #00eeff;
                }
            }
        }
        .sensor-open-box {
            width: 837px;
            height: 114px;
            background-color: rgba(7, 17, 30, 0.61);
            border-radius: 9px 9px 9px 9px;
            border: 1px solid #5d92d9;
            display: flex;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            .sensor-open-box-item {
                flex: 1;
                padding-left: 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .sensor-open-box-item-icon {
                    width: 30px;
                    height: 30px;
                }
                .sensor-open-box-item-label {
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    font-size: 14px;
                    color: #e6ff00;
                }
                .sensor-open-box-item-value {
                    padding-top: 10px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    font-size: 20px;
                }
            }
        }
        .other-sensor-box {
            width: 320px;
            height: 450px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            display: grid;
            grid-template-columns: 1fr; /* 只有一列 */
            grid-template-rows: repeat(10, 1fr); /* 八行 */
            grid-gap: 10px; /* 间距 */
            padding: 10px; /* 边距 */
            .other-sensor-box-item {
                padding-left: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-image: url('./img/right-bg.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position-x: 40px;
                .other-sensor-box-item-icon {
                    width: 30px;
                    height: 30px;
                    position: relative;
                    right: 65px;
                    // margin-right: 20px;
                }
                .other-sensor-box-item-label {
                    width: 100px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    font-size: 14px;
                    color: #ffffff;
                    text-align: end;
                    margin-right: 10px;
                    position: absolute;
                    right: 115px;
                }
                .other-sensor-box-item-value {
                    width: 80px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    font-size: 20px;
                    color: #00eeff;
                }
            }
        }
    }
    .day-target-box {
        margin: 0 auto;
        width: 580px;
        height: 80px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 20px;
        .topListData-item {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 25px 21px;
            background: #07111e;
            border-radius: 9px 9px 9px 9px;
            border: 1px solid #1b2a40;
            .topListData-item-icon {
                width: 30px;
                height: 30px;
                margin-right: 8px;
            }
            .topListData-item-label {
                width: 100px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #ffffff;
            }
            .topListData-item-value {
                width: 60px;
                font-family: PingFang SC, PingFang SC;
                font-weight: bold;
                font-size: 20px;
                color: #00ff3c;
            }
        }
    }
    .fan-open-box {
        margin-top: 10px;
        margin-left: 20px;
        margin-right: 20px;
        height: 114px;
        background-color: rgba(7, 17, 30, 0.61);
        border-radius: 9px 9px 9px 9px;
        border: 1px solid #5d92d9;
        display: flex;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        .fan-open-box-item {
            flex: 1;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .fan-open-box-item-icon {
                width: 30px;
                height: 30px;
            }
            .fan-open-box-item-value {
                margin-top: 10px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #fff;
            }
        }
    }
}

.fan-animation {
    animation: rotateBackground 5s infinite linear;
}

@keyframes rotateBackground {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.jump-img {
    /* 设置图片跳动动画 */
    animation: jump 3s ease infinite;
}
@keyframes jump {
    0% {
        transform: translateY(0) scale(1, 1);
    }
    /* 中间状态图片位移并且拉伸 */
    50% {
        transform: translateY(-5px) scale(0.97, 1.03);
    }
    100% {
        transform: translateY(0) scale(1, 1);
    }
}
.jump-img:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 10px;
    left: 0;
    bottom: -30px;
    z-index: -1;
    background: rgba(0, 0, 0, 0.7);
    filter: blur(10px);
    border-radius: 50%;
    /* 设置投影动画 */
    animation: shadow 3s ease infinite;
}
@keyframes shadow {
    0% {
        transform: scale(1);
        opacity: 1;
        filter: blur(10px);
    }
    /* 投影缩放+虚化 */
    50% {
        transform: scale(0.8);
        opacity: 0.7;
        filter: blur(20px);
    }
    100% {
        transform: scale(1);
        opacity: 1;
        filter: blur(10px);
    }
}

/* 重写滑动块样式 */
.el-slider__bar {
    height: 18px;
}

.el-slider__runway {
    height: 18px;
    margin: 5px 0;
}

.el-slider__button {
    height: 18px;
    width: 18px;
    border-radius: 10%;
}

.el-slider__button-wrapper {
    top: -9px;
}

.out-box {
    background: #0d1827;
    border-radius: 10px 10px 10px 10px;
    .box-item {
        width: 302px;
        height: 103px;
        background: #07111e;
        border-radius: 9px 9px 9px 9px;
        margin: 10px;
        border: 1px solid #1b2a40;
        .box-item-title {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            line-height: 0px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            margin-top: 15px;
        }
        .box-item-value {
            font-family: PingFang SC, PingFang SC;
            font-weight: bold;
            font-size: 20px;
            color: #00eeff;
            line-height: 0px;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
    }
}
</style>
