<template>
    <div class="device-inline-video" v-loading="loading" element-loading-background="#ffff">
        <el-row v-show="total > 0">
            <el-col id="deviceVideoCol" :span="8" style="padding-left: 10px; padding-right: 10px; padding-top: 15px" v-for="(item, index) in sipList" :key="index">
                <div class="video">
                    <player :ref="`player_${index}`" :playerinfo="{ playtype: 'play', deviceId: item.deviceSipId, channelId: item.channelId }"></player>
                    <span v-if="item.status === 1" class="status" style="color: #ffba00">{{ $t('home.notActive') }}</span>
                    <span v-if="item.status === 2" class="status" style="color: #ff4949">{{ $t('home.disabled') }}</span>
                    <span v-if="item.status === 4" class="status" style="color: #909399">{{ $t('home.offline') }}</span>
                    <i v-if="item.status === 3" class="el-icon-caret-right btn" @click="handlePlay($event, item, index)"></i>
                </div>
            </el-col>
        </el-row>
        <el-empty v-if="total === 0" :description="$t('device.inline-video.986754-0')"></el-empty>
        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" :pageSizes="[9, 18, 27, 36]" @pagination="getSipList" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import player from '@/views/components/player/player.vue';
import { startPlay, closeStream } from '@/api/iot/channel';

export default {
    name: 'DeviceInlineVideo',
    components: {
        player,
    },
    props: {
        sipRelationList: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
    watch: {
        // 检测系统菜单栏状态
        sidebarStatus() {
            this.calculatePlayerHeight();
        },
        sipRelationList: {
            handler(newVal, oldVal) {
                if (newVal && newVal.length !== 0) {
                    this.total = newVal.length;
                    this.tempSipList = this.sipRelationList;
                }
            },
            deep: true,
        },
    },
    computed: {
        ...mapState({
            sidebarStatus: (state) => state.app.sidebar.opened,
        }),
        sipList() {
            const start = (this.pageNum - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.sipRelationList.slice(start, end);
        },
    },
    data() {
        return {
            loading: false,
            pageNum: 1,
            pageSize: 9,
            total: 0,
            tempSipList: [],
        };
    },
    mounted() {
        this.calculatePlayerHeight();
        window.addEventListener('resize', this.calculatePlayerHeight, true);
        this.tempSipList = this.sipRelationList;
        this.total = this.sipRelationList.length;
    },
    methods: {
        // 获取窗体高度
        calculatePlayerHeight() {
            const _this = this;
            _this.loading = true;
            setTimeout(() => {
                _this.sipList &&
                    _this.sipList.forEach((item, index) => {
                        let videoContainer = _this.$refs[`player_${index}`][0].$refs.container;
                        const offsetWidth = document.getElementById('deviceVideoCol').offsetWidth;
                        videoContainer.style.width = offsetWidth ? offsetWidth - 10 + 'px' : '300px';
                        videoContainer.style.height = '230px';
                    });
                _this.loading = false;
            }, 100);
        },
        getSipList(e) {
            this.pageNum = e.page;
            this.pageSize = e.limit;
        },
        // 播放
        handlePlay(event, item, index) {
            const _this = this;
            startPlay(item.deviceSipId, item.channelId).then((res) => {
                if (res.code === 200) {
                    if (!_this.$refs[`player_${index}`][0].isInit) {
                        _this.$refs[`player_${index}`][0].init();
                    }
                    _this.tempSipList[index].streamId = res.data.streamId;
                    _this.tempSipList[index].playurl = res.data.playurl;
                    _this.$refs[`player_${index}`][0].play(res.data.playurl);
                    event.target.style.visibility = 'hidden';
                }
            });
        },
        // 关闭播放器
        handleClose() {
            if (this.sipList && this.sipList.length !== 0) {
                const _this = this;
                this.sipList.forEach((item, index) => {
                    if (_this.tempSipList[index].streamId) {
                        closeStream(item.deviceSipId, item.channelId, _this.tempSipList[index].streamId).then((res) => {});
                    }
                    _this.$refs[`player_${index}`][0] && _this.$refs[`player_${index}`][0].close();
                });
            }
        },
    },
    destroyed() {
        this.handleClose();
    },
};
</script>

<style lang="scss" scoped>
.device-inline-video {
    position: relative;
    width: 100%;
    height: 100%;
    padding-bottom: 15px;

    .video {
        position: relative;
        width: 350px;
        height: 230px;

        .btn {
            position: absolute;
            bottom: 5px;
            left: 5px;
            border-radius: 50%;
            background: #fff;
            padding: 5px;
            cursor: pointer;
            color: #606266;
        }

        .status {
            position: absolute;
            top: 5px;
            left: 8px;
            font-size: 12px;
        }
    }
}
</style>
