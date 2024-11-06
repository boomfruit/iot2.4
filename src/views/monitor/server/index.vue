<template>
    <div class="app-container">
        <el-row>
            <el-col :span="12" class="card-box">
                <el-card>
                    <div slot="header"><span>CPU</span></div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%">
                            <thead>
                                <tr>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-0') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-1') }}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-2') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.cpu">{{ server.cpu.cpuNum }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-3') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.cpu">{{ server.cpu.used }}%</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-4') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.cpu">{{ server.cpu.sys }}%</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-5') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.cpu">{{ server.cpu.free }}%</div>
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
                        <span>{{ $t('system.server.890786-6') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%">
                            <thead>
                                <tr>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-0') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-6') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">JVM</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-7') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.mem">{{ server.mem.total }}G</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.total }}M</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-8') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.mem">{{ server.mem.used }}G</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.used }}M</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-9') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.mem">{{ server.mem.free }}G</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.free }}M</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-10') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.mem" :class="{ 'text-danger': server.mem.usage > 80 }">{{ server.mem.usage }}%</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm" :class="{ 'text-danger': server.jvm.usage > 80 }">{{ server.jvm.usage }}%</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="24" class="card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('system.server.890786-11') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%">
                            <tbody>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-12') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.sys">{{ server.sys.computerName }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-13') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.sys">{{ server.sys.osName }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-14') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.sys">{{ server.sys.computerIp }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-15') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.sys">{{ server.sys.osArch }}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="24" class="card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('system.server.890786-16') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%; table-layout: fixed">
                            <tbody>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-17') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.name }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-18') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.version }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-19') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.startTime }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-20') }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.runTime }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="1" class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-21') }}</div>
                                    </td>
                                    <td colspan="3" class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.home }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="1" class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-22') }}</div>
                                    </td>
                                    <td colspan="3" class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.sys">{{ server.sys.userDir }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="1" class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-23') }}</div>
                                    </td>
                                    <td colspan="3" class="el-table__cell is-leaf">
                                        <div class="cell" v-if="server.jvm">{{ server.jvm.inputArgs }}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="24" class="card-box">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('system.server.890786-24') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%">
                            <thead>
                                <tr>
                                    <th class="el-table__cell el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-25') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-26') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-27') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-28') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-29') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-30') }}</div>
                                    </th>
                                    <th class="el-table__cell is-leaf">
                                        <div class="cell">{{ $t('system.server.890786-31') }}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody v-if="server.sysFiles">
                                <tr v-for="(sysFile, index) in server.sysFiles" :key="index">
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ sysFile.dirName }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ sysFile.sysTypeName }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ sysFile.typeName }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ sysFile.total }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ sysFile.free }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell">{{ sysFile.used }}</div>
                                    </td>
                                    <td class="el-table__cell is-leaf">
                                        <div class="cell" :class="{ 'text-danger': sysFile.usage > 80 }">{{ sysFile.usage }}%</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getServer } from '@/api/monitor/server';

export default {
    name: 'Server',
    data() {
        return {
            // 服务器信息
            server: [],
        };
    },
    created() {
        this.getList();
        this.openLoading();
    },
    methods: {
        /** 查询服务器信息 */
        getList() {
            getServer().then((response) => {
                this.server = response.data;
                this.$modal.closeLoading();
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
