<template>
    <div class="log-wrap">
        <el-card class="top-card-wrap">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item :label="$t('notify.log.333543-0')" prop="channelId">
                    <el-input v-model="queryParams.channelId" :placeholder="$t('notify.log.333543-1')" clearable type="number" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('notify.log.333543-2')" prop="notifyTemplateId" label-width="110px">
                    <el-input v-model="queryParams.notifyTemplateId" :placeholder="$t('notify.log.333543-3')" clearable type="number" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('notify.log.333543-4')" prop="sendAccount">
                    <el-input v-model="queryParams.sendAccount" :placeholder="$t('notify.log.333543-5')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('notify.log.333543-6')" prop="serviceCode">
                    <el-select v-model="queryParams.serviceCode" :placeholder="$t('notify.log.333543-7')" clearable style="width: 100%; display: inline-block">
                        <el-option v-for="dict in dict.type.notify_service_code" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('notify.log.333543-8')">
                    <el-date-picker
                        v-model="dateRange"
                        style="width: 240px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        :start-placeholder="$t('notify.log.333543-9')"
                        :end-placeholder="$t('notify.log.333543-10')"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="card-wrap">
            <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column :label="$t('notify.log.333543-0')" align="left" prop="channelId" width="100" />
                <el-table-column :label="$t('notify.log.333543-11')" align="left" prop="channelName" />
                <el-table-column :label="$t('notify.log.333543-2')" align="left" prop="notifyTemplateId" width="100" />
                <el-table-column :label="$t('notify.log.333543-12')" align="left" prop="templateName" />
                <el-table-column :label="$t('notify.log.333543-6')" align="left" prop="serviceCode">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.notify_service_code" :value="scope.row.serviceCode" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('notify.log.333543-4')" align="left" prop="sendAccount" min-width="150" />
                <el-table-column :label="$t('notify.log.333543-13')" align="center" prop="sendStatus" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sendStatus == 0" class="status-error-wrap">{{ $t('notify.log.333543-14') }}</span>
                        <span v-if="scope.row.sendStatus == 1" class="status-success-wrap">{{ $t('notify.log.333543-15') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('notify.log.333543-16')" align="left" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="160">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['notify:log:query']">{{ $t('detail') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['notify:log:remove']">{{ $t('del') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 通知日志详情对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
                <div style="margin-top: -55px" class="dialog-wrap">
                    <el-divider style="margin-top: -30px"></el-divider>
                    <el-form ref="form" :model="form" label-width="80px" disabled>
                        <el-form-item :label="$t('notify.log.333543-4')" prop="sendAccount">
                            <el-input v-model="form.sendAccount" :placeholder="$t('notify.log.333543-5')" />
                        </el-form-item>
                        <el-form-item :label="$t('notify.log.333543-17')">
                            <el-input type="textarea" :rows="8" :placeholder="$t('notify.log.333543-18')" v-model="form.resultContent"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('notify.log.333543-19')">
                            <editor v-model="form.msgContent" :min-height="192" :readOnly="true" />
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { listLog, getLog, delLog, addLog, updateLog } from '@/api/notify/log';

export default {
    name: 'Log',
    dicts: ['notify_message_type', 'iot_is_enable', 'notify_service_code'],
    data() {
        return {
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
            // 通知日志表格数据
            logList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            dateRange: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                notifyTemplateId: null,
                channelId: null,
                msgContent: null,
                sendAccount: null,
                sendStatus: null,
                resultContent: null,
                dateRange: '',
                serviceCode: null,
            },
            //选择时间不超过当前时间
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            // 表单参数
            form: {},
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询通知日志列表 */
        getList() {
            this.loading = true;
            listLog(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
                this.logList = response.rows;
                this.total = response.total;
                this.loading = false;
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
                id: null,
                notifyTemplateId: null,
                channelId: null,
                msgType: null,
                msgContent: null,
                sendAccount: null,
                sendStatus: null,
                resultContent: null,
                createTime: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                delFlag: null,
            };
            this.resetForm('form');
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
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('notify.log.333543-20');
        },
        /** 详情按钮操作 */
        handleView(row) {
            this.reset();
            const id = row.id || this.ids;
            getLog(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('notify.log.333543-21');
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateLog(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addLog(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('addSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(this.$t('notify.log.333543-22', [ids]))
                .then(function () {
                    return delLog(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'notify/log/export',
                {
                    ...this.queryParams,
                },
                `log_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';

.log-wrap {
    padding: 6px;

    .top-card-wrap {
        margin-bottom: 5px;
    }

    .card-wrap {
        padding-bottom: 100px;
    }
}

.dialog-wrap ::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000000 !important;
}

.dialog-wrap ::v-deep textarea[disabled],
textarea:disabled,
textarea.disabled {
    color: #000000 !important;
    background-color: #fff !important;
    font-size: 16px;
}

.status-success-wrap {
    color: #13ce66 !important;
}

.status-error-wrap {
    color: #ff4949 !important;
}
</style>
