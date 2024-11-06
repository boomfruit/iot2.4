<template>
    <el-dialog :title="$t('alert.notify-temp-list.555661-0')" :visible.sync="open" width="800px" append-to-body>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: -10px">
            <el-form-item :label="$t('alert.notify-temp-list.555661-1')" prop="name">
                <el-input v-model="queryParams.name" :placeholder="$t('alert.notify-temp-list.555661-2')" size="mini"
                    clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('alert.index.236501-29')" prop="channelType">
                <el-select v-model="queryParams.channelType" :placeholder="$t('alert.notify-temp-list.555661-4')"
                    clearable size="mini" style="width: 100%">
                    <el-option v-for="option in dict.type.notify_channel_type" :key="option.value" :label="option.label"
                        :value="option.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini"
                    @click="handleQuery">{{ $t('search') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="notifyTempList" @select="handleSelectionChange"
            @select-all="handleSelectionAll" ref="multipleTable" size="mini">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column :label="$t('alert.notify-temp-list.555661-7')" width="50" align="center" prop="id" />
            <el-table-column :label="$t('alert.notify-temp-list.555661-1')" align="center" prop="name"
                min-width="100" />
            <el-table-column :label="$t('alert.index.236501-29')" align="center" prop="channelType">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.notify_channel_type" :value="scope.row.channelType" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('alert.index.236501-30')" align="center" prop="channelName"></el-table-column>
            <el-table-column :label="$t('alert.index.236501-31')" align="center" prop="provider"></el-table-column>
            <el-table-column :label="$t('alert.notify-temp-list.555661-11')" align="center" prop="status">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" @change="handleStatus(scope.row)" disabled :active-value="1"
                        :inactive-value="0" />
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
import { listTemplate } from '@/api/notify/template';

export default {
    name: 'notifyTempList',
    dicts: ['notify_channel_type', 'notify_service_code'],
    data() {
        return {
            // 通知模板列表数据
            notifyTempList: [],
            // 选中的通知模板IDs
            ids: [],
            // 选中的通知模板
            selectNotifyTemps: [],
            // 加载
            loading: true,
            // 总条数
            total: 0,
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                serviceCode: 'alert',
                name: null,
                channelType: null,
            },
        };
    },
    created() { },
    methods: {
        /** 确定后返回数据 */
        handleEmitData() {
            this.$emit('notifyEvent', this.selectNotifyTemps);
            this.open = false;
        },
        /** 查询通知模版列表 */
        getList() {
            this.loading = true;
            listTemplate(this.queryParams).then((response) => {
                this.notifyTempList = response.rows;
                this.total = response.total;
                this.loading = false;
                // 设置场景选中
                this.notifyTempList.forEach((row) => {
                    this.$nextTick(() => {
                        if (this.ids.some((x) => x === row.id)) {
                            this.$refs.multipleTable.toggleRowSelection(row, true);
                        }
                    });
                });
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.ids = [];
            this.selectNotifyTemps = [];
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection, row) {
            // 场景ID是否存在于原始设备ID数组中
            let index = this.ids.indexOf(row.id);
            // 是否选中
            let value = selection.indexOf(row);
            if (index == -1 && value != -1) {
                // 不存在且选中
                this.ids.push(row.id);
                this.selectNotifyTemps.push(row);
            } else if (index != -1 && value == -1) {
                // 存在且取消选中
                this.ids.splice(index, 1);
                this.selectNotifyTemps.splice(index, 1);
            }
        },
        // 全选事件处理
        handleSelectionAll(selection) {
            for (let i = 0; i < this.notifyTempList.length; i++) {
                // 场景ID是否存在于原始设备ID数组中
                let index = this.ids.indexOf(this.notifyTempList[i].id);
                // 是否选中
                let value = selection.indexOf(this.notifyTempList[i]);
                if (index == -1 && value != -1) {
                    // 不存在且选中
                    this.ids.push(this.notifyTempList[i].sceneId);
                    this.selectNotifyTemps.push(this.notifyTempList[i]);
                } else if (index != -1 && value == -1) {
                    // 存在且取消选中
                    this.ids.splice(index, 1);
                    this.selectNotifyTemps.splice(index, 1);
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
