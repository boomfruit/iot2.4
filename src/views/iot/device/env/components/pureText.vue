<template>
    <div style="display: flex; align-items: center">
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
        title: {
            type: String,
            default: '标题',
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
    flex: 1;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #fff;
    line-height: 0px;
}
</style>
