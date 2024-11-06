<template>
    <el-row style="display: flex; align-items: center" :gutter="gutter">
        <el-col :span="childrenSpan[0]" :style="{ textAlign: textDirection }">{{ title }}</el-col>
        <el-col :span="childrenSpan[1]">
            <el-input size="mini" v-model="itemValue" placeholder="请输入内容" @change="handleChange"></el-input>
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
            console.log(event, 'event');
            this.$confirm(`确定要修改该参数`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                if (this.inside) {
                    // 设备端
                    this.$emit('changeDeviceInsideValue', {
                        itemId: this.itemId,
                        itemValue: this.inputValue,
                        value: event,
                    });
                } else {
                    this.$emit('change', {
                        itemId: this.itemId,
                        itemValue: this.inputValue,
                        value: event,
                    }); //返回输入值
                }
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
        inside: {
            type: Boolean,
            default: false,
        },
    },
    computed: {},
};
</script>
<style lang="scss" scoped>
.idstyle {
    color: white;
}
</style>
