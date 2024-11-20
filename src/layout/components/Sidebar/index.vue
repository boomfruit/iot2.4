<template>
    <div :class="{ 'has-logo': showLogo }" class="menu-bg">
        <div class="menu-box-smartAquaculture">
            <el-menu default-active="2" class="el-menu-vertical-demo" :default-openeds="defaultOpeneds">
                <div v-for="item in menuList[menuMap[topBar.currentBarIdx]]" :key="item.key">
                    <el-submenu v-if="item.children" :index="item.key">
                        <template slot="title">
                            <div class="menu-item-smartAquaculture">
                                <div
                                    style="margin-right: 16px; width: 20px; height: 56px"
                                    :style="{
                                        background: `url(${item.icon}) no-repeat center center / contain`,
                                    }"
                                ></div>
                                <div>{{ item.name }}</div>
                            </div>
                        </template>
                        <el-menu-item v-for="itm in item.children" :key="itm.key" :class="[currentItemIdx === itm.key ? 'active-item' : '']" @click="handleClick(itm)">
                            <template slot="title">
                                <div class="menu-item-smartAquaculture">
                                    <div
                                        style="margin-right: 16px; width: 20px; height: 56px"
                                        :style="{
                                            background: `url(${itm.icon}) no-repeat center center / contain`,
                                        }"
                                    ></div>
                                    <div>{{ itm.name }}</div>
                                </div>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else :class="[currentItemIdx === item.key ? 'active-item' : '']" @click="handleClick(item)">
                        <template slot="title">
                            <div class="menu-item-smartAquaculture">
                                <div
                                    style="margin-right: 16px; width: 20px; height: 56px"
                                    :style="{
                                        background: `url(${item.icon}) no-repeat center center / contain`,
                                    }"
                                ></div>
                                <div>{{ item.name }}</div>
                            </div>
                        </template>
                    </el-menu-item>
                </div>
            </el-menu>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.scss';
import { iconList } from './icon.js';

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(['settings', 'topBar']),
        ...mapGetters(['sidebarRouters', 'sidebar']),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        },
        menuMap() {
            return {
                1: 'smartAquaculture',
                2: 'smartAquaculture',
                3: 'smartAquaculture',
                4: 'alarmCenter',
                5: 'resourceManagement',
                6: 'systemManagement',
            };
        },
    },
    created() {
        // 在创建组件时设置默认展开的菜单
        this.setDefaultOpeneds();
    },
    data() {
        return {
            menuList: {
                smartAquaculture: [
                    {
                        name: '设备管理',
                        key: 'parent_device',
                        icon_key: 'equipmentGrouping',
                        icon: iconList['equipmentGrouping'][1],
                        children: [
                            {
                                name: '设备管理',
                                key: 1,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'smartAquaculture/iot/device',
                            },
                            {
                                name: '产品分类',
                                key: 2,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'smartAquaculture/iot/category',
                            },
                            {
                                name: '产品管理',
                                key: 3,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'smartAquaculture/iot/product',
                            },
                            {
                                name: '设备分组',
                                key: 4,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'smartAquaculture/iot/group',
                            },
                            {
                                name: '物模型',
                                key: 5,
                                icon_key: 'equipmentGrouping',
                                icon: iconList['equipmentGrouping'][0],
                                path: 'smartAquaculture/iot/template',
                            },
                            // {
                            //     name: '设备联动',
                            //     key: 6,
                            //     icon_key: 'equipmentManagement',
                            //     icon: iconList['equipmentManagement'][1],
                            //     path: 'smartAquaculture/iot/linkage',
                            // },
                        ],
                    },
                    // {
                    //     name: '场景列表',
                    //     key: 7,
                    //     icon_key: 'notificationChannels',
                    //     icon: iconList['notificationChannels'][0],
                    //     path: 'smartAquaculture/scene/list/index',
                    // },
                    //  {
                    //      name: '数据中心',
                    //      key: 'parent_data_center',
                    //      icon_key: 'equipmentGrouping',
                    //      icon: iconList['equipmentGrouping'][1],
                    //      children: [
                    //          {
                    //              name: '历史记录',
                    //              key: 9,
                    //              icon_key: 'equipmentGrouping',
                    //              icon: iconList['equipmentGrouping'][0],
                    //              path: 'smartAquaculture/dataCenter/history',
                    //          },
                    //          {
                    //              name: '数据分析',
                    //              key: 10,
                    //              icon_key: 'equipmentManagement',
                    //              icon: iconList['equipmentManagement'][1],
                    //              path: 'smartAquaculture/dataCenter/analysis',
                    //          },
                    //      ],
                    //  },
                ],
                alarmCenter: [
                    {
                        name: '告警配置',
                        key: 1,
                        icon_key: 'notificationChannels',
                        icon: iconList['notificationChannels'][0],
                        path: 'alarmCenter/alert',
                    },
                    {
                        name: '告警记录',
                        key: 2,
                        icon_key: 'notificationTemplate',
                        icon: iconList['notificationTemplate'][1],
                        path: 'alarmCenter/alertLog',
                    },
                    {
                        name: '告警分组',
                        key: 3,
                        icon_key: 'notificationTemplate',
                        icon: iconList['notificationTemplate'][1],
                        path: 'alarmCenter/alarmGroup',
                    },
                ],
                resourceManagement: [
                    {
                        name: '运维管理',
                        key: 'parent_operation ',
                        icon_key: 'equipmentGrouping',
                        icon: iconList['equipmentGrouping'][1],
                        children: [
                            {
                                name: '指令权限',
                                key: 1,
                                icon_key: 'equipmentGrouping',
                                icon: iconList['equipmentGrouping'][0],
                                path: 'resourceManagement/template/control',
                            },
                            {
                                name: '协议管理',
                                key: 2,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'resourceManagement/template/protocol',
                            },
                            {
                                name: '产品固件',
                                key: 3,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'resourceManagement/template/firmware',
                            },
                            {
                                name: '通知日志',
                                key: 4,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'resourceManagement/template/notifylog',
                            },
                            {
                                name: '通知模板',
                                key: 5,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'resourceManagement/template/notifyTemplate',
                            },
                            {
                                name: '通知渠道',
                                key: 6,
                                icon_key: 'equipmentManagement',
                                icon: iconList['equipmentManagement'][1],
                                path: 'resourceManagement/template/channel',
                            },
                        ],
                    },
                    {
                        name: '视频中心',
                        key: 'parent_video',
                        icon_key: 'monitoringScreen',
                        icon: iconList['videoManagement'][1],
                        children: [
                            {
                                name: '分屏显示',
                                key: 7,
                                icon_key: 'monitoringScreen',
                                icon: iconList['monitoringScreen'][1],
                                path: 'resourceManagement/video/splitview',
                            },
                            {
                                name: '通道管理',
                                key: 8,
                                icon_key: 'videoManagement',
                                icon: iconList['videoManagement'][1],
                                path: 'resourceManagement/video/sip',
                            },
                            {
                                name: '视频配置',
                                key: 9,
                                icon_key: 'thoroughfareManagement',
                                icon: iconList['thoroughfareManagement'][1],
                                path: 'resourceManagement/video/mediaServer',
                            },
                            {
                                name: '录像管理',
                                key: 10,
                                icon_key: 'configurationManagement',
                                icon: iconList['configurationManagement'][1],
                                path: 'resourceManagement/video/record',
                            },
                            {
                                name: '文件记录',
                                key: 11,
                                icon_key: 'configurationManagement',
                                icon: iconList['configurationManagement'][1],
                                path: 'resourceManagement/video/detail',
                            },
                        ],
                    },
                    {
                        name: '规则引擎',
                        key: 'parent_rule',
                        icon_key: 'monitoringScreen',
                        icon: iconList['videoManagement'][1],
                        children: [
                            {
                                name: '数据桥接',
                                key: 12,
                                icon_key: 'monitoringScreen',
                                icon: iconList['monitoringScreen'][1],
                                path: 'resourceManagement/ruleengine/bridge',
                            },
                            {
                                name: '规则脚本',
                                key: 13,
                                icon_key: 'videoManagement',
                                icon: iconList['videoManagement'][1],
                                path: 'resourceManagement/ruleengine/script',
                            },
                            {
                                name: '场景联动',
                                key: 14,
                                icon_key: 'thoroughfareManagement',
                                icon: iconList['thoroughfareManagement'][1],
                                path: 'resourceManagement/ruleengine/scene',
                            },
                        ],
                    },
                    {
                        name: '企业管理',
                        key: 'parent_company',
                        icon_key: 'monitoringScreen',
                        icon: iconList['videoManagement'][1],
                        children: [
                            {
                                name: '用户管理',
                                key: 15,
                                icon_key: 'monitoringScreen',
                                icon: iconList['monitoringScreen'][1],
                                path: 'resourceManagement/enterprise/user',
                            },
                            {
                                name: '角色管理',
                                key: 16,
                                icon_key: 'videoManagement',
                                icon: iconList['videoManagement'][1],
                                path: 'resourceManagement/enterprise/role',
                            },
                            {
                                name: '菜单管理',
                                key: 17,
                                icon_key: 'thoroughfareManagement',
                                icon: iconList['thoroughfareManagement'][1],
                                path: 'resourceManagement/enterprise/menu',
                            },
                            {
                                name: '机构管理',
                                key: 18,
                                icon_key: 'videoManagement',
                                icon: iconList['videoManagement'][1],
                                path: 'resourceManagement/enterprise/dept',
                            },
                            {
                                name: '终端用户',
                                key: 19,
                                icon_key: 'thoroughfareManagement',
                                icon: iconList['thoroughfareManagement'][1],
                                path: 'resourceManagement/enterprise/terminal',
                            },
                        ],
                    },
                ],
                systemManagement: [
                    {
                        name: '系统设置',
                        key: 'parent_system',
                        icon_key: 'system_settings',
                        icon: iconList['system_settings'][1],
                        children: [
                            {
                                name: '岗位管理',
                                key: 1,
                                icon_key: 'post_management',
                                icon: iconList['post_management'][0],
                                path: 'systemManagement/system/post',
                            },
                            {
                                name: '字典管理',
                                key: 2,
                                icon_key: 'dictionary_management',
                                icon: iconList['dictionary_management'][1],
                                path: 'systemManagement/system/dict',
                            },
                            {
                                name: '参数设置',
                                key: 3,
                                icon_key: 'parameter_setting',
                                icon: iconList['parameter_setting'][1],
                                path: 'systemManagement/system/config',
                            },
                            {
                                name: '新闻分类',
                                key: 4,
                                icon_key: 'news_Classification',
                                icon: iconList['news_Classification'][1],
                                path: 'systemManagement/system/newsCategory',
                            },
                            {
                                name: '新闻咨询',
                                key: 5,
                                icon_key: 'news_information',
                                icon: iconList['news_information'][1],
                                path: 'systemManagement/system/news',
                            },
                            {
                                name: '三方登录',
                                key: 6,
                                icon_key: 'news_information',
                                icon: iconList['news_information'][1],
                                path: 'systemManagement/system/platform',
                            },
                            {
                                name: '操作日志',
                                key: 7,
                                icon_key: 'operation_log',
                                icon: iconList['operation_log'][1],
                                path: 'systemManagement/system/log/operlog',
                            },
                            {
                                name: '登录日志',
                                key: 8,
                                icon_key: 'entry_log',
                                icon: iconList['entry_log'][1],
                                path: 'systemManagement/system/log/logininfor',
                            },
                            {
                                name: '通知公告',
                                key: 9,
                                icon_key: 'entry_log',
                                icon: iconList['entry_log'][1],
                                path: 'systemManagement/system/notice',
                            },
                            {
                                name: '国际化配置',
                                key: 10,
                                icon_key: 'entry_log',
                                icon: iconList['entry_log'][1],
                                path: 'systemManagement/system/appLang',
                            },
                        ],
                    },
                    {
                        name: '系统运维',
                        key: 'parent_operation',
                        icon_key: 'system_operation',
                        icon: iconList['system_operation'][1],
                        children: [
                            {
                                name: '在线用户',
                                key: 11,
                                icon_key: 'online_user',
                                icon: iconList['online_user'][1],
                                path: 'systemManagement/monitor/online',
                            },
                            {
                                name: '定时任务',
                                key: 12,
                                icon_key: 'timed_task',
                                icon: iconList['timed_task'][1],
                                path: 'systemManagement/monitor/job',
                            },
                            {
                                name: '数据监测',
                                key: 13,
                                icon_key: 'data_monitoring',
                                icon: iconList['data_monitoring'][1],
                                path: 'systemManagement/monitor/druid',
                            },
                            {
                                name: '服务监测',
                                key: 14,
                                icon_key: 'service_monitoring',
                                icon: iconList['service_monitoring'][1],
                                path: 'systemManagement/monitor/server',
                            },
                            {
                                name: '缓存监测',
                                key: 15,
                                icon_key: 'cache_monitoring',
                                icon: iconList['cache_monitoring'][1],
                                path: 'systemManagement/monitor/cache',
                            },
                            {
                                name: '缓存列表',
                                key: 16,
                                icon_key: 'cache_list',
                                icon: iconList['cache_list'][1],
                                path: 'systemManagement/monitor/cacheList',
                            },
                        ],
                    },
                    {
                        name: '系统工具',
                        key: 'parent_tools',
                        icon_key: 'system_tools',
                        icon: iconList['system_tools'][1],
                        children: [
                            {
                                name: '表单构建',
                                key: 28,
                                icon_key: 'form_construction',
                                icon: iconList['form_construction'][1],
                                path: 'systemManagement/tool/build',
                            },
                            {
                                name: '代码生成',
                                key: 29,
                                icon_key: 'code_generation',
                                icon: iconList['code_generation'][1],
                                path: 'systemManagement/tool/gen',
                            },
                            {
                                name: '系统接口',
                                key: 30,
                                icon_key: 'system_interface',
                                icon: iconList['system_interface'][1],
                                path: 'systemManagement/tool/swagger',
                            },
                        ],
                    },
                ],
            },
            currentItemIdx: 1,
            defaultOpeneds: [], // 用于存储需要默认展开的 submenu 的 index
        };
    },
    methods: {
        setDefaultOpeneds() {
            const allSubmenus = [];
            const currentMenuList = this.menuList[this.menuMap[this.topBar.currentBarIdx]];

            // 收集所有有子菜单的项的 key
            currentMenuList.forEach((item) => {
                if (item.children) {
                    allSubmenus.push(item.key.toString());
                }
            });

            this.defaultOpeneds = allSubmenus;
        },
        handleClick(item) {
            const _map = {
                1: 'smartAquaculture',
                2: 'smartAquaculture',
                3: 'smartAquaculture',
                4: 'alarmCenter',
                5: 'resourceManagement',
                6: 'systemManagement',
            };
            this.menuList[_map[this.topBar.currentBarIdx]].forEach((element) => {
                if (element.children) {
                    element.children.forEach((child) => {
                        if (item.key === child.key) {
                            child.icon = iconList[child.icon_key][0];
                        } else {
                            child.icon = iconList[child.icon_key][1];
                        }
                    });
                } else {
                    if (item.key === element.key) {
                        element.icon = iconList[element.icon_key][0];
                    } else {
                        element.icon = iconList[element.icon_key][1];
                    }
                }
            });
            if (item.path) {
                this.$router.push('/' + item.path);
            }
            this.currentItemIdx = item.key;
        },
        showMenu(idx) {
            console.log(idx);
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .el-submenu__title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #a8aec9;
}
::v-deep .el-submenu__title i {
    color: #a8aec9;
}
::v-deep .el-submenu .el-menu-item {
    min-width: 180px;
}
::v-deep .el-menu-item {
    background-color: transparent !important;
    color: #000 !important;
    width: 180px !important;
}

::v-deep .el-menu {
    background-color: transparent !important;
    border: none !important;
    width: 180px;
}

::v-deep .el-submenu :hover {
    background-color: transparent !important;
}

.menu-bg {
    background-image: url('../../../assets/sunseen/feed/menu-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position-x: -5px;

    -webkit-transition: width 0.28s;
    transition: width 0.28s;
    width: 200px !important;
    height: 100%;
    position: fixed;
    top: 70px;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    -webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}
.menu-box-smartAquaculture {
    margin-top: 18px;
}
.menu-item-smartAquaculture {
    display: flex;
    align-items: center;
    line-height: 56px;
    width: 180px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #a8aec9;
    cursor: pointer;
}
.active-item {
    background-image: url('../../../assets/sunseen/feed/item-active.png');
    background-size: cover;
    background-repeat: no-repeat;
}
</style>
