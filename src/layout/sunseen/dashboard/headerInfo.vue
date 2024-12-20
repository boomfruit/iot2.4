<template>
    <div>
        <div class="dashboard-box-info">
            <div
                v-for="item in boxInfo"
                :key="item.name"
                class="dashboard-box-info-item"
                :style="{
                    background: `url(${item.bg}) no-repeat center center / cover`,
                }"
            >
                <div style="padding: 18px 22px; display: flex; flex-direction: column; justify-content: space-around; height: 167px; margin-top: -7px">
                    <el-row>
                        <el-col
                            class="font1"
                            :style="{
                                color: item.color,
                            }"
                        >
                            {{ item.name }}
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="font2">{{ item.value }}</el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col
                            :span="8"
                            class="font1"
                            :style="{
                                color: item.color,
                            }"
                        >
                            {{ item.container[0].name }}
                        </el-col>
                        <el-col
                            :span="4"
                            class="font3"
                            :style="{
                                color: item.color,
                            }"
                        >
                            {{ item.container[0].value }}
                        </el-col>
                        <el-col
                            :span="8"
                            class="font1"
                            :style="{
                                color: item.color,
                            }"
                        >
                            {{ item.container[1].name }}
                        </el-col>
                        <el-col
                            :span="4"
                            class="font3"
                            :style="{
                                color: item.color,
                            }"
                        >
                            {{ item.container[1].value }}
                        </el-col>
                    </el-row> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const shack = require('./img/shack.png');
const alarm = require('./img/alarm.png');
const mail = require('./img/mail.png');
const motior = require('./img/motior.png');
const phone = require('./img/phone.png');
const device = require('./img/device.png');

import { listBarns } from '@/api/iot/barns';
import { listDeviceShort } from '@/api/iot/device';
import { listAlarm } from '@/api/iot/alarm';

export default {
    data() {
        return {
            boxInfo: [
                {
                    name: '栏舍总数',
                    value: 0,
                    container: [
                        {
                            name: '在养栏舍',
                            value: 15,
                        },
                        {
                            name: '空闲栏舍',
                            value: 3,
                        },
                    ],
                    bg: shack,
                    color: '#8FC5FF',
                },
                {
                    name: '设备总数',
                    value: 0,
                    container: [
                        {
                            name: '在线设备',
                            value: 185,
                        },
                        {
                            name: '报警设备',
                            value: 32,
                        },
                    ],
                    bg: device,
                    color: '#B9AEFF',
                },
                {
                    name: '报警总数',
                    value: 0,
                    container: [
                        {
                            name: '今日报警',
                            value: 1,
                        },
                        {
                            name: '昨日报警',
                            value: 170,
                        },
                    ],
                    bg: alarm,
                    color: '#FFE8C6',
                },
                {
                    name: '监控总数',
                    value: 0,
                    container: [
                        {
                            name: '在线监控',
                            value: 15,
                        },
                        {
                            name: '离线监控',
                            value: 3,
                        },
                    ],
                    bg: motior,
                    color: '#A1FFE9',
                },
                // {
                //     name: '短信通知次数',
                //     value: 108,
                //     container: [
                //         {
                //             name: '今日通知',
                //             value: 0,
                //         },
                //         {
                //             name: '昨日通知',
                //             value: 108,
                //         },
                //     ],
                //     bg: mail,
                //     color: '#FFC8E9',
                // },
                // {
                //     name: '电话通知次数',
                //     value: 18,
                //     container: [
                //         {
                //             name: '今日通知',
                //             value: 15,
                //         },
                //         {
                //             name: '昨日通知',
                //             value: 3,
                //         },
                //     ],
                //     bg: phone,
                //     color: '#FFE3F5',
                // },
            ],
        };
    },
    components: {},
    watch: {},

    filters: {},

    computed: {},

    mounted() {
        this.getData();
    },

    methods: {
        getData() {
            Promise.all([
                listBarns().then((result) => {
                    this.$set(this.boxInfo[0], 'value', result.total);
                }),
                listDeviceShort().then((result) => {
                    this.$set(this.boxInfo[1], 'value', result.total);
                }),
                listAlarm().then((result) => {
                    this.$set(this.boxInfo[2], 'value', result.total);
                }),
            ])
                .then(() => {})
                .catch((err) => {});
        },
    },

    watch: {},
};
</script>
<style lang="scss" scoped>
.font1 {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
}
.font2 {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 36px;
    color: #ffffff;
}
.font3 {
    font-family: PingFang SC, PingFang SC;
    font-weight: bold;
    font-size: 20px;
}
.dashboard-box {
    padding: 13px 22px;
    .dashboard-box-info {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
        .dashboard-box-info-item {
            height: 147px;
            border-radius: 10px 10px 10px 10px;
        }
    }
}
</style>
