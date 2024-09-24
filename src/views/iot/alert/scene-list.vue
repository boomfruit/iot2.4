<template>
    <el-dialog :title="$t('alert.scene-list.591934-0')" :visible.sync="openScene" width="800px" append-to-body>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: -10px">
            <el-form-item :label="$t('alert.scene-list.591934-1')" prop="sceneName">
                <el-input v-model="queryParams.sceneName" :placeholder="$t('alert.scene-list.591934-2')" clearable
                    size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">{{ $t('reset') }}</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="sceneList" @select="handleSelectionChange" @select-all="handleSelectionAll"
            ref="multipleTable" size="mini">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column :label="$t('alert.scene-list.591934-1')" align="center" prop="sceneName" />
            <el-table-column :label="$t('alert.index.236501-44')" align="center" prop="enable" width="">
                <template slot-scope="scope">
                    <el-tag type="success" size="small" v-if="scope.row.enable == 1">{{ $t('alert.index.236501-45')
                        }}</el-tag>
                    <el-tag type="danger" size="small" v-if="scope.row.enable == 2">{{ $t('alert.index.236501-46')
                        }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('alert.index.236501-19')" align="center" prop="cond">
                <template slot-scope="scope">
                    <span v-if="scope.row.cond == 1">{{ $t('alert.index.236501-20') }}</span>
                    <span v-if="scope.row.cond == 2">{{ $t('alert.index.236501-21') }}</span>
                    <span v-if="scope.row.cond == 3">{{ $t('alert.index.236501-22') }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('alert.index.236501-23')" align="center" prop="executeMode">
                <template slot-scope="scope">
                    <span v-if="scope.row.executeMode == 1">{{ $t('alert.index.236501-24') }}</span>
                    <span v-if="scope.row.executeMode == 2">{{ $t('alert.index.236501-25') }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('sip.mediaServer.998535-4')" align="center" prop="createTime" width="100">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <div slot="footer" style="width: 100%">
            <el-button type="primary" @click="handleEmitData">{{ $t('confirm') }}</el-button>
            <el-button @click="cancel">{{ $t('cancel') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { listScene } from '@/api/iot/scene';

export default {
    name: 'sceneList',
    data() {
        return {
            // 打开场景列表
            openScene: false,
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
            // 场景联动表格数据
            sceneList: [],
            // 选中的场景
            selectScenes: [],
            // 弹出层标题
            title: '',
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hasAlert: 1,
                sceneName: null,
            },
            form: {},
        };
    },
    created() { },
    methods: {
        /** 确定后返回数据 */
        handleEmitData() {
            this.$emit('sceneEvent', this.selectScenes);
            this.openScene = false;
        },
        /** 查询场景联动列表 */
        getList() {
            this.loading = true;
            listScene(this.queryParams).then((response) => {
                this.sceneList = response.rows;
                this.total = response.total;
                this.loading = false;
                // 设置场景选中
                this.sceneList.forEach((row) => {
                    this.$nextTick(() => {
                        if (this.ids.some((x) => x === row.sceneId)) {
                            this.$refs.multipleTable.toggleRowSelection(row, true);
                        }
                    });
                });
            });
        },
        // 取消按钮
        cancel() {
            this.openScene = false;
            this.ids = [];
            this.selectScenes = [];
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
        // 多选框选中数据
        handleSelectionChange(selection, row) {
            // 场景ID是否存在于原始设备ID数组中
            let index = this.ids.indexOf(row.sceneId);
            // 是否选中
            let value = selection.indexOf(row);
            if (index == -1 && value != -1) {
                // 不存在且选中
                this.ids.push(row.sceneId);
                this.selectScenes.push(row);
            } else if (index != -1 && value == -1) {
                // 存在且取消选中
                this.ids.splice(index, 1);
                this.selectScenes.splice(index, 1);
            }
        },
        // 全选事件处理
        handleSelectionAll(selection) {
            for (let i = 0; i < this.sceneList.length; i++) {
                // 场景ID是否存在于原始设备ID数组中
                let index = this.ids.indexOf(this.sceneList[i].sceneId);
                // 是否选中
                let value = selection.indexOf(this.sceneList[i]);
                if (index == -1 && value != -1) {
                    // 不存在且选中
                    this.ids.push(this.sceneList[i].sceneId);
                    this.selectScenes.push(this.sceneList[i]);
                } else if (index != -1 && value == -1) {
                    // 存在且取消选中
                    this.ids.splice(index, 1);
                    this.selectScenes.splice(index, 1);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
