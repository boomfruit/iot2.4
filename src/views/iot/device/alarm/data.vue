<template>
    <div class="dashboard">
        <!-- Device Information Panel -->
        <div class="panel device-info">
            <h2>
                <span class="icon-title"><component :is="icons.device" /></span>
                设备信息
            </h2>
            <div class="info-item">
                <div class="icon-wrapper"><component :is="icons.device" /></div>
                <div>
                    <div class="label">设备名称:</div>
                    <div class="value">{{ deviceName }}</div>
                </div>
            </div>
            <div class="info-item">
                <div class="icon-wrapper"><component :is="icons.model" /></div>
                <div>
                    <div class="label">设备型号:</div>
                    <div class="value">SXAL-D06</div>
                </div>
            </div>
            <div class="info-item">
                <div class="icon-wrapper"><component :is="icons.status" /></div>
                <div>
                    <div class="label">运行模式:</div>
                    <div class="value status-normal">{{ runMode }}</div>
                </div>
            </div>
            <div class="info-item">
                <div class="icon-wrapper"><component :is="icons.status" /></div>
                <div>
                    <div class="label">每日一测:</div>
                    <div class="value status-normal">{{ DailyTestStatus }}</div>
                </div>
            </div>
        </div>

        <!-- Power Information Panel -->
        <div class="panel power-info">
            <h2>
                <span class="icon-title"><component :is="icons.battery" /></span>
                电池信息
            </h2>
            <div class="info-item">
                <div class="icon-wrapper"><component :is="icons.battery" /></div>
                <div>
                    <div class="label">电池电压:</div>
                    <div class="value">{{ BatteryVoltage }} V</div>
                </div>
            </div>
            <div class="info-item">
                <div class="icon-wrapper"><component :is="icons.power" /></div>
                <div>
                    <div class="label">电池电量:</div>
                    <div class="value">
                        <div class="battery-level">
                            <div class="battery-fill" :style="{ width: '100%' }"></div>
                        </div>
                        {{ BatteryCharge }}%
                    </div>
                </div>
            </div>
            <div class="info-item">
                <div class="icon-wrapper"><component :is="icons.temperature" /></div>
                <div>
                    <div class="label">温度:</div>
                    <div class="value">{{ Temperature }}°C---{{ temperatureAlarm }}</div>
                </div>
            </div>
        </div>

        <!-- External Information Panel -->
        <div class="panel external-info">
            <h2>
                <span class="icon-title"><component :is="icons.sensor" /></span>
                外部信息
            </h2>
            <table>
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>类型</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in DeviceNameObj" :key="index">
                        <td style="display: flex; align-items: center; gap: 10px">
                            <div class="icon-wrapper small external-icon"><component :is="icons.sensor" /></div>
                            <div>{{ item.name }}</div>
                        </td>
                        <td class="status-normal">{{ item.type }}</td>
                        <td class="status-normal">{{ item.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Electrical Information Panel -->
        <div class="panel electrical-info">
            <h2>
                <span class="icon-title"><component :is="icons.power" /></span>
                电源信息
            </h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>电压</th>
                        <th>电流</th>
                        <th>相角</th>
                        <th>频率</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(phase, index) in phaseDataObj" :key="index">
                        <td>
                            <div class="phase-indicator" :class="phase.color">
                                {{ phase.name }}
                            </div>
                        </td>
                        <td>{{ phase.voltage }} V</td>
                        <td>{{ phase.current }} A</td>
                        <td>{{ phase.angle }}°</td>
                        <td>{{ phase.frequency }} Hz</td>
                        <td class="status-normal">{{ phase.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        CC01AlarmInfo: {
            type: Object,
            default: () => ({}),
        },
    },
    watch: {
        CC01AlarmInfo: {
            handler(newValue, oldValue) {
                // newValue.staticList
                //     {
                //         id: 'PowerStatus',
                //         name: '电源状态',
                //     },
                //     {
                //         id: 'UPhaseStatus',
                //         name: 'U相状态',
                //     },
                //     {
                //         id: 'VPhaseStatus',
                //         name: 'V相状态',
                //     },
                //     {
                //         id: 'WPhaseStatus',
                //         name: 'W相状态',
                //     },
                //     {
                //         id: 'BatteryStatus',
                //         name: '电池状态',
                //     },
                //     {
                //         id: 'ExternalAlarm1',
                //         name: '外部报警-1',
                //     },
                //     {
                //         id: 'ExternalAlarm2',
                //         name: '外部报警-2',
                //     },
                //     {
                //         id: 'ExternalAlarm3',
                //         name: '外部报警-3',
                //     },
                //     {
                //         id: 'ExternalAlarm4',
                //         name: '外部报警-4',
                //     },
                //     {
                //         id: 'Channel1CurrentAlarmStatus',
                //         name: '通道1电流报警状态',
                //     },
                //     {
                //         id: 'Channel2CurrentAlarmStatus',
                //         name: '通道2电流报警状态',
                //     },
                //     {
                //         id: 'Channel3CurrentAlarmStatus',
                //         name: '通道3电流报警状态',
                //     },
                //     {
                //         id: 'CommunicationStatus',
                //         name: '通信状态',
                //     },
                //     {
                //         id: 'MuteStatus',
                //         name: '消音状态',
                //     },
                //     {
                //         id: 'AlarmProcessing',
                //         name: '报警处理',
                //     },
                //     {
                //         id: 'UPhaseVoltage',
                //         name: 'U相电压',
                //     },
                //     {
                //         id: 'VPhaseVoltage',
                //         name: 'V相电压',
                //     },
                //     {
                //         id: 'WPhaseVoltage',
                //         name: 'W相电压',
                //     },
                //     {
                //         id: 'Channel1Current',
                //         name: '通道1电流',
                //     },
                //     {
                //         id: 'Channel2Current',
                //         name: '通道2电流',
                //     },
                //     {
                //         id: 'Channel3Current',
                //         name: '通道3电流',
                //     },
                //     {
                //         id: 'BatteryCharge',
                //         name: '电池电量',
                //     },
                //     {
                //         id: 'BatteryVoltage',
                //         name: '电池电压',
                //     },
                //     {
                //         id: 'DailyTestStatus',
                //         name: '每日一测状态',
                //     },
                //     {
                //         id: 'BatteryChargeDischargeStatus',
                //         name: '电池充放电状态',
                //     },
                //     {
                //         id: 'MuteStatus1',
                //         name: '消音状态1',
                //     },
                //     {
                //         id: 'UVPhaseAngle',
                //         name: 'UV相角',
                //     },
                //     {
                //         id: 'VWPhaseAngle',
                //         name: 'VW相角',
                //     },
                //     {
                //         id: 'UWPhaseAngle',
                //         name: 'UW相角',
                //     },
                //     {
                //         id: 'dtm_k87',
                //         name: '无',
                //     },
                //     {
                //         id: 'dtm_1ne',
                //         name: '无',
                //     },
                //     {
                //         id: 'Temperature',
                //         name: '温度',
                //     },
                //     {
                //         id: 'OnlineStatus',
                //         name: '在线状态',
                //     },
                //     {
                //         id: 'AlarmStatus',
                //         name: '报警状态',
                //     }
                // console.log('CC01AlarmInfo 变化:', newValue);
                // console.log(newValue.staticList);
            },
            deep: true, // 如果需要深度监听对象的变化
        },
    },
    computed: {
        deviceName() {
            if (this.CC01AlarmInfo.thingsModels) {
                const _deviceNames = this.CC01AlarmInfo.thingsModels.filter((item) => item.id.includes('LocalAlarmName'));
                _deviceNames.sort((a, b) => a.id.split('LocalAlarmName')[1] - b.id.split('LocalAlarmName')[1]);
                return _deviceNames.map((item) => item.value).join('');
            } else {
                return '';
            }
        },
        DailyTestStatus() {
            if (this.CC01AlarmInfo.thingsModels) {
                const _dailyTestStatus = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('DailyTestStatus'));
                if (_dailyTestStatus.value == 1) {
                    return '已测';
                } else if (_dailyTestStatus.value == 2) {
                    return '已测';
                } else if (_dailyTestStatus.value == 3) {
                    return '未测';
                } else if (_dailyTestStatus.value == 4) {
                    return '未测';
                } else {
                    return '-';
                }
            } else {
                return '-';
            }
        },
        runMode() {
            if (this.CC01AlarmInfo.thingsModels) {
                const _dailyTestStatus = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('DailyTestStatus'));
                if (_dailyTestStatus.value == 1) {
                    return '消音';
                } else if (_dailyTestStatus.value == 2) {
                    return '正常';
                } else if (_dailyTestStatus.value == 3) {
                    return '消音';
                } else if (_dailyTestStatus.value == 4) {
                    return '正常';
                } else {
                    return '-';
                }
            } else {
                return '-';
            }
        },
        BatteryVoltage() {
            if (this.CC01AlarmInfo.staticList) {
                const _batteryVoltage = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('BatteryVoltage'));
                return _batteryVoltage.value / 10;
            } else {
                return '-';
            }
        },
        BatteryCharge() {
            if (this.CC01AlarmInfo.staticList) {
                const _batteryCharge = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('BatteryCharge'));
                return _batteryCharge.value;
            } else {
                return '-';
            }
        },
        Temperature() {
            if (this.CC01AlarmInfo.staticList) {
                const _temperature = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('Temperature'));
                return _temperature.value;
            } else {
                return '-';
            }
        },
        temperatureAlarm() {
            if (this.CC01AlarmInfo.staticList) {
                const _temperatureAlarm = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('ExternalAlarm4'));
                if (_temperatureAlarm.value == 1) {
                    return '正常';
                } else if (_temperatureAlarm.value == 2) {
                    return '超温';
                } else if (_temperatureAlarm.value == 3) {
                    return '低温';
                } else if (_temperatureAlarm.value == 4) {
                    return '超温';
                } else if (_temperatureAlarm.value == 5) {
                    return '低温';
                }
            } else {
                return '-';
            }
        },
        DeviceNameObj() {
            if (this.CC01AlarmInfo.thingsModels && this.CC01AlarmInfo.staticList) {
                const getExternalDeviceNames = (externalName) => {
                    const filteredDevices = this.CC01AlarmInfo.thingsModels.filter((item) => item.id.includes(externalName));
                    filteredDevices.sort((a, b) => a.id.split(externalName)[1] - b.id.split(externalName)[1]);
                    return filteredDevices.map((item) => item.value).join('');
                };

                const getExternalStatus = (Status) => {
                    const ExternalStatus = this.CC01AlarmInfo.thingsModels.find((item) => item.id.includes(Status));
                    return ExternalStatus.value;
                };

                const name1 = getExternalDeviceNames('External1Name');
                const name2 = getExternalDeviceNames('External2Name');
                const name3 = getExternalDeviceNames('External3Name');
                const name4 = getExternalDeviceNames('External4Name');
                const name5 = getExternalDeviceNames('External5Name');
                const name6 = getExternalDeviceNames('External6Name');

                const type1 = getExternalStatus('External1Type');
                const type2 = getExternalStatus('External2Type');
                const type3 = getExternalStatus('External3Type');
                const type4 = getExternalStatus('External4Type');
                const type5 = getExternalStatus('External5Type');
                const type6 = getExternalStatus('External6Type');

                // status 为报警信息
                const alarm1 = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('ExternalAlarm1'));

                const deviceData = [
                    {
                        name: name1,
                        type: type1,
                        status: '正常',
                    },
                    {
                        name: name2,
                        type: type2,
                        status: '正常',
                    },
                    {
                        name: name3,
                        type: type3,
                        status: '正常',
                    },
                    {
                        name: name4,
                        type: type4,
                        status: '正常',
                    },
                    {
                        name: name5,
                        type: type5,
                        status: '正常',
                    },
                    {
                        name: name6,
                        type: type6,
                        status: '正常',
                    },
                ];

                if (alarm1.value == 1) {
                    deviceData[0].status = '报警';
                } else {
                    deviceData[0].status = '正常';
                }
                const alarm2 = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('ExternalAlarm2'));
                if (alarm2.value == 1) {
                    deviceData[1].status = '报警';
                    deviceData[4].status = '正常';
                } else if (alarm2.value == 2) {
                    deviceData[4].status = '报警';
                    deviceData[1].status = '正常';
                } else if (alarm2.value == 3) {
                    deviceData[1].status = '报警';
                    deviceData[4].status = '报警';
                } else {
                    deviceData[1].status = '正常';
                    deviceData[4].status = '正常';
                }

                const alarm3 = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('ExternalAlarm3'));
                if (alarm3.value == 1) {
                    deviceData[2].status = '报警';
                    deviceData[5].status = '正常';
                } else if (alarm3.value == 2) {
                    deviceData[5].status = '报警';
                    deviceData[2].status = '正常';
                } else if (alarm3.value == 3) {
                    deviceData[2].status = '报警';
                    deviceData[5].status = '报警';
                } else {
                    deviceData[2].status = '正常';
                    deviceData[5].status = '正常';
                }

                const alarm4 = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('ExternalAlarm4'));
                if (alarm4.value == 1) {
                    deviceData[3].status = '报警';
                    deviceData[0].templateAlarm = '正常';
                } else if (alarm4.value == 2) {
                    deviceData[0].templateAlarm = '超温';
                    deviceData[3].status = '正常';
                } else if (alarm4.value == 3) {
                    deviceData[0].templateAlarm = '低温';
                    deviceData[3].status = '正常';
                } else if (alarm4.value == 4) {
                    deviceData[0].templateAlarm = '超温';
                    deviceData[3].status = '报警';
                } else if (alarm4.value == 5) {
                    deviceData[0].templateAlarm = '低温';
                    deviceData[3].status = '报警';
                }

                console.log(deviceData, 'deviceData');
                return deviceData;
            } else {
                return [];
            }
        },
        phaseDataObj() {
            const originPhaseData = [
                { name: 'U相', color: 'phase-u', voltage: '220', current: '0', angle: '0', frequency: '50', status: '正常' },
                { name: 'V相', color: 'phase-v', voltage: '220', current: '0', angle: '0', frequency: '50', status: '正常' },
                { name: 'W相', color: 'phase-w', voltage: '220', current: '0', angle: '0', frequency: '50', status: '正常' },
            ];
            if (this.CC01AlarmInfo.staticList) {
                // 报警状态
                const UPhaseStatus = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('UPhaseStatus'));
                const VPhaseStatus = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('VPhaseStatus'));
                const WPhaseStatus = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('WPhaseStatus'));

                if (UPhaseStatus.value == 1) {
                    originPhaseData[0].status = '报警';
                }
                if (VPhaseStatus.value == 1) {
                    originPhaseData[1].status = '报警';
                }
                if (WPhaseStatus.value == 1) {
                    originPhaseData[2].status = '报警';
                }

                // 电压
                const UPhaseVoltage = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('UPhaseVoltage'));
                const VPhaseVoltage = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('VPhaseVoltage'));
                const WPhaseVoltage = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('WPhaseVoltage'));

                originPhaseData[0].voltage = UPhaseVoltage.value;
                originPhaseData[1].voltage = VPhaseVoltage.value;
                originPhaseData[2].voltage = WPhaseVoltage.value;

                // 相角
                const UVPhaseAngle = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('UVPhaseAngle'));
                const VWPhaseAngle = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('VWPhaseAngle'));
                const UWPhaseAngle = this.CC01AlarmInfo.staticList.find((item) => item.id.includes('UWPhaseAngle'));

                originPhaseData[0].angle = UVPhaseAngle.value;
                originPhaseData[1].angle = VWPhaseAngle.value;
                originPhaseData[2].angle = UWPhaseAngle.value;
            }

            return originPhaseData;
        },
    },
    data() {
        return {
            icons: {
                device: 'div',
                model: 'div',
                status: 'div',
                battery: 'div',
                power: 'div',
                temperature: 'div',
                sensor: 'div',
            },
            externalData: [
                { name: '环控器监管', type: '常开', status: '正常' },
                { name: '环控电箱报', type: '常开', status: '正常' },
                { name: '外部二电', type: '常开', status: '正常' },
                { name: '外部四电', type: '常开', status: '正常' },
                { name: '外部二电', type: '常开', status: '正常' },
                { name: '外部四电', type: '常开', status: '正常' },
            ],
            phaseData: [
                { name: 'U相', color: 'phase-u', voltage: '220', current: '0', angle: '0', frequency: '50', status: '正常' },
                { name: 'V相', color: 'phase-v', voltage: '220', current: '0', angle: '0', frequency: '50', status: '正常' },
                { name: 'W相', color: 'phase-w', voltage: '220', current: '0', angle: '0', frequency: '50', status: '正常' },
            ],
        };
    },
};
</script>

<style scoped>
.dashboard {
    width: 1600px;
    height: 600px;
    color: white;
    display: flex;
    padding: 16px;
    gap: 16px;
    font-family: 'Arial', sans-serif;
}

.panel {
    flex: 1;
    background-color: #0d1827;
    background-image: linear-gradient(45deg, #0d1827 0%, #0d1827 100%);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
}

.panel:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

h2 {
    color: #fff;
    font-size: 20px;
    border-bottom: 2px solid rgba(68, 136, 255, 0.3);
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.icon-title {
    /* background-color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px; */
}

.info-item {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.icon-wrapper {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.icon-wrapper:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.icon-wrapper.small {
    width: 30px;
    height: 30px;
    border-radius: 6px;
}

.label {
    font-size: 14px;
    color: #a0a0a0;
    margin-bottom: 4px;
}

.value {
    font-size: 16px;
    font-weight: bold;
}

.status-normal {
    color: #40ff40;
    text-shadow: 0 0 5px rgba(64, 255, 64, 0.5);
}

.battery-level {
    width: 100px;
    height: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    margin-right: 10px;
    display: inline-block;
    vertical-align: middle;
}

.battery-fill {
    height: 100%;
    background-color: #40ff40;
    transition: width 0.5s ease-in-out;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
}

th {
    text-align: left;
    color: #a0a0a0;
    font-size: 14px;
    font-weight: normal;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

td {
    padding: 10px 0;
}

tr {
    transition: all 0.3s ease;
}

tr:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.phase-indicator {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.phase-u {
    background-color: #40ff40;
    box-shadow: 0 0 10px rgba(64, 255, 64, 0.5);
}
.phase-v {
    background-color: #ff40ff;
    box-shadow: 0 0 10px rgba(255, 64, 255, 0.5);
}
.phase-w {
    background-color: #4040ff;
    box-shadow: 0 0 10px rgba(64, 64, 255, 0.5);
}

.external-icon {
    mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3m2 2v14h14V5H5z"/></svg>');
}
</style>
