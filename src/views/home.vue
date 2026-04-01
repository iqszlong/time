<template>
    <main class="home-layout">
        <section class="logo" :class="[{ 'is-hidden': isHidden }]">
            <z-logo v-if="!isEmpty(VITE_SITE_LOGO)" :src="VITE_SITE_LOGO" :alt="VITE_TITLE" class="min"></z-logo>
        </section>
        <section class="wrapper">
            <div class="ctrl-bar" :class="[{ 'is-hidden': isHidden }]">
                <SettingModal></SettingModal>
                <!-- <Button type="primary" @click="testClick">测试</Button> -->
            </div>
            <Timer class="timer" :display="config.timeDisplay"></Timer>
            <Footer></Footer>
        </section>
        <section class="media">
            <template v-for="item in backgrounds" :key="item.id">
                <Background class="item" :source="item" :videoPlay="videoPlay" :style="{ 'z-index': item.order }"></Background>
            </template>
        </section>
    </main>
</template>

<script setup>
import { useConfigStore } from '@/stores/config'
import { useBackgroundStore } from '@/stores/background'
import { toast } from 'vue-sonner'
const configStore = useConfigStore();
const { config, videoPlay } = storeToRefs(configStore)
const backgroundStore = useBackgroundStore();
const { loadBackgrounds,verifyPermission} = backgroundStore
const { loading: backgroundLoading,backgrounds, currentBackground } = storeToRefs(backgroundStore)
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
const testClick = () =>{
    toast.success('测试成功',{
        description: '这是一个测试消息',
        position: 'top-center',
    })
}



onMounted(async () => {
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