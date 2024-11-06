<template>
    <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
        <!-- <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
        <!-- 菜单栏 -->
        <sidebar v-if="!sidebar.hide && currentBarIdx !== 1 && currentBarIdx !== 3 && currentBarIdx !== 7" />
        <!-- 菜单栏 -->
        <!-- 新首页菜单 -->
        <headerNav></headerNav>
        <!-- 新首页内容 -->
        <sunseenMain style="margin-top: 60px" v-if="currentBarIdx === 1"></sunseenMain>
        <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide, noneMarginLeft: currentBarIdx === 3 || currentBarIdx === 7 }" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <tags-view v-if="needTagsView" />
            </div>
            <app-main style="margin-top: 60px" v-if="!sidebar.hide && currentBarIdx !== 1" />
            <right-panel>
                <settings />
            </right-panel>
        </div>
    </div>
</template>

<script>
import RightPanel from '@/components/RightPanel';
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components';
import ResizeMixin from './mixin/ResizeHandler';
import { mapState } from 'vuex';
import variables from '@/assets/styles/variables.scss';
import headerNav from './sunseen/header';
import sunseenMain from './sunseen/dashboard';

export default {
    name: 'Layout',
    components: {
        AppMain,
        Navbar,
        RightPanel,
        Settings,
        Sidebar,
        TagsView,
        headerNav,
        sunseenMain,
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapState({
            theme: (state) => state.settings.theme,
            sideTheme: (state) => state.settings.sideTheme,
            sidebar: (state) => state.app.sidebar,
            device: (state) => state.app.device,
            needTagsView: (state) => state.settings.tagsView,
            fixedHeader: (state) => state.settings.fixedHeader,
            currentBarIdx: (state) => state.topBar.currentBarIdx,
        }),
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile',
            };
        },
        variables() {
            return variables;
        },
    },
    watch: {
        currentBarIdx(newIdx, oldIdx) {
            // 在这里执行当`currentBarIdx`变化时需要做的任何操作
        },
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    background: #000;
    overflow: hidden;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
    width: 100%;
}

.mobile .fixed-header {
    width: 100%;
}

.noneMarginLeft {
    margin-left: 0 !important;
}
</style>
