<template>
    <div class="timer-wrapper">
        <div class="text-muted-foreground text-xs">{{ unix }}</div>
        <div class="text-base">{{ date }}</div>
        <div class="text-9xl">{{ time }}</div>
    </div>
</template>

<script setup>
const { dayjs } = utils
const unix = ref(dayjs().unix())
const date = ref(dayjs().format('ll A'))
const time = ref(dayjs().format('hh:mm'))
const timer = ref(null)

onMounted(() => {
    timer.value = setInterval(() => {
        date.value = dayjs().format('ll A')
        time.value = dayjs().format('hh:mm')
    }, 15000)
})

onUnmounted(() => {
    clearInterval(timer.value)
})
</script>

<style scoped>
.timer-wrapper{
    display: grid;
    grid-auto-flow: row;
    gap:8px;
    place-items: center;
    place-content: center;
    text-shadow: 0 0 8px #000;
}
</style>