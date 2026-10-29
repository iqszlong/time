<template>
    <div class="fx-led" :data-text="time">
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
.fx-led {
  --ink: currentColor; --ink-2: #FF4FD8; --ink-3: #4FF8FF;
  position: relative;
  font: normal calc(3.75rem + v-bind('props.fontSizeScale') * 1px)/1.1 v-bind('props.fontFamily');
  color: color-mix(in srgb, var(--ink-2) 22%, transparent);
  text-shadow: 0 0 1px color-mix(in srgb, var(--ink-2) 35%, transparent);
}
.fx-led::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  color: transparent;
  background:
    radial-gradient(circle closest-side,
      #fff 0 28%,
      var(--ink-2) 34% 62%,
      transparent 68%) 0 0 / 4.5px 4.5px;
  -webkit-background-clip: text;
  background-clip: text;
  
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0%,
    #000 18%,
    #000 42%,
    transparent 68%
  );
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    #000 18%,
    #000 42%,
    transparent 68%
  );
  -webkit-mask-size: 240% 100%;
  mask-size: 240% 100%;
  -webkit-mask-position: 120% 0;
  mask-position: 120% 0;
  animation: fx-led 12s linear infinite;
}
.fx-led::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  color: transparent;
  background:
    radial-gradient(circle closest-side,
      color-mix(in srgb, var(--ink-2) 55%, transparent) 0 55%,
      transparent 62%) 0 0 / 4.5px 4.5px;
  -webkit-background-clip: text;
  background-clip: text;
  opacity: .45;
}
@keyframes fx-led {
  to {
    -webkit-mask-position: -240% 0;
    mask-position: -240% 0;
  }
}
</style>