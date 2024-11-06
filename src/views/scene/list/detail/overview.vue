<template>
    <div class="scene-list-overview">
        <el-row>
            <el-col :span="12" class="card-box" style="padding-right: 7.5px; margin-top: 5px">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('scene.overview.324354-0') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <div class="prop-box-info" id="scenePropBox">
                            <div class="left-pic">
                                <el-image style="width: 100px; height: 100px"
                                    :src="sceneModels.imgUrl ? baseUrl + sceneModels.imgUrl : require('@/assets/images/scene-info.png')"
                                    fit="fill"></el-image>
                            </div>
                            <div class="right-message">
                                <div class="title">{{ sceneModels.sceneModelName }}</div>
                                <div class="info-item">
                                    <label>{{ $t('scene.overview.324354-1') }}</label>
                                    <span>{{ sceneModels.deptName }}</span>
                                </div>
                                <div class="info-item">
                                    <label>{{ $t('scene.overview.324354-2') }}</label>
                                    <span v-if="sceneModels.cusDeviceList && sceneModels.cusDeviceList.length > 0">
                                        <el-tag class="tag-wrap" size="small"
                                            v-for="(item, index) in sceneModels.cusDeviceList" :key="index">{{ item.name
                                            }}</el-tag>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <label>{{ $t('scene.overview.324354-3') }}</label>
                                    <span>{{ sceneModels.updateTime }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12" class="card-box" style="padding-left: 7.5px; margin-top: 5px">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('scene.overview.324354-4') }}</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <div class="prop-box-attr" :style="{ height: scenePropBoxHeight + 'px' }">
                            <div class="num-empty">
                                {{ $t('scene.overview.324354-5') }}
                                <br />
                                <br />
                                <br />
                                <br />
                                <el-image style="width: 493px; height: 29px"
                                    :src="require('@/assets/images/scene-basic-attr-flow.png')" fit="fill"></el-image>
                            </div>
                            <!-- <div class="num-area">
                                <div class="num-props">
                                    <div class="name-div">电费单价：</div>
                                    <div class="value-part">8 元</div>
                                </div>
                                <div class="num-props">
                                    <div class="name-div">电费单价：</div>
                                    <div class="value-part">8 元</div>
                                </div>
                                <div class="num-props">
                                    <div class="name-div">电费单价：</div>
                                    <div class="value-part">8 元</div>
                                </div>
                                <div class="num-props">
                                    <div class="name-div">电费单价：</div>
                                    <div class="value-part">8 元</div>
                                </div>
                                <div class="num-props">
                                    <div class="name-div">电费单价：</div>
                                    <div class="value-part">8 元</div>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="24" class="card-box" style="margin-bottom: 15px">
                <el-card>
                    <div slot="header">
                        <span>{{ $t('scene.overview.324354-6') }}</span>
                    </div>
                    <div class="el-table--enable-row-hover el-table--medium">
                        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
                            <el-form-item :label="$t('scene.overview.324354-7')" prop="sceneModelDeviceId">
                                <el-select v-model="queryParams.sceneModelDeviceId"
                                    :placeholder="$t('scene.overview.324354-8')" clearable>
                                    <el-option v-for="(item, index) in sceneModels.sceneModelDeviceList" :key="index"
                                        :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('scene.overview.324354-9')" prop="slaveName">
                                <el-input v-model="queryParams.slaveName" :placeholder="$t('scene.overview.324354-10')"
                                    clearable />
                            </el-form-item>
                            <el-form-item :label="$t('scene.overview.324354-11')" prop="sourceName">
                                <el-input v-model="queryParams.sourceName" :placeholder="$t('scene.overview.324354-12')"
                                    clearable />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{
                                    $t('search') }}</el-button>
                                <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">{{ $t('reset')
                                    }}</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table v-loading="loading" :data="variableList" style="width: 100%; margin-top: 10px"
                            :border="false">
                            <el-table-column prop="id" :label="$t('scene.overview.324354-13')"
                                width="100"></el-table-column>
                            <el-table-column prop="sceneModelDeviceName" :label="$t('scene.overview.324354-7')"
                                width="130"></el-table-column>
                            <el-table-column prop="slaveName" :label="$t('scene.overview.324354-9')"></el-table-column>
                            <el-table-column prop="sourceName"
                                :label="$t('scene.overview.324354-11')"></el-table-column>
                            <el-table-column prop="updateTime" :label="$t('scene.overview.324354-14')"
                                width="190"></el-table-column>
                            <el-table-column prop="value" :label="$t('scene.overview.324354-15')">
                                <template slot-scope="scope">
                                    <span>
                                        {{ scope.row.value === '' || scope.row.value === null ? '-' : scope.row.value }}
                                        {{ scope.row.value !== '' && scope.row.value !== null ? scope.row.unit : '' }}
                                        <i v-if="scope.row.isReadonly === 0" style="cursor: pointer; color: #1890ff"
                                            class="el-icon-edit" v-hasPermi="['iot:service:invoke']"
                                            @click="handleEditVariable(scope.row)"></i>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('opation')" align="center"
                                class-name="small-padding fixed-width" width="100">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text" @click="handleQueryHistory(scope.row)">{{
                                        $t('scene.overview.324354-16') }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                            :limit.sync="queryParams.pageSize" @pagination="getVariableList" />
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { getSceneModelDataList } from '@/api/scene/list.js';
import { serviceInvokeReply } from '@/api/iot/runstatus.js';

export default {
    name: 'SceneListOverView',
    computed: {
        ...mapState({
            sidebarStatus: (state) => state.app.sidebar.opened,
        }),
    },
    props: {
        sceneModels: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API,
            scenePropBoxHeight: 150, // 场景基本属性窗口高度
            loading: false,
            queryParams: {
                sceneModelId: null,
                sceneModelDeviceId: null,
                slaveName: '',
                sourceName: '',
                pageNum: 1,
                pageSize: 10,
            },
            variableList: [], // 变量列表
            total: 0, // 总条数
        };
    },
    watch: {
        // 检测系统菜单栏状态
        sidebarStatus() {
            this.calculateScenePropBoxHeight();
        },
        sceneModels: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.getVariableList();
                }
            },
        },
    },
    mounted() {
        // 获取高度
        this.calculateScenePropBoxHeight();
        window.addEventListener('resize', this.calculateScenePropBoxHeight, true);
        this.connectMqtt();
    },
    methods: {
        // 获取窗体高度
        calculateScenePropBoxHeight() {
            setTimeout(() => {
                let originalHeight = document.getElementById('scenePropBox').offsetHeight;
                this.scenePropBoxHeight = parseFloat(originalHeight);
            }, 500);
        },
        // 获取变量情况列表
        getVariableList() {
            this.loading = true;
            this.queryParams.sceneModelId = this.$route.query.sceneModelId;
            let { sceneModelDeviceId, ...pres } = this.queryParams;
            if (sceneModelDeviceId === '-1') {
                sceneModelDeviceId = '';
            }
            const params = { sceneModelDeviceId, ...pres };
            getSceneModelDataList(params).then((res) => {
                if (res.code === 200) {
                    this.variableList = res.rows;
                    this.total = res.total;
                }
                this.loading = false;
            });
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getVariableList();
        },
        // 重置按钮操作
        handleResetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 编辑变量值
        handleEditVariable(item) {
            this.$prompt(this.$t('scene.overview.324354-17'), this.$t('edit'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                inputPattern: /\S/,
                inputErrorMessage: this.$t('scene.overview.324354-17'),
                inputPlaceholder: item.value,
            }).then(({ value }) => {
                if (item.variableType === 1) {
                    if (item.status !== 3 && item.isShadow !== 1) {
                        let title = '';
                        if (item.status === 1) {
                            title = this.$t('scene.overview.324354-18');
                        } else if (item.status === 2) {
                            title = this.$t('scene.overview.324354-19');
                        } else {
                            title = this.$t('scene.overview.324354-20');
                        }
                        this.$message({
                            type: 'warning',
                            message: title,
                        });
                        return;
                    }
                }
                const command = {};
                command[item.identifier] = value;
                const data = {
                    sceneModelId: item.sceneModelId,
                    variableType: item.variableType,
                    serialNumber: item.serialNumber,
                    productId: item.productId,
                    remoteCommand: command,
                    identifier: item.identifier,
                    modelName: item.modelName,
                    isShadow: item.status != 3,
                    type: item.type,
                };
                serviceInvokeReply(data).then((res) => {
                    if (res.code === 200) {
                        item.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                        item.value = value;
                    }
                });
            });
        },
        // 查询历史数据
        handleQueryHistory(item) {
            this.$router.push({
                path: '/dataCenter/history',
                query: {
                    sceneModelId: item.sceneModelId,
                    sceneModelDeviceId: item.sceneModelDeviceId,
                    identifier: item.identifier,
                    activeName: 'scene',
                },
            });
        },
        // 连接Mqtt消息服务器
        async connectMqtt() {
            if (this.$mqttTool.client == null) {
                await this.$mqttTool.connect();
            }
            // 删除所有message事件监听器
            this.$mqttTool.client.removeAllListeners('message');
            // 添加message事件监听器
            this.mqttCallback();
        },
        // Mqtt回调处理
        mqttCallback() {
            const _this = this;
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                let topics = topic.split('/');
                let productId = topics[1];
                let deviceNum = topics[2];
                message = JSON.parse(message.toString());
                if (!message) {
                    return;
                }
                console.log('接收到【物模型】主题：', topic);
                console.log('接收到【物模型】内容：', message);
                if (topic.endsWith('ws/service')) {
                    // 更新列表中设备的属性
                    message = message.message;
                    message.forEach((mes) => {
                        _this.variableList.forEach((vari) => {
                            this.$busEvent.$emit('updateData', {
                                serialNumber: topics[2],
                                productId: vari.productId,
                                data: message,
                            });
                            // 更新列表中设备的状态
                            if (vari.serialNumber === deviceNum) {
                                if (vari.identifier === mes.id) {
                                    vari.value = mes.value;
                                    vari.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                        });
                    });
                }
                if (topic.endsWith('scene/report')) {
                    // 更新列表中设备的属性
                    message.forEach((mes) => {
                        _this.variableList.forEach((vari) => {
                            const identifier = vari.identifier;
                            if (identifier === mes.id) {
                                vari.value = mes.value;
                                vari.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                            }
                        });
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.scene-list-overview {
    width: 100%;

    .card-box {
        padding: 0;
        margin: 15px 0 0;
    }

    .prop-box-info {
        display: flex;

        .left-pic {
            margin-right: 20px;
        }

        .right-message {
            width: 100%;

            .title {
                font-size: 12px;
                color: #333;
                font-weight: 600;
                margin-bottom: 20px;
            }

            .info-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 15px;
                font-size: 12px;
                font-weight: 400;
                color: #333;

                label {
                    color: #666;
                    width: 80px;
                    flex-shrink: 0;
                    font-weight: normal;
                }

                .tag-wrap {
                    margin-bottom: 5px;
                    margin-right: 5px;
                    cursor: pointer;
                }
            }
        }
    }

    .prop-box-attr {
        .num-empty {
            width: 100%;
        }

        .num-area {
            display: flex;
            flex-wrap: wrap;

            .num-props {
                margin-right: 10px;
                margin-bottom: 10px;
                display: flex;
                width: calc(33% - 20px);
                font-size: 12px;

                .name-div {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    flex-shrink: 0;
                    max-width: 50%;
                }

                .value-part {
                    margin-left: 15px;
                }
            }
        }
    }
}
</style>
