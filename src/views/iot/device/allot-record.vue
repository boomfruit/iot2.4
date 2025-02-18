<template>
    <el-dialog :modal="false" :title="$t('device.allot-record.155854-0')" :visible.sync="open" width="70%">
        <div style="margin-top: -55px">
            <el-divider style="margin-top: -30px"></el-divider>
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                <el-form-item prop="operateDeptId" style="width: 240px">
                    <treeselect v-model="queryParams.operateDeptId" :options="deptOptions" :show-count="true" :placeholder="$t('device.allot-record.155854-1')" />
                </el-form-item>
                <el-form-item prop="productId">
                    <el-select v-model="queryParams.productId" :placeholder="$t('device.allot-record.155854-2')" filterable style="width: 240px" clearable>
                        <el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table v-loading="loading" ref="singleTable" :data="dataList" size="mini">
                <el-table-column :label="$t('device.allot-record.155854-2')" align="left" prop="productName" />
                <el-table-column align="left" prop="operateDeptName">
                    <template slot="header">
                        <span>{{ $t('device.allot-record.155854-1') }}</span>
                        <el-tooltip class="item" effect="dark" :content="$t('device.allot-record.155854-5')" placement="top" style="margin-left: 10px">
                            <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="targetDeptName">
                    <template slot="header">
                        <span>{{ $t('device.allot-import-dialog.060657-2') }}</span>
                        <el-tooltip class="item" effect="dark" :content="$t('device.allot-record.155854-7')" placement="top" style="margin-left: 10px">
                            <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.allot-record.155854-8')" align="left" prop="total" width="100" />
                <el-table-column :label="$t('device.allot-record.155854-9')" align="left" prop="successQuantity" width="100" />
                <el-table-column :label="$t('device.allot-record.155854-10')" align="left" prop="failQuantity" width="100" />
                <el-table-column :label="$t('device.allot-record.155854-11')" align="left" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.common_status_type" :value="scope.row.status" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.allot-record.155854-12')" align="left" prop="distributeTypeDesc" />
                <el-table-column :label="$t('device.allot-record.155854-13')" align="left" prop="createTime" width="200" />
                <el-table-column :label="$t('opation')" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" style="padding: 5px" icon="el-icon-download" @click="handleDownLoad(scope.row)" v-hasPermi="['iot:device:record:export']">
                            {{ $t('device.allot-record.155854-15') }}
                        </el-button>
                    </template>
                </el-table-column>
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
    name: 'allotRecord',
    dicts: ['common_status_type'],
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
                type: 3,
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
        //查询分配记录列表
        getList() {
            this.loading = true;
            listRecycleRecord(this.queryParams).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        //下载明细
        handleDownLoad(row) {
            const params = {
                parentId: row.id,
                type: 4,
            };
            this.download(
                'iot/record/export',
                {
                    ...params,
                },
                `allot_${new Date().getTime()}.xlsx`
            );
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
