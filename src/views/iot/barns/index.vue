<template>
    <div class="shack-box">
        <div class="shack-box-search_info">
            <el-row>
                <el-col :span="22">
                    <div class="header-box">
                        <div class="search-box" style="margin-top: 20px; padding-left: 30px">
                            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                                <el-form-item label="栏舍名称" prop="name">
                                    <el-input v-model="queryParams.name" placeholder="请输入栏舍名称" clearable @keyup.enter.native="handleQuery" />
                                </el-form-item>
                                <el-form-item label="栏舍位置" prop="location">
                                    <el-input v-model="queryParams.location" placeholder="请输入栏舍位置" clearable @keyup.enter.native="handleQuery" />
                                </el-form-item>
                                <el-form-item label="养殖品种" prop="breedId">
                                    <el-input v-model="queryParams.breedId" placeholder="请输入养殖品种" clearable @keyup.enter.native="handleQuery" />
                                </el-form-item>
                                <el-form-item label="存栏量" prop="population">
                                    <el-input v-model="queryParams.population" placeholder="请输入存栏量" clearable @keyup.enter.native="handleQuery" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button class="el-button" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                                    <el-button class="el-button" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="line-box"></div>
                        <div class="shack-info-box">
                            <div v-for="item in shackInfoList" :key="item.name" style="margin-left: 24px; display: flex; width: 160px; align-items: center; height: 57px">
                                <div
                                    class="shack-info-box-icon"
                                    :style="{
                                        background: `url(${item.icon}) no-repeat center center / cover`,
                                    }"
                                ></div>
                                <div class="shack-info-box-title">{{ item.name }}</div>
                                <div class="shack-info-box-value">{{ item.value }}</div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="2">
                    <div class="three-box" @click="showAddBarn"></div>
                </el-col>
            </el-row>
        </div>
        <div class="shack-item-box">
            <div
                v-for="item in shackListData"
                :key="item.name"
                :class="[currentHoverId === item.id ? 'shack-item-hover' : '']"
                class="shack-item"
                @mouseover="handleMouseOver(item)"
                @mouseleave="handleMouseLeave(item)"
                @click="showDetail(item)"
            >
                <div class="shack-item-header">
                    <div class="shack-item-header-icon"></div>
                    <el-row :gutter="8" style="width: 100%; display: flex; height: 44px; align-items: center">
                        <el-col :span="9">
                            <div class="shack-item-header-title">{{ item.name }}</div>
                        </el-col>
                        <el-col :span="10">
                            <div class="shack-item-header-alarm" v-if="item.exceptionInfo">
                                <div class="shack-item-header-alarm-icon"></div>
                                <div class="shack-item-header-alarm-value">{{ item.exceptionInfo.length > 7 ? item.exceptionInfo.substring(0, 7) + '...' : item.exceptionInfo }}</div>
                                <!-- <div class="shack-item-header-alarm-value">{{ item.exceptionInfo }}</div> -->
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div class="shack-item-header-detail">
                                <div class="shack-item-header-detail-icon" @click.stop="handleUpdate(item)"></div>
                                <div class="shack-item-header-detail-value" @click.stop="handleDelete(item)"></div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="shack-item-content" :class="[currentHoverId === item.id ? 'shack-item-content-hover' : '']">
                    <div style="display: flex; justify-content: center">
                        <el-image v-if="!item.dataTemperatureAva01" style="width: 56px" :src="require('@/assets/sunseen/shack/no-data.png')"></el-image>
                    </div>

                    <div v-if="item.dataTemperatureAva01" style="display: flex">
                        <div class="shack-item-content-title-icon"></div>
                        <div class="shack-item-content-title-name">平均室温</div>
                    </div>
                    <div v-if="item.dataTemperatureAva01" style="height: 70px; display: flex">
                        <div class="shack-item-content-indoorTemp">{{ item.dataTemperatureAva01 }}℃</div>
                        <div class="shack-item-content-targetTemp-box">
                            <div class="shack-item-content-targetTemp-icon"></div>
                            <div class="shack-item-content-targetTemp-name">目标温度</div>
                            <div class="shack-item-content-targetTemp-value">{{ item.dataTargetTemperature }}℃</div>
                        </div>
                    </div>
                </div>
                <div class="shack-item-value" v-if="item.info.length > 0">
                    <div v-for="itm in item.info" :key="itm.key" style="display: flex; align-items: center">
                        <div
                            :style="{
                                width: '15px',
                                height: '15px',
                                background: `url(${itm.icon}) no-repeat center center / contain`,
                            }"
                        ></div>
                        <div class="shack-item-value-name">{{ itm.name }}</div>
                        <el-tooltip class="item" effect="dark" :content="itm.value" placement="top">
                            <div class="shack-item-value-value" v-if="itm.value && itm.value.length > 7">
                                {{ itm.value.substring(0, 5) + '...' }}
                            </div>
                            <div class="shack-item-value-value" v-else>{{ itm.value }}</div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="shack-item-value-noFeed" v-else></div>
            </div>
        </div>

        <div>
            <pagination
                style="width: 100%; height: 50px; border-radius: 16px"
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                :pageSizes="[10]"
                @pagination="getList"
            />
        </div>

        <el-row>
            <el-col :span="12"></el-col>
        </el-row>
        <!-- 添加或修改栏舍信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="所属农场" prop="farmId">
                    <el-select :disabled="form.id" style="width: 100%" v-model="form.farmId" placeholder="请选择">
                        <el-option v-for="subItem in farmsList" :key="subItem.id" :label="subItem.farmsName" :value="subItem.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="栏舍名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入栏舍名称" />
                </el-form-item>
                <el-form-item label="栏舍位置" prop="location">
                    <el-input v-model="form.location" placeholder="请输入栏舍位置" />
                </el-form-item>
                <!-- <el-form-item label="栏舍使用年限" prop="age">
                  <el-input v-model="form.age" placeholder="请输入栏舍使用年限" />
              </el-form-item> -->

                <el-form-item label="养殖品种">
                    <el-select :disabled="form.id" style="width: 100%" v-model="form.breedId" placeholder="请选择">
                        <el-option v-for="subItem in breedList" :key="subItem.id" :label="subItem.breedName" :value="subItem.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="存栏量" prop="population">
                    <el-input v-model="form.population" placeholder="请输入存栏量" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import onFeed from '@/assets/sunseen/shack/onFeed.png';
import outFeed from '@/assets/sunseen/shack/outFeed.png';
import onAlarm from '@/assets/sunseen/shack/onAlarm.png';

import calendar from '@/assets/sunseen/shack/shack-calendar.png';
import save from '@/assets/sunseen/shack/shack-save.png';
import breed from '@/assets/sunseen/shack/shack-breed.png';
import wind from '@/assets/sunseen/shack/shack-wind.png';
import location from '@/assets/sunseen/shack/shack-location.png';
import { listBarns, getBarns, delBarns, addBarns, updateBarns } from '@/api/iot/barns';
import { listFarms } from '@/api/iot/farms';
import { listBreeds } from '@/api/iot/breeds';

export default {
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 栏舍信息表格数据
            barnsList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                farmId: null,
                name: null,
                location: null,
                age: null,
                breedId: null,
                breedName: null,
                population: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                farmId: [{ required: true, message: '所属农场ID不能为空', trigger: 'blur' }],
                name: [{ required: true, message: '栏舍名称不能为空', trigger: 'blur' }],
            },
            shackInfoList: [
                {
                    name: '在养栏舍',
                    icon: onFeed,
                    value: 14,
                },
                {
                    name: '空闲栏舍',
                    icon: outFeed,
                    value: 6,
                },
                {
                    name: '报警栏舍',
                    icon: onAlarm,
                    value: 6,
                },
            ],
            shackListData: [],
            farmsList: [],
            breedList: [],
            currentHoverId: null,
            total: 0,
        };
    },

    components: {},

    filters: {},

    computed: {},

    mounted() {
        // 获取农场，获取养殖品种
        this.getPreData();
        this.getList();
    },
    methods: {
        getPreData() {
            listFarms({
                pageNum: 1,
                pageSize: 999,
            })
                .then((farmsRes) => {
                    // 农场
                    this.farmsList = farmsRes.rows;
                })
                .then(() => {
                    listBreeds({
                        pageNum: 1,
                        pageSize: 999,
                    }).then((breedRes) => {
                        // 养殖品种
                        this.breedList = breedRes.rows;
                    });
                });
        },
        getList() {
            listBarns(this.queryParams)
                .then((result) => {
                    this.shackListData = result.rows.map((item) => {
                        return {
                            ...item,
                            alarm: false,
                            info: [
                                {
                                    name: '日龄',
                                    key: 'day',
                                    value: 30,
                                    icon: calendar,
                                },
                                {
                                    name: '存栏量',
                                    key: 'saveNumber',
                                    value: 2500,
                                    icon: save,
                                },
                                {
                                    name: '品种',
                                    key: 'breed',
                                    value: item.breedName,
                                    icon: breed,
                                },
                                {
                                    name: '通风等级',
                                    key: 'windLevel',
                                    value: 6,
                                    icon: wind,
                                },
                                {
                                    name: '位置',
                                    key: 'location',
                                    value: item.location,
                                    icon: location,
                                },
                            ],
                        };
                    });
                    this.total = result.total;
                })
                .catch((err) => {});
        },
        handleMouseOver(item) {
            this.currentHoverId = item.id;
        },
        handleMouseLeave() {
            this.currentHoverId = null;
        },
        showAddBarn() {
            this.reset();
            this.open = true;
            this.title = '添加栏舍';
        },
        showDetail(item) {
            this.$router.push({
                path: '/barnsList/barnsDetail',
                query: {
                    id: item.id,
                },
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                farmId: null,
                name: null,
                location: null,
                age: null,
                breedId: null,
                breedName: null,
                population: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
            };
            this.resetForm('form');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加栏舍信息';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getBarns(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = '修改栏舍信息';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateBarns(this.form).then((response) => {
                            this.$modal.msgSuccess('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addBarns(this.form).then((response) => {
                            this.$modal.msgSuccess('新增成功');
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm('是否确认删除栏舍名称为"' + row.name + '"的数据项？')
                .then(function () {
                    return delBarns(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess('删除成功');
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/barns/export',
                {
                    ...this.queryParams,
                },
                `barns_${new Date().getTime()}.xlsx`
            );
        },
    },

    watch: {},
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
// 字体
$color-white: #fff;
$color-blue: #00b1ff;
$font-weight-top-label: 400;
$font-size-top-label: 15px;

// 背景颜色
$bg-top-search: #302f4c;
$bg-top-btn: linear-gradient(270deg, #00d4ff 0%, #0068ff 100%);
$bg-top-btn2: #142342;
::v-deep.el-select-dropdown {
    border: none;
    background: #0b1420;
    // 若不将下拉框的背景颜色设置为：transparent，那么做不出来半透明的效果；
    // 因为其最终的显示为：下拉框有一个背景颜色且下拉框的字体有一个背景颜色，重叠后的效果展示；
    background-color: transparent;
}

// 设置下拉框的字体属性及背景颜色；
.el-select-dropdown__item {
    color: #fff;
    background-color: #0b1420;
    border: none;
}

// 设置下拉框列表的 padding 值为：0；(即：样式调整)
::v-deep.el-select-dropdown__list {
    background-color: #0b1420;
    border: none;
    padding: 0;
}

// 设置输入框与下拉框的距离为：0; (即：样式调整)
::v-deep.el-popper[x-placement^='bottom'] {
    border: none;
    margin-top: 0px;
}

.el-button {
    background-color: $bg-top-btn2;
    color: $color-blue;
    border: 1px solid $color-blue;
}
// 头部按钮
.el-button--primary {
    background: $bg-top-btn !important;
    color: $color-white;
}

// 将下拉框上的小箭头取消；(看着像一个箭头，其实是两个重叠在一起的箭头)
::v-deep.el-popper .popper__arrow,
::v-deep.el-popper .popper__arrow::after {
    border: none;
    display: none;
}

// 设置鼠标悬停在下拉框列表的悬停色；
.el-select-dropdown__item:hover {
    background-color: rgba(0, 225, 219, 0.690196078431373);
}

.three-box {
    cursor: pointer;
    height: 60px;
    height: 60px;
    background-image: url('../../../assets/sunseen/shack/add.png');
    background-repeat: no-repeat;
    background-size: contain;
    margin-top: 45px;
    margin-left: 10px;
}
.shack-box {
    padding: 22px;
    // display: none;
}
.shack-box-search_info {
    width: 100%;
    height: 137px;
    background: #0d1827;
    .search-box {
        height: 60px;
        display: flex;
        ::v-deep .el-form-item__label {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
        }
        ::v-deep .el-input__inner {
            color: #fff !important;
            background: #0b1420;
            border-radius: 5px 5px 5px 5px;
            border: 1px solid #24354b;
        }
    }
    .line-box {
        height: 1px;
        background-color: #24354b;
        margin-left: 37px;
    }
    .shack-info-box {
        height: 57px;
        display: flex;
        .shack-info-box-icon {
            margin-left: 10px;

            width: 17px;
            height: 17px;
        }
        .shack-info-box-title {
            margin-left: 10px;

            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
        }
        .shack-info-box-value {
            margin-left: 10px;
            font-family: PingFang SC, PingFang SC;
            font-weight: bold;
            font-size: 20px;
            color: #00eeff;
        }
    }
}
.shack-item-box {
    margin-top: 20px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
    .shack-item {
        cursor: pointer;
        color: #00eeff;
        background-color: #0d1827;
        border-radius: 10px 10px 10px 10px;
        height: 252px;
        padding: 0 23px;
        .shack-item-header {
            display: flex;
            height: 44px;
            align-items: center;
            .shack-item-header-icon {
                width: 15px;
                height: 15px;
                background-image: url('../../../assets//sunseen/shack/shack-title.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .shack-item-header-title {
                padding-left: 5px;
                min-width: 100px;
                font-family: PingFang SC, PingFang SC;
                font-weight: bold;
                font-size: 13px;
                color: #ffffff;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .shack-item-header-alarm {
                height: 23px;
                background: #3e0000;
                border-radius: 13px 13px 13px 13px;
                border: 1px solid #ff3d3d;
                display: flex;
                justify-content: center;
                align-items: center;
                .shack-item-header-alarm-icon {
                    width: 15px;
                    height: 15px;
                    background-image: url('../../../assets//sunseen/shack/onAlarm.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .shack-item-header-alarm-value {
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    font-size: 13px;
                    color: #ff3d3d;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .shack-item-header-detail {
                height: 23px;
                border-radius: 13px 13px 13px 13px;
                // border: 1px solid #223043;
                display: flex;
                justify-content: center;
                align-items: center;
                .shack-item-header-detail-icon {
                    cursor: pointer;
                    width: 14px;
                    height: 14px;
                    background-image: url('../../../assets//sunseen/shack/edit.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    margin-right: 10px;
                }
                .shack-item-header-detail-value {
                    cursor: pointer;
                    width: 16px;
                    height: 16px;
                    background-image: url('../../../assets//sunseen/shack/del.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
        }
        .shack-item-content {
            padding: 12px 14px;
            height: 92px;
            background: #07111e;
            border-radius: 9px 9px 9px 9px;
            border: 1px solid #1b2a40;

            .shack-item-content-title-icon {
                width: 17px;
                height: 17px;
                background-image: url('../../../assets/sunseen/shack/shack-temp.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .shack-item-content-title-name {
                padding-left: 5px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 13px;
                color: #a8aec9;
            }
            .shack-item-content-indoorTemp {
                flex: 1;
                display: flex;
                padding-left: 20px;
                align-items: center;
                font-family: PingFang SC, PingFang SC;
                font-weight: bold;
                font-size: 27px;
                color: #ff7800;
            }
            .shack-item-content-targetTemp-box {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                .shack-item-content-targetTemp-icon {
                    width: 15px;
                    height: 15px;
                    background-image: url('../../../assets//sunseen/shack/shack-temp.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .shack-item-content-targetTemp-name {
                    padding-left: 2px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    font-size: 13px;
                    color: #a8aec9;
                }
                .shack-item-content-targetTemp-value {
                    padding-left: 4px;
                    padding-top: 3px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    font-size: 13px;
                    color: #ff7800;
                }
            }
        }
        .shack-item-value {
            margin-top: 15px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 15px;
            .shack-item-value-name {
                padding-left: 5px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 13px;
                color: #a8aec9;
            }
            .shack-item-value-value {
                padding-left: 5px;
                font-family: PingFang SC, PingFang SC;
                font-weight: bold;
                font-size: 16px;
                color: #5d8dff;
            }
        }
        .shack-item-value-noFeed {
            margin-top: 30px;
            height: 50px;
            background-image: url('../../../assets/sunseen/shack/noFeed.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position-x: 50%;
        }
    }
}
.shack-item-hover {
    background-color: #192b47 !important;
}
.shack-item-content-hover {
    background-color: #132137 !important;
}
</style>
