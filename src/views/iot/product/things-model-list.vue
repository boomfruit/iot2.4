<template>
    <el-dialog :title="$t('product.thimgs-mopdel-list.738493-0')" :visible.sync="open" width="600px">
        <div style="margin-top: -55px">
            <el-divider style="margin-top: -30px"></el-divider>
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
                <el-form-item :label="$t('product.thimgs-mopdel-list.738493-1')" prop="productName">
                    <el-input v-model="queryParams.modelName" :placeholder="$t('product.thimgs-mopdel-list.738493-2')" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('product.thimgs-mopdel-list.738493-3') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('product.thimgs-mopdel-list.738493-4') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table v-loading="loading" :data="modelList" @selection-change="handleSelectionChange" highlight-current-row height="50vh" ref="thingsModelTable" size="mini">
                <el-table-column type="selection" width="55" align="center" :selectable="selectable" />
                <el-table-column :label="$t('product.thimgs-mopdel-list.738493-5')" align="center" prop="modelName" />
                <el-table-column :label="$t('product.thimgs-mopdel-list.738493-6')" align="center" prop="identifier" />
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmSelectProduct" type="primary">{{ $t('product.thimgs-mopdel-list.738493-7') }}</el-button>
            <el-button @click="closeDialog" type="info">{{ $t('product.thimgs-mopdel-list.738493-8') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getlListModbus } from '@/api/iot/model';

export default {
    name: 'ThingsModelList',
    props: {
        productId: {
            type: Number,
            default: 0,
        },
        justiceSelect: {
            type: String,
            default: 'isSelectData',
        },
    },
    data() {
        return {
            // 遮罩层
            loading: false,
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
            // 产品物模型表格数据
            modelList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
            },
            // 表单参数
            form: {},
            //已经选择的列表
            selectedList: [],
        };
    },
    methods: {
        /** 查询产品物模型列表 */
        getList() {
            this.loading = true;
            this.queryParams.productId = this.productId;
            getlListModbus(this.queryParams).then((response) => {
                this.modelList = response.rows;
                this.total = response.total;
                this.loading = false;
                this.$nextTick(() => {
                    this.selectedList.forEach((selected) => {
                        const findIndex = this.modelList.findIndex((model) => model.identifier == selected.identifier);
                        if (findIndex != -1) {
                            const model = this.modelList[findIndex];
                            model.isSelectData = false;
                            model.isSelectIo = false;
                            this.$refs.thingsModelTable.toggleRowSelection(model, true);
                        }
                    });
                });
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
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
            this.ids = selection.map((item) => item.identifier);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },

        /**确定选择产品，产品传递给父组件 */
        confirmSelectProduct() {
            this.$emit('productEvent', this.ids);
            this.open = false;
        },
        /**关闭对话框 */
        closeDialog() {
            this.open = false;
        },
        //是否可选
        selectable(item) {
            return item[this.justiceSelect];
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.numInputCss {
    width: 100%;
}

.numInputCss ::v-deep .el-input .el-input__inner {
    text-align: left;
}
</style>
