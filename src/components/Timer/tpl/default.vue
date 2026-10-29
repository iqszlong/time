<template>
    <div class="clock">
        {{ time }}
    </div>
</template>

<script setup>
const props = defineProps({
    time: String,
    fontFamily: String,
    fontSizeScale: Number
})
</script>

<style scoped>
.clock {
    font-size: calc(3.75rem + v-bind('props.fontSizeScale') * 1px);
    line-height: 1.1em;
    /* 让数字等宽对齐 */
    font-variant-numeric: tabular-nums;
    font-family: v-bind('props.fontFamily');
    text-shadow: 0 0 8px #000;
}
</style>