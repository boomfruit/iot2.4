<template>
    <div class="scene-list-scada">
        <div v-if="isScada" class="scada" :style="{ height: contentHeight + 'px' }">
            <component ref="sceneScada" :is="scadaComp" :fullScreemTip="false" :isContextmenu="false"></component>
        </div>
        <div v-else>
            <el-empty :description="$t('scene.scada.433893-0')"></el-empty>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SceneListScada',
    props: {
        guid: {
            type: String,
            default: '',
        },
    },
    watch: {
        guid: function (newVal, oldVal) {
            if (newVal) {
                this.getScadaComp(newVal);
                this.isScada = true;
            } else {
                this.isScada = false;
            }
        },
    },
    data() {
        return {
            isScada: true,
            scadaComp: null,
            contentHeight: window.innerHeight,
        };
    },
    methods: {
        // 获取组态
        getScadaComp(guid) {
            //以下组态特有
            // import('../../../scada/topo/components/topoRender.vue').then((module) => {
            //     this.scadaComp = module.default;
            // });
            //以上组态特有
            this.$router.push({ query: { ...this.$route.query, guid: guid, type: 2 } });
        },
    },
};
</script>

<style lang="scss" scoped>
.scene-list-scada {
    position: relative;
    width: 100%;
    height: 100%;

    .scada {
        position: relative;
        width: 100%;
        height: 550px;
        margin-top: 5px;
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
