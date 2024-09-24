<template>
    <div class="box">
        <div class="gutter-box2">
            <div style="display: flex">
                <div class="content-card-img"></div>
                <div>{{ title }}</div>
            </div>
            <div class="content-card-line">
                <div class="bottom-line1" :style="{ width: lineWidth }"></div>
                <div class="bottom-line2"></div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '标题',
        },
        lineWidth: {
            type: String,
            default: '62px',
        },
    },
    data() {
        return {
            boxGutter: 20,
        };
    },
    created() {},
    methods: {},
};
</script>

<style lang="scss" scoped>
$bg-color: #0d1827;
.box {
    background-color: #000000;
}

.gutter-box1 {
    /* 第一层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    margin-top: 20px;
    border-radius: 10px;
    align-items: center;
    line-height: 45px;
}

.gutter-box2 {
    /* 第二层组件的设置 */
    padding: 10px;
    background-color: $bg-color;
    color: white;
    margin-bottom: 20px;
    border-radius: 10px;
}
.content-card-img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    background-image: url('../../../../../assets/sunseen/shackDetail/content-card-img.png');
    background-size: contain;
}

.content-card-line {
    padding-left: 30px;

    .bottom-line1 {
        margin-top: 5px;
        width: 62px;
        height: 3px;
        background: #4177ab;
    }

    .bottom-line2 {
        width: 100%;
        height: 2px;
        background-color: #1f3950;
    }
}
</style>
