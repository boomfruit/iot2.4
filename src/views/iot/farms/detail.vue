<template>
    <div class="box">
        <el-row :gutter="boxGutter">
            <el-col :span="5">
                <div class="gutter-box1">
                    <el-row>
                        <div></div>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="gutter-box1">组件2</div>
            </el-col>
            <el-col :span="5">
                <div class="gutter-box1">组件3</div>
            </el-col>
            <el-col :span="9">
                <div class="gutter-box1" style="margin-right: 20px">地区</div>
            </el-col>
        </el-row>
        <el-row :gutter="boxGutter">
            <el-col :span="15">
                <div class="gutter-box2">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>栏舍环控数据</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div class="gutter-box2" style="margin-right: 20px">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>设备列表</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="boxGutter">
            <el-col :span="15">
                <div class="gutter-box3">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>栏舍设备状态</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div class="gutter-box3" style="margin-right: 20px">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>监控画面</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="boxGutter">
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
                </div>
            </el-col>
            <el-col :span="7">
                <div class="gutter-box4">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>能耗统计</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div class="gutter-box4" style="margin-right: 20px">
                    <div style="display: flex">
                        <div class="content-card-img"></div>
                        <div>通风量曲线</div>
                    </div>
                    <div class="content-card-line">
                        <div class="bottom-line1"></div>
                        <div class="bottom-line2"></div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ImageUploader from './ImageUploader.vue';

export default {
    data() {
        return {
            boxGutter: 20,
        };
    },
    created() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
$bg-color: #0d1827;

.box {
    background-color: #000000;
    margin-left: 10px;
}

.gutter-box1 {
    /* 第一层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    margin-top: 20px;
    border-radius: 10px;
    height: 66px;
    align-items: center;
    line-height: 45px;
}

.gutter-box2 {
    /* 第二层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
    height: 192px;
}

.gutter-box3 {
    /* 第三层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
    height: 297px;
}

.gutter-box4 {
    /* 第四层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
    height: 297px;
}

.content-card-img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    // background-image: url('./img/content-card-img.png');
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
