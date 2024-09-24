import Cookies from 'js-cookie';

export default {
    /**
     * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
     */
    sideTheme: 'theme-dark',

    /**
     * 是否系统布局配置
     */
    showSettings: false,

    /**
     * 是否显示顶部导航
     */
    topNav: false,

    /**
     * 是否显示 tagsView
     */
    tagsView: false,

    /**
     * 是否固定头部
     */
    fixedHeader: false,

    /**
     * 是否显示logo
     */
    sidebarLogo: true,

    /**
     * 是否显示动态标题
     */
    dynamicTitle: false,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production',
    /**
     * 默认语言 先從cookies拿，沒有從
     */
    language: 'zh-CN',

    /**
     * 组态特有，是否显示组态相关按钮和代码
     */
    isShowScada: false,
};
