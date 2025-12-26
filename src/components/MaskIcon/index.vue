<template>
    <span class="mask-icon pointer-events-none" :style="{ 'mask-image': `url(${svgImg})` }"></span>
</template>


<script setup>
const props = defineProps({
    svgImg: String,
})
</script>

<style scoped>
.mask-icon {
    display: block;
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
}
</style>