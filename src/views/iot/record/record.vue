<template>
    <div style="padding: 6px">
        <div v-if="!recordDetail">
            <el-card style="margin-bottom: 6px">
                <el-form ref="queryForm" size="small" :inline="true" label-width="86px" style="margin-bottom: -20px">
                    <el-form-item :label="$t('record.239091-0')" prop="serverId">
                        <el-select @change="chooseMediaChange" style="width: 16rem; margin-right: 1rem" v-model="mediaServerId" :placeholder="$t('record.239091-1')" :disabled="recordDetail">
                            <el-option v-for="item in mediaServerList" :key="item.serverId" :label="item.serverId" :value="item.serverId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="!recordDetail" icon="el-icon-refresh-right" size="mini" :loading="loading" type="primary" @click="getRecordList()">{{ $t('query') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card style="padding-bottom: 100px">
                <el-table :data="recordList" style="width: 100%">
                    <el-table-column prop="app" :label="$t('record.239091-2')" align="center" width="150"></el-table-column>
                    <el-table-column prop="stream" :label="$t('record.239091-3')" align="center" width="460"></el-table-column>
                    <el-table-column prop="time" :label="$t('record.239091-4')" align="center"></el-table-column>
                    <el-table-column :label="$t('opation')" width="360" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-button size="medium" icon="el-icon-folder-opened" type="text" @click="showRecordDetail(scope.row)" v-hasPermi="['iot:sip:record:query']">{{ $t('look') }}</el-button>
                        </template>
                    </el-table-column>
                    <el-empty :description="$t('sip.mediaServer.998535-6')" v-if="total == 0"></el-empty>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryRecord.pageNum" :limit.sync="queryRecord.pageSize" :pageSizes="[12, 24, 36, 60]" @pagination="getRecordList" />
            </el-card>
        </div>
        <record-detail ref="cloudRecordDetail" v-if="recordDetail" :recordFile="chooseRecord" :mediaServerId="mediaServerId" :recordApi="recordApi"></record-detail>
    </div>
</template>

<script>
import { listmediaServer } from '@/api/iot/mediaServer';
import { getServerRecord } from '@/api/iot/record';
import recordDetail from '@/views/iot/record/record-detail.vue';
export default {
    name: 'Reocrd',
    components: {
        recordDetail,
    },
    data() {
        return {
            mediaServerList: [], // 滅体节点列表
            mediaServerId: null, // 媒体服务
            recordApi: null, // 媒体服务地址
            recordList: [], // 设备列表
            chooseRecord: null, // 媒体服务
            updateLooper: 0, //数据刷新轮训标志
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            queryRecord: {
                pageNum: 1,
                pageSize: 10,
                recordApi: null,
            },
            total: 0,
            loading: false,
            recordDetail: false,
        };
    },
    computed: {},
    mounted() {
        this.initData();
    },
    destroyed() {},
    methods: {
        initData: function () {
            // 获取媒体节点列表
            this.getMediaServerList();
        },
        currentChange: function (val) {
            this.currentPage = val;
            this.getRecordList();
        },
        handleSizeChange: function (val) {
            this.count = val;
            this.getRecordList();
        },
        getMediaServerList: function () {
            listmediaServer(this.queryParams).then((response) => {
                this.mediaServerList = response.rows;
                this.total = response.total;
            });
        },
        setRecordApi: function (serverId) {
            let i;
            for (i = 0; i < this.mediaServerList.length; i++) {
                if (serverId === this.mediaServerList[i].serverId) {
                    break;
                }
            }
            if (this.mediaServerList[i].protocol == 'http') {
                this.recordApi = 'http://' + this.mediaServerList[i].ip + ':' + this.mediaServerList[i].recordPort;
            } else if (this.mediaServerList[i].protocol == 'https') {
                this.recordApi = 'https://' + this.mediaServerList[i].domain + ':' + this.mediaServerList[i].recordPort;
            }
            console.log(this.recordApi);
        },
        getRecordList: function () {
            if (!this.recordApi) {
                this.$modal.alertError(this.$t('record.239091-5'));
                return;
            }
            this.loading = true;
            this.queryRecord.recordApi = this.recordApi;
            getServerRecord(this.queryRecord)
                .then((response) => {
                    console.log(response.data);
                    this.loading = false;
                    if (response.data != null) {
                        this.recordList = response.data.list;
                        this.total = response.data.total;
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        chooseMediaChange(val) {
            this.total = 0;
            this.recordList = [];
            this.setRecordApi(val);
            this.getRecordList();
        },
        showRecordDetail(row) {
            this.recordDetail = true;
            this.chooseRecord = row;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
