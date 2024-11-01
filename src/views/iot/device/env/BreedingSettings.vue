<template>
    <envCard title="料塔数据">
        <el-row style="margin-top: 20px; background-color: #0d1827">
            <el-col :span="9">
                <div class="left-item">
                    <div style="font-size: 16px; color: #ffffff; margin-bottom: 15px; font-family: PingFang SC, PingFang SC; font-weight: bold">报警状态</div>
                    <el-row type="flex" justify="space-between" style="background-color: #1d2632; height: 50px; align-items: center">
                        <el-col style="width: 30px">
                            <div class="alarmNum"></div>
                        </el-col>
                        <el-col :span="16">
                            <span style="font-size: 14px; color: #a8aec9">报警状态</span>
                        </el-col>
                        <el-col style="width: 60px">
                            <el-tag type="success">正常</el-tag>
                        </el-col>
                    </el-row>
                    <div style="font-size: 16px; color: #ffffff; margin-bottom: 15px; margin-top: 30px; font-family: PingFang SC, PingFang SC; font-weight: bold">传感器记录</div>
                    <el-table :data="sensorData" style="width: 100%; background-color: #1d2632; color: #ffffff; text-align: center">
                        <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
                        <el-table-column prop="weight" label="重量" width="180" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'" style="display: inline-block">{{ scope.row.status }}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="feed-box">
                    <div class="feed-info" style="position: absolute; top: 20%; left: 0; right: 0; text-align: center; color: #ffffff">
                        <div style="font-size: 16px; margin-bottom: 10px; color: #a8aec9">整体重量</div>
                        <div style="font-size: 40px; font-weight: bold; margin-bottom: 10px; color: #ffcc00">
                            163.21
                            <span style="font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #ffcc00">KG</span>
                        </div>
                        <div style="font-size: 14px; color: #a8aec9">
                            容量
                            <span style="font-size: 16px; color: #fff">20KG</span>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div style="font-size: 16px; color: #ffffff; margin-bottom: 15px; margin-top: 30px; font-family: PingFang SC, PingFang SC; font-weight: bold">今日上放料</div>
                <el-row :gutter="20" style="margin-right: 40px; background-color: #1d2632">
                    <el-col :span="12">
                        <div style="display: flex; justify-content: center; align-items: center">
                            <div class="custom-statistic">
                                <div class="custom-statistic-title" style="text-align: center">今日上料</div>
                                <div class="custom-statistic-content" style="text-align: center">
                                    <span class="custom-statistic-value">20,341</span>
                                    <span class="custom-statistic-unit">kg</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="display: flex; justify-content: center; align-items: center">
                            <div class="custom-statistic">
                                <div class="custom-statistic-title">今日放料</div>
                                <div class="custom-statistic-content">
                                    <span class="custom-statistic-value">19,341</span>
                                    <span class="custom-statistic-unit">kg</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <div style="font-size: 16px; color: #ffffff; margin-bottom: 15px; margin-top: 30px; font-family: PingFang SC, PingFang SC; font-weight: bold">料塔详情</div>
                <div style="margin-right: 40px">
                    <el-descriptions class="margin-top" :column="1" border>
                        <el-descriptions-item>
                            <template slot="label">负责人</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">手机号</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">型号</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">当地地址</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">在线状态</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">料塔重量</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">料塔类型</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">产品编号</template>
                            kooriookami
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">料塔类型</template>
                            kooriookami
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
            </el-col>
        </el-row>
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
            sensorData: [
                { name: '传感器1', weight: '50kg', status: '正常' },
                { name: '传感器2', weight: '45kg', status: '正常' },
                { name: '传感器3', weight: '55kg', status: '异常' },
                { name: '传感器4', weight: '48kg', status: '正常' },
                { name: '传感器5', weight: '52kg', status: '正常' },
                { name: '传感器6', weight: '47kg', status: '异常' },
                { name: '传感器7', weight: '53kg', status: '正常' },
                { name: '传感器8', weight: '49kg', status: '正常' },
            ],
        };
    },
};
</script>
<style lang="scss" scoped>
.left-item {
    padding: 24px;
    background-color: #0d1827;
}
.alarmNum {
    margin-left: 20px;
    width: 24px;
    height: 24px;
    background-image: url('./imgs/feed/alarm-num.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
.feed-box {
    width: 100%;
    height: 640px;
    background-image: url('./imgs/feed/feed-box.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.custom-statistic {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;

    border-radius: 4px;
}

.custom-statistic-title {
    font-size: 14px;
    color: #909399;
    margin-bottom: 5px;
}

.custom-statistic-content {
    display: flex;
    align-items: baseline;
}

.custom-statistic-value {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
}

.custom-statistic-unit {
    font-size: 14px;
    color: #909399;
    margin-left: 5px;
}
</style>
