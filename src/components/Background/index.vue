<template>
    <div class="media-bg">
        <Transition name="site-bg">
            <Preview :source="source" :state="state" :visible="source.visible"></Preview>
        </Transition>
        <z-pagevisible @get-state="pageState"></z-pagevisible>
    </div>
</template>



<script setup>
const props = defineProps({
    source: {
        type: Object,
        default: () => ({})
    },
    videoPlay:{
        type: Boolean,
        default: true
    }
})

const state = ref('play')


let stateTimer = null;
function pageState(e) {
    const stateVal = e.detail[0];
    // console.log(props.videoPlay)
    if(!props.videoPlay) return
    // 添加延迟，避免在页面可见性变化时立即触发视频播放/暂停
    // 这可以解决 Edge 浏览器中窗口最小化和任务栏图标变亮的问题
    clearTimeout(stateTimer);
    stateTimer = setTimeout(() => {
        if (stateVal == 'hidden') state.value = 'pause';
        if (stateVal == 'visible') state.value = 'play';
    }, 150);
}

watch(() => props.videoPlay, (newVal) => {
    state.value = newVal ? 'play' : 'pause';    
})

</script>

<style scoped>

</style>