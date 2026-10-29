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
const lunarDate = ref(dayjs().format("LYLZ年 LMLD LH"))
const time = ref(dayjs().format(timeFormat.value))

let animationFrameId = null
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
.timer-wrapper {
    display: grid;
    grid-auto-flow: row;
    gap: 8px;
    place-items: center;
    place-content: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;

    .line {
        width: 80px;
        --border: rgba(255, 255, 255, 0.2);
        margin-top: 8px;
        margin-bottom: 8px;
    }

    

    .date-text,
    .unix-text,
    .lunar-text {
        text-shadow: 0 1px 1px #000;
        white-space: nowrap;
    }

    .date-text,.lunar-text {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }

    .unix-text {
        font-size: 0.75rem;
        line-height: 1rem;
    }

}
</style>