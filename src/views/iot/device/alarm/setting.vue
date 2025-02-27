<template>
    <div class="settings-container" v-loading="loading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.7)">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="settings-card half-width">
                    <div class="card-header">
                        <i class="icon settings-icon" />
                        <span>设备信息</span>
                    </div>
                    <div class="form-group">
                        <label>设备名称</label>
                        <input v-model="deviceName" maxlength="9" type="text" @blur="handleInputChange('deviceName', deviceName)" />
                    </div>
                </div>
            </el-col>
            <el-col :span="16">
                <!-- Temperature Settings Section -->
                <div class="settings-card half-width">
                    <div class="card-header">
                        <i class="icon temperature-icon" />
                        <span>温度报警设置</span>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>温度上限</label>
                            <input v-model="tempUpper" type="text" @blur="handleInputChange('tempUpper', tempUpper)" />
                        </div>
                        <div class="form-group">
                            <label>温度下限</label>
                            <input v-model="tempLower" type="text" @blur="handleInputChange('tempLower', tempLower)" />
                        </div>
                        <div class="form-group">
                            <label>报警开关</label>
                            <label class="switch">
                                <input v-model="tempAlarm" :true-value="1" :false-value="2" type="checkbox" @change="handleInputChange('tempAlarm', tempAlarm)" />
                                <span class="slider" />
                            </label>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- Battery Information Section -->
        <div class="settings-card">
            <div class="card-header">
                <i class="icon battery-icon" />
                <span>电池信息</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>电压上限</label>
                    <input v-model="voltageUpper" type="text" @blur="handleInputChange('voltageUpper', voltageUpper)" />
                </div>
                <div class="form-group">
                    <label>电压下限</label>
                    <input v-model="voltageLower" type="text" @blur="handleInputChange('voltageLower', voltageLower)" />
                </div>
                <div class="form-group">
                    <label>电流上限</label>
                    <input v-model="currentUpper" type="text" @blur="handleInputChange('currentUpper', currentUpper)" />
                </div>
                <!-- <div class="form-group">
                    <label>电流检测</label>
                    <label class="switch">
                        <input v-model="currentDetection" type="checkbox" @change="handleInputChange('currentDetection', currentDetection)" />
                        <span class="slider" />
                    </label>
                </div> -->
            </div>
        </div>

        <!-- Basic Information Section -->
        <!-- <div class="settings-card">
            <div class="card-header">
                <i class="icon basic-icon" />
                <span>基本信息</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>时间同步</label>
                    <label class="switch">
                        <input v-model="timeSync" type="checkbox" @change="handleInputChange('timeSync', timeSync)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>屏幕亮度</label>
                    <input v-model="brightness" type="text" @blur="handleInputChange('brightness', brightness)" />
                </div>
                <div class="form-group">
                    <label>自动熄屏</label>
                    <label class="switch">
                        <input v-model="autoScreen" type="checkbox" @change="handleInputChange('autoScreen', autoScreen)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>熄屏时间</label>
                    <input v-model="screenOffTime" type="text" @blur="handleInputChange('screenOffTime', screenOffTime)" />
                </div>
            </div>
        </div> -->

        <div class="settings-card">
            <div class="card-header">
                <i class="icon external-icon" />
                <span>外部信息</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>外部1</label>
                    <input v-model="external1" maxlength="5" type="text" @blur="handleInputChange('external1', external1)" />
                </div>
                <div class="form-group">
                    <label>外部1类型</label>
                    <label class="switch">
                        <input v-model="External1Type" :true-value="1" :false-value="2" type="checkbox" @change="handleInputChange('External1Type', External1Type)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部1启用状态</label>
                    <label class="switch">
                        <input v-model="External1EnabledStatus" type="checkbox" @change="handleInputChange('External1EnabledStatus', External1EnabledStatus)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部2</label>
                    <input v-model="external2" maxlength="5" type="text" @blur="handleInputChange('external2', external2)" />
                </div>
                <div class="form-group">
                    <label>外部2类型</label>
                    <label class="switch">
                        <input v-model="External2Type" :true-value="1" :false-value="2" type="checkbox" @change="handleInputChange('External2Type', External2Type)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部2启用状态</label>
                    <label class="switch">
                        <input v-model="External2EnabledStatus" type="checkbox" @change="handleInputChange('External2EnabledStatus', External2EnabledStatus)" />
                        <span class="slider" />
                    </label>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>外部3</label>
                    <input v-model="external3" :true-value="1" :false-value="2" maxlength="5" type="text" @blur="handleInputChange('external3', external3)" />
                </div>
                <div class="form-group">
                    <label>外部3类型</label>
                    <label class="switch">
                        <input v-model="External3Type" type="checkbox" @change="handleInputChange('External3Type', External3Type)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部3启用状态</label>
                    <label class="switch">
                        <input v-model="External3EnabledStatus" type="checkbox" @change="handleInputChange('External3EnabledStatus', External3EnabledStatus)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部4</label>
                    <input v-model="external4" maxlength="5" type="text" @blur="handleInputChange('external4', external4)" />
                </div>
                <div class="form-group">
                    <label>外部4类型</label>
                    <label class="switch">
                        <input v-model="External4Type" :true-value="1" :false-value="2" type="checkbox" @change="handleInputChange('External4Type', External4Type)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部4启用状态</label>
                    <label class="switch">
                        <input v-model="External4EnabledStatus" type="checkbox" @change="handleInputChange('External4EnabledStatus', External4EnabledStatus)" />
                        <span class="slider" />
                    </label>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>外部5</label>
                    <input v-model="external5" maxlength="5" type="text" @blur="handleInputChange('external5', external5)" />
                </div>
                <div class="form-group">
                    <label>外部5类型</label>
                    <label class="switch">
                        <input v-model="External5Type" :true-value="1" :false-value="2" type="checkbox" @change="handleInputChange('External5Type', External5Type)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部5启用状态</label>
                    <label class="switch">
                        <input v-model="External5EnabledStatus" type="checkbox" @change="handleInputChange('External5EnabledStatus', External5EnabledStatus)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部6</label>
                    <input v-model="external6" :true-value="1" :false-value="2" maxlength="5" type="text" @blur="handleInputChange('external6', external6)" />
                </div>
                <div class="form-group">
                    <label>外部6类型</label>
                    <label class="switch">
                        <input v-model="External6Type" type="checkbox" @change="handleInputChange('External6Type', External6Type)" />
                        <span class="slider" />
                    </label>
                </div>
                <div class="form-group">
                    <label>外部6启用状态</label>
                    <label class="switch">
                        <input v-model="External6EnabledStatus" type="checkbox" @change="handleInputChange('External6EnabledStatus', External6EnabledStatus)" />
                        <span class="slider" />
                    </label>
                </div>
            </div>
        </div>

        <el-dialog :visible.sync="centerDialogVisible" title="是否修改该参数" width="600px" style="margin-top: 10%" :close-on-click-modal="false" :modal="false">
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="SubmitEvent">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getDeviceRunningStatus } from '@/api/iot/device';
import { serviceInvoke } from '@/api/iot/runstatus';

export default {
    props: {
        device: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            deviceName: '', // ok
            voltageUpper: '', // ok
            voltageLower: '', // ok
            currentUpper: '', // ok
            currentDetection: false, // ok
            tempUpper: '0', // ok
            tempLower: '', // ok
            tempAlarm: false, // ok
            timeSync: false, // ok
            brightness: '', // ok
            autoScreen: false, // ok
            screenOffTime: '',
            dailyTest: '', // ok
            external1: '', // ok
            external2: '', // ok
            external3: '', // ok
            external4: '', // ok
            external5: '', // ok
            external6: '', // ok
            External1EnabledStatus: false, // ok
            External2EnabledStatus: false, // ok
            External3EnabledStatus: false, // ok
            External4EnabledStatus: false, // ok
            External5EnabledStatus: false, // ok
            External6EnabledStatus: false, // ok
            External1Type: '', // ok
            External2Type: '', // ok
            External3Type: '', // ok
            External4Type: '', // ok
            External5Type: '', // ok
            External6Type: '', // ok
            centerDialogVisible: false,
            currentChangeKey: '',
            currentChangeValue: '',
            loading: false,
        };
    },
    mounted() {
        let urlParams = new URLSearchParams(window.location.search);
        let deviceId = urlParams.get('deviceId');

        getDeviceRunningStatus({ deviceId: deviceId }).then((res) => {
            let newVal = res.data;
            const _deviceNames = newVal.thingsModels.filter((item) => item.id.includes('LocalAlarmName'));
            _deviceNames.sort((a, b) => a.id.split('LocalAlarmName')[1] - b.id.split('LocalAlarmName')[1]);
            this.deviceName = _deviceNames.map((item) => item.value).join('');

            // 电压上限
            this.voltageUpper = newVal.thingsModels.find((item) => item.id.includes('VoltageUpperLimit')).value;
            // 电压下限
            this.voltageLower = newVal.thingsModels.find((item) => item.id.includes('VoltageLowerLimit')).value;
            // 电流上限
            this.currentUpper = newVal.thingsModels.find((item) => item.id.includes('CurrentUpperLimit')).value;
            // 电流监测
            this.currentDetection = newVal.thingsModels.find((item) => item.id.includes('CurrentDetectionEnabledStatus')).value;

            // 时间同步
            this.timeSync = newVal.thingsModels.find((item) => item.id.includes('TimeSync')).value;
            // 屏幕亮度
            this.brightness = newVal.thingsModels.find((item) => item.id.includes('ScreenBrightness')).value;
            // 屏幕息屏时间
            this.screenOffTime = newVal.thingsModels.find((item) => item.id.includes('ScreenOffTime')).value;
            // 熄屏开关
            this.autoScreen = newVal.thingsModels.find((item) => item.id.includes('ScreenOffSwitch')).value;
            // 每日一测
            this.dailyTest = newVal.thingsModels.find((item) => item.id.includes('DailyTestTime')).value + ':' + newVal.thingsModels.find((item) => item.id.includes('DailyTestMinute')).value;

            // 外部名称
            const getExternalDeviceNames = (externalName) => {
                const filteredDevices = newVal.thingsModels.filter((item) => item.id.includes(externalName));
                filteredDevices.sort((a, b) => a.id.split(externalName)[1] - b.id.split(externalName)[1]);
                return filteredDevices.map((item) => item.value).join('');
            };

            // 外部设备名称
            this.external1 = getExternalDeviceNames('External1Name');
            this.external2 = getExternalDeviceNames('External2Name');
            this.external3 = getExternalDeviceNames('External3Name');
            this.external4 = getExternalDeviceNames('External4Name');
            this.external5 = getExternalDeviceNames('External5Name');
            this.external6 = getExternalDeviceNames('External6Name');

            // 外部设备类型
            this.External1Type = newVal.thingsModels.find((item) => item.id.includes('External1Type')).value;
            this.External2Type = newVal.thingsModels.find((item) => item.id.includes('External2Type')).value;
            this.External3Type = newVal.thingsModels.find((item) => item.id.includes('External3Type')).value;
            this.External4Type = newVal.thingsModels.find((item) => item.id.includes('External4Type')).value;
            this.External5Type = newVal.thingsModels.find((item) => item.id.includes('External5Type')).value;
            this.External6Type = newVal.thingsModels.find((item) => item.id.includes('External6Type')).value;
            // console.log(newVal.thingsModels);

            // 外部设备启用状态
            this.External1EnabledStatus = newVal.thingsModels.find((item) => item.id.includes('External1EnabledStatus')).value == 1 ? true : false;
            this.External2EnabledStatus = newVal.thingsModels.find((item) => item.id.includes('External2EnabledStatus')).value == 1 ? true : false;
            this.External3EnabledStatus = newVal.thingsModels.find((item) => item.id.includes('External3EnabledStatus')).value == 1 ? true : false;
            this.External4EnabledStatus = newVal.thingsModels.find((item) => item.id.includes('External4EnabledStatus')).value == 1 ? true : false;
            this.External5EnabledStatus = newVal.thingsModels.find((item) => item.id.includes('External5EnabledStatus')).value == 1 ? true : false;
            this.External6EnabledStatus = newVal.thingsModels.find((item) => item.id.includes('External6EnabledStatus')).value == 1 ? true : false;

            // 温度上限
            this.tempUpper = newVal.thingsModels.find((item) => item.id.includes('TemperatureUpperLimit')).value;
            // 温度下限
            this.tempLower = newVal.thingsModels.find((item) => item.id.includes('TemperatureLowerLimit')).value;
            // 温度开关
            this.tempAlarm = newVal.thingsModels.find((item) => item.id.includes('TemperatureSwitch')).value;
        });
    },
    methods: {
        SubmitEvent() {
            if (this.currentChangeKey == 'deviceName') {
                this.centerDialogVisible = true;
                let urlParams = new URLSearchParams(window.location.search);
                let deviceId = urlParams.get('deviceId');
                const valueArray = this.currentChangeValue.split('').map((item) => item.trim());
                const fixedLengthArray = new Array(9).fill('');
                for (let i = 0; i < valueArray.length && i < 9; i++) {
                    fixedLengthArray[i] = valueArray[i];
                }
                let promise = Promise.resolve(); // 初始化一个已解决的 Promise
                this.loading = true;
                this.centerDialogVisible = false;
                let requests = fixedLengthArray.map((item, idx) => {
                    return (promise = promise.then(() => {
                        return serviceInvoke({
                            identifier: 'LocalAlarmName' + parseInt(idx + 1),
                            isShadow: false,
                            productId: this.device.productId,
                            remoteCommand: {
                                ['LocalAlarmName' + parseInt(idx + 1)]: item,
                            },
                            serialNumber: this.device.serialNumber,
                            type: 2,
                        }).then(() => {});
                    }));
                });
                // 在所有请求完成后触发消息弹出
                Promise.all(requests).then(() => {
                    this.$message({
                        message: '数据保存完成！',
                        type: 'success',
                    });
                    this.loading = false;
                });
            } else if (
                this.currentChangeKey == 'external1' ||
                this.currentChangeKey == 'external2' ||
                this.currentChangeKey == 'external3' ||
                this.currentChangeKey == 'external4' ||
                this.currentChangeKey == 'external5' ||
                this.currentChangeKey == 'external6'
            ) {
                this.centerDialogVisible = true;
                let urlParams = new URLSearchParams(window.location.search);
                let deviceId = urlParams.get('deviceId');
                const valueArray = this.currentChangeValue.split('').map((item) => item.trim());
                const fixedLengthArray = new Array(5).fill('');
                for (let i = 0; i < valueArray.length && i < 5; i++) {
                    fixedLengthArray[i] = valueArray[i];
                }
                const nameObj = {
                    external1: 'External1Name',
                    external2: 'External2Name',
                    external3: 'External3Name',
                    external4: 'External4Name',
                    external5: 'External5Name',
                    external6: 'External6Name',
                };

                let promise = Promise.resolve(); // 初始化一个已解决的 Promise
                this.loading = true;
                this.centerDialogVisible = false;
                let requests = fixedLengthArray.map((item, idx) => {
                    return (promise = promise.then(() => {
                        return serviceInvoke({
                            identifier: nameObj[this.currentChangeKey] + parseInt(idx + 1),
                            isShadow: false,
                            productId: this.device.productId,
                            remoteCommand: {
                                [nameObj[this.currentChangeKey] + parseInt(idx + 1)]: item,
                            },
                            serialNumber: this.device.serialNumber,
                            type: 2,
                        }).then(() => {});
                    }));
                });
                // 在所有请求完成后触发消息弹出
                Promise.all(requests).then(() => {
                    this.$message({
                        message: '数据保存完成！',
                        type: 'success',
                    });
                    this.loading = false;
                });
            } else if (
                [
                    'External1Type',
                    'External2Type',
                    'External3Type',
                    'External4Type',
                    'External5Type',
                    'External6Type',
                    'External1EnabledStatus',
                    'External2EnabledStatus',
                    'External3EnabledStatus',
                    'External4EnabledStatus',
                    'External5EnabledStatus',
                    'External6EnabledStatus',
                    'tempAlarm',
                    'currentDetection',
                    'timeSync',
                    'autoScreen',
                ].includes(this.currentChangeKey)
            ) {
                let addrMap = {
                    External1Type: 'External1Type',
                    External2Type: 'External2Type',
                    External3Type: 'External3Type',
                    External4Type: 'External4Type',
                    External5Type: 'External5Type',
                    External6Type: 'External6Type',
                    External1EnabledStatus: 'External1EnabledStatus',
                    External2EnabledStatus: 'External2EnabledStatus',
                    External3EnabledStatus: 'External3EnabledStatus',
                    External4EnabledStatus: 'External4EnabledStatus',
                    External5EnabledStatus: 'External5EnabledStatus',
                    External6EnabledStatus: 'External6EnabledStatus',
                    tempAlarm: 'TemperatureSwitch',
                    currentDetection: 'CurrentDetectionEnabledStatus',
                    timeSync: 'timeSync',
                    autoScreen: 'ScreenOffSwitch',
                };
                this.centerDialogVisible = true;
                let urlParams = new URLSearchParams(window.location.search);
                let deviceId = urlParams.get('deviceId');

                let remoteCommandData = {};
                let arr = ['External1Type', 'External2Type', 'External3Type', 'External4Type', 'External5Type', 'External6Type', 'TemperatureSwitch'];
                if (arr.includes(addrMap[this.currentChangeKey])) {
                    if (this.currentChangeValue == 1) {
                        remoteCommandData[addrMap[this.currentChangeKey]] = 1;
                    } else {
                        remoteCommandData[addrMap[this.currentChangeKey]] = 2;
                    }
                } else {
                    remoteCommandData[addrMap[this.currentChangeKey]] = this.currentChangeValue ? 1 : 0;
                }
                serviceInvoke({
                    identifier: addrMap[this.currentChangeKey],
                    isShadow: false,
                    productId: this.device.productId,
                    remoteCommand: remoteCommandData,
                    serialNumber: this.device.serialNumber,
                    type: 2,
                }).then(() => {
                    this.centerDialogVisible = false;
                });
            } else {
                this.centerDialogVisible = true;
                let urlParams = new URLSearchParams(window.location.search);
                let deviceId = urlParams.get('deviceId');
                let addrMap = {
                    voltageUpper: 'VoltageUpperLimit',
                    voltageLower: 'VoltageLowerLimit',
                    currentUpper: 'CurrentUpperLimit',
                    tempUpper: 'TemperatureUpperLimit',
                    tempLower: 'TemperatureLowerLimit',
                    brightness: 'ScreenBrightness',
                };
                serviceInvoke({
                    identifier: addrMap[this.currentChangeKey],
                    isShadow: false,
                    productId: this.device.productId,
                    remoteCommand: {
                        [addrMap[this.currentChangeKey]]: this.currentChangeValue,
                    },
                    serialNumber: this.device.serialNumber,
                    type: 2,
                }).then(() => {
                    this.centerDialogVisible = false;
                });
            }
        },
        handleInputChange(key, value) {
            this.currentChangeKey = key;
            this.currentChangeValue = value;
            this.centerDialogVisible = true;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.settings-container {
    width: 100%;
    padding: 10px;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.settings-card {
    background-color: #1a1f29;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.half-width {
    flex: 1;
    min-width: 300px;
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: #00b7c3;
}

.icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    background-color: #00b7c3;
    mask-size: cover;
    -webkit-mask-size: cover;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.form-group {
    flex: 1;
    min-width: 200px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #8b949e;
}

input[type='text'] {
    width: 100%;
    padding: 8px 12px;
    background-color: #2d333b;
    border: 1px solid #30363d;
    border-radius: 6px;
    color: #ffffff;
    outline: none;
}

input[type='text']:focus {
    border-color: #00b7c3;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2d333b;
    transition: 0.4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: '';
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #00b7c3;
}

input:checked + .slider:before {
    transform: translateX(30px);
}

/* Icons */
.settings-icon {
    mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.65.07-.97 0-.32-.03-.65-.07-.97l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65c-.04-.24-.25-.42-.5-.42h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.63c-.04.32-.07.65-.07.97 0 .32.03.65.07.97l-2.11 1.63c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63z"/></svg>');
}
.battery-icon {
    mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.67 4H15V2H9v2H7.33A1.33 1.33 0 0 0 6 5.33v15.34C6 21.4 6.6 22 7.33 22h9.34A1.33 1.33 0 0 0 18 20.67V5.33C18 4.6 17.4 4 16.67 4z"/></svg>');
}
.temperature-icon {
    mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1z"/></svg>');
}
.basic-icon {
    mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2m0 3.5L19.5 19h-15L12 5.5z"/></svg>');
}
.external-icon {
    mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3m2 2v14h14V5H5z"/></svg>');
}

::v-deep .ant-modal-title {
    color: #fff !important;
}

::v-deep .ant-modal-header {
    background-color: #0d1117 !important;
}
</style>
