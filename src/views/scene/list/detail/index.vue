<template>
    <div class="scene-list-detail">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane :label="$t('scene.detail.index.209809-0')" name="overview">
                <scene-overview :sceneModels="sceneModels" />
            </el-tab-pane>
            <el-tab-pane :label="$t('scene.detail.index.209809-1')" name="scada" v-if="isShowScada == true">
                <span slot="label" v-hasPermi="['scene:model:scada:run']">{{ $t('scene.detail.index.209809-1') }}</span>
                <scene-scada ref="scada" :guid="sceneModels.guid" />
            </el-tab-pane>
            <el-tab-pane :label="$t('scene.detail.index.209809-2')" name="video">
                <span slot="label" v-hasPermi="['scene:SipRelation:list']">{{ $t('scene.detail.index.209809-2')
                    }}</span>
                <scene-video ref="video" :sipRelationList="sceneModels.sipRelationList" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getSceneModelDetail } from '@/api/scene/list.js';
import sceneOverview from './overview.vue';
import sceneScada from './scada.vue';
import sceneVideo from './video.vue';
import defaultSettings from '@/settings';

export default {
    name: 'sceneListDetail',
    components: {
        sceneOverview,
        sceneScada,
        sceneVideo,
    },
    data() {
        return {
            activeTab: 'overview',
            //组态相关按钮是否显示，true显示，false不显示
            isShowScada: defaultSettings.isShowScada,
            sceneModels: {
                sceneModelDeviceList: [], // 数据来源设备
                deviceInfo: {}, // 设备信息
            },
        };
    },
    mounted() {
        this.getDetail(); // 获取详情
    },
    methods: {
        // 获取详情
        getDetail() {
            this.$modal.loading(this.$t('scene.detail.index.209809-3'));
            const id = this.$route.query.sceneModelId;
            getSceneModelDetail(id).then((res) => {
                if (res.code === 200) {
                    this.sceneModels = res.data;
                    this.sceneModels.sceneModelDeviceList = [{ id: '-1', name: this.$t('scene.detail.index.209809-4') }, ...res.data.sceneModelDeviceList];
                    this.mqttSubscribe(this.sceneModels.sceneModelDeviceList);
                }
                this.$modal.closeLoading();
            });
        },
        handleTabClick(tab, event) {
            if (tab.name === 'video') {
                this.$refs.video.calculatePlayerHeight(); // 调整布局
            } else {
                this.$refs.video && this.$refs.video.handleClose();
            }
            if (tab.name !== 'scada') {
                const scadaRef = this.$refs.scada || {};
                if (scadaRef && scadaRef.$refs && scadaRef.$refs.sceneScada) {
                    const copmRef = scadaRef.$refs.sceneScada;
                    if (copmRef.$refs && copmRef.$refs.spirit) {
                        copmRef.$refs.spirit.forEach((item) => {
                            if (item.$vnode.tag.includes('ViewInlineVideo')) {
                                item.handleCloseJessibuca();
                            }
                        });
                    }
                }
            }
        },
        // mqtt订阅主题
        mqttSubscribe(list) {
            let topics = [];
            for (let i = 1; i < list.length; i++) {
                if (list[i].variableType === 1) {
                    const topicStatus = '/' + list[i].productId + '/' + list[i].serialNumber + '/status/post';
                    const topicMonitor = '/' + list[i].productId + '/' + list[i].serialNumber + '/monitor/post';
                    const serviceTop = '/' + list[i].productId + '/' + list[i].serialNumber + '/ws/service';
                    topics.push(topicStatus);
                    topics.push(topicMonitor);
                    topics.push(serviceTop);
                } else {
                    const topicScene = '/' + list[i].sceneModelId + '/' + list[i].id + '/scene/report';
                    topics.push(topicScene);
                }
            }
            this.$mqttTool.subscribe(topics);
        },
        // mqtt取消订阅主题
        mqttUnSubscribe(list) {
            let topics = [];
            for (let i = 1; i < list.length; i++) {
                if (list[i].variableType === 1) {
                    const topicStatus = '/' + list[i].productId + '/' + list[i].serialNumber + '/status/post';
                    const topicMonitor = '/' + list[i].productId + '/' + list[i].serialNumber + '/monitor/post';
                    const serviceTop = '/' + list[i].productId + '/' + list[i].serialNumber + '/ws/service';
                    topics.push(topicStatus);
                    topics.push(topicMonitor);
                    topics.push(serviceTop);
                } else {
                    const topicScene = '/' + list[i].sceneModelId + '/' + list[i].id + '/scene/report';
                    topics.push(topicScene);
                }
            }
            this.$mqttTool.unsubscribe(topics);
        },
    },
    destroyed() {
        this.mqttUnSubscribe(this.sceneModels.sceneModelDeviceList); // 取消订阅主题
    },
};
</script>

<style lang="scss" scoped>
.scene-list-detail {
    width: 100%;
    padding: 15px 15px 0 15px;
}
</style>
