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
// let animationFrameId = null
let timer = null


const updateTime = () => {
  const now = dayjs()
  date.value = now.format(dateFormat.value)
  time.value = now.format(timeFormat.value)
  unix.value = now.unix()
}


const getMsToNextMinute = () => {
  const now = dayjs()
  const seconds = now.second()
  const ms = now.millisecond()
  return (60 - seconds) * 1000 - ms
}

const startTimer = () => {
  updateTime()  // 先立即更新一次

  const scheduleNext = () => {
    const delay = getMsToNextMinute()
    
    timer = setTimeout(() => {
      updateTime()
      scheduleNext()  // 遞迴安排下一次
    }, delay)
  }

  scheduleNext()
}

// 精準版：使用 requestAnimationFrame 做每秒更新，並校正到整秒
// const preciseTick = () => {
//   const now = dayjs()
//   const ms = now.millisecond()

//   updateTime()

//   // 計算距離下一個整秒還有多少毫秒
//   const delayToNextSecond = 1000 - ms

//   // 下次更新時間點盡量靠近整秒
//   animationFrameId = setTimeout(() => {
//     requestAnimationFrame(preciseTick)
//   }, delayToNextSecond)
// }

onMounted(() => {
    // preciseTick()
    // updateTime()
    startTimer()
})

onUnmounted(() => {
    // if (animationFrameId) clearTimeout(animationFrameId)
    if (timer) clearTimeout(timer)
})

watch(()=>props.display, () => {
    updateTime()
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