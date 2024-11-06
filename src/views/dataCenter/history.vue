<template>
    <div class="data-center-history-wrap">
        <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('dataCenter.history.384934-0')" name="device">
                <div class="device-wrap">
                    <el-form :model="devQueryParams" ref="devQueryForm" size="small" :inline="true" label-width="68px">
                        <el-form-item :label="$t('dataCenter.history.384934-1')" prop="deviceId">
                            <el-select style="width: 200px" v-model="devQueryParams.deviceId" :placeholder="$t('dataCenter.history.384934-2')" filterable @change="handleDevDeviceChange">
                                <el-option v-for="(item, index) in devDeviceList" :key="index" :label="item.deviceName" :value="item.deviceId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('dataCenter.history.384934-3')" prop="identifiers">
                            <el-select style="width: 200px" v-model="devQueryParams.identifiers" :placeholder="$t('dataCenter.history.384934-4')" filterable multiple collapse-tags>
                                <el-option v-for="(item, index) in devIdentifierList" :key="index" :label="item.modelName" :value="item.identifier"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('dataCenter.history.384934-5')" prop="dayDaterange">
                            <el-date-picker
                                style="width: 340px"
                                v-model="devQueryParams.dayDaterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetimerange"
                                range-separator="-"
                                :start-placeholder="$t('dataCenter.history.384934-6')"
                                :end-placeholder="$t('dataCenter.history.384934-7')"
                                :picker-options="pickerOptions"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDevQuery">{{ $t('dataCenter.history.384934-8') }}</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="handleDevResetQuery">{{ $t('dataCenter.history.384934-9') }}</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row>
                        <el-col :span="24" style="margin-bottom: 15px">
                            <el-card v-loading="loading" shadow="never">
                                <div slot="header">
                                    <span>{{ $t('dataCenter.history.384934-10') }}</span>
                                    <span style="margin-left: 10px; color: #f56c6c; font-size: 12px">{{ $t('dataCenter.history.384934-11') }}</span>
                                </div>
                                <div class="el-table--enable-row-hover el-table--medium">
                                    <div v-show="devDatas.length !== 0" ref="devLineChart" style="width: 100%; height: 480px; background: #fff"></div>
                                    <el-empty v-if="devDatas.length === 0" style="height: 480px" :description="$t('dataCenter.history.384934-12')"></el-empty>
                                    <el-table v-show="devTotal > 0" style="margin-top: 50px" :data="devTableList" :border="false">
                                        <el-table-column :label="$t('dataCenter.history.384934-13')" prop="time" width="200" />
                                        <el-table-column v-for="item in this.devTableHeaderTemp" :key="item.value" :label="item.name" :prop="item.value" />
                                    </el-table>
                                    <pagination v-show="devTotal > 0" :autoScroll="false" :total="devTotal" :page.sync="devPageNum" :limit.sync="devPageSize" @pagination="getDevTableList" />
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('dataCenter.history.384934-14')" name="scene">
                <div class="scene-wrap">
                    <el-form :model="sceneQueryParams" ref="sceneQueryForm" size="small" :inline="true" label-width="68px">
                        <el-form-item :label="$t('dataCenter.history.384934-15')" prop="sceneModelId">
                            <el-select style="width: 200px" v-model="sceneQueryParams.sceneModelId" :placeholder="$t('dataCenter.history.384934-16')" @change="handleSceneModelChange">
                                <el-option v-for="(item, index) in sceneModelList" :key="index" :label="item.sceneModelName" :value="item.sceneModelId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('dataCenter.history.384934-17')" prop="sceneModelDeviceId">
                            <el-select style="width: 200px" v-model="sceneQueryParams.sceneModelDeviceId" :placeholder="$t('dataCenter.history.384934-18')" @change="handleSceneDeviceChange">
                                <el-option v-for="(item, index) in sceneDeviceList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('dataCenter.history.384934-3')" prop="identifiers">
                            <el-select style="width: 200px" v-model="sceneQueryParams.identifiers" :placeholder="$t('dataCenter.history.384934-4')" multiple collapse-tags>
                                <el-option v-for="(item, index) in sceneIdentifierList" :key="index" :label="item.sourceName" :value="item.identifier"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('dataCenter.history.384934-5')" prop="dayDaterange">
                            <el-date-picker
                                style="width: 340px"
                                v-model="sceneQueryParams.dayDaterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetimerange"
                                range-separator="-"
                                :start-placeholder="$t('dataCenter.history.384934-6')"
                                :end-placeholder="$t('dataCenter.history.384934-7')"
                                :picker-options="pickerOptions"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSceneQuery">{{ $t('dataCenter.history.384934-8') }}</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="handleSceneResetQuery">{{ $t('dataCenter.history.384934-9') }}</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row>
                        <el-col :span="24" style="margin-bottom: 15px">
                            <el-card v-loading="loading" shadow="never">
                                <div slot="header">
                                    <span>{{ $t('dataCenter.history.384934-10') }}</span>
                                    <span style="margin-left: 10px; color: #f56c6c; font-size: 12px">{{ $t('dataCenter.history.384934-11') }}</span>
                                </div>
                                <div class="el-table--enable-row-hover el-table--medium">
                                    <div v-show="sceneDatas.length !== 0" ref="sceneLineChart" style="width: 100%; height: 480px; background: #fff"></div>
                                    <el-empty v-if="sceneDatas.length === 0" style="height: 480px" :description="$t('dataCenter.history.384934-12')"></el-empty>
                                    <el-table v-show="sceneTotal > 0" style="margin-top: 50px" :data="sceneTableList" :border="false">
                                        <el-table-column :label="$t('dataCenter.history.384934-13')" prop="time" width="200" />
                                        <el-table-column v-for="item in this.sceneTableHeaderTemp" :key="item.value" :label="item.name" :prop="item.value" />
                                    </el-table>
                                    <pagination v-show="sceneTotal > 0" :autoScroll="false" :total="sceneTotal" :page.sync="scenePageNum" :limit.sync="scenePageSize" @pagination="getSceneTableList" />
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import moment from 'moment';
import { listDeviceShort, listThingsModel } from '@/api/iot/device.js';
import { getSceneModelList, getSceneModelDetail, getSceneModelDataList } from '@/api/scene/list.js';
import { getDataCenterDeviceHistory, getDataCenterSceneHistory } from '@/api/data/center.js';

export default {
    name: 'dataCenterHistory',
    data() {
        return {
            activeTab: 'device',
            devDeviceList: [], // 设备-设备列表
            devIdentifierList: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: this.$t('dataCenter.history.384934-19'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 2);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('dataCenter.history.384934-20'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('dataCenter.history.384934-21'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('dataCenter.history.384934-22'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ],
            },
            // 查询参数
            devQueryParams: {
                deviceId: null,
                identifiers: [],
                dayDaterange: [new Date(new Date().getTime() - 3600 * 1000 * 2), new Date()],
            },
            loading: false,
            devDatas: [], // 设备列表数据
            devTableComTemp: [], // 设备列表table数据
            devTableHeaderTemp: [], // 设备列表table数据
            devPageNum: 1,
            devPageSize: 10,
            devTotal: 0,
            sceneModelList: [], // 场景列表
            sceneDeviceList: [],
            sceneIdentifierList: [], // 场景变量
            sceneQueryParams: {
                sceneModelId: null,
                sceneModelDeviceId: null,
                identifiers: [],
                dayDaterange: [new Date(new Date().getTime() - 3600 * 1000 * 2), new Date()],
            },
            sceneDatas: [], // 场景列表数据
            sceneTableComTemp: [], // 设备列表table数据
            sceneTableHeaderTemp: [], // 设备列表table数据
            scenePageNum: 1,
            scenePageSize: 10,
            sceneTotal: 0,
        };
    },
    mounted() {
        this.getDevDeviceList();
        this.getSceneModelListDatas();
        const { activeName, deviceId, identifier, sceneModelId, sceneModelDeviceId } = this.$route.query;
        if (activeName) {
            this.activeTab = activeName || 'device';
            // 设置默认值
            if (activeName === 'device') {
                this.devQueryParams.deviceId = Number(deviceId);
                this.getDevIdentifierList(Number(deviceId));
                this.devQueryParams.identifiers = [identifier];
                setTimeout(() => {
                    this.handleDevQuery();
                }, 500);
            } else {
                this.sceneQueryParams.sceneModelId = Number(sceneModelId);
                this.getSceneModelDetailDatas(Number(sceneModelId));
                this.sceneQueryParams.sceneModelDeviceId = Number(sceneModelDeviceId);
                this.getSceneIdentifierList(Number(sceneModelDeviceId));
                this.sceneQueryParams.identifiers = [identifier];
                setTimeout(() => {
                    this.handleSceneQuery();
                }, 500);
            }
        }
    },
    computed: {
        devTableList() {
            const start = (this.devPageNum - 1) * this.devPageSize;
            const end = start + this.devPageSize;
            return this.devTableComTemp.slice(start, end);
        },
        sceneTableList() {
            const start = (this.scenePageNum - 1) * this.scenePageSize;
            const end = start + this.scenePageSize;
            return this.sceneTableComTemp.slice(start, end);
        },
    },
    methods: {
        // 获取设备列表
        getDevDeviceList() {
            const params = {
                showChild: true,
                pageNum: 1,
                pageSize: 9999,
            };
            listDeviceShort(params).then((res) => {
                if (res.code === 200) {
                    this.devDeviceList = res.rows;
                }
            });
        },
        // 选择设备后
        handleDevDeviceChange(val) {
            this.devQueryParams.identifiers = [];
            this.getDevIdentifierList(val);
        },
        getDevIdentifierList(deviceId) {
            const params = {
                deviceId: deviceId,
                pageNum: 1,
                pageSize: 9999,
            };
            listThingsModel(params).then((res) => {
                if (res.code === 200) {
                    this.devIdentifierList = res.rows;
                }
            });
        },
        // 获取设备图形数据
        getDevChartDatas() {
            this.loading = true;
            const devices = this.devDeviceList.find((item) => item.deviceId === this.devQueryParams.deviceId);
            const identifierList = this.devQueryParams.identifiers.map((item) => {
                const identifiers = this.devIdentifierList.find((chil) => chil.identifier === item);
                return { identifier: identifiers.identifier, type: identifiers.type };
            });
            const params = {
                deviceId: devices.deviceId,
                serialNumber: devices.serialNumber,
                identifierList: identifierList,
                beginTime: moment(this.devQueryParams.dayDaterange[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(this.devQueryParams.dayDaterange[1]).format('YYYY-MM-DD HH:mm:ss'),
            };
            getDataCenterDeviceHistory(params).then((res) => {
                if (res.code === 200) {
                    this.devDatas = res.data;
                    this.formatDevTableDatas();
                    if (this.devDatas.length !== 0) {
                        setTimeout(() => {
                            this.drawDevLine();
                        }, 500);
                    }
                }
                this.loading = false;
            });
        },
        // 搜索按钮操作
        handleDevQuery() {
            const isField = this.areAllFields(this.devQueryParams);
            if (isField) {
                this.getDevChartDatas();
            }
        },
        // 重置按钮操作
        handleDevResetQuery() {
            this.resetForm('devQueryForm');
            this.devQueryParams.identifiers = [];
            this.devDatas = [];
            this.devTableComTemp = [];
            this.devTotal = 0;
            this.handleDevQuery();
        },
        // 获取设备列表数据
        getDevTableList(e) {
            this.devPageNum = e.page;
            this.devPageSize = e.limit;
        },
        // 获取场景列表
        getSceneModelListDatas() {
            const params = {
                pageNum: 1,
                pageSize: 9999,
            };
            getSceneModelList(params).then((res) => {
                if (res.code === 200) {
                    this.sceneModelList = res.rows;
                }
            });
        },
        // 场景选择后
        handleSceneModelChange(val) {
            this.sceneQueryParams.sceneModelDeviceId = null;
            this.sceneQueryParams.identifiers = [];
            this.getSceneModelDetailDatas(val);
        },
        getSceneModelDetailDatas(sceneModelId) {
            getSceneModelDetail(sceneModelId).then((res) => {
                if (res.code === 200) {
                    this.sceneDeviceList = res.data.sceneModelDeviceList;
                }
            });
        },
        // 场景-设备选择后
        handleSceneDeviceChange(val) {
            this.sceneQueryParams.identifiers = [];
            this.getSceneIdentifierList(val);
        },
        // 获取变量情况列表
        getSceneIdentifierList(sceneModelDeviceId) {
            const params = {
                sceneModelId: this.sceneQueryParams.sceneModelId,
                sceneModelDeviceId: sceneModelDeviceId,
                pageNum: 1,
                pageSize: 9999,
            };
            getSceneModelDataList(params).then((res) => {
                if (res.code === 200) {
                    this.sceneIdentifierList = res.rows;
                }
            });
        },
        // 获取设备图形数据
        getSceneChartDatas() {
            this.loading = true;
            const variableType = this.sceneDeviceList.find((item) => item.id === this.sceneQueryParams.sceneModelDeviceId).variableType;
            const ids = this.sceneQueryParams.identifiers.map((item) => this.sceneIdentifierList.find((chil) => chil.identifier === item).id).join(',');
            const params = {
                sceneModelId: this.sceneQueryParams.sceneModelId,
                sceneModelDeviceId: this.sceneQueryParams.sceneModelDeviceId,
                variableType: variableType,
                ids: ids,
                beginTime: moment(this.sceneQueryParams.dayDaterange[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(this.sceneQueryParams.dayDaterange[1]).format('YYYY-MM-DD HH:mm:ss'),
            };
            getDataCenterSceneHistory(params).then((res) => {
                if (res.code === 200) {
                    this.sceneDatas = res.data;
                    this.formatSceneTableDatas();
                    if (this.sceneDatas.length !== 0) {
                        setTimeout(() => {
                            this.drawSceneLine();
                        }, 500);
                    }
                }
                this.loading = false;
            });
        },
        // 搜索按钮操作
        handleSceneQuery() {
            const isField = this.areAllFields(this.sceneQueryParams);
            if (isField) {
                this.getSceneChartDatas();
            }
        },
        // 重置按钮操作
        handleSceneResetQuery() {
            this.resetForm('sceneQueryForm');
            this.sceneQueryParams.identifiers = [];
            this.sceneDatas = [];
            this.sceneTableComTemp = [];
            this.sceneTotal = 0;
            this.handleSceneQuery();
        },
        // 获取场景列表数据
        getSceneTableList(e) {
            this.scenePageNum = e.page;
            this.scenePageSize = e.limit;
        },
        // 判断对象是否都有值
        areAllFields(obj) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (!obj[key] || obj[key] === '' || obj[key].length === 0) {
                        return false;
                    }
                }
            }
            return true;
        },
        drawDevLine() {
            // 初始化折线图
            this.charts = this.$echarts.init(this.$refs.devLineChart);
            this.charts.clear();
            // 设置折线图数据和样式
            this.charts.setOption({
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    align: 'right',
                    left: '3%',
                    top: '15%',
                },
                grid: {
                    top: '30%',
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true,
                },
                toolbox: {
                    feature: {
                        dataView: {},
                        restore: {},
                        saveAsImage: {},
                    },
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 100,
                    },
                    {
                        start: 0,
                        end: 100,
                    },
                ],
                // 自定义：设置x轴刻度
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    // 自定义标签
                    data: this.devDatas.length !== 0 && this.devDatas.map((item) => Object.keys(item)[0]),
                },
                // 自定义：设置y轴刻度
                yAxis: {
                    type: 'value',
                    scale: true, //自适应
                },
                // 设置数据
                series: this.getDevSeries(),
            });
        },
        // 获取设备的series
        getDevSeries() {
            return this.devQueryParams.identifiers.map((item) => {
                return {
                    name: this.devIdentifierList.find((chil) => chil.identifier === item).modelName,
                    type: 'line',
                    stack: this.$t('dataCenter.history.384934-23'),
                    data: this.devDatas.map((d) => {
                        const ide = Object.values(d)[0].find((f) => Object.keys(f)[0] === item);
                        return Object.values(ide)[0];
                    }),
                };
            });
        },
        // 格式化设备列表数据
        formatDevTableDatas() {
            this.devTableComTemp = this.devDatas.map((item) => {
                const time = Object.keys(item)[0];
                let obj = {};
                Object.values(item)[0].forEach((chil) => {
                    obj[Object.keys(chil)[0]] = Object.values(chil)[0];
                });
                return { time, ...obj };
            });
            this.devTotal = this.devDatas.length;
            this.devTableHeaderTemp = this.devQueryParams.identifiers.map((item) => ({
                name: this.devIdentifierList.find((chil) => chil.identifier === item).modelName,
                value: item,
            }));
        },
        drawSceneLine() {
            // 初始化折线图
            this.charts = this.$echarts.init(this.$refs.sceneLineChart);
            this.charts.clear();
            // 设置折线图数据和样式
            this.charts.setOption({
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    align: 'right',
                    left: '3%',
                    top: '15%',
                },
                grid: {
                    top: '30%',
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true,
                },
                toolbox: {
                    feature: {
                        dataView: {},
                        restore: {},
                        saveAsImage: {},
                    },
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 100,
                    },
                    {
                        start: 0,
                        end: 100,
                    },
                ],
                // 自定义：设置x轴刻度
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    // 自定义标签
                    data: this.sceneDatas.length !== 0 && this.sceneDatas.map((item) => Object.keys(item)[0]),
                },
                // 自定义：设置y轴刻度
                yAxis: {
                    type: 'value',
                    boundaryGap: true,
                    splitNumber: 4,
                    interval: 250,
                },
                // 设置数据
                series: this.getSceneSeries(),
            });
        },
        // 获取设备的series
        getSceneSeries() {
            return this.sceneQueryParams.identifiers.map((item) => {
                return {
                    name: this.sceneIdentifierList.find((chil) => chil.identifier === item).sourceName,
                    type: 'line',
                    stack: this.$t('dataCenter.history.384934-23'),
                    data: this.sceneDatas.map((d) => {
                        const ide = Object.values(d)[0].find((f) => Object.keys(f)[0] === item);
                        return Object.values(ide)[0];
                    }),
                };
            });
        },
        // 格式化设备列表数据
        formatSceneTableDatas() {
            this.sceneTableComTemp = this.sceneDatas.map((item) => {
                const time = Object.keys(item)[0];
                let obj = {};
                Object.values(item)[0].forEach((chil) => {
                    obj[Object.keys(chil)[0]] = Object.values(chil)[0];
                });
                return { time, ...obj };
            });
            this.sceneTotal = this.sceneDatas.length;
            this.sceneTableHeaderTemp = this.sceneQueryParams.identifiers.map((item) => ({
                name: this.sceneIdentifierList.find((chil) => chil.identifier === item).sourceName,
                value: item,
            }));
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.data-center-history-wrap {
    padding: 20px;

    .device-wrap {
        margin-top: 5px;
    }

    .scene-wrap {
        margin-top: 5px;
    }
}
</style>
