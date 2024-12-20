<template>
    <div class="dashboard-box">
        <headerInfo></headerInfo>
        <div class="content">
            <el-row :gutter="20">
                <!-- <el-col :span="6">
                    <div class="content-card">
                        <div style="display: flex">
                            <div class="content-card-img"></div>
                            <div class="content-card-title">消息监控总览</div>
                        </div>
                        <div class="content-card-line">
                            <div class="bottom-line1"></div>
                            <div class="bottom-line2"></div>
                        </div>
                        <leftTop></leftTop>
                    </div>
                    <div class="content-card">
                        <div style="display: flex">
                            <div class="content-card-img"></div>
                            <div class="content-card-title">数据传输总览</div>
                        </div>
                        <div class="content-card-line">
                            <div class="bottom-line1"></div>
                            <div class="bottom-line2"></div>
                        </div>
                        <leftBottom :leftBottomData="leftBottomData"></leftBottom>
                    </div>
                </el-col> -->
                <el-col :span="24">
                    <div class="content-card-big">
                        <centerMap></centerMap>
                    </div>
                </el-col>
                <!-- <el-col :span="6">
                    <div class="content-card">
                        <div style="display: flex">
                            <div class="content-card-img"></div>
                            <div class="content-card-title">设备类型占比</div>
                        </div>
                        <div class="content-card-line">
                            <div class="bottom-line1"></div>
                            <div class="bottom-line2"></div>
                        </div>
                        <rightTop></rightTop>
                    </div>
                    <div class="content-card">
                        <div style="display: flex">
                            <div class="content-card-img"></div>
                            <div class="content-card-title">实时报警列表</div>
                        </div>
                        <div class="content-card-line">
                            <div class="bottom-line1"></div>
                            <div class="bottom-line2"></div>
                        </div>
                        <rightBottom></rightBottom>
                    </div>
                </el-col> -->
            </el-row>
        </div>
    </div>
</template>

<script>
import headerInfo from './headerInfo.vue';
import centerMap from './map.vue';
import leftTop from './components/left-top.vue';
import leftBottom from './components/left-bottom.vue';
import rightTop from './components/right-top.vue';
import rightBottom from './components/right-bottom.vue';

import { getBashBoardMetrics, getBashBoardStats } from '@/api/sunseen/screen.js';

export default {
    data() {
        return {
            leftBottomData: {},
            headerInfoData: {
                barnsTotal: 0,
                devicesTotal: 0,
                alarmsTotal: 0,
            },
        };
    },

    components: {
        headerInfo,
        centerMap,
        leftTop,
        leftBottom,
        rightTop,
        rightBottom,
    },

    filters: {},

    computed: {},

    methods: {},
    watch: {},
};
</script>
<style lang="scss" scoped>
.dashboard-box {
    padding: 13px 22px;
}
.content {
    margin-top: 20px;
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
.content-card {
    height: 344px;
    background: #0e1e2c;
    border-radius: 10px 10px 10px 10px;
    margin-bottom: 20px;
    padding: 8px 9px;
    .content-card-img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        background-image: url('./img/content-card-img.png');
        background-size: contain;
    }
    .content-card-title {
        height: 20px;
        line-height: 20px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
    }
}
.content-card-big {
    height: 708px;
    background: #0e1e2c;
    border-radius: 10px 10px 10px 10px;
}
</style>
