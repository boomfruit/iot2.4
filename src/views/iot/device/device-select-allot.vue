<template>
    <div>
        <el-card style="margin: 10px">
            <el-row :gutter="10">
                <i class="el-icon-arrow-left" @click="goBack()"></i>
                <el-divider direction="vertical"></el-divider>
                <span style="color: #f8f8f9">{{ $t('device.device-select-allot.903153-0') }}</span>
            </el-row>
            <el-divider></el-divider>
            <div style="width: 70%">
                <el-row>
                    <el-form ref="queryForm" :model="queryParams">
                        <el-col :span="6">
                            <el-form-item prop="productId">
                                <el-select v-model="queryParams.productId" :placeholder="$t('device.allot-import-dialog.060657-1')" style="width: 95%" filterable clearable>
                                    <el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="deviceName">
                                <el-input :placeholder="$t('device.device-edit.148398-2')" clearable v-model="queryParams.deviceName" style="width: 95%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="serialNumber">
                                <el-input :placeholder="$t('device.device-edit.148398-8')" clearable v-model="queryParams.serialNumber" style="width: 95%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('device.device-select-allot.903153-4') }}</el-button>
                        </el-col>
                        <el-button icon="el-icon-refresh-left" @click="resetQuery" style="margin-left: 5px">{{ $t('device.device-select-allot.903153-5') }}</el-button>
                    </el-form>
                </el-row>
            </div>
            <div class="general">
                <div class="topLeft">
                    <div style="padding: 10px 10px; background-color: #0d1827 !important; color: #f8f8f9">
                        <span style="font-size: 15px; font-weight: bold">{{ $t('device.device-select-allot.903153-6') }}</span>
                        <span style="font-size: 15px; font-weight: bold; float: right">{{ selectedCount }}/{{ this.count }}</span>
                    </div>
                    <el-row>
                        <el-table ref="leftTableData" :data="menuTableData" style="width: 100%" max-height="373" @selection-change="changeCheckBoxValueLeft">
                            <template slot="empty">
                                <el-empty :image-size="100" :description="$t('device.device-select-allot.903153-7')"></el-empty>
                            </template>
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="deviceId" label="DeviceKey"></el-table-column>
                            <el-table-column prop="productName" :label="$t('device.allot-record.155854-2')"></el-table-column>
                            <el-table-column prop="serialNumber" :label="$t('device.device-edit.148398-7')"></el-table-column>
                            <el-table-column prop="deviceName" :label="$t('device.device-edit.148398-1')"></el-table-column>
                        </el-table>
                    </el-row>
                </div>
                <div class="topCenter">
                    <el-button type="primary" :disabled="add" @click="rightAdd"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    <el-button type="primary" :disabled="del" @click="leftDelete"><i class="el-icon-arrow-left el-icon--left"></i></el-button>
                </div>
                <div class="topRight">
                    <div style="padding: 10px 10px; background-color: #0d1827 !important; color: #f8f8f9">
                        <span style="font-size: 15px; font-weight: bold">{{ $t('device.device-select-allot.903153-11') }}</span>
                        <span style="font-size: 15px; font-weight: bold; float: right">{{ selectedCount1 }}/500</span>
                    </div>
                    <el-row>
                        <el-table ref="rightTableData" :data="rightTableData" style="width: 100%" max-height="373" @selection-change="changeCheckBoxValueRight">
                            <template slot="empty">
                                <el-empty :image-size="100" :description="$t('device.device-select-allot.903153-7')"></el-empty>
                            </template>
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="deviceId" label="DeviceKey"></el-table-column>
                            <el-table-column prop="productName" :label="$t('device.allot-record.155854-2')"></el-table-column>
                            <el-table-column prop="serialNumber" :label="$t('device.device-edit.148398-7')"></el-table-column>
                            <el-table-column prop="deviceName" :label="$t('device.device-edit.148398-1')"></el-table-column>
                        </el-table>
                    </el-row>
                </div>
            </div>
            <div class="pagination-container">
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :pager-count="5" :limit.sync="queryParams.pageSize" :pageSizes="[10, 20, 30, 40]" @pagination="getList" />
            </div>
            <div style="width: 100%">
                <el-form label-position="top" :model="allotForm" ref="allotForm" :rules="allotRules">
                    <div style="width: 45%; margin: 60px 0">
                        <el-form-item :label="$t('device.allot-import-dialog.060657-2')" prop="deptId">
                            <treeselect
                                style="background-color: black !important; color: #f8f8f9"
                                v-model="allotForm.deptId"
                                :options="deptOptions"
                                :show-count="true"
                                :placeholder="$t('device.allot-import-dialog.060657-3')"
                                :appendToBody="true"
                                z-index="9000"
                            />
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </el-card>
        <div class="footer">
            <el-button type="primary" @click="confirmDistribution">{{ $t('device.device-select-allot.903153-14') }}</el-button>
        </div>
    </div>
</template>
<script type="text/javascript">
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { deptsTreeSelect } from '@/api/system/user';
import { listDevice, distributionDevice } from '@/api/iot/device';
import { listProduct } from '@/api/iot/product';
export default {
    components: {
        Treeselect,
    },
    data() {
        return {
            total: 0,
            productList: [],
            queryParams: {
                productId: null,
                deviceName: '',
                pageNum: 1,
                pageSize: 10,
                productName: null,
                serialNumber: null,
                showChild: false,
            },
            count: 0,
            //导入表单
            allotForm: {
                productId: 0,
                deptId: 0,
            },
            deviceIds: {},
            selectedCount: 0,
            // 机构树选项
            deptOptions: [],
            selectedRow: null,
            add: true,
            del: true,
            leftTableData: [],
            rightTableData: [],
            selectedListLeft: [], //点击左边选中的设备
            selectedListRight: [], //点击右边选中的设备
            //设备列表数据
            menuTableData: [],
            //导入分配表单校验
            allotRules: {
                deptId: [{ required: true, message: this.$t('device.allot-import-dialog.060657-15'), trigger: 'change' }],
            },
        };
    },
    created() {
        this.getProductList();
        this.getDeptTree();
        this.getList();
    },
    computed: {
        //已选设备数量
        selectedCount1() {
            return this.rightTableData.length;
        },
    },
    watch: {
        selectedListLeft: function (val) {
            if (val.length) {
                this.add = false;
            } else {
                this.add = true;
            }
        },
        selectedListRight: function (val) {
            if (val.length) {
                this.del = false;
            } else {
                this.del = true;
            }
        },
    },
    methods: {
        //查询所有设备列表
        getList() {
            this.loading = true;
            listDevice(this.queryParams).then((response) => {
                this.menuTableData = response.rows;
                //isSelect用于判断是否可选
                this.menuTableData.map((item) => {
                    this.leftTableData.push(
                        Object.assign(item, {
                            isSelect: 0,
                        })
                    );
                });
                //分页后保持已选中状态
                if (this.rightTableData.length != 0) {
                    this.menuTableData.forEach((item, index) => {
                        this.rightTableData.forEach((item1) => {
                            if (item1.deviceId == item.deviceId) {
                                item.isSelect = 1;
                            }
                        });
                    });
                }
                this.total = response.total;
                if (this.count === 0) {
                    this.count = this.total;
                }
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.rightTableData = [];
            this.queryParams.productId = null;
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 查询产品列表 */
        getProductList() {
            this.loading = true;
            const params = {
                pageSize: 999,
            };
            listProduct(params).then((response) => {
                this.productList = response.rows.map((item) => {
                    return { value: item.productId, label: item.productName };
                });
            });
        },
        /** 查询机构下拉树结构 */
        getDeptTree() {
            this.allotForm.deptId = null;
            deptsTreeSelect().then((response) => {
                this.deptOptions = response.data;
            });
        },
        /** 返回按钮 */
        goBack() {
            const obj = {
                path: '/smartAquaculture/iot/device',
            };
            this.$tab.closeOpenPage(obj);
        },
        //右边增加的数据
        rightAdd() {
            let leftTableData = JSON.parse(JSON.stringify(this.menuTableData));
            leftTableData.forEach((item, index) => {
                this.selectedListLeft.forEach((item1) => {
                    if (item.deviceId == item1.deviceId) {
                        this.rightTableData = this.rightTableData.concat(item).sort((a, b) => {
                            return a.deviceId - b.deviceId;
                        });
                        item.isSelect = 1;
                    }
                });
            });
            if (this.selectedCount1 != 0) {
                this.count = this.count - this.selectedListLeft.length;
            }
            leftTableData = leftTableData.filter((val) => {
                return val;
            });
            this.menuTableData = leftTableData;
            this.selectedListLeft = [];
        },
        //删除的数据
        leftDelete() {
            let rightTableData = JSON.parse(JSON.stringify(this.rightTableData));
            rightTableData.forEach((item, index) => {
                this.selectedListRight.forEach((item1) => {
                    this.menuTableData.forEach((item2) => {
                        if (item2.deviceId == item1.deviceId) {
                            item2.isSelect = 0;
                        }
                        if (item1.deviceId == item.deviceId) {
                            delete rightTableData[index];
                        }
                    });
                });
            });
            if (this.selectedCount1 != 0) {
                this.count = this.count + this.selectedListRight.length;
                this.getList();
            }
            rightTableData = rightTableData.filter((val) => {
                return val;
            });
            this.rightTableData = rightTableData;
            this.selectedListRight = [];
        },
        checkSelectable(row) {
            let flag = true;
            if (row.isSelect === 0) {
                flag = true;
            } else {
                flag = false;
            }
            return flag;
        },
        //左边数据
        changeCheckBoxValueLeft(val) {
            this.selectedListLeft = val;
            this.selectedCount = val.length;
        },
        //右边
        changeCheckBoxValueRight(val) {
            this.selectedListRight = val;
        },
        //确定分配操作
        confirmDistribution() {
            this.$refs['allotForm'].validate((valid) => {
                if (valid) {
                    this.deviceIds = this.rightTableData.map((item) => item.deviceId);
                    const deviceIds = this.deviceIds.join(',');
                    const deptId = this.allotForm.deptId;
                    distributionDevice(deptId, deviceIds).then((response) => {
                        if (response.code == 200) {
                            this.$modal.msgSuccess(response.msg);
                            this.resetQuery();
                        } else {
                            this.$modal.msgError(response.msg);
                        }
                    });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

.topCenter {
    .el-button + .el-button {
        margin-left: 0px;
        margin-top: 10px;
    }
}

.vue-treeselect__label {
    /* 取消加粗 */
    font-weight: normal;
    font-size: 14px;
}

.general {
    display: flex;
    align-items: center;
}

.topLeft {
    width: 45%;
    height: 373px;
}

.topCenter {
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.topRight {
    width: 45%;
    height: 373px;
}

.footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    padding: 20px 50px 20px 360px;
    margin-bottom: 0 !important;
    color: #fff;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
}

.pagination-container {
    text-align: left;
    width: 45%;
    margin-left: 200px;
    margin-top: 20px;
}

//tree
.treeSelect {
    width: 212px;
    border-radius: 0;
    height: 50px;
    background-color: #0d1827 !important;
}

::v-deep .vue-treeselect__control {
    height: 100%;
    border: 1px solid #23344a;
    background-color: #0d1827 !important;
}
::v-deep .vue-treeselect__placeholder {
    color: #c0c4cc;
}
//foucs时的placeholder
::v-deep.vue-treeselect--focus .vue-treeselect__input {
    color: #c0c4cc !important;
}
//foucs时有值的input
::v-deep.vue-treeselect--has-value .vue-treeselect__single-value {
    color: #606266 !important;
}
::v-deep .vue-treeselect__menu {
    background: #024b8a;
    // border: none;
    border: rgba(8, 160, 255, 0.827) 1px solid;
}
::v-deep.vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) .vue-treeselect__control:hover {
    border-color: rgba(8, 160, 255, 0.827);
}

//input箭头
::v-deep .vue-treeselect__control-arrow-container .vue-treeselect__control-arrow {
    color: #c0c4cc !important;
}
//清空icon
::v-deep .vue-treeselect__x-container .vue-treeselect__x {
    color: #c0c4cc !important;
}
//hover
::v-deep .vue-treeselect__option--highlight {
    background-color: #4a8bec !important;
}
//选中的menu
::v-deep .vue-treeselect__option--selected {
    background: none;
}
//menu文字
::v-deep .vue-treeselect__label {
    color: #fff;
}
//menu-icon
::v-deep .vue-treeselect__option-arrow-container .vue-treeselect__option-arrow {
    color: #2aebff !important;
}
</style>
