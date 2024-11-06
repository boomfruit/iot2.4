import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect'),
            },
        ],
    },
    {
        path: '/bigScreen',
        component: () => import('@/views/bigScreen/home'),
        hidden: true,
        meta: { bigScreen: true },
    },
    {
        path: '/login',
        component: () => import('@/views/login'),
        hidden: true,
    },
    {
        path: '/register',
        component: () => import('@/views/register'),
        hidden: true,
    },
    {
        path: '/404',
        component: () => import('@/views/error/404'),
        hidden: true,
    },
    {
        path: '/401',
        component: () => import('@/views/error/401'),
        hidden: true,
    },
    {
        path: '',
        component: Layout,
        redirect: 'index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/index'),
                name: 'Index',
                meta: { title: '首页', icon: 'dashboard', affix: true },
            },
        ],
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'profile',
                component: () => import('@/views/system/user/profile/index'),
                name: 'Profile',
                meta: { title: '个人中心', icon: 'user' },
            },
        ],
    },
    {
        path: '/oauthLogin',
        component: () => import('@/views/oauthLogin/index'),
        hidden: true,
    },
    {
        path: '/sso',
        component: () => import('@/views/oauthLogin/sso'),
        hidden: true,
    },
    //以下组态特有
    // {
    //     path: '/topo/fullscreen',
    //     component: () => import('@/views/scada/topo/fullscreen'),
    //     hidden: true,
    // },
    // {
    //     path: '/scada/topo/editor',
    //     component: () => import('@/views/scada/topo/editor'),
    // },
    //以上组态特有
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
    {
        path: '/system/user-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:user:edit'],
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole'),
                name: 'AuthRole',
                meta: { title: '分配角色', activeMenu: '/system/user' },
            },
        ],
    },
    {
        path: '/system/role-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:role:edit'],
        children: [
            {
                path: 'user/:roleId(\\d+)',
                component: () => import('@/views/system/role/authUser'),
                name: 'AuthUser',
                meta: { title: '分配用户', activeMenu: '/system/role' },
            },
        ],
    },
    {
        path: '/system/dict-data',
        component: Layout,
        hidden: true,
        permissions: ['system:dict:list'],
        children: [
            {
                path: 'index/:dictId(\\d+)',
                component: () => import('@/views/system/dict/data'),
                name: 'Data',
                meta: { title: '字典数据', activeMenu: '/system/dict' },
            },
        ],
    },
    {
        path: '/system/user-manage',
        component: Layout,
        hidden: true,
        permissions: ['system:user:edit'],
        children: [
            {
                path: 'user/:deptId(\\d+)',
                component: () => import('@/views/system/user/index'),
                name: 'User',
                meta: { title: '用户管理', activeMenu: '/system/user' },
            },
        ],
    },
    {
        path: '/system/role-manage',
        component: Layout,
        hidden: true,
        permissions: ['system:role:edit'],
        children: [
            {
                path: 'role/:deptId(\\d+)',
                component: () => import('@/views/system/role/index'),
                name: 'User',
                meta: { title: '角色管理', activeMenu: '/system/role' },
            },
        ],
    },
    {
        path: '/monitor/job-log',
        component: Layout,
        hidden: true,
        permissions: ['monitor:job:list'],
        children: [
            {
                path: 'index/:jobId(\\d+)',
                component: () => import('@/views/monitor/job/log'),
                name: 'JobLog',
                meta: { title: '调度日志', activeMenu: '/monitor/job' },
            },
        ],
    },
    {
        path: '/tool/gen-edit',
        component: Layout,
        hidden: true,
        permissions: ['tool:gen:edit'],
        children: [
            {
                path: 'index/:tableId(\\d+)',
                component: () => import('@/views/tool/gen/editTable'),
                name: 'GenEdit',
                meta: { title: '修改生成配置', activeMenu: '/tool/gen' },
            },
        ],
    },
    {
        path: '/system/oss-config',
        component: Layout,
        hidden: true,
        permissions: ['oss:config:list'],
        children: [
            {
                path: 'index',
                component: () => import('@/views/system/oss/config.vue'),
                name: 'OssConfig',
                meta: { title: '配置管理', activeMenu: '/system/oss', icon: '' },
            },
        ],
    },
    {
        path: '/iot',
        component: Layout,
        hidden: true,
        permissions: ['iot:device:add', 'iot:device:query'],
        children: [
            {
                path: 'product-edit',
                component: () => import('@/views/iot/product/product-edit'),
                name: 'ProductEdit',
                meta: { title: '编辑产品', activeMenu: '/iot/product', nocache: true },
            },
            {
                path: 'device-edit',
                component: () => import('@/views/iot/device/device-edit'),
                name: 'DeviceEdit',
                meta: { title: '编辑设备', activeMenu: '/iot/device', noCache: true },
            },
            {
                path: 'firmware-task',
                component: () => import('@/views/iot/firmware/firmware-task'),
                name: 'FirmwareTask',
                meta: { title: '固件详情', activeMenu: '/iot/firmware' },
            },

            {
                path: 'device-select-allot',
                component: () => import('@/views/iot/device/device-select-allot'),
                name: 'DeviceSelectAllot',
                meta: { title: '选择分配', activeMenu: '/iot/device', noCache: true },
            },
            {
                path: 'device-recycle',
                component: () => import('@/views/iot/device/device-recycle'),
                name: 'DeviceSelectAllot',
                meta: { title: '回收设备', activeMenu: '/iot/device', noCache: true },
            },
        ],
    },

    {
        path: '/scene',
        component: Layout,
        hidden: true,
        permissions: ['scene:model:query', 'scene:model:edit'],
        children: [
            {
                path: 'list/detail',
                component: () => import('@/views/scene/list/detail/index'),
                name: 'listDetail',
                meta: { title: '场景详情', activeMenu: '/scene/list/index', noCache: true },
            },
            {
                path: 'list/edit',
                component: () => import('@/views/scene/list/edit'),
                name: 'listEdit',
                meta: { title: '场景编辑', activeMenu: '/scene/list/index', noCache: true },
            },
        ],
    },

    //以下组态特有
    // {
    //     path: '/scada',
    //     component: Layout,
    //     hidden: true,
    //     permissions: ['scada:echart:edit', 'scada:center:edit', 'scada:component:edit'],
    //     children: [
    //         {
    //             path: 'echart/detail',
    //             component: () => import('@/views/scada/echart/detail'),
    //             name: 'echartDetail',
    //             meta: { title: '图表详情', activeMenu: '/scada/echart', noCache: true },
    //         },
    //         {
    //             path: 'component/detail',
    //             component: () => import('@/views/scada/component/detail'),
    //             name: 'Editor',
    //             meta: { title: '组件详情', activeMenu: '/scada/component', noCache: true },
    //         },
    //     ],
    // },
    //以上组态特有
];

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch((err) => err);
};

export default new Router({
    mode: 'history', // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
    linkActiveClass: 'active',
    base: '/',
});
