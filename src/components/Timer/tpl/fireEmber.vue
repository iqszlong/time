<template>
    <div class="fx-ember">
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
.fx-ember {
    font: 500 calc(3.75rem + v-bind('props.fontSizeScale') * 1px)/1.1 v-bind('props.fontFamily');
    color: #ffd9a0;
    animation: fx-ember 1.7s ease-in-out infinite alternate;
}

@keyframes fx-ember {
    0% {
        text-shadow:
            0 -2px 6px #ffab40,
            0 -6px 14px #ff6d00,
            0 -12px 28px #dd2c00,
            0 -20px 44px rgba(213, 0, 0, .55);
    }

    100% {
        text-shadow:
            0 -3px 8px #ffc46b,
            0 -9px 20px #ff8f1f,
            0 -18px 38px #ff3d00,
            0 -30px 60px rgba(213, 0, 0, .8);
    }
}
</style>