<template>
    <div class="box">
        <el-row :gutter="boxGutter">
            <el-col :span="8">
                <div class="gutter-box1" style="margin-right: 20px; display: flex; justify-content: start">
                    <el-button type="primary" @click="goBack">返回列表</el-button>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="gutter-box1">
                    <el-row style="display: flex; align-items: center">
                        <el-col :span="3" style="display: flex; align-items: center">
                            <el-image style="width: 30px; height: 30px" :src="tempUrl"></el-image>
                        </el-col>
                        <el-col :span="5">目标温度</el-col>
                        <el-col :span="16" style="display: flex; justify-content: end">{{ DataTargetTemperature }}C</el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="gutter-box1">
                    <el-row style="display: flex; align-items: center">
                        <el-col :span="3" style="display: flex; align-items: center">
                            <el-image style="width: 30px; height: 30px" :src="dayUrl"></el-image>
                        </el-col>
                        <el-col :span="5">日龄</el-col>
                        <el-col :span="16" style="display: flex; justify-content: end">{{ DataDayLive }}天</el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="8">
            <el-col :span="24">
                <div class="gutter-box2">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>栏舍环控数据</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                    <div style="width: 100%; overflow-x: auto; padding-left: 10px">
                        <div style="display: flex; min-width: min-content">
                            <div class="env-data" v-for="item in chartDataList">
                                <el-image style="width: 30px; height: 30px" :src="item.imgUrl"></el-image>
                                <div style="display: flex; justify-content: space-between">
                                    <div class="env-data-title">{{ item.name }}</div>
                                    <div class="env-data-data">
                                        {{ item.value }}
                                        <span style="font-size: 10px">{{ item.datatype.unit }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="gutter-box3" style="margin-right: 20px; position: relative">
                    <div style="width: 100px; display: flex; flex-direction: column; align-items: center; position: absolute; right: 45px; top: 48px">
                        <div class="video-item-active">机位1</div>
                        <div class="video-item">机位2</div>
                        <div class="video-item">机位3</div>
                        <div class="video-item">机位4</div>
                        <div class="video-item">机位5</div>
                        <div class="video-item">机位6</div>
                    </div>
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>监控画面</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                    <div style="width: 360px; height: 230px; display: flex; padding-top: 5px; position: absolute">
                        <player></player>
                    </div>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="gutter-box5" style="margin-right: 20px">
                    <div style="display: flex; justify-content: space-between">
                        <div style="display: flex">
                            <div class="content-card-img"></div>
                            <div>设备列表</div>
                        </div>
                        <el-row>
                            <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="showUnBindDeviceList()"></el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="showRemoveDeviceList()"></el-button>
                        </el-row>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                    <div style="display: flex; width: 100%; justify-content: start; padding-left: 10px">
                        <el-carousel indicator-position="outside" :autoplay="false" arrow="always">
                            <el-carousel-item v-for="item in bindDeviceList" :key="item">
                                <div style="display: flex">
                                    <div v-for="itm in item" :key="itm" style="display: flex; flex-direction: column; align-items: center" @click="showDeviceItem(itm)">
                                        <div class="env-device">
                                            <el-row v-if="itm.status === 3" style="display: flex; align-items: center; width: 100%">
                                                <el-col :span="20" style="text-align: end">
                                                    <span style="font-family: PingFang SC, PingFang SC; font-weight: 400; font-size: 14px; color: #1aff57; line-height: 0px; text-align: left">在线</span>
                                                </el-col>
                                                <el-col :offset="1" :span="2"><div style="width: 10px; height: 10px; background: #1aff57; border-radius: 50%"></div></el-col>
                                            </el-row>
                                            <el-row v-else style="display: flex; align-items: center; width: 100%">
                                                <el-col :span="20" style="text-align: end">
                                                    <span style="font-family: PingFang SC, PingFang SC; font-weight: 400; font-size: 14px; color: #ff1a1a; line-height: 0px; text-align: left">离线</span>
                                                </el-col>
                                                <el-col :offset="1" :span="2"><div style="width: 10px; height: 10px; background: #ff1a1a; border-radius: 50%"></div></el-col>
                                            </el-row>
                                            <el-image fit="contain" style="width: 96px; height: 120px" :src="itm.imgUrl ? baseUrl + itm.imgUrl : require('@/assets/images/product.png')"></el-image>
                                        </div>
                                        <div style="margin-top: 20px; font-family: PingFang SC, PingFang SC; font-weight: 400; font-size: 16px; color: #ffffff; line-height: 0px">
                                            {{ itm.deviceName ? itm.deviceName : '设备' }}
                                        </div>
                                    </div>
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="boxGutter">
            <el-col :span="24">
                <div class="gutter-box3">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>栏舍设备状态</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                    <div class="env-data-status" v-if="getDeviceTypeJson">
                        <div style="display: flex; width: 100%; flex-wrap: wrap">
                            <div
                                v-for="(item, idx1) in dataJson.data.fansNum"
                                :key="idx1"
                                style="height: 64px; width: 64px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px"
                            >
                                <el-image :src="deviceEnableIcon.fans[idx1]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                <div style="color: #fff; text-align: center">{{ '风机' + (idx1 + 1) }}</div>
                            </div>
                            <div v-for="(item, idx2) in dataJson.data.hot" :key="idx2" style="height: 64px; width: 64px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px">
                                <el-image :src="deviceEnableIcon.hot[idx2]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                <div style="color: #fff; text-align: center">{{ '加热' + (idx2 + 1) }}</div>
                            </div>
                            <div
                                v-for="(item, idx3) in dataJson.data.cold"
                                :key="idx3"
                                style="height: 64px; width: 64px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px"
                            >
                                <el-image :src="deviceEnableIcon.cold[idx3]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                <div style="color: #fff; text-align: center">{{ '制冷' + (idx3 + 1) }}</div>
                            </div>
                            <div
                                v-for="(item, idx4) in dataJson.data.light"
                                :key="idx4"
                                style="height: 64px; width: 64px; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 10px"
                            >
                                <el-image :src="deviceEnableIcon.light[idx4]" style="height: 32px; width: 32px; margin: 0 auto"></el-image>
                                <div style="color: #fff; text-align: center">{{ '照明' + (idx4 + 1) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-dialog :title="'选择设备'" :visible.sync="open" width="600px" append-to-body>
            <el-table :data="pagedUnBindDeviceList" style="width: 100%">
                <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label"></el-table-column>
                <el-table-column :width="120" :label="'操作'">
                    <template slot-scope="scope">
                        <el-popconfirm title="是否要添加此设备？" @confirm="bindDeviceBarn(scope.row)">
                            <el-button type="primary" size="small" slot="reference">添加</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="unBindDeviceList.length"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    :current-page.sync="currentPage"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </el-dialog>

        <el-dialog :title="'移除设备'" :visible.sync="removeOpen" width="400px" append-to-body>
            <el-table :data="bindDeviceListFlat" style="width: 100%">
                <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width"></el-table-column>
                <el-table-column :label="'操作'" :width="120">
                    <template slot-scope="scope">
                        <el-popconfirm title="是否要移除此设备？" @confirm="unBindDevice(scope.row.devicesId)">
                            <el-button type="primary" size="small" slot="reference">移除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import lineCharts from '../../dashboard/LineChart.vue';
import player from '@/views/components/player/jessibuca.vue';
import { listDevices, getDevices, delDevices, addDevices, updateDevices, listDeviceShort, getFarmsDevice, unBoundDevicesList, addDevice, removeBarnDevices } from '@/api/iot/device';
import { chunkArray } from '@/utils/index.js';
import { getBarns } from '@/api/iot/barns';
import { getProductMOdelJson } from '@/api/iot/model';
import { PrefixZero, bytesToBitsArray } from '@/utils/index';

export default {
    data() {
        return {
            boxGutter: 20,
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            // 遮罩层
            deviceLoading: true,
            deviceForm: {},
            devicesList: [],
            unBindDeviceList: [],
            farmId: null,
            open: false,
            tableColumns: [{ prop: 'deviceName', label: '设备名称', width: '240' }],
            bindDeviceList: [],
            bindDeviceListFlat: [],
            removeOpen: false,
            baseUrl: '/prod-api',
            tempUrl: require('@/assets/sunseen/shackDetail/temp.png'),
            dayUrl: require('@/assets/sunseen/shackDetail/day.png'),
            humUrl: require('@/assets/sunseen/shackDetail/hum.png'),
            co2Url: require('@/assets/sunseen/shackDetail/co2.png'),
            nh3Url: require('@/assets/sunseen/shackDetail/nh3.png'),
            windSpeedUrl: require('@/assets/sunseen/shackDetail/windSpeed.png'),
            pressureUrl: require('@/assets/sunseen/shackDetail/pressure.png'),
            fanLevel: require('@/assets/sunseen/shackDetail/fanLevel.png'),
            tunnelVentilation: require('@/assets/sunseen/env/tunnelVentilation.png'),
            dataList: [],
            dataStatusList: [],
            dataJson: {},
            deviceData: {},
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
                DataHumidityAva01: '室内湿度',
                DataHumidityAva02: '室外湿度',
                Dataco2Sensor: '二氧化碳',
                DataCO2Sensor: '二氧化碳',
                DatanH3Sensor: '氨气',
                DataNH3Sensor: '氨气',
                DataDayLive: '日龄',
                DataTargetTemperature: '目标温度',
                DataCurrentWindLevel: '通风级别',
                DataWindSpeedSensor: '风速',
                DataPressureSensor: '负压',
                DataFrequencyConversion2: '变频2',
                DataFrequencyConversion1: '变频1',
            },
            DataDayLive: '',
            DataTargetTemperature: '',
            iconImages: {},
            deviceEnableIcon: {},
            getDeviceTypeJson: false,
            chartDataList: [],
            // 分页相关数据
            currentPage: 1,
            pageSize: 10,
            ecProductId: '',
        };
    },
    components: {
        lineCharts,
        player,
    },
    watch: {
        // 监听对话框打开状态，重置分页
        open(newVal) {
            if (newVal) {
                this.currentPage = 1;
                this.pageSize = 10;
                this.searchKeyword = ''; // 重置搜索关键词
                this.getUnBoundDevicesList();
            }
        },
    },
    created() {},
    computed: {
        // 计算属性：处理分页后的数据
        pagedUnBindDeviceList() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.unBindDeviceList.slice(start, end);
        },
    },
    mounted() {
        this.farmId = this.$route.query.id;
        this.getDeviceList();
        // 获取栏舍详情
        this.getBarnsDetailData();
        this.getFarmBindDeviceList();
        this.getUnBoundDevicesList();
    },
    methods: {
        getIcon() {
            // 获取到图标
            const imagesPath = require.context('../../../assets/sunseen/env/data', false, /\.png$/);
            console.log(imagesPath, ' this.deviceEnableIcon');

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
            // 基础数据
            let chartDataList = this.deviceData.filter((item) => {
                return item.isChart === 1;
            });
            console.log(chartDataList, 'chartDataList');
            chartDataList.forEach((item) => {
                item.name = this.nameFormat[item.id];
                if (item.id.includes('Temperature')) {
                    item.imgUrl = this.tempUrl;
                } else if (item.id.includes('Humidity')) {
                    item.imgUrl = this.humUrl;
                } else if (item.id.includes('Dataco2Sensor')) {
                    item.imgUrl = this.co2Url;
                } else if (item.id.includes('CO2')) {
                    item.imgUrl = this.co2Url;
                } else if (item.id.includes('DataWindSpeedSensor')) {
                    item.imgUrl = this.windSpeedUrl;
                } else if (item.id.includes('DataPressureSensor')) {
                    item.imgUrl = this.pressureUrl;
                } else if (item.id.includes('DataCurrentWindLevel')) {
                    item.imgUrl = this.fanLevel;
                } else if (item.id.includes('DataH3Sensor')) {
                    item.imgUrl = this.nh3Url;
                } else if (item.id.includes('NH3')) {
                    item.imgUrl = this.nh3Url;
                } else if (item.id.includes('DataFrequencyConversion')) {
                    item.imgUrl = this.tunnelVentilation;
                }
            });
            this.chartDataList = [...chartDataList].filter((item) => {
                return item.name;
            });

            // 设备开关数据 需要展示的是（风机开关、开度一，二、制冷、加热、光照....）以实际情况而定
            const enable = this.deviceData.find((item) => {
                return item.id === 'DataAllDeviceStatus';
            });

            this.DataDayLive = this.deviceData.find((item) => {
                return item.id === 'DataDayLive';
            }).value;
            this.DataTargetTemperature = this.deviceData.find((item) => {
                return item.id === 'DataTargetTemperature';
            }).value;

            let _item = [];

            if (this.ecProductId == 154) {
                //  ec12
                _item = PrefixZero(parseInt(enable.value).toString(2), 25).split('');
            } else {
                _item = PrefixZero(parseInt(enable.value).toString(2), 32).split('');
            }

            console.log(_item, ' _item');
            // 风机
            this.dataJson.data.enableMap.fans.forEach((item, idx) => {
                if (_item[item] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['fans'][idx] = this.iconImages['fan_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['fans'][idx] = this.iconImages['fan_gray'];
                }
            });
            // 加热
            this.dataJson.data.enableMap.hot.forEach((item, idx) => {
                if (_item[item] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['hot'][idx] = this.iconImages['fire_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['hot'][idx] = this.iconImages['fire_gray'];
                }
            });
            // 制冷
            this.dataJson.data.enableMap.cold.forEach((item, idx) => {
                if (_item[item] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['cold'][idx] = this.iconImages['cold_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['cold'][idx] = this.iconImages['cold_gray'];
                }
            });
            // 光照
            this.dataJson.data.enableMap.light.forEach((item, idx) => {
                if (_item[item] == '1') {
                    // 开启状态
                    this.deviceEnableIcon['light'][idx] = this.iconImages['light_active'];
                } else {
                    // 关闭状态
                    this.deviceEnableIcon['light'][idx] = this.iconImages['light_gray'];
                }
            });
        },
        getBarnsDetailData() {
            getBarns(this.farmId).then((res) => {
                this.deviceData = res.data.ecThingsModelJsonValue;
                this.ecProductId = res.data.ecProductId;
                this.dataJson = JSON.parse(res.data.ecThingsModelValue);
                if (this.dataJson) {
                    this.getIcon();
                    this.getEnvData();
                    this.getDeviceTypeJson = true;
                }
            });
        },
        getDeviceList() {
            listDeviceShort().then((response) => {
                this.devicesList = response.rows;
                this.total = response.total;
                console.log(this.devicesList, 'this.devicesList');
            });
        },
        getFarmBindDeviceList() {
            getFarmsDevice(this.farmId).then((res) => {
                this.bindDeviceList = chunkArray(res.data, 8);
                console.log(this.bindDeviceList, 'this.bindDeviceList');
                this.bindDeviceListFlat = res.data;
            });
        },
        getUnBoundDevicesList() {
            unBoundDevicesList({
                barnId: this.farmId,
            }).then((unBindRes) => {
                this.unBindDeviceList = unBindRes.rows;
                // 重置分页
                this.currentPage = 1;
                this.pageSize = 10;
                console.log(unBindRes, 'unBindRes');
            });
        },
        handleSearch() {
            // 搜索时重置到第一页
            this.currentPage = 1;
        },
        showUnBindDeviceList() {
            this.open = true;
        },
        showRemoveDeviceList() {
            this.removeOpen = true;
        },
        bindDeviceBarn(item) {
            const deviceId = item.deviceId;
            addDevice({
                devicesId: deviceId,
                barnId: this.farmId,
            }).then((res) => {
                console.log('res', res);
                this.getFarmBindDeviceList();
                this.open = false;
            });
        },
        unBindDevice(id) {
            removeBarnDevices({
                barnId: parseInt(this.farmId),
                devicesIds: [id],
            }).then((res) => {
                console.log(res, 'res');
                this.getFarmBindDeviceList();
            });
        },
        // 处理每页显示数量变化
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1; // 重置到第一页
        },

        // 处理页码变化
        handlePageChange(newPage) {
            this.currentPage = newPage;
        },

        // 处理当前选中行
        handleCurrentChange(currentRow) {
            console.log('当前选中行:', currentRow);
        },

        showDeviceItem(item) {
            if (item.status === 3) {
                this.$router.push({
                    path: '/iot/device-edit',
                    query: {
                        deviceId: item.devicesId,
                        isSubDev: 0,
                        pageNum: 1,
                        activeName: 'sipChannel',
                    },
                });
            } else {
                this.$router.push({
                    path: '/iot/device-edit',
                    query: {
                        deviceId: item.devicesId,
                        isSubDev: 0,
                        pageNum: 1,
                        activeName: 'runningStatus',
                    },
                });
            }
        },
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

$bg-color: #0d1827;
::v-deep .el-button--mini.is-circle {
    padding: 3px;
}
.box {
    background-color: #000000;
    margin-left: 10px;
}

.gutter-box1 {
    /* 第一层组件的设置 */
    padding: 10px 16px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    margin-top: 20px;
    border-radius: 10px;
    height: 66px;
    align-items: center;
    line-height: 45px;
}

.gutter-box5 {
    /* 第二层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
    height: 295px;
}
.gutter-box2 {
    /* 第二层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
    height: 180px;
    margin-right: 20px;
    .env-data {
        margin-top: 15px;
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        width: 150px;
        height: 103px;
        background: #07111e;
        border-radius: 9px 9px 9px 9px;
        border: 1px solid #1b2a40;
        padding: 14px 18px;
        .env-data-title {
            margin-top: 7px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
        }
        .env-data-data {
            margin-top: 7px;
            font-family: PingFang SC, PingFang SC;
            font-weight: bold;
            font-size: 20px;
            color: #00eeff;
        }
    }
}
.env-device {
    margin-top: 15px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 128px;
    height: 180px;
    background: #07111e;
    border-radius: 9px 9px 9px 9px;
    border: 1px solid #1b2a40;
    padding: 14px 8px;
}
.gutter-box3 {
    /* 第三层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
    height: 297px;
    .env-data-status {
        margin-top: 15px;
        height: 230px;
        width: 100%;
        background: #07111e;
        border-radius: 10px 10px 10px 10px;
        display: flex;
        flex-wrap: wrap;
        .env-data-status-item {
            height: 60px;
            width: 75px;
            margin-left: 15px;
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            justify-items: center;
            align-items: center;
            .env-data-status-item-title {
                margin-bottom: 8px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #ffffff;
            }
        }
    }
    .video-item-active {
        width: 100px;
        height: 23px;
        text-align: center;
        line-height: 23px;
        background: #2f70ec;
        border-radius: 3px 3px 3px 3px;
        border: 1px solid #2f70ec;
        margin-bottom: 10px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #ffffff;
    }
    .video-item {
        margin-bottom: 10px;
        width: 100px;
        text-align: center;
        line-height: 23px;
        height: 23px;
        background: #182333;
        border-radius: 30px 30px 30px 30px;
        border: 1px solid #3a5070;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #3a5070;
    }
}

.gutter-box4 {
    /* 第四层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
    height: 297px;
    .env-data-line-item-active {
        background: #2f70ec;
        border-radius: 3px 3px 3px 3px;
        text-align: center;
        height: 23px;
        margin-bottom: 10px;
        margin-top: 10px;
        line-height: 23px;
        color: #fff;
        cursor: pointer;
    }
    .env-data-line-item {
        cursor: pointer;

        background: #182333;
        border-radius: 3px 3px 3px 3px;
        border: 1px solid #3a5070;
        color: #a8aec9;
        text-align: center;
        height: 23px;
        margin-bottom: 10px;
        margin-top: 10px;
        line-height: 23px;
    }
}

.content-card-img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    background-image: url('../../../assets/sunseen/shackDetail/content-card-img.png');
    background-size: contain;
}

.content-card-line {
    padding-left: 30px;

    .bottom-line1 {
        margin-top: 5px;
        width: 62px;
        height: 3px;
        background: #4177ab;
    }

    .bottom-line2 {
        width: 100%;
        height: 2px;
        background-color: #1f3950;
    }
}
::v-deep .el-carousel--horizontal {
    width: 100%;
}

::-webkit-scrollbar {
    height: 8px; /* 横向滚动条的高度 */
}

::-webkit-scrollbar-track {
    background: #0d1827; /* 滚动条轨道的背景色 */
}

::-webkit-scrollbar-thumb {
    background: #2f70ec; /* 滚动条的颜色 */
    border-radius: 4px; /* 滚动条的圆角 */
}

::-webkit-scrollbar-thumb:hover {
    background: #4177ab; /* 鼠标悬停时滚动条的颜色 */
}
</style>
