<template>
    <div class="clock-glass-container" :key="time">
        <div class="clock-blur-layer">{{ time }}</div>
        <div class="clock-text-layer">{{ time }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    time: String,
    fontFamily: String
})
</script>

<style scoped>
.clock-glass-container {
    position: relative;
    font-size: 3.75rem;
    font-weight: bold;
    line-height: 1.1em;
    font-variant-numeric: tabular-nums;
    font-family: v-bind('props.fontFamily');
}

.clock-blur-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    color: transparent;
    background: rgba(255, 255, 255, 0.15);

    filter: blur(4px);
    pointer-events: none;
    
}


@supports (backdrop-filter: blur(1px)) {
    .clock-blur-layer {
        -webkit-mask: linear-gradient(#fff 0 0) text;
        mask: linear-gradient(#fff 0 0) text;

        backdrop-filter: blur(5px) saturate(500%);
        -webkit-backdrop-filter: blur(5px) saturate(500%);

        /* 叠加微光扩散 */
        filter: blur(4px) drop-shadow(0 0 8px rgba(0, 0, 0, 1));
    }
}


.clock-text-layer {
    position: relative;
    z-index: 1;

    /* 彻底掏空文字 */
    color: transparent;

    -webkit-text-stroke: 0.8px rgba(255, 255, 255, 0.4);

    text-shadow:
        0 1px 1px rgba(255, 255, 255, 0.1),
        0 2px 2px rgba(0, 0, 0, 0.15),
        0 -1px 1px rgba(255, 255, 255, 0.3);



}
</style>