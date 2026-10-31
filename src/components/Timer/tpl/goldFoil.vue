<template>
  <div class="fx-foil">
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
.fx-foil {
  font: 500 calc(3.75rem + v-bind('props.fontSizeScale') * 1px)/1.1 v-bind('props.fontFamily');
  color: transparent;
  background:
    linear-gradient(108deg,
      #7a4a08 0%,
      #f2c15d 18%,
      #fff4b8 24%,
      #b87014 36%,
      #f6d66d 51%,
      #8e560b 68%,
      #fff0a2 76%,
      #c98218 100%) 0 0 / 230% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow:
    0 1px 0 rgba(255, 244, 184, .45),
    0 9px 20px rgba(0, 0, 0, .36);
  animation: fx-foil 12s ease-in-out infinite;
}

@keyframes fx-foil {
  0% {
    background-position: 0% 0;
    filter: saturate(1.05);
  }

  50% {
    background-position: -265% 0;
    filter: saturate(1.35) brightness(1.12);
  }

  100% {
    background-position: -530% 0;
    filter: saturate(1.05);
  }
}
</style>