<template>
    <div class="fx-neon">
        <TimerCore :time="time"></TimerCore>
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
    animation: fx-neon 5s linear infinite;
}
@keyframes fx-neon {
  0%, 18%, 21%, 24%, 100% {
    opacity: 1;
    text-shadow:
      0 0 4px var(--ink),
      0 0 11px var(--ink-2),
      0 0 24px var(--ink-2),
      0 0 48px var(--ink-2);
  }
  19%, 22%, 62% {
    opacity: .35;
    text-shadow: none;
  }
  63%, 64.5% {
    opacity: .6;
    text-shadow: 0 0 4px var(--ink-2);
  }
}
</style>