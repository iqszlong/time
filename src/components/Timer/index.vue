<template>
    <div class="timer-wrapper">
        <div class="text-sm">{{ date }}</div>
        <div class="text-6xl">{{ time }}</div>
        <Separator class="my-2 line" />
        <div class="text-muted-foreground text-xs">{{ unix }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    display: {
        type: String,
        default: '12'
    }
})

const { dayjs } = utils
const dateFormat = computed(() => {
    return props.display === '12' ? 'll dddd A' : 'll dddd'
})
const timeFormat = computed(() => {
    return props.display === '12' ? 'hh:mm' : 'HH:mm'
})
const unix = ref(dayjs().unix())
const date = ref(dayjs().format(dateFormat.value))
const time = ref(dayjs().format(timeFormat.value))
const timer = ref(null)

onMounted(() => {
    timer.value = setInterval(() => {
        date.value = dayjs().format(dateFormat.value)
        time.value = dayjs().format(timeFormat.value)
    }, 15000)
})

onUnmounted(() => {
    clearInterval(timer.value)
})

watch(()=>props.display, (curr, prev) => {
     date.value = dayjs().format(dateFormat.value)
    time.value = dayjs().format(timeFormat.value)
})
</script>

<style scoped>
.timer-wrapper {
    display: grid;
    grid-auto-flow: row;
    gap: 8px;
    place-items: center;
    place-content: center;
    text-shadow: 0 0 8px #000;

    .line {
        width: 80px;
        --border: rgba(255, 255, 255, 0.2);
    }
}
</style>