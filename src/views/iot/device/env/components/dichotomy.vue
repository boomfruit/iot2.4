<template>
    <el-row>
        <el-col :span="12" style="display: flex; justify-content: start">
            <slot name="left"></slot>
        </el-col>
        <el-col :span="12" style="display: flex; justify-content: end">
            <slot name="right"></slot>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {};
    },

    components: {},

    filters: {},

    computed: {},

    mounted() {},

    methods: {},

    watch: {},
};
</script>
<style lang="scss" scoped></style>
