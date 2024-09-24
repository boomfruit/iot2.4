<template>
    <div class="device-scada-wrap">
        <div v-if="isScada" class="scada" :style="{ height: contentHeight + 'px' }">
            <component ref="deviceScada" :is="scadaComp" :fullScreemTip="false" :isContextmenu="false"></component>
        </div>
        <div v-else>
            <el-empty :description="$t('device.scada.789543-0')"></el-empty>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeviceScada',
    props: {
        device: {
            type: Object,
            default: null,
        },
    },
    watch: {
        device: {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal.guid) {
                    this.getScadaComp();
                    this.isScada = true;
                } else {
                    this.isScada = false;
                }
            },
        },
    },
    data() {
        return {
            isScada: false,
            contentHeight: window.innerHeight,
            scadaComp: null,
        };
    },
    mounted() {
        const { guid } = this.device;
        if (guid) {
            this.getScadaComp();
            this.isScada = true;
        } else {
            this.isScada = false;
        }
    },
    methods: {
        // 获取窗体高度
        calculateContentHeight() {
            let originalHeight = document.getElementById('deviceDetailTab').offsetHeight;
            this.contentHeight = parseFloat(originalHeight);
        },
        // 获取组态
        getScadaComp() {
            //以下组态特有
            // import('../../scada/topo/components/topoRender.vue').then((module) => {
            //     this.scadaComp = module.default;
            // });
            //以上组态特有
            const { guid, serialNumber } = this.device;
            this.$router.push({ query: { ...this.$route.query, guid: guid, serialNumber: serialNumber, type: 1 } });
        },
    },
};
</script>

<style lang="scss" scoped>
.device-scada-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    .scada {
        position: relative;
        width: 100%;
        overflow: auto;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #e1e1e1;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #a5a2a2;
    }

    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        position: absolute;
    }

    ::-webkit-scrollbar-track {
        background-color: #fff;
    }
}
</style>
