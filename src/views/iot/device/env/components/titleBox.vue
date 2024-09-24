<template>
    <div style="display: flex; align-items: center">
        <div style="width: 20px; flex-basis: 20px; flex-shrink: 0">
            <el-image style="width: 20px; height: 20px" :src="url"></el-image>
        </div>
        <div class="title">
            {{ title }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        url: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '标题',
        },
        img: {
            type: String,
            default: '',
        },
    },
    components: {},

    filters: {},

    computed: {},

    mounted() {},

    methods: {},

    watch: {},
};
</script>
<style lang="scss" scoped>
.title {
    margin-left: 7px;
    flex: 1;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #00eeff;
    line-height: 0px;
}
</style>
