<template>
    <div class="box">
        <el-row :gutter="boxGutter">
            <el-col :span="6">
                <div class="gutter-box1">
                    <el-row style="display: flex; align-items: center">
                        <el-col :span="3" style="display: flex; align-items: center">
                            <el-image style="width: 30px; height: 30px" :src="url"></el-image>
                        </el-col>
                        <el-col :span="5">目标温度</el-col>
                        <el-col :span="16" style="display: flex; justify-content: end">25°C</el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="gutter-box1">
                    <el-row style="display: flex; align-items: center">
                        <el-col :span="3" style="display: flex; align-items: center">
                            <el-image style="width: 30px; height: 30px" :src="url"></el-image>
                        </el-col>
                        <el-col :span="5">日龄</el-col>
                        <el-col :span="16" style="display: flex; justify-content: end">34</el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="gutter-box1">
                    <el-row style="display: flex; align-items: center">
                        <el-col :span="3" style="display: flex; align-items: center">
                            <el-image style="width: 30px; height: 30px" :src="url"></el-image>
                        </el-col>
                        <el-col :span="5">模式</el-col>
                        <el-col :span="16" style="display: flex; justify-content: end">自动模式</el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="gutter-box1" style="margin-right: 20px">地区</div>
            </el-col>
        </el-row>
        <el-row :gutter="boxGutter">
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
                    <div style="display: flex; width: 100%; justify-content: start; padding-left: 10px">
                        <div class="env-data" v-for="item in 7">
                            <el-image style="width: 30px; height: 30px" :src="url"></el-image>
                            <div style="display: flex; justify-content: space-between">
                                <div class="env-data-title">室内温度</div>
                                <div class="env-data-data">35.6℃</div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="gutter-box4">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>栏舍数据监测</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                    <el-row :gutter="10">
                        <el-col :span="4"><div class="env-data-line-item">平均温度</div></el-col>
                        <el-col :span="4">
                            <div class="env-data-line-item-active">湿度</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="env-data-line-item">CO2</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="env-data-line-item">氨气</div>
                        </el-col>
                        <el-col :span="4"></el-col>
                        <el-col :span="4"></el-col>
                    </el-row>
                    <lineCharts height="200px"></lineCharts>
                </div>
            </el-col>
            <el-col :span="9">
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
                    <div style="width: 440px; height: 230px; display: flex; padding-top: 5px; position: absolute">
                        <player></player>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="gutter-box5" style="margin-right: 20px">
                    <div style="display: flex; justify-content: space-between">
                        <div style="display: flex">
                            <div class="content-card-img"></div>
                            <div>设备列表</div>
                        </div>
                        <el-row>
                            <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="showUnBindDeviceList()"></el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                        </el-row>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                    <div style="display: flex; width: 100%; justify-content: start; padding-left: 10px">
                        <div class="env-device" v-for="item in bindDeviceList">
                            <div @click="unBindDevice(item.devicesId)">{{ item.devicesId }}</div>
                            <!-- <el-image style="width: 64px; height: 110px" :src="url"></el-image> -->
                        </div>
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
                    <div class="env-data-status">
                        <div class="env-data-status-item" v-for="item in 33">
                            <div class="env-data-status-item-title">室内温度</div>
                            <el-image style="width: 30px; height: 30px" :src="url"></el-image>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-dialog :title="'选择设备'" :visible.sync="open" width="400px" append-to-body>
            <el-table :data="unBindDeviceList" style="width: 100%">
                <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width"></el-table-column>
                <el-table-column :label="'操作'" :width="120">
                    <template slot-scope="scope">
                        <el-popconfirm title="是否要添加此设备？" @confirm="bindDeviceBarn(scope.row)">
                            <el-button slot="reference">添加</el-button>
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
        };
    },
    components: {
        lineCharts,
        player,
    },
    created() {},
    mounted() {
        this.farmId = this.$route.query.id;
        this.getDeviceList();
        this.getFarmBindDeviceList();
        this.getUnBoundDevicesList();
    },
    methods: {
        getDeviceList() {
            listDeviceShort().then((response) => {
                this.devicesList = response.rows;
                this.total = response.total;
                console.log(this.devicesList, 'this.devicesList');
            });
        },
        getFarmBindDeviceList() {
            getFarmsDevice(this.farmId).then((res) => {
                this.bindDeviceList = res.data;
                console.log(res, 'res');
            });
        },
        getUnBoundDevicesList() {
            unBoundDevicesList({}).then((unBindRes) => {
                this.unBindDeviceList = unBindRes.rows;
                console.log(unBindRes, 'unBindRes');
            });
        },
        showUnBindDeviceList() {
            this.open = true;
        },
        bindDeviceBarn(item) {
            const deviceId = item.productId;
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
    },
};
</script>

<style lang="scss" scoped>
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
        width: 182px;
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
    .env-device {
        margin-top: 15px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        width: 104px;
        height: 125px;
        background: #07111e;
        border-radius: 9px 9px 9px 9px;
        border: 1px solid #1b2a40;
        padding: 14px 18px;
    }
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
</style>
