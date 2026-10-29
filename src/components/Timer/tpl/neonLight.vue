<template>
    <div class="fx-neon">
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
.fx-neon {
    --ink: currentColor;
    --ink-2: #FF4FD8;
    --ink-3: #4FF8FF;
    font: 500 calc(3.75rem + v-bind('props.fontSizeScale') * 1px)/1.1 v-bind('props.fontFamily');
    color: var(--ink);
    text-shadow:
            0 0 4px var(--ink),
            0 0 11px var(--ink-2),
            0 0 24px var(--ink-2),
            0 0 48px var(--ink-2);
}
</style>