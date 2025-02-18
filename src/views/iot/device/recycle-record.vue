<template>
    <el-dialog :modal="false" :title="$t('device.recycle-record.845969-0')" :visible.sync="open" width="900px">
        <div style="margin-top: -55px">
            <el-divider style="margin-top: -30px"></el-divider>
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                <el-form-item prop="operateDeptId">
                    <treeselect
                        v-model="queryParams.operateDeptId"
                        :options="deptOptions"
                        :show-count="true"
                        style="width: 180px; background-color: black !important; color: #f8f8f9"
                        :placeholder="$t('device.recycle-record.845969-1')"
                    />
                </el-form-item>
                <el-form-item prop="productId">
                    <el-select v-model="queryParams.productId" :placeholder="$t('device.allot-record.155854-2')" style="width: 180px" clearable>
                        <el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="serialNumber">
                    <el-input v-model="queryParams.serialNumber" :placeholder="$t('device.device-edit.148398-7')" clearable size="small" style="width: 180px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('device.recycle-record.845969-4') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('device.recycle-record.845969-5') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table v-loading="loading" ref="singleTable" :data="dataList" size="mini">
                <el-table-column :label="$t('device.recycle-record.845969-1')" align="left" prop="operateDeptName" />
                <el-table-column :label="$t('device.recycle-record.845969-6')" align="left" min-width="120" prop="targetDeptName" />
                <el-table-column :label="$t('device.device-edit.148398-1')" align="left" prop="deviceName" />
                <el-table-column label="DeviceKey" align="left" prop="deviceId" />
                <el-table-column :label="$t('device.device-edit.148398-7')" align="left" prop="serialNumber" />
                <el-table-column :label="$t('device.allot-record.155854-2')" align="left" prop="productName" />
                <el-table-column :label="$t('device.recycle-record.845969-8')" align="left" prop="createTime" />
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
    </el-dialog>
</template>

<script>
import { listProduct } from '@/api/iot/product';
import { listRecycleRecord } from '@/api/iot/device';
import { deptsTreeSelect } from '@/api/system/user';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
    name: 'recycleRecord',
    dicts: [],
    components: {
        Treeselect,
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 打开选择产品对话框
            open: false,
            // 产品列表
            productList: [],
            dataList: [],
            //时间范围
            daterangeTime: [],
            deptOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                operateDeptId: null,
                productId: null,
                serialNumber: '',
                type: 2,
            },
        };
    },
    created() {
        this.getProductList();
        this.getDeptTree();
    },
    methods: {
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
                this.loading = false;
            });
        },
        //查询导入记录列表
        getList() {
            this.loading = true;
            listRecycleRecord(this.queryParams).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 查询机构下拉树结构 */
        getDeptTree() {
            deptsTreeSelect().then((response) => {
                this.deptOptions = response.data;
            });
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
        /**关闭对话框 */
        closeDialog() {
            this.open = false;
        },
    },
};
</script>
