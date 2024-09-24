<template>
    <div class="data-center-analysis-wrap">
        <div class="search-box">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
                <el-form-item :label="$t('dataCenter.analysis.349202-0')" prop="deviceId">
                    <el-select v-model="queryParams.deviceId" :placeholder="$t('dataCenter.analysis.349202-1')" filterable @change="handleDevDeviceChange">
                        <el-option v-for="(item, index) in deviceList" :key="index" :label="item.deviceName" :value="item.deviceId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('dataCenter.analysis.349202-2')" prop="dayDaterange">
                    <el-date-picker
                        style="width: 340px"
                        v-model="queryParams.dayDaterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        :start-placeholder="$t('dataCenter.analysis.349202-4')"
                        :end-placeholder="$t('dataCenter.analysis.349202-5')"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('dataCenter.analysis.349202-5') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">{{ $t('dataCenter.analysis.349202-6') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row v-loading="loading">
            <el-col :span="16" class="card-box">
                <el-card shadow="never" style="margin-right: 10px">
                    <div v-show="deviceLineList.length !== 0" ref="deviceLineChart" style="width: 100%; height: 400px"></div>
                    <el-empty v-if="deviceLineList.length === 0" style="height: 400px" :description="$t('dataCenter.analysis.349202-7')"></el-empty>
                </el-card>
            </el-col>

            <el-col :span="8" class="card-box">
                <el-card shadow="never" style="margin-left: 10px">
                    <div v-show="alertProcessList.length !== 0" ref="alertProcessPieChart" style="width: 100%; height: 400px"></div>
                    <el-empty v-if="alertProcessList.length === 0" style="height: 400px" :description="$t('dataCenter.analysis.349202-7')"></el-empty>
                </el-card>
            </el-col>

            <el-col :span="8" class="card-box">
                <el-card shadow="never" style="margin-right: 10px; margin-top: 10px">
                    <div v-show="deviceBarList.length !== 0" ref="deviceBarChart" style="width: 100%; height: 480px"></div>
                    <el-empty v-if="deviceBarList.length === 0" style="height: 480px" :description="$t('dataCenter.analysis.349202-7')"></el-empty>
                </el-card>
            </el-col>

            <el-col :span="8" class="card-box">
                <el-card shadow="never" style="margin: 10px 10px 0 10px">
                    <dv-scroll-board v-show="realTimeConfig.data && realTimeConfig.data.length !== 0" class="scroll-board-wrap" :config="realTimeConfig" style="width: 100%; height: 480px" />
                    <el-empty v-if="!realTimeConfig.data || realTimeConfig.data.length === 0" style="height: 480px" :description="$t('dataCenter.analysis.349202-7')"></el-empty>
                </el-card>
            </el-col>

            <el-col :span="8" class="card-box">
                <el-card shadow="never" style="margin: 10px 0 0 10px">
                    <dv-scroll-board v-show="alertInfoConfig.data && alertInfoConfig.data.length !== 0" class="scroll-board-wrap" :config="alertInfoConfig" style="width: 100%; height: 265px; margin-bottom: 15px" />
                    <el-empty v-if="!alertInfoConfig.data || alertInfoConfig.data.length === 0" style="height: 265px; margin-bottom: 15px" :image-size="120" :description="$t('dataCenter.analysis.349202-7')"></el-empty>
                    <div v-show="alertLevelPieList.length !== 0" ref="alertPieChart" style="width: 100%; height: 200px"></div>
                    <el-empty v-if="alertLevelPieList.length === 0" style="height: 200px" :image-size="120" :description="$t('dataCenter.analysis.349202-7')"></el-empty>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import moment from 'moment';
import { listDeviceShort, listThingsModel } from '@/api/iot/device.js';
import { getDataCenterDeviceHistory, getDataCenterCountAlertProcess, getDataCenterCountAlertLevel, getDataCenterCountThingsModelInvoke } from '@/api/data/center.js';
import { listAlertLog } from '@/api/iot/alertLog';

export default {
    name: 'dataCenterAnalysis',
    dicts: ['iot_process_status', 'iot_alert_level'],
    data() {
        return {
            loading: false,
            loadingCount: 0,
            deviceList: [],
            identifierList: [], // 属性列表
            pickerOptions: {
                shortcuts: [
                    {
                        text: this.$t('dataCenter.analysis.349202-8'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 200 * 2);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('dataCenter.analysis.349202-9'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 200 * 24);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('dataCenter.analysis.349202-10'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 200 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: this.$t('dataCenter.analysis.349202-11'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 200 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ],
            },
            // 查询参数
            queryParams: {
                deviceId: null,
                dayDaterange: [new Date(new Date().getTime() - 3600 * 200 * 2), new Date()],
            },
            deviceLineList: [], // 设备折线图数据
            alertProcessList: [], // 信息饼图数据列表
            deviceBarList: [], // 设备柱状数据列表
            realTimeConfig: {}, // 实时数据
            alertInfoConfig: {},
            alertLevelPieList: [], // 告警饼图数据列表
        };
    },
    mounted() {
        this.getDeviceList();
    },
    methods: {
        // 获取设备列表
        getDeviceList() {
            const params = {
                showChild: true,
                pageNum: 1,
                pageSize: 9999,
            };
            listDeviceShort(params).then((res) => {
                if (res.code === 200) {
                    this.deviceList = res.rows;
                }
            });
        },
        // 选择设备后
        handleDevDeviceChange(val) {
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
                    this.identifierList = res.rows;
                }
            });
        },
        // 查询设备的历史数据
        getDevChartDatas() {
            const devices = this.deviceList.find((item) => item.deviceId === this.queryParams.deviceId);
            if (!devices) {
                return;
            }
            this.myLoading();
            const params = {
                deviceId: devices.deviceId,
                serialNumber: devices.serialNumber,
                beginTime: moment(this.queryParams.dayDaterange[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(this.queryParams.dayDaterange[1]).format('YYYY-MM-DD HH:mm:ss'),
            };
            getDataCenterDeviceHistory(params).then((res) => {
                if (res.code === 200) {
                    this.deviceLineList = res.data;
                    if (this.deviceLineList.length !== 0) {
                        setTimeout(() => {
                            this.drawDevLineChart();
                        }, 200);
                    }
                }
                this.myLoadingClose();
            });
        },
        // 折线图
        drawDevLineChart() {
            this.deviceLineChart = this.$echarts.init(this.$refs.deviceLineChart);
            this.deviceLineChart.clear();
            // 设置折线图数据和样式
            this.deviceLineChart.setOption({
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    align: 'right',
                    left: '3%',
                    top: '6%',
                },
                grid: {
                    top: '20%',
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true,
                },
                // 自定义：设置x轴刻度
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisTick: {
                        alignWithLabel: true,
                    },
                    // 自定义标签
                    data: this.deviceLineList.length !== 0 && this.deviceLineList.map((item) => Object.keys(item)[0]),
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
            if (this.deviceLineList && this.deviceLineList.length !== 0) {
                const identifiers = Object.values(this.deviceLineList[0])[0].map((item) => Object.keys(item)[0]) || [];
                return identifiers.map((item) => {
                    return {
                        name: this.identifierList.find((chil) => chil.identifier === item).modelName,
                        type: 'line',
                        stack: this.$t('dataCenter.analysis.349202-12'),
                        data: this.deviceLineList.map((d) => {
                            const ide = Object.values(d)[0].find((f) => Object.keys(f)[0] === item);
                            return Object.values(ide)[0];
                        }),
                    };
                });
            }
        },
        // 查询统计告警信息处理
        getCountAlertProcess() {
            const devices = this.deviceList.find((item) => item.deviceId === this.queryParams.deviceId);
            if (!devices) {
                return;
            }
            this.myLoading();
            const params = {
                serialNumber: devices.serialNumber,
                beginTime: moment(this.queryParams.dayDaterange[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(this.queryParams.dayDaterange[1]).format('YYYY-MM-DD HH:mm:ss'),
            };
            getDataCenterCountAlertProcess(params).then((res) => {
                if (res.code === 200) {
                    this.alertProcessList = res.data;
                    if (this.alertProcessList.length !== 0) {
                        setTimeout(() => {
                            this.drawAlertProcessPieChart();
                        }, 200);
                    }
                }
                this.myLoadingClose();
            });
        },
        // 饼图
        drawAlertProcessPieChart() {
            this.alertProcessPieChart = this.$echarts.init(this.$refs.alertProcessPieChart);
            this.alertProcessPieChart.clear();
            this.alertProcessPieChart.setOption({
                title: {
                    text: this.$t('dataCenter.analysis.349202-13'),
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    show: true,
                    x: 'center',
                    y: 'bottom',
                    padding: [0, 0, 12, 0],
                },
                color: ['#5470C6', '#91CC75', '#73C0DE', '#FAC858', '#EE6666'],
                series: [
                    {
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '49%'],
                        labelLine: {
                            show: true,
                            smooth: true, // 设置平滑曲线
                            length: 10, // 设置牵引线长度
                            length2: 10,
                        },
                        label: {
                            // 设置标签显示信息和格式
                            show: true,
                            position: 'outer',
                            fontSize: 11,
                            color: '#1d1d1d',
                            formatter: function (params) {
                                return `${params.name}：${params.value}个\n占：${params.percent}%`;
                            },
                        },
                        data: this.getAlertPieProcessData(),
                    },
                ],
            });
        },
        getAlertPieProcessData() {
            if (this.alertProcessList && this.alertProcessList.length !== 0) {
                return this.alertProcessList.map((item) => {
                    return {
                        name: this.dict.type.iot_process_status.find((chil) => chil.value === String(item.type)).label,
                        value: item.count,
                    };
                });
            }
        },
        // 获取设备物模型指令下发数量
        getThingsModelInvoke() {
            const devices = this.deviceList.find((item) => item.deviceId === this.queryParams.deviceId);
            if (!devices) {
                return;
            }
            this.myLoading();
            const params = {
                serialNumber: devices.serialNumber,
                beginTime: moment(this.queryParams.dayDaterange[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(this.queryParams.dayDaterange[1]).format('YYYY-MM-DD HH:mm:ss'),
            };
            getDataCenterCountThingsModelInvoke(params).then((res) => {
                if (res.code === 200) {
                    this.deviceBarList = res.data;
                    if (this.deviceBarList.length !== 0) {
                        setTimeout(() => {
                            this.drawDeviceBarChart();
                        }, 200);
                    }
                }
                this.myLoadingClose();
            });
        },
        // 柱状图
        drawDeviceBarChart() {
            this.deviceBarChart = this.$echarts.init(this.$refs.deviceBarChart);
            this.deviceBarChart.clear();
            this.deviceBarChart.setOption({
                title: {
                    text: this.$t('dataCenter.analysis.349202-14'),
                    left: 'center',
                },
                color: ['#1890FF'],
                textStyle: {
                    fontSize: 12,
                    fontStyle: 'normal',
                },
                grid: {
                    top: '10%',
                    left: '1%',
                    right: '6%',
                    bottom: '5%',
                    containLabel: true,
                    borderWidth: 0,
                },
                xAxis: {
                    type: 'value',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#fefef',
                        },
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        formatter: function (val) {
                            return `${val}次`;
                        },
                    },
                },
                yAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#fefef',
                        },
                    },
                    type: 'category',
                    data: this.deviceBarList.length !== 0 && this.deviceBarList.map((item) => item.modelName),
                },
                series: [
                    {
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'right',
                                },
                            },
                            backgroundStyle: {
                                color: '#EBEEF5',
                            },
                        },
                        data: this.deviceBarList.length !== 0 && this.deviceBarList.map((item) => item.count),
                        type: 'bar',
                        barWidth: 30, //柱图宽度
                    },
                ],
            });
        },
        // 查询告警信息
        getDataRealTimeUpload() {
            if (!this.queryParams.deviceId) {
                return;
            }
            this.myLoading();
            const params = {
                deviceId: this.queryParams.deviceId,
                pageNum: 1,
                pageSize: 9999,
            };
            listThingsModel(params).then((res) => {
                if (res.code === 200) {
                    const header = [this.$t('dataCenter.analysis.349202-15'), this.$t('dataCenter.analysis.349202-16'), this.$t('dataCenter.analysis.349202-17')];
                    let data = [];
                    if (res.rows && res.rows.length !== 0) {
                        data = res.rows.map((item) => {
                            return [item.modelName, item.value, item.ts];
                        });
                    }
                    this.realTimeConfig = {
                        rowNum: 10,
                        columnWidth: [100, 80, 190],
                        header: header,
                        data: data,
                    };
                }
                this.myLoadingClose();
            });
        },
        // 查询告警信息
        getAlertInfo() {
            const devices = this.deviceList.find((item) => item.deviceId === this.queryParams.deviceId);
            if (!devices) {
                return;
            }
            this.myLoading();
            const params = {
                serialNumber: devices.serialNumber,
                pageNum: 1,
                pageSize: 9999,
            };
            listAlertLog(params).then((res) => {
                const header = [this.$t('dataCenter.analysis.349202-18'), this.$t('dataCenter.analysis.349202-19'), this.$t('dataCenter.analysis.349202-20')];
                let data = [];
                if (res.rows && res.rows.length !== 0) {
                    data = res.rows.map((item) => {
                        return [item.alertName, this.dict.type.iot_alert_level.find((chil) => chil.value === String(item.alertLevel)).label, item.createTime];
                    });
                }
                this.alertInfoConfig = {
                    rowNum: 5,
                    columnWidth: [90, 90, 180],
                    header: header,
                    data: data,
                };
                this.myLoadingClose();
            });
        },
        // 查询统计告警信息级别
        getCountAlertLevel() {
            const devices = this.deviceList.find((item) => item.deviceId === this.queryParams.deviceId);
            if (!devices) {
                return;
            }
            this.myLoading();
            const params = {
                serialNumber: devices.serialNumber,
            };
            getDataCenterCountAlertLevel(params).then((res) => {
                if (res.code === 200) {
                    this.alertLevelPieList = res.data;
                    if (this.alertLevelPieList.length !== 0) {
                        setTimeout(() => {
                            this.drawAlertLevelPieChart();
                        }, 200);
                    }
                }
                this.myLoadingClose();
            });
        },
        // 告警饼图
        drawAlertLevelPieChart() {
            this.alertPieChart = this.$echarts.init(this.$refs.alertPieChart);
            this.alertPieChart.clear();
            this.alertPieChart.setOption({
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    show: true,
                    x: 'center',
                    y: 'bottom',
                    padding: [14, 0, 0, 0],
                },
                color: ['#5470C6', '#91CC75', '#73C0DE', '#FAC858', '#EE6666'],
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '44%'],
                        labelLine: {
                            show: true,
                            smooth: true, // 设置平滑曲线
                            length: 10, // 设置牵引线长度
                            length2: 10,
                        },
                        label: {
                            // 设置标签显示信息和格式
                            show: true,
                            position: 'outer',
                            fontSize: 11,
                            color: '#1d1d1d',
                            formatter: function (params) {
                                return `${params.name}：${params.value}个\n占：${params.percent}%`;
                            },
                        },
                        data: this.getAlertLevelPieData(),
                    },
                ],
            });
        },
        getAlertLevelPieData() {
            if (this.alertLevelPieList && this.alertLevelPieList.length !== 0) {
                return this.alertLevelPieList.map((item) => {
                    return {
                        name: this.dict.type.iot_alert_level.find((chil) => chil.value === String(item.type)).label,
                        value: item.count,
                    };
                });
            }
        },
        // 搜索按钮操作
        handleQuery() {
            this.getDevChartDatas(); // 查询设备的历史数据
            this.getCountAlertProcess(); // 查询告警统计数据
            this.getThingsModelInvoke(); // 设备使用统计
            this.getDataRealTimeUpload(); // 获取数据实时上传
            this.getAlertInfo(); // 查询告警信息
            this.getCountAlertLevel(); // 查询告警级别统计
        },
        // 重置按钮操作
        handleResetQuery() {
            this.resetForm('queryForm');
            this.deviceLineList = [];
            this.alertProcessList = [];
            this.deviceBarList = [];
            this.realTimeConfig = {};
            this.alertInfoConfig = {};
            this.alertLevelPieList = [];
            this.loading = false;
            this.loadingCount = 0;
        },
        myLoading() {
            if (this.loading === false) {
                this.loading = true;
            }
        },
        myLoadingClose() {
            if (this.loadingCount === 5) {
                this.loadingCount = 0;
                this.loading = false;
                return;
            }
            this.loadingCount = this.loadingCount + 1;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.data-center-analysis-wrap {
    padding: 20px;

    .search-box {
        padding: 5px 0;
    }

    .card-box {
        padding: 0px;

        .scroll-board-wrap {
            ::v-deep .header {
                background-color: #f6f8fa !important;
                color: #909399;
                font-weight: bold;

                .header-item {
                    height: 45px !important;
                    line-height: 45px !important;
                }
            }

            ::v-deep .rows {
                .row-item {
                    height: 45px !important;
                    line-height: 45px !important;
                    color: #606266;
                    background-color: #fff !important;
                }
            }
        }
    }
}
</style>
