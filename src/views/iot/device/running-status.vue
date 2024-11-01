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
                        // 环控器
                        <div v-if="deviceType === 'env'">
                            // 开关图
                            <el-card shadow="hover" style="border-radius: 30px; margin-top: -25px">
                                <div style="display: flex; width: 100%; flex-wrap: wrap">
                                    <div
                                        v-for="(item, idx1) in dataJson.data.fansNum"
                                        :key="idx1"
                                        style="height: 48px; width: 48px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px"
                                    >
                                        <el-image :src="deviceEnableIcon.fans[idx1]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                        <div style="color: #fff; text-align: center; font-size: 12px">{{ '风机' + (idx1 + 1) }}</div>
                                    </div>
                                    <div
                                        v-for="(item, idx2) in dataJson.data.hot"
                                        :key="idx2"
                                        style="height: 48px; width: 48px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px"
                                    >
                                        <el-image :src="deviceEnableIcon.hot[idx2]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                        <div style="color: #fff; text-align: center">{{ '加热' + (idx2 + 1) }}</div>
                                    </div>
                                    <div
                                        v-for="(item, idx3) in dataJson.data.cold"
                                        :key="idx3"
                                        style="height: 48px; width: 48px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px"
                                    >
                                        <el-image :src="deviceEnableIcon.cold[idx3]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                        <div style="color: #fff; text-align: center">{{ '制冷' + (idx3 + 1) }}</div>
                                    </div>
                                    <div
                                        v-for="(item, idx4) in dataJson.data.light"
                                        :key="idx4"
                                        style="height: 48px; width: 48px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px"
                                    >
                                        <el-image :src="deviceEnableIcon.light[idx4]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                        <div style="color: #fff; text-align: center">{{ '照明' + (idx4 + 1) }}</div>
                                    </div>
                                </div>
                            </el-card>
                            <!-- 设备监测图表-->
                            <el-row :gutter="20" style="padding: 20px 10px 20px 10px; border-radius: 15px; margin-right: 5px">
                                <el-col :xs="24" :sm="12" :md="12" :lg="4" :xl="4" v-for="(item, index) in deviceInfo.chartList" :key="index">
                                    <el-card shadow="hover" style="border-radius: 30px; margin-bottom: 12px">
                                        <div ref="map" style="height: 160px; width: 160px; margin: 0 auto"></div>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </div>

                        // 报警器
                        <div v-if="deviceType === 'alarm'">
                            <el-row class="out-box" :gutter="8">
                                <el-col v-for="item in dataJson.data.view" :span="8" class="box-item">
                                    <el-row>
                                        <el-col :span="4">
                                            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 83px">
                                                <el-image :src="item.icon" style="padding-left: 5px"></el-image>
                                                <div class="box-item-title">{{ item.title }}</div>
                                            </div>
                                        </el-col>
                                        <el-col :span="6" :offset="14">
                                            <div style="display: flex; flex-direction: column; justify-content: end; align-items: center; height: 83px">
                                                <span class="box-item-value">{{ item.value ? '报警' : '正常' }}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
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

import alarm06DataJson from './env/alarm06Temple.json';
import env08ProDataJson from './env/envTemple-08PRO.json';

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
    watch: {
        // 获取到父组件传递的device后，刷新列表
        device: {
            handler(newVal) {
                if (newVal && newVal.deviceId != 0) {
                    if (newVal && newVal.deviceId != 0) {
                        this.deviceInfo = newVal;
                        console.log(this.deviceInfo, 'this.deviceInfo');
                        // 获取JSON配置
                        getProductMOdelJson(this.deviceInfo.productId).then((res) => {
                            // EC08 152
                            // EC12 154
                            // EC22 155
                            if (this.deviceInfo.productId == 152 || this.deviceInfo.productId == 154 || this.deviceInfo.productId == 155) {
                                this.dataJson = JSON.parse(res.data);
                                this.getIcon();
                                setTimeout(() => {
                                    this.getEnvData();
                                    this.MonitorChart();
                                }, 1000 * 3);
                                this.getDeviceTypeJson = true;
                            } else {
                                this.dataJson = JSON.parse(res.data);
                            }
                        });
                        // 获取到DataAlarmInfo
                        const alarmMap = this.deviceInfo.staticList.find((item) => {
                            return item.id == 'DataAlarmInfo';
                        });
                        if (alarmMap) {
                            let _value = alarmMap.value;
                            const _bitArray = bytesToBitsArray([_value]).map((item) => {
                                return item.reverse();
                            });
                            this.alarmBitArray = [..._bitArray[0]];
                        }
                        this.updateDeviceStatus(this.deviceInfo);
                        this.$nextTick(function () {});
                        // 添加message事件监听器
                        this.mqttCallback();
                    }
                }
            },
        },
        deviceType: {
            handler(newVal) {
                // if (newVal == 'env') {
                //     this.dataJson = env08ProDataJson;
                //     this.getIcon();
                //     // 获取环控数据
                //     setTimeout(() => {
                //         this.getEnvData();
                //         this.MonitorChart();
                //     }, 1.5 * 1000);
                //     this.getDeviceTypeJson = true;
                // } else {
                //     this.dataJson = alarm06DataJson;
                //     // 获取报警数据
                //     setTimeout(() => {
                //         this.dataJson.data.view.forEach((item, idx) => {
                //             item.value = this.alarmBitArray[idx];
                //         });
                //     }, 1.5 * 1000);
                //     this.getDeviceTypeJson = true;
                // }
            },
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
            // 监测图表
            monitorChart: [
                {
                    chart: {},
                    data: {
                        id: '',
                        name: '',
                        value: '',
                    },
                },
            ],
            remoteCommand: {},
            nameFormat: {
                DataTemperatureSensor01: '温度1',
                DataTemperatureSensor02: '温度2',
                DataTemperatureSensor03: '温度3',
                DataTemperatureSensor04: '温度4',
                DataTemperatureSensor05: '温度5',
                DataTemperatureSensor06: '温度6',
                DataTemperatureSensor07: '温度7',
                DataTemperatureSensor08: '温度8',
                DataTemperatureAva01: '室内温度',
                DataTemperatureAva02: '室外温度',
                DataHumiditySensor01: '室内湿度',
                DataHumiditySensor02: '室外湿度',
                DataCO2Sensor: '二氧化碳',
                DataNH3Sensor: '氨气',
                DataDayLive: '日龄',
                DataTargetTemperature: '目标温度',
            },
            iconImages: {},
            deviceEnableIcon: {},
            getDeviceTypeJson: false,
            alarmBitArray: [],
        };
    },
    created() {},
    methods: {
        getIcon() {
            // 获取到图标
            const imagesPath = require.context('../../../assets/sunseen/env/data', false, /\.png$/);
            this.iconImages = {};
            imagesPath.keys().forEach((key) => {
                const result = key.match(/\/([^/]+)\.png$/);
                this.iconImages[result[1]] = imagesPath(key);
            });
            // 讲对应设备的图标对应上数组,默认是关闭状态
            this.deviceEnableIcon['fans'] = new Array(this.dataJson.data.fansNum).fill(this.iconImages['fan_gray']);
            this.deviceEnableIcon['hot'] = new Array(this.dataJson.data.hot).fill(this.iconImages['fire_gray']);
            this.deviceEnableIcon['cold'] = new Array(this.dataJson.data.cold).fill(this.iconImages['cold_gray']);
            this.deviceEnableIcon['light'] = new Array(this.dataJson.data.light).fill(this.iconImages['light_gray']);
        },
        getEnvData() {
            console.log(this.deviceInfo, 'this.deviceInfo.thingsModels');
            // 设备开关数据 需要展示的是（风机开关、开度一，二、制冷、加热、光照....）以实际情况而定
            const enable = JSON.parse(this.deviceInfo.thingsModelValue).find((item) => {
                return item.id === 'DataAllDeviceStatus';
            });
            console.log(enable, 'enable');
            // PrefixZero
            // enable.value
            const _item = PrefixZero(parseInt(enable.value).toString(2), 25).split('');

            console.log(_item, '_item');
            // 风机
            console.log(this.dataJson.data.enableMap.fans, 'this.dataJson.data');
            this.dataJson.data.enableMap.fans.forEach((item, idx) => {
                console.log(_item[parseInt(item)], item, '内容值');
                if (_item[parseInt(item)] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['fans'][idx] = this.iconImages['fan_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['fans'][idx] = this.iconImages['fan_gray'];
                }
            });
            // 加热
            this.dataJson.data.enableMap.hot.forEach((item, idx) => {
                if (_item[parseInt(item)] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['hot'][idx] = this.iconImages['fire_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['hot'][idx] = this.iconImages['fire_gray'];
                }
            });
            // 制冷
            this.dataJson.data.enableMap.cold.forEach((item, idx) => {
                if (_item[parseInt(item)] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['cold'][idx] = this.iconImages['cold_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['cold'][idx] = this.iconImages['cold_gray'];
                }
            });
            // 光照
            this.dataJson.data.enableMap.light.forEach((item, idx) => {
                if (_item[parseInt(item)] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['light'][idx] = this.iconImages['light_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['light'][idx] = this.iconImages['light_gray'];
                }
            });
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
                            // 图表数据
                            for (let k = 0; k < this.deviceInfo.chartList.length; k++) {
                                if (this.deviceInfo.chartList[k].id.indexOf('array_') == 0) {
                                    // 数组类型匹配,例如：array_00_gateway_temperature
                                    if (this.deviceInfo.chartList[k].id == message.message[j].id) {
                                        // let shadows = message.message[j].value.split(",");
                                        this.deviceInfo.chartList[k].shadow = message.message[j].value;
                                        // 更新图表
                                        for (let m = 0; m < this.monitorChart.length; m++) {
                                            if (message.message[j].id == this.monitorChart[m].data.id) {
                                                let data = [
                                                    {
                                                        value: message.message[j].value,
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
                                    if (this.deviceInfo.chartList[k].id == message.message[j].id) {
                                        this.deviceInfo.chartList[k].shadow = message.message[j].value;
                                        // 更新图表
                                        for (let m = 0; m < this.monitorChart.length; m++) {
                                            if (message.message[j].id == this.monitorChart[m].data.id) {
                                                isComplete = true;
                                                let data = [
                                                    {
                                                        value: message.message[j].value,
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
        /**图表展示*/
        MonitorChart() {
            for (let i = 0; i < this.deviceInfo.chartList.length; i++) {
                this.monitorChart[i] = {
                    chart: this.$echarts.init(this.$refs.map[i]),
                    data: {
                        id: this.deviceInfo.chartList[i].id,
                        name: this.deviceInfo.chartList[i].name,
                        value: this.deviceInfo.chartList[i].shadow ? this.deviceInfo.chartList[i].shadow : this.deviceInfo.chartList[i].datatype.min,
                    },
                };
                var option;
                option = {
                    tooltip: {
                        formatter: ' {b} <br/> {c}' + this.deviceInfo.chartList[i].datatype.unit,
                    },
                    series: [
                        {
                            name: this.deviceInfo.chartList[i].datatype.type,
                            type: 'gauge',
                            min: this.deviceInfo.chartList[i].datatype.min,
                            max: this.deviceInfo.chartList[i].datatype.max,
                            colorBy: 'data',
                            splitNumber: 10,
                            radius: '100%',
                            // 分割线
                            splitLine: {
                                distance: 4,
                            },
                            axisLabel: {
                                fontSize: 10,
                                distance: 10,
                            },
                            // 刻度线
                            axisTick: {
                                distance: 4,
                            },
                            // 仪表盘轴线
                            axisLine: {
                                lineStyle: {
                                    width: 8,
                                    color: [
                                        [0.2, '#409EFF'], // 0~20%
                                        [0.8, '#12d09f'], // 40~60%
                                        [1, '#F56C6C'], // 80~100%
                                    ],
                                    opacity: 0.9,
                                },
                            },
                            pointer: {
                                icon: 'triangle',
                                length: '60%',
                                width: 7,
                            },
                            progress: {
                                show: true,
                                width: 8,
                            },
                            detail: {
                                valueAnimation: true,
                                formatter: this.nameFormat[this.deviceInfo.chartList[i].id] + '-' + '{value}' + ' ' + this.deviceInfo.chartList[i].datatype.unit,
                                offsetCenter: [0, '80%'],
                                fontSize: 20,
                                textStyle: {
                                    color: '#ffffff', // 设置 detail 文本颜色
                                },
                            },
                            data: [
                                {
                                    value: this.deviceInfo.chartList[i].shadow ? this.deviceInfo.chartList[i].shadow : this.deviceInfo.chartList[i].datatype.min,
                                    name: this.deviceInfo.chartList[i].name,
                                },
                            ],
                            title: {
                                offsetCenter: [0, '115%'],
                                fontSize: 16,
                            },
                        },
                    ],
                };
                option && this.monitorChart[i].chart.setOption(option);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

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
