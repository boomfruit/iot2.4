<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item :label="$t('online.093480-0')" prop="ipaddr">
                <el-input v-model="queryParams.ipaddr" :placeholder="$t('online.093480-1')" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('user.profile.index.894502-1')" prop="userName">
                <el-input v-model="queryParams.userName" :placeholder="$t('online.093480-2')" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize)" style="width: 100%">
            <el-table-column :label="$t('online.093480-3')" type="index" align="center">
                <template slot-scope="scope">
                    <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('online.093480-4')" align="center" prop="tokenId" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('online.093480-5')" align="center" prop="userName" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('online.093480-6')" align="center" prop="deptName" />
            <el-table-column :label="$t('online.093480-7')" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('online.093480-8')" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('online.093480-9')" align="center" prop="browser" />
            <el-table-column :label="$t('online.093480-10')" align="center" prop="os" />
            <el-table-column :label="$t('online.093480-11')" align="center" prop="loginTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.loginTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleForceLogout(scope.row)" v-hasPermi="['monitor:online:forceLogout']">{{ $t('online.093480-12') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
    </div>
</template>

<script>
import { list, forceLogout } from '@/api/monitor/online';

export default {
    name: 'Online',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 表格数据
            list: [],
            pageNum: 1,
            pageSize: 10,
            // 查询参数
            queryParams: {
                ipaddr: undefined,
                userName: undefined,
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询登录日志列表 */
        getList() {
            this.loading = true;
            list(this.queryParams).then((response) => {
                this.list = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 强退按钮操作 */
        handleForceLogout(row) {
            this.$modal
                .confirm(this.$t('online.093480-12', [row.userName]))
                .then(function () {
                    return forceLogout(row.tokenId);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('online.093480-14'));
                })
                .catch(() => {});
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
