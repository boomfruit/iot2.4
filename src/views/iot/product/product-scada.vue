<template>
    <div class="product-scada-wrap">
        <div v-if="isScada" class="scada" :style="{ height: contentHeight + 'px' }">
            <component :is="scadaComp" :fullScreemTip="false" :isContextmenu="false"></component>
        </div>
        <div v-else>
            <el-empty :description="$t('product.product-scada.638785-0')"></el-empty>
            <div style="text-align: center;">
                <el-button size="mini" type="primary" @click="handleGoToScada()" v-hasPermi="['iot:product:scada']">{{
                    $t('product.product-scada.034908-0') }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductScada',
    props: {
        product: {
            type: Object,
            default: null
        }
    },
    watch: {
        product: {
            deep: true,
            immediate: true,
            handler(newVal, oldVal) {
                this.productInfo = newVal;
                if (newVal.guid) {
                    this.getScadaComp(newVal);
                    this.isScada = true;
                } else {
                    this.isScada = false;
                }
            }
        },
    },
    data() {
        return {
            isScada: false,
            contentHeight: window.innerHeight,
            scadaComp: null,
            productInfo: {},
        };
    },
    methods: {
        // 获取窗体高度
        calculateContentHeight() {
            let originalHeight = document.getElementById('productDetailTab').offsetHeight;
            this.contentHeight = parseFloat(originalHeight);
        },
        // 组态设计
        handleGoToScada() {
            this.$router.push({
                path: '/scada/center/temp',
                query: {
                    productId: this.productInfo.productId,
                },
            });
        },
        // 获取组态
        getScadaComp(guid) {
            //以下组态特有
            // import('../../scada/topo/components/topoRender.vue').then((module) => {
            //     this.scadaComp = module.default;
            // });
            //以上组态特有
            this.$router.push({ query: { ...this.$route.query, guid: this.productInfo.guid } });
        },
    },
};
</script>

<style lang="scss" scoped>
.product-scada-wrap {
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
