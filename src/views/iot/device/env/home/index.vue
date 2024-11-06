<template>
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
                    {{ item.label }}
                </div>
                <div class="topListData-item-value">{{ item.value }}{{ item.unit }}</div>
            </div>
        </div>
        <div class="data-box">
            <div class="temp-sensor-box">
                <div v-for="item in leftListData" :key="item.label" class="temp-sensor-box-item">
                    <div
                        class="temp-sensor-box-item-icon"
                        :style="{
                            background: `url(${item.icon}) no-repeat center center / cover`,
                        }"
                    />
                    <div class="temp-sensor-box-item-label">
                        {{ item.label }}
                    </div>
                    <div class="temp-sensor-box-item-value">{{ item.value / 10 }} {{ item.unit }}</div>
                </div>
            </div>
            <div class="sensor-open-box">
                <div v-for="item in curtainListT22" :key="item.label" class="sensor-open-box-item">
                    <div
                        :class="[item.value == 1 ? 'jump-img' : '']"
                        class="sensor-open-box-item-icon"
                        :style="{
                            background: `url(${item.icon}) no-repeat center center / contain`,
                        }"
                    />

                    <div class="sensor-open-box-item-value">
                        {{ item.label }}
                    </div>
                </div>
            </div>
            <div class="other-sensor-box">
                <div v-for="item in rightListData" :key="item.label" class="other-sensor-box-item">
                    <div class="other-sensor-box-item-value">
                        <span v-if="item.label === '室内湿度' || item.label === '室外湿度' || item.label === '室外氨气' || item.label === '室内二氧化碳' || item.label === '风速' || item.label === '负压'">
                            {{ item.value }}{{ item.unit }}
                        </span>
                        <span v-else>{{ item.value / 10 }}{{ item.unit }}</span>
                    </div>
                    <div class="other-sensor-box-item-label">
                        {{ '一二三四' }}
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
            <div v-for="item in fansListT22" :key="item.label" class="fan-open-box-item">
                <div
                    :class="[item.value == 1 ? 'fan-animation' : '']"
                    class="fan-open-box-item-icon"
                    :style="{
                        background: `url(${item.icon}) no-repeat center center / contain`,
                    }"
                />

                <div class="fan-open-box-item-value">
                    {{ item.label }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PrefixZero, bytesToBitsArray } from '@/utils/index';
import { getProductMOdelJson } from '@/api/iot/model';

import targetTempIcon from './img/target-temp.png';
import dayIcon from './img/day.png';

import temp1 from './img/temp1.png';
import temp2 from './img/temp2.png';
import temp3 from './img/temp3.png';
import temp4 from './img/temp4.png';
import temp5 from './img/temp5.png';

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

// 实时数据
// import { data, data1, data2, data3, data4, averageTempList, otherTemplateList, otherMoodList, fansListT12, fansListT22, curtainList, curtainListT22, otherList } from '@/views/pages/devices/deviceAddrs/hkq.js';
// 实时数据
// import { actualTimeList } from '@/views/pages/devices/deviceAddrs/SXCL-EC22.js';
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
    data() {
        return {
            data,
            data1,
            data2,
            data3,
            data4,
            // 平均温度图片
            averageTempList,
            // 七个其他温度图片
            otherTemplateList,
            // 其他模式图标
            otherMoodList,
            // 风机开关
            fansListT12,
            fansListT22,
            curtainListT22,
            // 帘、窗、变频
            curtainList,
            // 其他
            otherList,
            // ------------------------------------------------------------
            // 当前日龄
            currentAge: '',
            // 目标温度
            targetTemperature: '',
            // ----------------------------------------------------------------------------------------
            timer: null,
            actualTimeList,
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
        };
    },
    computed: {
        bodyStyle() {
            return {
                backgroundColor: '#ecf2f8',
                padding: '5px',
                borderRadius: '16px',
            };
        },
    },
    mounted() {
        this.fansList.length = 18;
        this.fansList.fill(0);
        this.init();
        this.timer = setInterval(() => {
            this.init();
        }, 1000 * 30);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        // 初始化获取实时数据
        async init() {
            this.datalist = JSON.parse(JSON.stringify(actualTimeList));
            const addrsList = actualTimeList.map((item) => {
                return item.addrs;
            });
            const { data } = await getSingleData({
                device_no: this.$route.params.id,
                addrs_list: JSON.stringify(addrsList),
            });
            getSingleData({
                device_no: this.$route.params.id,
                addrs_list: JSON.stringify(['1820,1821,1822,1823']),
            }).then((_swtichData) => {
                this.swtichData = _swtichData.data[0].value;
                const _item = PrefixZero(parseInt(this.swtichData).toString(2), 32);
                // 风机
                for (let i = _item.length - 1; i >= 0; i--) {
                    if (i > 13) {
                        this.fansListT22[31 - i].value = parseInt(_item[i]);
                    } else if (i < 13 && i > 9) {
                        // 加热1、2、3、制冷
                        curtainListT22[13 - i].value = parseInt(_item[i]);
                    } else if (i === 1) {
                        //  照明
                        curtainListT22[4].value = parseInt(_item[i]);
                    } else if (i === 0) {
                        //  除尘
                        curtainListT22[5].value = parseInt(_item[i]);
                    }
                }
            });
            console.log(data);
            this.currentAge = data[18].value;
            this.targetTemperature = data[19].value / 10;
            // 顺序依次为 温度一、温度二、温度三、温度四、温度五、温度六、温度七、温度八、室内平均温度、室外平均温度、
            // 室内湿度、室外湿度、室内二氧化碳、室外氨气、风速、负压
            // 主导因素、通风级别、日龄、目标温度
            data.forEach((item, index) => {
                if (typeof item.value === 'string' || typeof item.value === 'number') {
                    this.$set(this.actualTimeList[index], 'value', item.value);
                    if (index < 10) {
                        if (this.leftList.length !== 10) {
                            this.leftList.push(this.actualTimeList[index]);
                        } else {
                            this.leftList[index].value = this.actualTimeList[index].value;
                        }
                    } else if (index > 9 && index < 16) {
                        if (this.rightList.length !== 6) {
                            this.rightList.push(this.actualTimeList[index]);
                        } else {
                            this.rightList[index - 10].value = this.actualTimeList[index].value;
                        }
                    } else if (index > 15 && index < 18) {
                        if (this.bottomList.length !== 2) {
                            this.bottomList.push(this.actualTimeList[index]);
                        } else {
                            this.bottomList[index - 16].value = this.actualTimeList[index].value;
                        }
                    }
                } else {
                    this.$set(this.actualTimeList[index], 'value', '暂无数据');
                    if (index < 10) {
                        if (this.leftList.length !== 10) {
                            this.leftList.push(this.actualTimeList[index]);
                        } else {
                            this.leftList[index].value = this.actualTimeList[index].value;
                        }
                    } else if (index > 9 && index < 16) {
                        if (this.rightList.length !== 6) {
                            this.rightList.push(this.actualTimeList[index]);
                        } else {
                            this.rightList[index - 10].value = this.actualTimeList[index].value;
                        }
                    } else if (index > 15 && index < 18) {
                        if (this.bottomList.length !== 2) {
                            this.bottomList.push(this.actualTimeList[index]);
                        } else {
                            this.bottomList[index - 16].value = this.actualTimeList[index].value;
                        }
                    }
                }
            });
            this.leftListData = this.leftList.slice(0, 8);
            this.leftListData.forEach((item) => {
                item.unit = '℃';
            });
            this.leftListData[0].icon = temp1;
            this.leftListData[1].icon = temp2;
            this.leftListData[2].icon = temp3;
            this.leftListData[3].icon = temp4;
            this.leftListData[4].icon = temp1;
            this.leftListData[5].icon = temp2;
            this.leftListData[6].icon = temp3;
            this.leftListData[7].icon = temp4;
            this.rightListData = [this.leftList[8], this.leftList[9], ...this.rightList];
            this.rightListData[0].icon = temp5;
            this.rightListData[0].unit = '℃';
            this.rightListData[1].icon = temp5;
            this.rightListData[1].unit = '℃';
            this.rightListData[2].icon = water;
            this.rightListData[2].unit = '%';
            this.rightListData[3].icon = water;
            this.rightListData[3].unit = '%';
            this.rightListData[4].icon = co2;
            this.rightListData[4].unit = 'ppm';
            this.rightListData[5].icon = nh3;
            this.rightListData[5].unit = 'ppm';
            this.rightListData[6].icon = wind;
            this.rightListData[6].unit = 'm/s';
            this.rightListData[7].icon = presurre;
            this.rightListData[7].unit = 'pa';

            setTimeout(() => {
                this.curtainListT22.forEach((item, idx) => {
                    if (idx === 0) {
                        if (item.value == 1) {
                            item.icon = fire_active;
                        } else {
                            item.icon = fire_gray;
                        }
                    }
                    if (idx === 1) {
                        if (item.value == 1) {
                            item.icon = fire_active;
                        } else {
                            item.icon = fire_gray;
                        }
                    }
                    if (idx === 2) {
                        if (item.value == 1) {
                            item.icon = fire_active;
                        } else {
                            item.icon = fire_gray;
                        }
                    }
                    if (idx === 3) {
                        if (item.value == 1) {
                            item.icon = cold_active;
                        } else {
                            item.icon = cold_gray;
                        }
                    }
                    if (idx === 4) {
                        if (item.value == 1) {
                            item.icon = light_active;
                        } else {
                            item.icon = light_gray;
                        }
                    }
                    if (idx === 5) {
                        if (item.value == 1) {
                            item.icon = dust_active;
                        } else {
                            item.icon = dust_gray;
                        }
                    }
                });
            }, 1000);

            setTimeout(() => {
                this.fansListT22.forEach((item) => {
                    if (item.value == 1) {
                        item.icon = fan_active;
                    } else {
                        item.icon = fan_gray;
                    }
                });
            }, 1500);

            this.topListData = [
                {
                    label: '目标温度',
                    value: this.targetTemperature,
                    icon: targetTempIcon,
                    unit: '℃',
                },
                {
                    label: '日龄',
                    value: this.currentAge,
                    icon: dayIcon,
                    unit: '天',
                },
            ];
        },
    },
};
</script>

<style lang="scss" scoped>
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
            grid-template-rows: repeat(8, 1fr); /* 八行 */
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
            width: 280px;
            height: 450px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            display: grid;
            grid-template-columns: 1fr; /* 只有一列 */
            grid-template-rows: repeat(8, 1fr); /* 八行 */
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
                .other-sensor-box-item-icon {
                    width: 30px;
                    height: 30px;
                    margin-right: 20px;
                }
                .other-sensor-box-item-label {
                    width: 100px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    font-size: 14px;
                    color: #ffffff;
                    text-align: end;
                    margin-right: 40px;
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
</style>
