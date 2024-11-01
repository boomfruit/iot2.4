<template>
    <envCard title="历史数据">
        <div class="breeding-use-data">
            <div class="top-controls">
                <div class="left-controls">
                    <el-date-picker
                        v-if="showPicker"
                        v-model="queryDateRange"
                        :key="pickerKey"
                        :type="datePickerType"
                        unlink-panels
                        range-separator="至"
                        :start-placeholder="startPlaceholder"
                        :end-placeholder="endPlaceholder"
                        :picker-options="pickerOptions"
                        @change="handleDateChange"
                        class="dark-theme-picker"
                    ></el-date-picker>
                </div>
                <div class="right-controls">
                    <el-button type="primary" @click="exportToExcel" icon="el-icon-download">导出Excel</el-button>
                    <el-button type="primary" @click="toggleView" icon="el-icon-refresh">
                        {{ showTable ? '显示图表' : '显示表格' }}
                    </el-button>
                </div>
            </div>

            <div v-show="!showTable" ref="map" style="width: 100%; height: 400px"></div>

            <div v-if="showTable" class="table-container">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="日期"></el-table-column>
                    <el-table-column prop="feedingAmount" label="投喂量"></el-table-column>
                    <el-table-column prop="loadingAmount" label="装载量"></el-table-column>
                </el-table>

                <div class="total-info">
                    <div class="total-item">
                        <span class="total-label">历史上料总量：</span>
                        <span class="total-value">{{ totalFeedingAmount }}</span>
                    </div>
                    <div class="total-item">
                        <span class="total-label">历史下料总量：</span>
                        <span class="total-value">{{ totalLoadingAmount }}</span>
                    </div>
                </div>
            </div>
        </div>
    </envCard>
</template>

<script>
import envCard from './components/card.vue';

export default {
    components: {
        envCard,
    },
    data() {
        return {
            queryDateRange: [],
            datePickerType: 'daterange',
            pickerKey: 0,
            showPicker: true,
            tableData: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [
                    {
                        text: '当天',
                        onClick: (picker) => {
                            const today = new Date();
                            picker.$emit('pick', [today, today]);
                            this.switchToDatePicker();
                        },
                    },
                    {
                        text: '最近7天',
                        onClick: (picker) => {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                            picker.$emit('pick', [start, end]);
                            this.switchToDatePicker();
                        },
                    },
                    {
                        text: '最近30天',
                        onClick: (picker) => {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                            picker.$emit('pick', [start, end]);
                            this.switchToDatePicker();
                        },
                    },
                    {
                        text: '按月查询',
                        onClick: (picker) => {
                            this.switchToMonthPicker();
                        },
                    },
                ],
            },
            showTable: true,
            totalFeedingAmount: 0,
            totalLoadingAmount: 0,
            charts: null,
            chartOption: {},
        };
    },
    computed: {
        startPlaceholder() {
            return this.datePickerType === 'daterange' ? '开始日期' : '开始月份';
        },
        endPlaceholder() {
            return this.datePickerType === 'daterange' ? '结束日期' : '结束月份';
        },
    },
    mounted() {
        this.initDefaultDateRange();
        this.fetchData();
    },
    methods: {
        initDefaultDateRange() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6); // 默认显示最近7天
            this.queryDateRange = [start, end];
        },
        switchToDatePicker() {
            this.datePickerType = 'daterange';
            this.refreshPicker();
        },
        switchToMonthPicker() {
            this.datePickerType = 'monthrange';
            const now = new Date();
            const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            this.queryDateRange = [lastMonth, currentMonth];
            this.refreshPicker();
        },
        refreshPicker() {
            this.showPicker = false;
            this.$nextTick(() => {
                this.pickerKey += 1;
                this.showPicker = true;
                this.fetchData(); // 在刷新选择器后重新获取数据
            });
        },
        handleDateChange(date) {
            if (date && date.length === 2) {
                console.log('选择的开始日期：', date[0]);
                console.log('选择的结束日期：', date[1]);
                this.fetchData();
            }
        },
        fetchData() {
            // 这里调用后端 API 获取数据
            console.log('查询类型：', this.datePickerType === 'daterange' ? '按天' : '按月');
            console.log('查询日期范围：', this.queryDateRange);

            // 模拟API调用
            setTimeout(() => {
                if (this.datePickerType === 'daterange') {
                    this.tableData = [
                        { date: '2023-05-01', feedingAmount: 100, loadingAmount: 90 },
                        { date: '2023-05-02', feedingAmount: 110, loadingAmount: 95 },
                        { date: '2023-05-03', feedingAmount: 105, loadingAmount: 100 },
                    ];
                } else {
                    this.tableData = [
                        { date: '2023-04', feedingAmount: 3000, loadingAmount: 2800 },
                        { date: '2023-05', feedingAmount: 3200, loadingAmount: 3000 },
                    ];
                }

                // 计算总量
                this.calculateTotals();
            }, 500);
        },
        calculateTotals() {
            this.totalFeedingAmount = this.tableData.reduce((sum, row) => sum + row.feedingAmount, 0);
            this.totalLoadingAmount = this.tableData.reduce((sum, row) => sum + row.loadingAmount, 0);
        },
        exportToExcel() {
            // 这里实现导出Excel的逻辑
            console.log('导出Excel');
            // 您可能需要使用一个库如xlsx来实现Excel导出功能
        },
        toggleView() {
            this.showTable = !this.showTable;
            if (!this.showTable) {
                this.$nextTick(() => {
                    this.initMap();
                });
            } else {
                this.destroyChart();
            }
        },
        initMap() {
            if (!this.charts) {
                this.charts = this.$echarts.init(this.$refs.map);
            }
            this.fetchHourlyData();
        },
        fetchHourlyData() {
            // 模拟获取每小时数据
            const hourlyData = Array.from({ length: 24 }, (_, i) => ({
                hour: i,
                feeding: Math.floor(Math.random() * 10),
                loading: Math.floor(Math.random() * 10),
            }));

            this.updateChartOption(hourlyData);
        },
        updateChartOption(hourlyData) {
            this.chartOption = {
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: ['放料', '上料'],
                    textStyle: {
                        color: '#fff',
                    },
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: hourlyData.map((item) => `${item.hour}:00`),
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '放料',
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            opacity: 0.3,
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#FFD8A5' },
                                { offset: 1, color: '#FF9100' },
                            ]),
                        },
                        itemStyle: {
                            color: '#FFD8A5',
                        },
                        data: hourlyData.map((item) => item.feeding),
                    },
                    {
                        name: '上料',
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            opacity: 0.3,
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(255,128,128,0.8)' },
                                { offset: 1, color: 'rgba(255,128,128,0.1)' },
                            ]),
                        },
                        itemStyle: {
                            color: '#ff8080',
                        },
                        data: hourlyData.map((item) => item.loading),
                    },
                ],
            };
            this.charts.setOption(this.chartOption);
        },
        destroyChart() {
            if (this.charts) {
                this.charts.dispose();
                this.charts = null;
            }
        },
    },
    beforeDestroy() {
        this.destroyChart();
    },
};
</script>

<style lang="scss" scoped>
// @import '@/assets/styles/tableView.scss';

.breeding-use-data {
    padding: 20px;
}
.top-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.left-controls {
    display: flex;
    align-items: center;
}
.el-button {
    margin-right: 20px;
}
.el-radio-group {
    margin-right: 20px;
}
.right-controls {
    text-align: right;
}
.total-info {
    font-size: 14px;
}
.total-item {
    margin-bottom: 5px;
}
.total-item .label {
    font-weight: bold;
}
.total-item .value {
    color: #409eff;
    font-weight: bold;
}
.chart {
    height: 400px;
}
.el-date-picker {
    margin-left: 20px;
    width: 320px;
}
.table-container {
    position: relative;
    padding-bottom: 60px; /* 为总量信息留出空间 */
}
.total-info {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-radius: 4px;
}
.total-item {
    display: flex;
    align-items: center;
}
.total-label {
    font-weight: bold;
    margin-right: 5px;
}
.total-value {
    color: #409eff;
}

.dark-theme-picker {
    ::v-deep .el-input__inner {
        background-color: #1f1f1f !important;
        border-color: #3f3f3f !important;
        color: #ffffff !important;
    }

    ::v-deep .el-input__icon {
        color: #909399 !important;
    }

    ::v-deep .el-date-picker {
        background-color: #1f1f1f !important;
        border-color: #3f3f3f !important;
        color: #ffffff !important;

        .el-date-picker__header {
            color: #ffffff !important;
        }

        .el-picker-panel__content {
            color: #ffffff !important;
        }

        .el-date-table th {
            color: #909399 !important;
        }

        .el-date-table td.available:hover {
            color: #409eff !important;
        }

        .el-date-table td.current:not(.disabled) span {
            background-color: #409eff !important;
            color: #ffffff !important;
        }

        .el-date-table td.in-range div {
            background-color: #2d3035 !important;
        }

        .el-date-table td.start-date span,
        .el-date-table td.end-date span {
            background-color: #409eff !important;
        }

        .el-picker-panel__link-btn {
            color: #409eff !important;
        }
    }
}
</style>
