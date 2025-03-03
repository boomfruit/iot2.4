import Vue from 'vue';

import Cookies from 'js-cookie';

import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/ruoyi.scss'; // ruoyi css

import App from './App';
import store from './store';
import router from './router';
import directive from './directive'; // directive
import plugins from './plugins'; // plugins
import './assets/icons'; // icon
import './permission'; // permission control
import VxeUITable from 'vxe-table';
import { VxeUI } from 'vxe-table';
VxeUI.setTheme('dark');
import 'vxe-table/lib/style.css';
import { i18n } from '@/lang';

import busEvent from '@/utils/busEvent';
import { download } from '@/utils/request';
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from '@/utils/ruoyi';
import mqttTool from '@/utils/mqttTool'; // Mqtt工具
import request from '@/utils/request'; // request
import topoUtil from '@/utils/topo/topo-util';

import { getDicts } from '@/api/system/dict/data';
import { getConfigKey } from '@/api/system/config';

import Pagination from '@/components/Pagination'; // 分页组件
import RightToolbar from '@/components/RightToolbar'; // 自定义表格工具组件
import Editor from '@/components/Editor'; // 富文本组件
import FileUpload from '@/components/FileUpload'; // 文件上传组件
import ImageUpload from '@/components/ImageUpload'; // 图片上传组件
import ImagePreview from '@/components/ImagePreview'; // 图片预览组件
import DictTag from '@/components/DictTag'; // 字典标签组件
import DictData from '@/components/DictData'; // 字典数据组件
import MonacoEditor from '@/components/MonacoEditor'; //代码编辑器

import Element from 'element-ui';
import './assets/styles/element-variables.scss';
import VueMeta from 'vue-meta'; // 头部标签组件
import * as echarts from 'echarts'; // Echart
import VueClipboard from 'vue-clipboard2'; // 一键复制粘贴板组件
import dataV from '@jiaminghi/data-view'; // DataV
import VideoPlayer from 'vue-video-player'; // video player
import 'vue-video-player/src/custom-theme.css';
import 'video.js/dist/video-js.css';
import BaiduMap from 'vue-baidu-map'; // 百度地图

import Contextmenu from 'vue-contextmenujs';
Vue.use(Contextmenu);

import ItemWrap from './views/bigScreen/components/item-wrap/item-wrap.vue';
import Message from './views/bigScreen/components/message/message.vue';
import Reacquire from './views/bigScreen/components/reacquire/reacquire.vue';

// 大屏组件
Vue.component('ItemWrap', ItemWrap);
Vue.component('Message', Message);
Vue.component('Reacquire', Reacquire);

// 全局方法挂载
Vue.prototype.$busEvent = busEvent;
Vue.prototype.download = download;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.handleTree = handleTree;
Vue.prototype.$mqttTool = mqttTool;
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.$echarts = echarts;
Vue.prototype.$request = request;
Vue.prototype.$topoUtil = topoUtil;

// 全局组件挂载
Vue.component('Pagination', Pagination);
Vue.component('RightToolbar', RightToolbar);
Vue.component('Editor', Editor);
Vue.component('FileUpload', FileUpload);
Vue.component('ImageUpload', ImageUpload);
Vue.component('ImagePreview', ImagePreview);
Vue.component('DictTag', DictTag);
Vue.component('MonacoEditor', MonacoEditor);

Vue.use(plugins);
Vue.use(directive);
Vue.use(VueMeta);
Vue.use(VueClipboard);
Vue.use(dataV);
Vue.use(VxeUITable);
Vue.use(VideoPlayer);
Vue.use(BaiduMap, { ak: process.env.VUE_APP_BAI_DU_AK });

DictData.install();

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value), // 这里会根据选的语言切换Element-ui的语言
});

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: (h) => h(App),
});

// 表格带边框
Element.Table.props.border = {
    default: true,
    type: Boolean,
};

//设置点击所有弹窗的遮罩不会关闭弹窗
Element.Dialog.props.closeOnClickModal.default = false;
