<template>
    <div class="app-container">
        <div class="head">
            <div class="head-title">
                <h2 class="title">{{ $t('product.product-modbus.562372-0') }}</h2>
                <span class="tips">{{ $t('product.product-modbus.562372-1') }}</span>
            </div>
            <div class="button-group">
                <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="setSlave" v-if="!enableSetSlave && productInfo.status == 1">{{ $t('product.product-modbus.562372-2') }}</el-button>
                <el-button type="primary" plain size="mini" @click="saveSlave" v-if="enableSetSlave">{{ $t('product.product-modbus.562372-3') }}</el-button>
                <el-button type="info" plain size="mini" @click="cancelSlave" v-if="enableSetSlave">{{ $t('product.product-modbus.562372-4') }}</el-button>
            </div>
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item :label="$t('product.product-modbus.562372-5')">
                    <el-tooltip placement="top">
                        <div slot="content" class="test_div">
                            {{ $t('product.product-modbus.562372-6') }}
                            <br />
                            {{ $t('product.product-modbus.562372-7') }}
                            <br />
                            {{ $t('product.product-modbus.562372-8') }}
                        </div>
                        <!-- elementui图标库：显示黑色的问号图标   -->
                        <i class="el-icon-question" style="color: dodgerblue" />
                    </el-tooltip>
                    <el-radio-group :disabled="!enableSetSlave" v-model="form.statusDeter">
                        <el-radio v-for="dict in dict.type.device_status_deter" :key="dict.value" :label="Number(dict.value)">
                            {{ dict.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.statusDeter == '1'" :label="$t('product.product-modbus.562372-9')">
                    <span>
                        <el-tooltip placement="top">
                            <div slot="content" class="test_div">
                                {{ $t('product.product-modbus.562372-10') }}
                            </div>
                            <!-- elementui图标库：显示黑色的问号图标   -->
                            <i class="el-icon-question" style="color: dodgerblue" />
                        </el-tooltip>
                    </span>
                    <el-select :disabled="!enableSetSlave" v-model="form.deterTimer" :placeholder="$t('product.product-modbus.562372-11')">
                        <el-option v-for="dict in dict.type.iot_modbus_poll_time" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                    <span style="font-size: small; color: darkgrey">{{ $t('product.product-modbus.562372-12') }}</span>
                </el-form-item>
                <el-form-item :label="$t('product.product-modbus.562372-13')">
                    <el-radio-group :disabled="!enableSetSlave" v-model="form.pollType">
                        <el-radio v-for="dict in dict.type.data_collect_type" :key="dict.value" :label="Number(dict.value)">{{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('product.product-modbus.562372-14')">
                    <el-input-number :disabled="!enableSetSlave" v-model="form.slaveId" size="small" :min="1" :max="256" :label="$t('product.product-modbus.562372-15')"></el-input-number>
                    <span style="font-size: small; color: darkgrey">{{ $t('product.product-modbus.562372-16') }}</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="head">
            <div class="head-title">
                <h2 class="title">{{ $t('product.product-modbus.562372-17') }}</h2>
                <span class="tips">{{ $t('product.product-modbus.562372-18') }}</span>
            </div>
            <div class="button-group">
                <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editIOModbus" v-if="!enableEditIO && productInfo.status == 1">{{ $t('product.product-modbus.562372-19') }}</el-button>
                <el-button type="primary" plain size="mini" @click="submitFormIO" v-if="enableEditIO">{{ $t('product.product-modbus.562372-22') }}</el-button>
                <el-button type="info" plain size="mini" @click="handleCancelIO" v-if="enableEditIO">{{ $t('product.product-modbus.562372-23') }}</el-button>
                <div class="right-btns">
                    <el-button type="primary" plain icon="el-icon-edit" v-if="productInfo.status == 1" size="mini" @click.stop="batchImport('isSelectIo')">{{ $t('product.product-modbus.562372-20') }}</el-button>
                    <el-button plain icon="el-icon-edit" v-if="productInfo.status == 1" size="mini" @click.stop="exportModbus('isSelectIo')">{{ $t('product.product-modbus.562372-21') }}</el-button>
                </div>
            </div>
        </div>

        <el-table style="margin-bottom: 10px" v-loading="loadingIO" :data="configList" :key="configTableKey" data-key="id" ref="IOTable">
            <el-table-column :label="$t('product.product-modbus.562372-24')" align="center" prop="sort"></el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-25')" align="center" prop="identifier">
                <template slot-scope="scope">
                    <el-select
                        filterable
                        :disabled="!enableEditIO"
                        v-model="scope.row.identifier"
                        :placeholder="$t('product.product-modbus.562372-26')"
                        :ref="`selectIo${scope.$index}`"
                        size="mini"
                        @change="(e) => updateSelectThingsModel({ newVal: e, oldVal: $refs[`selectIo${scope.$index}`].value, justiceSelect: 'isSelectIo' })"
                    >
                        <el-option key="0" label="" value="" disabled style="width: 300px">
                            <span style="float: left">{{ $t('product.product-modbus.562372-27') }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ $t('product.product-modbus.562372-28') }}</span>
                        </el-option>
                        <el-option v-for="item in thingsModelList" :key="item.identifier" :label="`${item.modelName} (${item.identifier})`" :value="item.identifier" style="width: 300px" :disabled="!item.isSelectIo">
                            <span style="float: left">{{ item.modelName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.identifier }}</span>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-29')" align="center" prop="slave">
                <template slot-scope="scope">
                    <el-input-number :disabled="!enableEditIO" v-model="scope.row.slave" size="small" :min="1" :max="256" :label="$t('product.product-modbus.562372-29')"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-30')" align="center" prop="address">
                <template slot-scope="scope">
                    <el-input-number :disabled="!enableEditIO" v-model="scope.row.address" size="small" :min="0" :max="400000" :label="$t('product.product-modbus.562372-30')"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-31')" align="center" prop="isReadonly">
                <template slot-scope="scope">
                    <el-radio-group :disabled="!enableEditIO" size="mini" v-model="scope.row.isReadonly">
                        <el-radio-button label="0">{{ $t('product.product-modbus.562372-32') }}</el-radio-button>
                        <el-radio-button label="1">{{ $t('product.product-modbus.562372-33') }}</el-radio-button>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-311')" align="center" prop="bitOrder">
                <template slot-scope="scope">
                    <el-input-number :disabled="!enableEditIO" v-model="scope.row.bitOrder" size="small" :min="0" :max="15" :label="$t('product.product-modbus.562372-311')"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-34')" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="enableEditIO" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row, scope.$index, configList, 'isSelectIo')" v-hasPermi="['iot:config:remove']">
                        {{ $t('product.product-modbus.562372-35') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParamsIO.pageNum" :limit.sync="queryParamsIO.pageSize" @pagination="getIOList" />

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-if="enableEditIO">{{ $t('product.product-modbus.562372-36') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddBatch('isSelectIo')" v-if="enableEditIO">{{ $t('product.product-modbus.562372-37') }}</el-button>
            </el-col>
        </el-row>

        <div class="head">
            <div class="head-title">
                <h2 class="title">{{ $t('product.product-modbus.562372-38') }}</h2>
                <span class="tips">{{ $t('product.product-modbus.562372-39') }}</span>
            </div>
            <div class="button-group">
                <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="editDataModbus" v-if="!enableEditData && productInfo.status == 1">{{ $t('product.product-modbus.562372-19') }}</el-button>
                <el-button type="primary" plain size="mini" @click="submitFormData" v-if="enableEditData">{{ $t('product.product-modbus.562372-22') }}</el-button>
                <el-button type="info" plain size="mini" @click="handleCancelData" v-if="enableEditData">{{ $t('product.product-modbus.562372-23') }}</el-button>
                <div class="right-btns">
                    <el-button type="primary" plain icon="el-icon-edit" v-if="productInfo.status == 1" size="mini" @click.stop="batchImport('isSelectData')">{{ $t('product.product-modbus.562372-40') }}</el-button>
                    <el-button plain icon="el-icon-edit" v-if="productInfo.status == 1" size="mini" @click.stop="exportModbus('isSelectIo')">{{ $t('product.product-modbus.562372-41') }}</el-button>
                </div>
            </div>
        </div>

        <el-table style="margin-bottom: 10px" v-loading="loadingData" :data="dataModbusList" :key="dataTableKey" ref="Dataable">
            <el-table-column :label="$t('product.product-modbus.562372-24')" align="center" prop="sort"></el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-25')" align="center" prop="identifier" width="250px">
                <template slot-scope="scope">
                    <el-select
                        filterable
                        :disabled="!enableEditData"
                        v-model="scope.row.identifier"
                        :placeholder="$t('product.product-modbus.562372-26')"
                        size="mini"
                        :ref="`selectData${scope.$index}`"
                        @change="(e) => updateSelectThingsModel({ newVal: e, oldVal: $refs[`selectData${scope.$index}`].value, justiceSelect: 'isSelectData' })"
                    >
                        <el-option key="0" label="" value="" disabled style="width: 300px">
                            <span style="float: left">{{ $t('product.product-modbus.562372-27') }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ $t('product.product-modbus.562372-28') }}</span>
                        </el-option>
                        <el-option v-for="item in thingsModelList" :key="item.identifier" :label="`${item.modelName} (${item.identifier})`" :value="item.identifier" style="width: 300px" :disabled="!item.isSelectData">
                            <!-- 判断是否可选 -->
                            <span style="float: left">{{ item.modelName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.identifier }}</span>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-29')" align="center" prop="identifier" width="170px">
                <template slot-scope="scope">
                    <el-input-number :disabled="!enableEditData" v-model="scope.row.slave" size="small" :min="1" :max="256" :label="$t('product.product-modbus.562372-29')"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-30')" align="center" prop="address" width="170px">
                <template slot-scope="scope">
                    <el-input-number :disabled="!enableEditData" v-model="scope.row.address" size="small" :min="0" :max="400000" :label="$t('product.product-modbus.562372-30')"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-31')" align="center" prop="isReadonly" width="170px">
                <template slot-scope="scope">
                    <el-radio-group :disabled="!enableEditData" size="mini" v-model="scope.row.isReadonly">
                        <el-radio-button label="0">{{ $t('product.product-modbus.562372-32') }}</el-radio-button>
                        <el-radio-button label="1">{{ $t('product.product-modbus.562372-33') }}</el-radio-button>
                    </el-radio-group>
                    <!-- <el-tag v-show="!enableEditData">{{scope.row.isReadonly=='0'?'只读':'读写'}}</el-tag> -->
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-42')" align="center" prop="dataType" width="200px">
                <template slot-scope="scope">
                    <el-select :disabled="!enableEditData" size="mini" v-model="scope.row.dataType" :placeholder="$t('product.product-modbus.562372-42')" style="display: inline-block; padding-right: 10px">
                        <el-option v-for="dict in dict.type.iot_modbus_data_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-43')" align="center" prop="quantity" width="170px">
                <template slot-scope="scope">
                    <el-input-number :disabled="!enableEditData" v-model="scope.row.quantity" size="small" :min="1" :max="256" :label="$t('product.product-modbus.562372-43')"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column :label="$t('product.product-modbus.562372-34')" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="enableEditData" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row, scope.$index, dataModbusList, 'isSelectData')" v-hasPermi="['iot:config:remove']">
                        {{ $t('product.product-modbus.562372-35') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="dataTotal > 0" :total="dataTotal" :page.sync="queryParamsData.pageNum" :limit.sync="queryParamsData.pageSize" @pagination="getDataList" />

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddData" v-if="enableEditData">{{ $t('product.product-modbus.562372-44') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddBatch('isSelectData')" v-if="enableEditData">{{ $t('product.product-modbus.562372-45') }}</el-button>
            </el-col>
        </el-row>

        <!-- 选择物模型 -->
        <things-list ref="thingsListRef" :productId="productId" @productEvent="getThingsData($event)" :justiceSelect="justiceSelect" />
        <!-- 批量导入 -->
        <import-batch ref="importBatchRef" :productId="productId" @productEvent="getThingsData($event)" :justiceSelect="justiceSelect" />
    </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig, addBatch } from '@/api/iot/modbusConfig';
import { getlListModbus } from '@/api/iot/model';
import thingsList from './things-model-list';
import importBatch from './components/batchImportModbus';
import Sortable from 'sortablejs';
import { addOrUpdate, addParams, getByProductId, updateParams } from '@/api/iot/params';
import { addFirmware, updateFirmware } from '@/api/iot/firmware';
export default {
    name: 'product-modbus',
    dicts: ['iot_modbus_data_type', 'iot_yes_no', 'data_collect_type', 'device_status_deter', 'iot_modbus_poll_time'],
    props: {
        product: {
            type: Object,
            default: null,
        },
    },
    components: {
        thingsList,
        importBatch,
    },
    watch: {
        // 获取到父组件传递的productId后，刷新列表
        product: function (newVal, oldVal) {
            this.productInfo = newVal;
            if (this.productInfo && this.productInfo.productId != 0) {
                this.thingsModelParams.productId = this.productInfo.productId;
                this.queryParamsIO.productId = this.productInfo.productId;
                this.queryParamsData.productId = this.productInfo.productId;
                this.productId = this.productInfo.productId;
                this.getIOList();
                this.getDataList();
                this.getThingsModelList();
                this.getParams();
            }
        },
        enableEditIO: function (n, old) {
            //设置行是否拖拽
            if (this.sortableIo) this.sortableIo.option('disabled', !n);
            //关闭编辑刷新页面
            if (!n) {
                this.getIOList();
                this.getThingsModelList();
            }
            //清空删除数组
            this.delIoIds = [];
            this.getThingsModelList();
        },
        enableEditData: function (n, old) {
            //设置行是否拖拽
            if (this.sortableData) this.sortableData.option('disabled', !n);
            //关闭编辑刷新页面
            if (!n) {
                this.getDataList();
                this.getThingsModelList();
            }
            //清空删除数组
            this.delDataIds = [];
        },
    },
    data() {
        return {
            // 遮罩层
            loadingIO: true,
            loadingData: true,
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
            // modbus配置表格数据
            configList: [],
            //io表格是否可以编辑
            enableEditIO: false,
            //子设备配置是否可编辑
            enableSetSlave: false,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParamsIO: {
                pageNum: 1,
                pageSize: 10,
                identifier: null,
                address: null,
                isReadonly: null,
                dataType: null,
                quantity: null,
                type: 1,
                productId: 0,
            },
            // 查询参数
            queryParamsData: {
                pageNum: 1,
                pageSize: 10,
                identifier: null,
                address: null,
                isReadonly: null,
                dataType: null,
                quantity: null,
                type: 2,
                productId: 0,
            },
            //产品id
            productId: 0,
            //数据寄存器
            dataModbusList: [],
            //io表格是否可以编辑
            enableEditData: false,
            //数据寄存器总条数
            dataTotal: 0,
            // 数据寄存器遮罩层
            dataLoading: true,

            //可选属性
            thingsModelList: [],
            //物模型遮罩层
            thingsLoading: true,
            //thingsModel
            thingsModelParams: {
                pageNum: 1,
                pageSize: 1000,
                productId: 0,
            },
            thingsTotal: 0,
            // 表单参数
            form: {
                statusDeter: 1,
                slaveId: 1,
                pollType: 0,
                deterTimer: '300',
            },
            productInfo: {},
            // 表单校验
            rules: {
                identifier: [{ required: true, message: this.$t('product.product-modbus.562372-46'), trigger: 'blur' }],
                address: [{ required: true, message: this.$t('product.product-modbus.562372-47'), trigger: 'blur' }],
                isReadonly: [{ required: true, message: this.$t('product.product-modbus.562372-48'), trigger: 'blur' }],
                dataType: [{ required: true, message: this.$t('product.product-modbus.562372-49'), trigger: 'change' }],
                quantity: [{ required: true, message: this.$t('product.product-modbus.562372-50'), trigger: 'blur' }],
                type: [{ required: true, message: this.$t('product.product-modbus.562372-51'), trigger: 'change' }],
            },
            //IO行拖拽对象
            sortableIo: null,
            //ioTable的key值，主要用于拖拽后重绘
            configTableKey: 0,
            //ioTable删除的id
            delIoIds: [],
            //数据寄存器行拖拽对象
            sortableData: null,
            //dataTable的key值，主要用于拖拽后重绘
            dataTableKey: 1000,
            //dataTable删除的id
            delDataIds: [],
            //判断多选物模型是io还是data,isSelectIo是判断是否可选io的，isSelectData是判断数据寄存器的，都是false不可选，true可选
            justiceSelect: 'isSelectData',
        };
    },
    mounted() {
        this.rowDropIo();
        this.rowDropData();
    },
    methods: {
        /** 查询modbusIO寄存器列表 */
        getIOList() {
            this.loadingIO = true;
            listConfig(this.queryParamsIO).then((response) => {
                this.configList = response.rows;
                this.total = response.total;
                this.loadingIO = false;
            });
        },
        /** 查询modbus数据寄存器列表 */
        getDataList() {
            this.loadingData = true;
            listConfig(this.queryParamsData).then((response) => {
                this.dataModbusList = response.rows;
                this.dataTotal = response.total;
                this.loadingData = false;
            });
            this.$nextTick(() => {
                this.$refs.Dataable.bodyWrapper.scrollTop = 0;
            });
        },
        /** 查询产品物模型列表 */
        getThingsModelList() {
            this.thingsLoading = true;
            getlListModbus(this.thingsModelParams).then((response) => {
                this.$refs.thingsListRef.modelList = response.rows;
                this.thingsModelList = response.rows;
                this.thingsTotal = response.total;
                this.thingsLoading = false;
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
                statusDeter: 1,
                slaveId: 1,
                // pollType: '0',
                deterTime: '300',
            };
            this.resetForm('form');
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增IO寄存器行操作 */
        handleAdd() {
            var d = {
                identifier: '',
                slave: 1,
                address: 1,
                isReadonly: 1,
                type: 1,
                sort: this.configList.length + 1,
            };
            this.configList.push(d);
            setTimeout(() => {
                this.$refs.IOTable.setCurrentRow(d);
            }, 10);
        },

        /** 新增数据寄存器行操作 */
        handleAddData() {
            var d = {
                identifier: '',
                slave: 1,
                address: 1,
                isReadonly: 1,
                dataType: 'ushort',
                quantity: 1,
                type: 2,
                sort: this.dataModbusList.length + 1,
            };
            this.dataModbusList.push(d);
            setTimeout(() => {
                this.$refs.Dataable.setCurrentRow(d);
            }, 10);
        },

        handleAddBatch(justiceSelect) {
            this.justiceSelect = justiceSelect;
            this.$refs.thingsListRef.open = true;
            this.$refs.thingsListRef.selectedList = justiceSelect == 'isSelectData' ? this.dataModbusList : this.configList;
            this.$refs.thingsListRef.getList();
        },
        /**点击编辑IO控制器*/
        editIOModbus() {
            this.enableEditIO = !this.enableEditIO;
        },
        /**点击取消IO寄存器编辑按钮*/
        handleCancelIO() {
            this.enableEditIO = !this.enableEditIO;
        },
        /**点击取消数据寄存器编辑按钮*/
        handleCancelData() {
            this.enableEditData = !this.enableEditData;
        },
        /**点击编辑数据寄存器*/
        editDataModbus() {
            this.enableEditData = !this.enableEditData;
        },

        /** IO寄存器提交按钮 */
        submitFormIO() {
            const configList = [];
            this.configList.forEach((config, index) => {
                if (config.identifier) {
                    config.sort = configList.length + 1;
                    configList.push(config);
                }
            });
            this.loadingIO = true;
            const data = { productId: this.productId, configList: configList, delIds: this.delIoIds };
            addBatch(data)
                .then((response) => {
                    this.$modal.msgSuccess('保存成功');
                    this.open = false;
                    this.loadingIO = false;
                    this.enableEditIO = false;
                })
                .catch((err) => {
                    this.loadingIO = false;
                });
        },
        /** 数据寄存器提交按钮 */
        submitFormData() {
            const dataModbusList = [];
            this.dataModbusList.forEach((dataModbus, index) => {
                if (dataModbus.identifier) {
                    dataModbus.sort = dataModbusList.length + 1;
                    dataModbusList.push(dataModbus);
                }
            });
            this.loadingData = true;
            const data = { productId: this.productId, configList: dataModbusList, delIds: this.delDataIds };
            addBatch(data)
                .then((response) => {
                    this.$modal.msgSuccess(this.$t('product.product-modbus.562372-52'));
                    this.open = false;
                    this.enableEditData = false;
                    this.loadingData = false;
                })
                .catch((err) => {
                    this.loadingData = false;
                });
        },
        /** 删除按钮操作 */
        handleDelete(row, index, list, justiceSelect) {
            const item = list.splice(index, 1)[0];
            //如果是删除数据寄存器，并且有id就存id
            if (justiceSelect == 'isSelectData' && row.id) this.delDataIds.push(row.id);
            //如果是删除io，并且有id就存id
            if (justiceSelect == 'isSelectIo' && row.id) this.delIoIds.push(row.id);
            //处理选项是否可选
            this.updateSelectThingsModel({ justiceSelect, oldVal: item.identifier });
        },

        /*获取选择的物模型*/
        getThingsData(ids) {
            const list = this.justiceSelect == 'isSelectData' ? this.dataModbusList : this.configList;
            ids.forEach((id, index) => {
                const findIndex = list.findIndex((item) => item.identifier == id);
                if (findIndex == -1) {
                    list.push({
                        identifier: id,
                        slave: 1,
                        address: 1,
                        isReadonly: 1,
                        dataType: 'ushort',
                        quantity: 1,
                        type: this.justiceSelect == 'isSelectData' ? 2 : 1,
                        sort: list.length + 1,
                    });
                    this.updateSelectThingsModel({ justiceSelect: this.justiceSelect, newVal: id });
                }
            });
        },

        /**
         * io拖拽行
         */
        rowDropIo() {
            const tbodyIo = this.$refs.IOTable.$el.children[2].children[0].children[1];
            this.sortableIo = new Sortable(tbodyIo, {
                disabled: true,
                onEnd: ({ newIndex, oldIndex, to }) => {
                    this.dealDrop(this.configList, newIndex, oldIndex);
                    this.configTableKey++;
                    this.sortableIo.destroy();
                    this.$nextTick(() => {
                        this.rowDropIo();
                        this.sortableIo.option('disabled', false);
                    });
                },
            });
        },
        /**
         * 数据寄存器拖拽
         */
        rowDropData() {
            const tbodyData = this.$refs.Dataable.$el.children[2].children[0].children[1];
            this.sortableData = new Sortable(tbodyData, {
                disabled: true,
                onEnd: ({ newIndex, oldIndex, to }) => {
                    this.dealDrop(this.dataModbusList, newIndex, oldIndex);
                    this.dataTableKey++;
                    this.sortableData.destroy();
                    this.$nextTick(() => {
                        this.rowDropData();
                        this.sortableData.option('disabled', false);
                    });
                },
            });
        },
        //处理拖拽后的数据
        dealDrop(list, newIndex, oldIndex) {
            if (oldIndex == newIndex) return;
            //找到选中那列，移除出数组
            const curRow = list.splice(oldIndex, 1)[0];
            //将选择中那列查到新位置
            list.splice(newIndex, 0, curRow);
        },
        /**
         * 更新物模型是否可选
         */
        updateSelectThingsModel({ oldVal, newVal, justiceSelect }) {
            //直接改前后值
            const oldIndex = oldVal ? this.thingsModelList.findIndex((thingsModel) => thingsModel.identifier == oldVal) : -1;
            const newIndex = newVal ? this.thingsModelList.findIndex((thingsModel) => thingsModel.identifier == newVal) : -1;
            if (oldIndex != -1) this.thingsModelList[oldIndex][justiceSelect] = true;
            if (newIndex != -1) this.thingsModelList[newIndex][justiceSelect] = false;
        },
        /**批量导入 */
        batchImport(justiceSelect) {
            this.justiceSelect = justiceSelect;
            this.$refs.importBatchRef.upload.importDeviceDialog = true;
        },
        /**导出 */
        exportModbus(justiceSelect) {
            const type = justiceSelect == 'isSelectData' ? 2 : 1;
            const name = justiceSelect == 'isSelectData' ? this.$t('product.product-modbus.562372-17') : this.$t('product.product-modbus.562372-38');
            this.download('/modbus/config/exportModbus?type=' + type, {}, `${name}_${new Date().getTime()}.xlsx`);
        },
        /**获取modbus参数配置*/
        getParams() {
            const params = { productId: this.productId };
            getByProductId(params).then((response) => {
                if (response.data) {
                    this.form = response.data;
                }
            });
        },
        /**编辑modbus配置参数*/
        setSlave() {
            this.enableSetSlave = !this.enableSetSlave;
        },

        /** 保存modbus配置参数 */
        saveSlave() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.enableSetSlave = !this.enableSetSlave;
                    this.form.productId = this.productId;
                    addOrUpdate(this.form).then((response) => {
                        this.$modal.msgSuccess(this.$t('product.product-modbus.562372-53'));
                    });
                }
            });
        },
        /**取消*/
        cancelSlave() {
            this.enableSetSlave = !this.enableSetSlave;
        },
    },
};
</script>

<style lang="scss">
.el-input-number.is-disabled .el-input__inner {
    color: #111315;
}

.el-select .el-input.is-disabled .el-input__inner {
    color: #0c0d0e;
}

.el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner {
    background-color: #409eff !important;
}

.head {
    .head-title {
        margin-bottom: 12px;

        .title {
            margin-top: 16px;
            margin-bottom: 2px;
            color: #fff;
        }

        .tips {
            color: grey;
            line-height: 36px;
            font-size: 14px;
        }
    }

    .button-group {
        margin-bottom: 16px;
        display: flex;

        .right-btns {
            margin-left: auto;
        }
    }
}

.test_div {
    width: 300px;
    padding: 5px;
}
</style>
