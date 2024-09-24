<template>
    <div class="app-container">
        <el-row>
            <el-col :span="24" class="card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('system.cache.232015-0') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%">
                            <tbody>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-1') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.redis_version }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-2') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.redis_mode == 'standalone' ? '单机' : '集群' }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-3') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.tcp_port }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-4') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.connected_clients }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-5') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.uptime_in_days }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-6') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.used_memory_human }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-7') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ parseFloat(cache.info.used_cpu_user_children).toFixed(2) }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-8') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.maxmemory_human }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-9') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.aof_enabled == '0' ? '否' : '是' }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-10') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.rdb_last_bgsave_status }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-11') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.dbSize">{{ cache.dbSize }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.cache.232015-12') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="cache.info">{{ cache.info.instantaneous_input_kbps }}kps/{{ cache.info.instantaneous_output_kbps }}kps</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12" class="card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('system.cache.232015-13') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <div ref="commandstats" style="height: 420px" />
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12" class="card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('system.cache.232015-14') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <div ref="usedmemory" style="height: 420px" />
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getCache } from '@/api/monitor/cache';
import * as echarts from 'echarts';

export default {
    name: 'Cache',
    data() {
        return {
            // 统计命令信息
            commandstats: null,
            // 使用内存
            usedmemory: null,
            // cache信息
            cache: [],
        };
    },
    created() {
        this.getList();
        this.openLoading();
    },
    methods: {
        /** 查缓存询信息 */
        getList() {
            getCache().then((response) => {
                this.cache = response.data;
                this.$modal.closeLoading();

                this.commandstats = echarts.init(this.$refs.commandstats, 'macarons');
                this.commandstats.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)',
                    },
                    series: [
                        {
                            name: this.$t('system.cache.232015-15'),
                            type: 'pie',
                            roseType: 'radius',
                            radius: [15, 95],
                            center: ['50%', '38%'],
                            data: response.data.commandStats,
                            animationEasing: 'cubicInOut',
                            animationDuration: 1000,
                        },
                    ],
                });
                this.usedmemory = echarts.init(this.$refs.usedmemory, 'macarons');
                this.usedmemory.setOption({
                    tooltip: {
                        formatter: '{b} <br/>{a} : ' + this.cache.info.used_memory_human,
                    },
                    series: [
                        {
                            name: this.$t('system.cache.232015-16'),
                            type: 'gauge',
                            min: 0,
                            max: 1000,
                            detail: {
                                formatter: this.cache.info.used_memory_human,
                            },
                            data: [
                                {
                                    value: parseFloat(this.cache.info.used_memory_human),
                                    name: this.$t('system.cache.232015-17'),
                                },
                            ],
                        },
                    ],
                });
            });
        },
        // 打开加载层
        openLoading() {
            this.$modal.loading(this.$t('system.server.890786-32'));
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
