<template>
    <div class="app-container">
        <el-dialog :title="$t('scene.bridgelist.784127-0')" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="85px" style="margin-bottom: -10px">
                <el-form-item :label="$t('scene.bridgelist.784127-1')" prop="name">
                    <el-input v-model="queryParams.name" :placeholder="$t('scene.bridgelist.784127-2')" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('scene.bridgelist.784127-3') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">{{ $t('scene.bridgelist.784127-4') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table v-loading="loading" :data="bridgeList" @row-click="rowClick" ref="singleTable" highlight-current-row size="mini">
                <el-table-column :label="$t('scene.bridgelist.784127-5')" width="50" align="center">
                    <template slot-scope="scope">
                        <input type="radio" :checked="scope.row.isSelect" name="bridge" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scene.bridgelist.784127-6')" align="center" prop="name" />
                <el-table-column :label="$t('scene.bridgelist.784127-7')" align="center" prop="enable">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enable" active-value="1" inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scene.bridgelist.784127-8')" align="center" prop="status">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.status === '0'">{{ $t('scene.bridgelist.784127-9') }}</el-tag>
                        <el-tag type="success" v-if="scope.row.status === '1'">{{ $t('scene.bridgelist.784127-10') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scene.bridgelist.784127-11')" align="center" prop="type">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.type === 3">{{ $t('scene.bridgelist.784127-12') }}</el-tag>
                        <el-tag type="success" v-if="scope.row.type === 4">{{ $t('scene.bridgelist.784127-13') }}</el-tag>
                        <el-tag type="info" v-if="scope.row.type === 5">{{ $t('views.iot.bridge.index.525282-15') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('scene.bridgelist.784127-14')" align="center" prop="direction">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.direction === 2">{{ $t('scene.bridgelist.784127-18') }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            <div slot="footer" style="width: 100%">
                <el-button type="primary" @click="confirmSelectClient">{{ $t('scene.bridgelist.784127-17') }}</el-button>
                <el-button @click="cancel">{{ $t('scene.bridgelist.784127-16') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listBridge } from '@/api/iot/bridge';

export default {
    name: 'bridgeList',
    data() {
        return {
            // 打开场景列表
            open: false,
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 场景联动表格数据
            bridgeList: [],
            // 选中的产品编号
            selectBridgeId: 0,
            // 选中的产品
            bridge: {},
            // 弹出层标题
            title: '',
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                direction: 2,
                name: null,
                enable: null,
                status: null,
                type: 3,
                configId: null,
            },
            form: {},
        };
    },
    created() {},
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            listBridge(this.queryParams).then((response) => {
                this.bridgeList = response.rows;
                this.bridgeList.forEach((item) => {
                    item.status = '1';
                });
                this.total = response.total;
                this.loading = false;
                // 设置选中
                this.setRadioSelected(this.selectBridgeId);
            });
        },

        // 取消按钮
        cancel() {
            this.open = false;
            this.ids = [];
            this.bridge = {};
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 重置按钮操作
        handleResetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 单选数据 */
        rowClick(bridge) {
            if (bridge != null) {
                this.setRadioSelected(bridge.id);
                this.bridge = bridge;
            }
        },
        /** 设置单选按钮选中 */
        setRadioSelected(bridgeId) {
            for (let i = 0; i < this.bridgeList.length; i++) {
                if (this.bridgeList[i].id == bridgeId) {
                    this.bridgeList[i].isSelect = true;
                } else {
                    this.bridgeList[i].isSelect = false;
                }
            }
        },
        /**确定选择，产品传递给父组件 */
        confirmSelectClient() {
            //console.log(this.bridge);
            this.$emit('clientEvent', this.bridge);
            this.open = false;
        },
    },
};
</script>

<style lang="scss" scoped></style>
