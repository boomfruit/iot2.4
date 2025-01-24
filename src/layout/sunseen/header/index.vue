<template>
    <div class="header-box">
        <div class="title"></div>
        <div class="header-contain">
            <div :class="[currentIdx === item.key ? 'current-item-bg' : '']" class="header-contain-item" v-for="item in tabList" :key="item.key" @click="changeCurrentIdx(item.key)">{{ item.name }}</div>
        </div>
        <div class="user">
            <langSelect id="lang-select" class="right-menu-item hover-effect" />

            <div class="user-name">{{ name }}</div>
            <Navbar></Navbar>
        </div>
    </div>
</template>

<script>
import Navbar from '../../components/TitleBar';
import { getUserProfile } from '@/api/system/user';
import langSelect from '@/layout/components/langSelect';

export default {
    data() {
        return {
            tabList: [
                {
                    name: '驾驶舱',
                    key: 1,
                },
                {
                    name: '智慧养殖',
                    key: 2,
                },
                {
                    name: '栏舍管理',
                    key: 7,
                },
                {
                    name: '农场管理',
                    key: 3,
                },
                {
                    name: '报警中心',
                    key: 4,
                },
                {
                    name: '资源管理',
                    key: 5,
                },
                {
                    name: '系统设置',
                    key: 6,
                },
            ],
            name: '',
            currentIdx: 1,
        };
    },

    components: {
        Navbar,
        langSelect,
    },

    filters: {},

    computed: {},

    mounted() {
        this.getName();
        if (this.$store.state.user.roles[0] === 'sysShowUser') {
            this.tabList = [
                {
                    name: '驾驶舱',
                    key: 1,
                },
                {
                    name: '智慧养殖',
                    key: 2,
                },
                {
                    name: '资源管理',
                    key: 5,
                },
                {
                    name: '系统设置',
                    key: 6,
                },
            ];
        }
    },
    methods: {
        getName() {
            getUserProfile().then((res) => {
                this.name = res.data.userName;
            });
        },
        changeCurrentIdx(idx) {
            this.currentIdx = idx;
            this.$store.dispatch('changeCurrentIdx', idx);
            const routerMap = this.$store.state.topBar.routerMap;
            console.log(routerMap, 'routerMap');
            this.$router.push('/' + routerMap[idx]);
        },
    },

    watch: {},
};
</script>
<style lang="scss" scoped>
.current-item-bg {
    background-image: url('../../../assets//sunseen/current-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
}
.header-box {
    height: 70px;
    width: 100%;
    background-image: url('../../../assets//sunseen/header-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    position: fixed;
    z-index: 999;
    .title {
        width: 392px;
        height: 50px;
        background-image: url('../../../assets//sunseen/sunseen-header-title.png');
        background-size: contain 75%;
        background-repeat: no-repeat;
        background-position-y: 15px;
        background-position-x: 15px;
    }
    .header-contain {
        flex: 1;
        display: flex;
        .header-contain-item {
            width: 175px;
            height: 70px;
            line-height: 70px;
            text-align: center;
            cursor: pointer;

            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
        }
    }
    .user {
        width: 270px;
        height: 70px;
        display: flex;
        align-content: center;
        align-items: center;
        .user-name {
            width: 100px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 15px;
            color: #8295b1;
            line-height: 70px;
            text-align: end;
        }
    }
}
</style>
