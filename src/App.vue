<template>
    <div id="app" style="background-color: #0e2e87; overflow: hidden" v-if="$route.meta.bigScreen">
        <router-view />
    </div>
    <div id="app" style="background-color: #0e2e87; overflow: hidden" v-else>
        <router-view :key="language" />
        <theme-picker />
    </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker';
import _ from 'lodash';
export default {
    name: 'App',
    components: { ThemePicker },
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: (title) => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE;
            },
        };
    },
    computed: {
        language() {
            return this.$store.state.settings.language;
        },
    },
    mounted() {
        this.handleResize();
        this.debouncedHandleResize = this.debounce(this.handleResize, 100);
        window.addEventListener('resize', this.debouncedHandleResize);
        // 系统整体缩放
    },
    methods: {
        debounce(func, wait) {
            let timeout;
            return function () {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            };
        },

        //定义防抖函数
        handleResize() {
            let cliWidth = document.documentElement.clientWidth || document.body.clientWidth;
            let cliHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let contW = 1920;
            let contH = 1080;
            let w = cliWidth / contW;
            let h = (cliHeight + 60) / contH;
            let appDom = document.querySelector('#app');
            let size = cliWidth / cliHeight;
            if (cliWidth === screen.width) {
                appDom.style.transform = 'scale(' + w + ',' + h + ')';
            } else if (size > contW / contH) {
                appDom.style.transform = 'scale(' + w + ',' + h + ')';
            } else {
                appDom.style.transform = 'scale(' + w + ',' + w + ')';
            }
            appDom.style.transformOrigin = 'top left';
            appDom.style.width = contW + 'px';
            appDom.style.height = contH + 'px';
        },
    },
};
</script>
<style scoped>
#app .theme-picker {
    display: none;
}
</style>
