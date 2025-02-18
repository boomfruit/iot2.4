<template>
    <div v-if="isGetDataDone" class="device-setting-container">
        <!-- 滚动控件容器 -->
        <div class="controls-container">
            <div v-if="isScroll" class="scroll-controls" style="margin-bottom: 10px">
                <el-button-group>
                    <el-button size="small" @click="handleScroll('left')" icon="el-icon-arrow-left">左对齐</el-button>
                    <el-button size="small" @click="handleScroll('center')">居中</el-button>
                    <el-button size="small" @click="handleScroll('right')" icon="el-icon-arrow-right">右对齐</el-button>
                </el-button-group>
            </div>
        </div>

        <div class="device-setting-content-box" style="overflow-x: scroll" ref="scrollContainer">
            <div class="scrollable-content" :style="{ width: domWidth }">
                <div class="box-title" :style="{ width: scrollWidth }">
                    <div class="box-title-item" v-for="(item, odx) in titleList" :key="odx">{{ item.title }}</div>
                </div>
                <div v-for="(col, iid) in colTitle" :key="iid" class="col-box">
                    <div v-for="(item, idx) in titleList.length" :key="idx" class="col-item">
                        <div :class="[idx == 0 ? 'col-input-title' : 'col-input']" v-if="composeList.length > 0">
                            <!-- 输入框 -->
                            <el-input v-if="idx != 0 && titleList[idx].type == 'input'" v-model="composeList[iid][idx].value" @change="inputChange(composeList[iid][idx])"></el-input>
                            <!-- 文本 -->
                            <span v-if="idx != 0 && titleList[idx].type == 'span'">{{ composeList[iid][idx].value }}</span>
                            <!-- 选择框 -->
                            <el-select
                                class="select-box"
                                :popper-append-to-body="false"
                                v-if="idx != 0 && titleList[idx].type == 'select'"
                                v-model="composeList[iid][idx].value"
                                @change="selectChange(composeList[iid][idx])"
                            >
                                <el-option v-for="(itm, optionIdx) in selectOption" :key="optionIdx" :label="itm.label" :value="itm.value">
                                    <div style="display: flex; align-items: center" v-if="selectIcon">
                                        <el-image style="width: 20px; height: 20px; margin-right: 5px" :src="iconList[optionIdx]"></el-image>
                                        <span>{{ itm.label }}</span>
                                    </div>
                                    <div v-else>
                                        <span>{{ itm.label }}</span>
                                    </div>
                                </el-option>
                            </el-select>
                            <!-- 布尔 -->
                            <el-popconfirm v-if="idx != 0 && titleList[idx].type == 'boolean'" :value="composeList[iid][idx].value" :title="clickTitle" @confirm="confirmBit(composeList[iid][idx], iid, idx)">
                                <el-button type="primary" slot="reference" v-if="composeList[iid][idx].value === '1'" @click="triggerTitle('关闭')">开启</el-button>
                                <el-button type="waring" slot="reference" v-else @click="triggerTitle('开启')">关闭</el-button>
                            </el-popconfirm>

                            <span v-if="idx == 0">{{ colTitle[iid] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!--
    1. 获取对应的表格参数。
    2. 获取修改对应表格的Id，组合在一起。
    3. 当修改值改变后，触发是否要修改的弹窗。
    4. 弹窗点击确认，修改对应表格的值。
    5. 特殊处理：按位处理要改变的值进行进制处理。
-->
<script>
import circle from '../../../../../assets/sunseen/env/circle.png';
import close from '../../../../../assets/sunseen/env/close.png';
import minSpeed from '../../../../../assets/sunseen/env/minSpeed.png';
import open from '../../../../../assets/sunseen/env/open.png';
import supersede from '../../../../../assets/sunseen/env/supersede.png';
import tunnelVentilation from '../../../../../assets/sunseen/env/tunnelVentilation.png';

export default {
    data() {
        return {
            dataFormList: [],
            composeList: [],
            iconList: [close, open, circle, supersede],
            clickTitle: '',
            isGetDataDone: false,
            moveOffsetBar: 0,
            SystemSettingInitialLevelOfTunnel: 0, // 初始级别
            SystemSettingVentilationLevel: 0, // 通风级别
            scrollPosition: 'left', // 新增：记录当前滚动位置
        };
    },
    props: {
        titleList: {
            type: Array,
            default: () => [],
        },
        colTitle: {
            type: Array,
            default: () => [],
        },
        selectOption: {
            type: Array,
            default: () => [
                {
                    label: '关闭',
                    value: '1',
                },
                {
                    label: '开启',
                    value: '2',
                },
                {
                    label: '循环',
                    value: '3',
                },
                {
                    label: '交替',
                    value: '4',
                },
            ],
        },
        valueIDs: {
            type: Array,
            default: [],
        },
        selectIcon: {
            type: Boolean,
            default: true,
        },
        // 是否按位处理
        isBit: {
            type: Boolean,
            default: false,
        },
        BigInt: {
            type: Number,
            default: 4,
        },
        // 是否显示通风模式
        isShowFanMode: {
            type: Boolean,
            default: false,
        },
        // 是否需要滚动
        isScroll: {
            type: Boolean,
            default: false,
        },
        scrollWidth: {
            type: String,
            default: '100%',
        },
        domWidth: {
            type: String,
            default: '100%',
        },
    },
    components: {},

    filters: {},

    computed: {},

    mounted() {
        // this.getData();
    },

    methods: {
        // 新增：处理滚动方法
        handleScroll(position) {
            const container = this.$refs.scrollContainer;
            if (!container) {
                return;
            }

            // 添加调试日志
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;

            switch (position) {
                case 'left':
                    container.scrollLeft = 0;
                    break;
                case 'center':
                    container.scrollLeft = (scrollWidth - clientWidth) / 2;
                    break;
                case 'right':
                    container.scrollLeft = scrollWidth - clientWidth;
                    break;
            }
        },
        // 是环控器且是风机控制或开度控制时
        getModeType(data) {
            // this.SystemSettingInitialLevelOfTunnel = parseInt(data[0]);
            // this.SystemSettingVentilationLevel = parseInt(data[1]);
        },
        getData(data) {
            this.$nextTick(() => {
                this.composeList = this.transformData(data);
                console.log(this.composeList, '_composeList');
                this.isGetDataDone = true;
            });
        },
        inputChange(item) {
            this.openWindow(item);
        },
        selectChange(item) {
            this.openWindow(item);
        },
        // 弹窗
        openWindow(item) {
            this.$confirm(`确定要修改该参数`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$emit('change', {
                    itemId: item.Id,
                    itemValue: item.value,
                    value: item.value,
                }); //返回输入值
            });
        },
        transformData(data) {
            if (!this.isBit) {
                return data.map((row) => {
                    // 假设每行的第一个元素作为 Id，其余元素作为 value
                    const values = row.map((value) => ({ Id: value.id, value: value.value }));
                    return values;
                });
            } else {
                return data.map((row) => {
                    // 假设每行的第一个元素作为 Id，其余元素作为 value
                    const values = row.map((_value, idx) => {
                        if (_value.Id === 'text') {
                            return { Id: 'text', value: '' };
                        } else {
                            return { Id: _value.id, value: this.toTwo(_value.value)[7 - idx].toString() };
                        }
                    });
                    return values;
                });
            }
        },
        triggerTitle(text) {
            this.clickTitle = '确定要' + text + '该参数？';
        },
        confirmBit(data, row, idx) {
            if (data.value === '1') {
                data.value = '0';
            } else {
                data.value = '1';
            }
            const changeData = JSON.parse(JSON.stringify(this.composeList[row])).reverse();
            changeData.pop();
            let char = '';
            changeData.forEach((element) => {
                char = char + element.value;
            });
            this.$confirm(`确定要修改该参数`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$emit('change', {
                    itemId: changeData[0].Id,
                    itemValue: parseInt(char, 2),
                    value: parseInt(char, 2),
                }); //返回输入值
            });
        },
        toTwo(value) {
            var two = parseInt(value).toString(2);
            var Point = [];
            if (two.length < 8) {
                for (var j = 0; j < 8 - two.length; j++) {
                    Point.push('0');
                }
            }
            for (var k = 0; k < two.length; k++) {
                Point.push(two.charAt(k));
            }
            return Point; // 或者return Point.reverse();对数组进行反向操作
        },
        showFansLevel(e) {},
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

.device-setting-wrapper {
    position: relative;
    width: 100%;
}

.select-box {
    ::v-deep .el-select-dropdown__list {
        background-color: #001234 !important;
    }
}

.device-setting-content-box {
    overflow-x: auto;

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.box-title {
    display: flex;
    background: #d1faff;
    border-radius: 10px 10px 10px 10px;
    position: relative;
    .box-title-item {
        text-align: center;
        flex: 1;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #1a193a;
        height: 40px;
        line-height: 40px;
    }
}
.col-box {
    display: flex;
    height: 40px;
    margin-top: 18px;
    color: #fff;
    .col-item {
        flex: 1;
        padding: 0px 3px;
        text-align: center;
        line-height: 40px;
    }
    .col-input-title {
        width: 100%;
        height: 40px;
    }
    .col-input {
        width: 100%;
        height: 40px;
    }
}
::v-deep .el-input__inner {
    border-radius: 16px;
}
.static-box {
    position: static;
    left: 0;
    top: -30px;
    display: flex;
    justify-content: end;
}
</style>
