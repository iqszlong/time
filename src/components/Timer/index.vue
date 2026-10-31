<template>
    <div class="timer-wrapper" :style="{gridArea:position,...positionStyleContent}">
        <div class="date-text">{{ date }}</div>

        <component :is="currentEffectComponent" :time="time" :font-family="fontFamily" :fontSizeScale="fontSizeScale"/>

        <div class="lunar-text">{{ lunarDate }}</div>

        <Separator class="line" />
        <div class="text-muted-foreground unix-text">{{ unix }}</div>
    </div>
</template>

<script setup>
import { fontEffects,positionStyle } from '@/services/mapping/config'
const props = defineProps({
    display: {
        type: String,
        default: '12'
    },
    fontFamily: {
        type: String,
        default: 'inherit'
    },
    fontSizeScale: {
        type: Number,
        default: 0,
    },
    position: {
        type: String,
        default: 'bottom-center'
    },
    effect: {
        type: String,
        default: fontEffects.default.value, // 'default'
        validator: (val) => Object.values(fontEffects).some(e => e.value === val)
    },
})

const { dayjs } = utils
const currentEffectComponent = computed(() =>
    fontEffects[props.effect].component
)


const dateFormat = computed(() => {
    return props.display === '12' ? 'll dddd A' : 'll dddd'
})
const timeFormat = computed(() => {
    return props.display === '12' ? 'hh:mm' : 'HH:mm'
})

const positionStyleContent = computed(() => {
    return positionStyle[props.position].style
})

const unix = ref(dayjs().unix())
const date = ref(dayjs().format(dateFormat.value))
const time = ref(dayjs().format(timeFormat.value))
const lunarDate = ref(dayjs().format("LYLZ年 LMLD LH"))

let animationFrameId = null
let timer = null


const updateTime = () => {
    const now = dayjs()
    date.value = now.format(dateFormat.value)
    time.value = now.format(timeFormat.value)
    unix.value = now.unix()
    lunarDate.value = now.format("LYLZ年 LMLD LH")
}


const getMsToNextMinute = () => {
    const now = dayjs()
    const seconds = now.second()
    const ms = now.millisecond()
    return (60 - seconds) * 1000 - ms
}

const startTimer = () => {
    
    const scheduleNext = () => {
        const delay = getMsToNextMinute()

        timer = setTimeout(() => {
            updateTime()
            scheduleNext()  // 遞迴安排下一次
        }, delay)
    }
    updateTime()  // 先立即更新一次
    scheduleNext()
}

// 精準版：使用 requestAnimationFrame 做每秒更新，並校正到整秒
const preciseTick = () => {
    const now = dayjs()
    const ms = now.millisecond()

    updateTime()

    // 計算距離下一個整秒還有多少毫秒
    const delayToNextSecond = 1000 - ms

    // 下次更新時間點盡量靠近整秒
    animationFrameId = setTimeout(() => {
        requestAnimationFrame(preciseTick)
    }, delayToNextSecond)
}

onMounted(() => {
    // preciseTick()
    // updateTime()
    startTimer()
})

onUnmounted(() => {
    // if (animationFrameId) clearTimeout(animationFrameId)
    if (timer) clearTimeout(timer)
})

watch(() => props.display, () => {
    updateTime()
})
</script>

<style scoped>

</style>