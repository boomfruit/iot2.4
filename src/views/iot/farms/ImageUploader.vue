<!-- ImageUploader.vue -->
<template>
    <div class="image-uploader">
        <slot v-text="组件1" name="image" :imageSrc="imageSrc"></slot>
    </div>
</template>

<script>
export default {
    props: {
        imageSrc: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
/* 样式可以根据你的需求进行调整 */
.image-uploader img {
    max-width: 100%;
    height: auto;
}
</style>
