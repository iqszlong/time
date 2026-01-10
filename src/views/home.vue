<template>
    <main class="home-layout">
        <div class="logo">
            <img v-if="!isEmpty(VITE_SITE_LOGO)" :src="VITE_SITE_LOGO" :alt="VITE_TITLE" />
        </div>
        <div class="wrapper">

            <div class="ctrl-bar" :class="[{ 'hidden': isHidden }]">
                <SettingModal></SettingModal>
            </div>
            <Timer class="timer" :display="config.time.display"></Timer>
            <Footer></Footer>
        </div>

        <Background class="media" :sourcePath="config.sourcePath"></Background>
    </main>
</template>

<script setup>
import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore();
const { config } = storeToRefs(configStore)
const { throttle, debounce, isEmpty } = utils
const isHidden = ref(false)

const { VITE_SITE_LOGO, VITE_TITLE } = import.meta.env

// 超时隐藏
const autoHide = debounce(() => {
    isHidden.value = true
}, 3000)


const handleMouseleave = (e) => {
    // console.log('mouseleave',e)
    isHidden.value = true
    autoHide.cancel()
}



const handleMouseMove = () => {
    isHidden.value = false // 鼠标一动就显示
    autoHide()// 重启倒计时
}

onMounted(() => {
    setTimeout(() => {
        autoHide()
    }, 800)
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseleave)
})

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseleave)
    autoHide.cancel()
})
</script>

<style scoped></style>