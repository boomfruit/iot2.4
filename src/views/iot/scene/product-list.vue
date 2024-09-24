<template>
    <el-dialog :title="$t('device.product-list.058448-0')" :visible.sync="open" width="800px"
        :close-on-click-modal="false">
        <div style="margin-top: -55px">
            <el-divider style="margin-top: -30px"></el-divider>
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                <el-form-item :label="$t('product.index.091251-0')" prop="productName">
                    <el-input v-model="queryParams.productName" :placeholder="$t('product.index.091251-1')" clearable
                        size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search')
                        }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table v-loading="loading" ref="singleTable" :data="productList" @row-click="rowClick"
                highlight-current-row size="mini">
                <el-table-column :label="$t('select')" width="50" align="center">
                    <template slot-scope="scope">
                        <input type="radio" :checked="scope.row.isSelect" name="product" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('product.index.091251-0')" align="center" prop="productName" />
                <el-table-column :label="$t('device.product-list.058448-6')" align="center" prop="categoryName" />
                <el-table-column :label="$t('device.product-list.058448-7')" align="center" prop="tenantName" />
                <el-table-column :label="$t('device.product-list.058448-8')" align="center" prop="status" width="70">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isAuthorize == 1">{{ $t('device.product-list.058448-9')
                            }}</el-tag>
                        <el-tag type="info" v-if="scope.row.isAuthorize == 0">{{ $t('device.product-list.058448-10')
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.product-list.058448-11')" align="center" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_vertificate_method" :value="scope.row.vertificateMethod" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.product-list.058448-12')" align="center" prop="networkMethod">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_network_method" :value="scope.row.networkMethod" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.product-list.058448-13')" align="center" prop="createTime"
                    width="100">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmSelectProduct" type="primary">{{ $t('confirm') }}</el-button>
            <el-button @click="closeDialog" type="info">{{ $t('cancel') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { listProduct } from '@/api/iot/product';

export default {
    name: 'ProductList',
    dicts: ['iot_vertificate_method', 'iot_network_method'],
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
            // 选中的产品编号
            selectProductId: 0,
            // 选中的产品
            product: {},
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                productName: null,
                categoryId: null,
                categoryName: null,
                tenantId: null,
                tenantName: null,
                isSys: null,
                status: 2, //已发布
                deviceType: null,
                networkMethod: null,
                showSenior: false,
            },
        };
    },
    created() { },
    methods: {
        /** 查询产品列表 */
        getList() {
            this.loading = true;
            listProduct(this.queryParams).then((response) => {
                //产品列表初始化isSelect值，用于单选
                for (let i = 0; i < response.rows.length; i++) {
                    response.rows[i].isSelect = false;
                }
                this.productList = response.rows;
                this.total = response.total;
                this.loading = false;
                // 设置产品选中
                this.setRadioSelected(this.selectProductId);
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
        /** 单选数据 */
        rowClick(product) {
            if (product != null) {
                this.setRadioSelected(product.productId);
                this.product = product;
            }
        },
        /** 设置单选按钮选中 */
        setRadioSelected(productId) {
            for (let i = 0; i < this.productList.length; i++) {
                if (this.productList[i].productId == productId) {
                    this.productList[i].isSelect = true;
                } else {
                    this.productList[i].isSelect = false;
                }
            }
        },
        /**确定选择产品，产品传递给父组件 */
        confirmSelectProduct() {
            this.$emit('productEvent', this.product);
            this.open = false;
            this.product = null;
        },
        /**关闭对话框 */
        closeDialog() {
            this.open = false;
        },
    },
};
</script>
