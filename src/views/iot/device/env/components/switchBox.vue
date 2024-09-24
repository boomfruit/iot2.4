<template>
    <el-row style="display: flex; align-items: center" :gutter="gutter">
        <el-col :span="childrenSpan[0]" :style="{ textAlign: textDirection }">{{ title }}</el-col>
        <el-col :span="childrenSpan[1]">
            <el-switch v-model="itemValue" @change="handleChange" inactive-value="0" active-value="1"></el-switch>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            itemId: '',
            itemValue: '',
            inputValue: '',
        };
    },
    methods: {
        handleChange(event) {
            this.$confirm(`确定要修改该参数`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$emit('change', {
                    itemId: itemId,
                    itemValue: inputValue,
                    value: event,
                }); //返回输入值
            });
        },
        getData(data) {
            this.$nextTick(() => {
                this.itemId = data[0].id;
                this.itemValue = data[0].value;
            });
        },
    },
    props: {
        title: {
            type: String,
            default: 'id',
        },
        id: {
            type: String,
            default: 'id',
        },
        textDirection: {
            type: String,
            default: '',
        },
        gutter: {
            type: Number,
            default: 20,
        },
        childrenSpan: {
            type: Array,
            default: [8, 16],
        },
        valueIDs: {
            type: Array,
            default: [],
        },
    },
    computed: {},
};
</script>
<style lang="scss" scoped>
.id-style {
    color: white;
    margin-right: 10px;
}
</style>
