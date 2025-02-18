<template>
    <el-dialog :modal="false" :title="$t('device.import-record.086254-0')" :visible.sync="open" width="900px">
        <div style="margin-top: -55px">
            <el-divider style="margin-top: -30px"></el-divider>
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                <el-form-item prop="productId">
                    <el-select v-model="queryParams.productId" :placeholder="$t('device.allot-record.155854-2')" style="width: 180px" clearable>
                        <el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status">
                    <el-select v-model="queryParams.status" :placeholder="$t('device.import-record.086254-2')" style="width: 180px" clearable>
                        <el-option v-for="dict in dict.type.common_status_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="daterangeTime"
                        size="small"
                        style="width: 180px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="$t('device.import-record.086254-')"
                        :end-placeholder="$t('device.import-record.086254-4')"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('device.import-record.086254-5') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('device.import-record.086254-6') }}</el-button>
                </el-form-item>
            </el-form>
            <el-table v-loading="loading" ref="singleTable" :data="dataList">
                <el-table-column :label="$t('device.import-record.086254-7')" align="left" prop="id" width="80" />
                <el-table-column :label="$t('device.import-record.086254-8')" align="center" prop="total" />
                <el-table-column :label="$t('device.import-record.086254-13')" align="center" prop="productName" />
                <el-table-column :label="$t('device.import-record.086254-9')" align="center" prop="successQuantity" />
                <el-table-column :label="$t('device.import-record.086254-10')" align="center" prop="failQuantity" />
                <el-table-column :label="$t('device.import-record.086254-11')" align="center" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.common_status_type" :value="scope.row.status" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.import-record.086254-12')" align="center" prop="createTime" width="200" />
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
    </el-dialog>
</template>

<script>
import { listProduct } from '@/api/iot/product';
import { listImportRecord } from '@/api/iot/device';

export default {
    name: 'importRecord',
    dicts: ['common_status_type'],
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
            statusList: [],
            dataList: [],
            //时间范围
            daterangeTime: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                productName: null,
                type: 1,
            },
        };
    },
    created() {
        this.getProductList();
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
            listImportRecord(this.addDateRange(this.queryParams, this.daterangeTime)).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
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
