<template>
    <div class="firmware-task">
        <el-card>
            <el-descriptions :title="$t('firmware.task.222543-0')">
                <!--        <template slot="extra">-->
                <!--          <el-button size="mini" type="text" icon="el-icon-edit">修改</el-button>-->
                <!--        </template>-->
                <el-descriptions-item v-for="(item, index) in firmwareInfo" :key="index" :label="item.name"
                    label-class-name="feint">{{
                        item.value }}</el-descriptions-item>
            </el-descriptions>
        </el-card>
        <el-card>
            <div class="firmwareDeviceHeader">
                <h1>{{ $t('firmware.task.222543-1') }}</h1>
                <i class="el-icon-refresh icon" @click="updateFirmwareDevice()"></i>
            </div>
            <div class="firmwareDevice">
                <div class="box" v-for="(item, index) in firmwareDevice" :key="index">
                    <span class="title">{{ item.title }}</span>
                    <span class="num">{{ item.num }}</span>
                </div>
            </div>
        </el-card>
        <el-card>
            <div class="firmwareDeviceHeader">
                <h1>{{ $t('firmware.task.222543-2') }}</h1>
            </div>
            <div class="task">
                <div class="taskHeader">
                    <div class="taskTitle">
                        <span :class="{ active: changeIndex === 0, noRight: changeIndex === 1 }"
                            @click="handleTask(0)">{{
                                $t('firmware.task.222543-3') }}</span>
                        <span :class="{ active: changeIndex === 1, noLeft: changeIndex === 0 }"
                            @click="handleTask(1)">{{
                                $t('firmware.task.222543-4') }}</span>
                    </div>
                    <div class="taskInput">
                        <el-input class="searchInput" v-show="changeIndex === 0" v-model="taskId"
                            :placeholder="$t('firmware.task.222543-5')" clearable size="small"
                            @keyup.enter.native="taskQuery()" />
                        <el-input class="searchInput input2" v-show="changeIndex === 1" v-model="deviceId"
                            :placeholder="$t('firmware.task.222543-5')" clearable size="small"
                            @keyup.enter.native="deviceQuery" />
                        <el-input class="searchInput input2" v-show="changeIndex === 1" v-model="serialNumber"
                            :placeholder="$t('firmware.task.222543-6')" clearable size="small"
                            @keyup.enter.native="deviceQuery" />
                        <el-input class="searchInput" v-show="changeIndex === 1" v-model="deviceName"
                            :placeholder="$t('firmware.task.222543-7')" clearable size="small"
                            @keyup.enter.native="deviceQuery" />
                    </div>
                </div>
                <div class="taskBody" v-show="changeIndex === 0">
                    <el-table v-loading="loading" :data="firmwareTaskList">
                        <el-table-column :label="$t('firmware.task.222543-8')" align="center" prop="id"
                            width="80"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-9')" align="center"
                            prop="taskName"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-10')" align="center" prop="upgradeType"
                            width="150">
                            <template slot-scope="scope">
                                <el-tag type="warning" v-if="scope.row.upgradeType == 1">{{
                                    $t('firmware.task.222543-11') }}</el-tag>
                                <el-tag v-else>{{ $t('firmware.task.222543-12') }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-13')" align="center" prop="deviceAmount"
                            width="80"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-14')" align="center" prop="bookTime"
                            width="160"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-15')" align="center"
                            prop="taskDesc"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-16')" align="center" prop="createTime"
                            width="160"></el-table-column>
                        <el-table-column :label="$t('opation')" align="center" width="100">
                            <template slot-scope="scope">
                                <el-button @click="taskDetailClick(scope.row)" type="text" size="small">{{
                                    $t('firmware.task.222543-17') }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="taskTotal > 0" :total="taskTotal" :page.sync="taskParams.pageNum"
                        :limit.sync="taskParams.pageSize" @pagination="getTaskList" />
                </div>
                <div class="deviceBody" v-show="changeIndex === 1">
                    <el-table v-loading="loading" :data="firmwareDeviceList">
                        <el-table-column :label="$t('firmware.deviceList.index.222542-1')" align="center"
                            prop="deviceName"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-18')" align="center"
                            prop="serialNumber"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-8')" align="center" prop="taskId"
                            width="80"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-9')" align="center"
                            prop="taskName"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-19')" align="center" prop="version"
                            width="120">
                            <template slot-scope="scope">
                                <span>Version {{ scope.row.version }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-20')" align="center" prop="messageId"
                            width="120"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-21')" align="center" prop="upgradeStatus"
                            width="150">
                            <template slot-scope="scope">
                                <el-tag type="info" v-if="scope.row.upgradeStatus == 0">{{ $t('firmware.task.222543-22')
                                    }}</el-tag>
                                <el-tag type="" v-else-if="scope.row.upgradeStatus == 1">{{
                                    $t('firmware.task.222543-23') }}</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.upgradeStatus == 2">{{
                                    $t('firmware.task.222543-24') }}</el-tag>
                                <el-tag type="success" v-else-if="scope.row.upgradeStatus == 3">{{
                                    $t('firmware.task.222543-25') }}</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.upgradeStatus == 4">{{
                                    $t('firmware.task.222543-26') }}</el-tag>
                                <el-tag type="info" v-else-if="scope.row.upgradeStatus == 5">{{
                                    $t('firmware.task.222543-27') }}</el-tag>
                                <el-tag type="info" v-else>{{ $t('firmware.task.222543-28') }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-29')" align="center" prop="detailMsg"
                            width="120"></el-table-column>
                        <el-table-column :label="$t('firmware.task.222543-30')" align="center" prop="updateTime"
                            width="160"></el-table-column>
                    </el-table>
                    <pagination v-show="deviceTotal > 0" :total="deviceTotal" :page.sync="deviceParams.pageNum"
                        :limit.sync="deviceParams.pageSize" @pagination="getDeviceList" />
                </div>
            </div>
        </el-card>
        <!-- 任务详情弹框-->
        <el-dialog :title="$t('firmware.task.222543-31')" width="80%" :visible.sync="taskDialogVisible">
            <div class="dialogBox">
                <div>
                    <el-card>
                        <el-descriptions :title="$t('firmware.task.222543-32')" :column="1">
                            <el-descriptions-item v-for="(item, index) in taskDialogData" :key="index"
                                :label="item.name" label-class-name="feint">{{ item.value }}</el-descriptions-item>
                        </el-descriptions>
                    </el-card>
                </div>
                <div>
                    <el-card>
                        <el-descriptions :title="$t('firmware.task.222543-33')">
                            <template slot="extra">
                                <el-button size="mini" type="text" icon="el-icon-refresh"
                                    @click="chartRefresh"></el-button>
                            </template>
                        </el-descriptions>
                        <div class="chart" ref="taskChart"></div>
                    </el-card>
                </div>
            </div>
            <el-card>
                <div class="firmwareDeviceHeader">
                    <h1>{{ $t('firmware.task.222543-32') }}</h1>
                </div>
                <div class="deviceDialogSearch">
                    <div class="left" id="left">
                        <span :class="{ active: deviceStatus === 'all' }" @click="deviceStatusClick('all')">{{
                            $t('firmware.task.222543-35') }}（{{ deviceDialogSearchStatus[0] }}）</span>
                        <span :class="{ active: deviceStatus === 3 }" @click="deviceStatusClick(3)">{{
                            $t('firmware.task.222543-36') }}（{{
                                deviceDialogSearchStatus[1] }}）</span>
                        <span :class="{ active: deviceStatus === 0 }" @click="deviceStatusClick(0)">{{
                            $t('firmware.task.222543-37') }}（{{
                                deviceDialogSearchStatus[2] }}）</span>
                        <span :class="{ active: deviceStatus === 1 }" @click="deviceStatusClick(1)">{{
                            $t('firmware.task.222543-38') }}（{{
                                deviceDialogSearchStatus[3] }}）</span>
                        <!--                    <span :class="{active:deviceStatus===2}" @click="deviceStatusClick(2)">升级中（{{deviceDialogSearchStatus[4]}}）</span>-->
                        <span :class="{ active: deviceStatus === 4 }" @click="deviceStatusClick(4)">{{
                            $t('firmware.task.222543-39') }}（{{
                                deviceDialogSearchStatus[5] }}）</span>
                        <span :class="{ active: deviceStatus === 5 }" @click="deviceStatusClick(5)">{{
                            $t('firmware.task.222543-40') }}（{{
                                deviceDialogSearchStatus[6] }}）</span>
                    </div>
                    <div class="right">
                        <el-button type="primary" size="mini" @click="deviceInfoQuery">{{ $t('firmware.task.222543-41')
                            }}</el-button>
                        <el-input class="input3" v-model="deviceSerialNumber"
                            :placeholder="$t('firmware.task.222543-42')" clearable size="small"
                            @keyup.enter.native="deviceInfoQuery" />
                    </div>
                </div>
                <el-table v-loading="loading" :data="deviceDialogList">
                    <el-table-column :label="$t('firmware.deviceList.index.222542-1')" align="center"
                        prop="deviceName"></el-table-column>
                    <el-table-column :label="$t('firmware.deviceList.index.222542-1')" align="center"
                        prop="serialNumber"></el-table-column>
                    <el-table-column :label="$t('firmware.task.222543-8')" align="center" prop="taskId"
                        width="80"></el-table-column>
                    <el-table-column :label="$t('firmware.task.222543-9')" align="center"
                        prop="taskName"></el-table-column>
                    <el-table-column :label="$t('firmware.task.222543-19')" align="center" prop="version" width="120">
                        <template slot-scope="scope">
                            <span>Version {{ scope.row.version }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('firmware.task.222543-20')" align="center" prop="messageId"
                        width="120"></el-table-column>
                    <el-table-column :label="$t('firmware.task.222543-21')" align="center" prop="upgradeStatus"
                        width="150">
                        <template slot-scope="scope">
                            <el-tag type="info" v-if="scope.row.upgradeStatus == 0">{{ $t('firmware.task.222543-22')
                                }}</el-tag>
                            <el-tag type="" v-else-if="scope.row.upgradeStatus == 1">{{ $t('firmware.task.222543-23')
                                }}</el-tag>
                            <el-tag type="warning" v-else-if="scope.row.upgradeStatus == 2">{{
                                $t('firmware.task.222543-24') }}</el-tag>
                            <el-tag type="success" v-else-if="scope.row.upgradeStatus == 3">{{
                                $t('firmware.task.222543-25') }}</el-tag>
                            <el-tag type="danger" v-else-if="scope.row.upgradeStatus == 4">{{
                                $t('firmware.task.222543-26') }}</el-tag>
                            <el-tag type="info" v-else-if="scope.row.upgradeStatus == 5">{{
                                $t('firmware.task.222543-27') }}</el-tag>
                            <el-tag type="info" v-else>{{ $t('firmware.task.222543-28') }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('firmware.task.222543-29')" align="center" prop="detailMsg"
                        width="120"></el-table-column>
                    <el-table-column :label="$t('firmware.task.222543-30')" align="center" prop="updateTime"
                        width="160"></el-table-column>
                </el-table>
                <pagination v-show="deviceInfoTotal > 0" :total="deviceInfoTotal" :page.sync="deviceInfoParams.pageNum"
                    :limit.sync="deviceInfoParams.pageSize" @pagination="getDeviceInfoList" />
            </el-card>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDialogCancel">{{ $t('cancel') }}</el-button>
                <!--        <el-button @click="taskDialogVisible=false">取 消</el-button>-->
                <el-button type="primary" @click="handleDialogCancel">{{ $t('confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    listTask,
    deviceList,
    deviceStatistic
} from "@/api/iot/firmwareTask";
import * as echarts from 'echarts';
export default {
    name: "firmware-task",
    data() {
        return {
            firmwareId: '',
            firmwareInfo: [{
                name: this.$t('firmware.index.222541-0'),
                value: ''
            },
            {
                name: this.$t('firmware.index.222541-2'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-42'),
                value: ''
            },
            {
                name: this.$t('firmware.index.222541-15'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-16'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-44'),
                value: ''
            }
            ],
            firmwareDevice: [{
                title: this.$t('firmware.task.222543-45'),
                num: 0
            },
            {
                title: this.$t('firmware.task.222543-36'),
                num: 0
            },
            {
                title: this.$t('firmware.task.222543-46'),
                num: 0
            },
            {
                title: this.$t('firmware.task.222543-39'),
                num: 0
            },
            ],
            // 以下为任务管理相关
            changeIndex: 0,
            // 任务明细参数
            loading: false,
            taskParams: {
                pageNum: 1,
                pageSize: 10,
                firmwareId: '',
                id: ''
            },
            taskTotal: 0,
            firmwareTaskList: [],
            // 任务明细查询
            taskId: '',
            // 设备明细参数
            deviceParams: {
                pageNum: 1,
                pageSize: 10,
                firmwareId: '',
                taskId: '',
                serialNumber: '',
                deviceName: ''
            },
            deviceTotal: 0,
            firmwareDeviceList: [],
            // 设备明细查询
            deviceId: '',
            deviceName: '',
            serialNumber: '',
            // 任务详情弹框
            taskDialogVisible: false,
            taskDialogData: [{
                name: this.$t('firmware.task.222543-8'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-9'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-10'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-13'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-14'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-15'),
                value: ''
            },
            {
                name: this.$t('firmware.task.222543-16'),
                value: ''
            },
            ],
            myChart: null,
            option: null,
            chartData: [],
            chartParam: {},
            // 设备详情
            deviceDialogList: [],
            deviceInfoParams: {
                pageNum: 1,
                pageSize: 10,
                firmwareId: '',
                taskId: '',
                upgradeStatus: '',
                serialNumber: '',
            },
            deviceSerialNumber: '',
            deviceInfoTotal: 0,
            deviceDialogSearchStatus: [0, 0, 0, 0, 0, 0],
            deviceStatus: 'all'
        }
    },
    created() {
        // const data = JSON.parse(this.$route.query.detailInfo)
        const data = JSON.parse(sessionStorage.getItem('firmwareTaskInfo'))
        this.firmwareId = data.firmwareId
        this.taskParams.firmwareId = data.firmwareId
        this.deviceParams.firmwareId = data.firmwareId
        this.deviceInfoParams.firmwareId = data.firmwareId
        this.firmwareInfo[0].value = data.firmwareName
        this.firmwareInfo[1].value = data.productName
        this.firmwareInfo[2].value = data.isLatest == 1 ? '最新' : '默认'
        this.firmwareInfo[3].value = 'Version ' + data.version
        this.firmwareInfo[4].value = data.createTime
        this.firmwareInfo[5].value = data.remark
        this.getDeviceStatistic()
        this.getTaskList()
        this.getDeviceList()
    },
    watch: {
        chartData: {
            immediate: true,
            deep: true,
            handler(newVal, oldVal) {
                if (newVal.length > 0) {
                    this.$nextTick(() => {
                        this.myChart = echarts.init(this.$refs.taskChart)
                        this.option = {
                            grid: {
                                top: 0,
                                bottom: 0,
                                containLabel: true
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: '{b}:{c}'
                            },
                            series: [{
                                name: this.$t('firmware.task.222543-33'),
                                type: 'pie',
                                radius: ['45%', '70%'],
                                label: {
                                    show: true,
                                    formatter: '{b}:{c}\n占比:{d}%'
                                },
                                data: newVal
                            }]
                        }
                        this.myChart.setOption(this.option)
                    })
                }
            }
        }
    },
    methods: {
        // 固件升级设备统计
        getDeviceStatistic() {
            deviceStatistic({
                firmwareId: this.firmwareId
            }).then(res => {
                if (res.code == 200) {
                    const data = res.data
                    let now = 0
                    let success = 0
                    let fail = 0
                    let total = 0
                    data.map(item => {
                        total += item.deviceCount
                        if (item.upgradeStatus == 0 || item.upgradeStatus == 1 || item.upgradeStatus == 2) {
                            now += item.deviceCount
                        } else if (item.upgradeStatus == 4 || item.upgradeStatus == 5) {
                            fail += item.deviceCount
                        } else {
                            success += item.deviceCount
                        }
                    })
                    this.firmwareDevice[0].num = total
                    this.firmwareDevice[1].num = success
                    this.firmwareDevice[2].num = now
                    this.firmwareDevice[3].num = fail
                }
            })
        },
        // 固件升级设备统计刷新
        updateFirmwareDevice() {
            this.getDeviceStatistic()
        },
        //任务明细列表
        getTaskList() {
            listTask(this.taskParams).then(res => {
                this.firmwareTaskList = res.rows
                this.taskTotal = res.total
            })
        },
        // 设备明细列表
        getDeviceList() {
            deviceList(this.deviceParams).then(res => {
                this.firmwareDeviceList = res.rows
                this.deviceTotal = res.total
            })
        },
        // 任务明细列表查询
        taskQuery() {
            this.taskParams.id = this.taskId
            this.getTaskList()
        },
        // 设备明细列表查询
        deviceQuery() {
            this.deviceParams.taskId = this.deviceId
            this.deviceParams.deviceName = this.deviceName
            this.deviceParams.serialNumber = this.serialNumber
            this.getDeviceList()
        },
        // 以下为任务管理-任务明细 详情弹出框相关
        // 任务信息
        taskDetailClick(data) {
            this.taskDialogData[0].value = data.id
            this.taskDialogData[1].value = data.taskName
            this.taskDialogData[2].value = data.upgradeType == 1 ? '版本升级' : '指定设备'
            this.taskDialogData[3].value = data.deviceAmount
            this.taskDialogData[4].value = data.bookTime
            this.taskDialogData[5].value = data.taskDesc
            this.taskDialogData[6].value = data.createTime
            this.deviceDialogSearchStatus[0] = data.deviceAmount
            this.taskDialogVisible = true
            this.chartParam = {
                taskId: data.id,
                firmwareId: data.firmwareId
            }
            this.deviceInfoParams.taskId = data.id
            this.getChartData()
            this.getDeviceInfoList()
        },
        // 任务统计
        getChartData() {
            deviceStatistic(this.chartParam).then(res => {
                const data = res.data
                let chartData = []
                let totalStatistics = [this.deviceDialogSearchStatus[0], 0, 0, 0, 0, 0]
                data.map(item => {
                    switch (item.upgradeStatus) {
                        case 0:
                            chartData.push({
                                name: this.$t('firmware.task.222543-48'),
                                value: item.deviceCount
                            })
                            totalStatistics[2] = item.deviceCount
                            break
                        case 1:
                            chartData.push({
                                name: this.$t('firmware.task.222543-38'),
                                value: item.deviceCount
                            })
                            totalStatistics[3] = item.deviceCount
                            break
                        // case 2:
                        //     chartData.push({
                        //         name: '升级中',
                        //         value: item.deviceCount
                        //     })
                        //     totalStatistics[4] = item.deviceCount
                        //     break
                        case 3:
                            chartData.push({
                                name: this.$t('firmware.task.222543-36'),
                                value: item.deviceCount
                            })
                            totalStatistics[1] = item.deviceCount
                            break
                        case 4:
                            chartData.push({
                                name: this.$t('firmware.task.222543-39'),
                                value: item.deviceCount
                            })
                            totalStatistics[5] = item.deviceCount
                            break
                        case 5:
                            chartData.push({
                                name: this.$t('firmware.task.222543-40'),
                                value: item.deviceCount
                            })
                            totalStatistics[6] = item.deviceCount
                            break
                    }
                })
                this.chartData = chartData
                this.deviceDialogSearchStatus = totalStatistics
            })
        },
        //任务统计刷新
        chartRefresh() {
            this.getChartData()
        },
        // 设备详情
        getDeviceInfoList() {
            deviceList(this.deviceInfoParams).then(res => {
                this.deviceDialogList = res.rows
                this.deviceInfoTotal = res.total
            })
        },
        // 设备详情查询
        deviceInfoQuery() {
            this.deviceInfoParams.serialNumber = this.deviceSerialNumber
            this.getDeviceInfoList()
        },
        // 设备详情不同状态切换
        deviceStatusClick(id) {
            this.deviceStatus = id
            if (id === 'all') {
                this.deviceInfoParams.upgradeStatus = ''
            } else {
                this.deviceInfoParams.upgradeStatus = id
            }
            this.getDeviceInfoList()
        },
        // 任务详情弹框中表格状态切换
        handleTask(id) {
            this.changeIndex = id
        },
        handleDialogCancel() {
            this.taskDialogVisible = false
            this.deviceStatus = 'all'
            this.deviceSerialNumber = ''
            this.deviceInfoParams.upgradeStatus = ''
            this.deviceInfoParams.serialNumber = ''
        }
    }
}
</script>

<style scoped>
.firmware-task {
    padding: 6px;
}

.firmware-task /deep/ .feint {
    color: #999;
}

.firmware-task /deep/ .el-card {
    margin-bottom: 10px;
}

.firmwareDeviceHeader {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}

h1 {
    margin: 0;
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    font-weight: bold;
}

.icon {
    width: 20px;
    line-height: 28px;
}

.icon:hover {
    color: #5cb6ff;
    cursor: pointer;
}

.firmware-task /deep/ .searchInput {
    width: 200px;
}

.firmwareDevice {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box {
    flex: 1;
    padding: 0 10px;
    height: 60px;
    border-right: 1px solid #999;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.box:last-child {
    border-right: none;
}

.title {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
    text-align: left;
}

.num {
    font-weight: bold;
}

.box:nth-child(1) .num {
    color: #5cb6ff;
}

.box:nth-child(2) .num {
    color: #67c23a;
}

.box:nth-child(3) .num {
    color: #e6a23c;
}

.box:nth-child(4) .num {
    color: #f56c6c;
}

.taskHeader {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.taskTitle span {
    display: inline-block;
    width: 130px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border: 1px solid #999;
}

.input2 {
    margin: 0 10px;
}

/*.taskTitle span:nth-child(2){*/
/*  border-left: none;*/
/*}*/
.taskTitle span:hover,
.taskTitle .active,
#left .active {
    color: #5cb6ff;
    border: 1px solid #5cb6ff;
}

.taskTitle .noRight {
    border-right: none;
}

.taskTitle .noLeft {
    border-left: none;
}

.dialogBox {
    display: flex;
    justify-content: space-between;
}

.dialogBox>div {
    flex: 1;
    margin: 0 10px;
}

.chart {
    height: 218px;
}

/*设备明细详情弹框*/
.deviceDialogSearch {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.left span {
    display: inline-block;
    width: 160px;
    text-align: center;
    height: 30px;
    line-height: 28px;
    cursor: pointer;
    border: 1px solid #999;
}

.left span:not(:first-child) {
    border-left: none
}

.right {
    display: flex;
    justify-content: flex-end;
}

.input3 {
    margin-left: 10px;
}
</style>
