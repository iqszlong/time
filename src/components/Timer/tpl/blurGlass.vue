<template>
    <div class="fx-glass" :data-text="time">{{ time }}</div>
</template>

<script setup>
const props = defineProps({
    time: String,
    fontFamily: String,
    fontSizeScale: Number,
})
</script>

<style scoped>
.fx-glass {
    --ink: #F5F2FF;
    --ink-2: #FF4FD8;
    --ink-3: #4FF8FF;
    position: relative;
    font: 500 calc(3.75rem + v-bind('props.fontSizeScale') * 1px)/1.1 v-bind('props.fontFamily');
    color: color-mix(in srgb, var(--ink) 58%, transparent);
    -webkit-text-stroke: 2px color-mix(in srgb, var(--ink) 52%, transparent);
    text-shadow:
        0 1px 0 rgba(255, 255, 255, .4),
        0 12px 24px rgba(0, 0, 0, .3);
}

.fx-glass::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: var(--ink-3);
    opacity: .34;
    filter: blur(3px);
    transform: translate(4px, 5px);
    pointer-events: none;
}

.fx-glass::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: transparent;
    background: linear-gradient(115deg, transparent 22%, #fff 44%, transparent 62%) 110% 0 / 260% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    opacity: .55;
    pointer-events: none;
}
</style>