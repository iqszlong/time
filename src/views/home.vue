<template>
    <main class="home-layout">
        <section class="logo" :class="[{ 'is-hidden': isHidden }]">
            <z-logo v-if="!isEmpty(VITE_SITE_LOGO)" :src="VITE_SITE_LOGO" :alt="VITE_TITLE" class="min"></z-logo>
        </section>
        <section class="wrapper">
            <div class="ctrl-bar" :class="[{ 'is-hidden': isHidden }]">
                <SettingModal></SettingModal>

                <z-screenfull>
                    <Button variant="outline" size="icon" slot="exit" class="rounded-full">
                        <Shrink />
                    </Button>
                    <Button variant="outline" size="icon" slot="full" class="rounded-full">
                        <Expand />
                    </Button>
                </z-screenfull>

                <!-- <Button variant="outline" @click="testClick">测试</Button> -->
            </div>
            <Timer class="timer" v-bind="timerAttrs"></Timer>
            <Footer></Footer>
        </section>
        <section class="media">
            <template v-for="item in backgrounds" :key="item.id">
                <Background class="item" :source="item" :videoPlay="videoPlay" :style="{ 'z-index': item.order }">
                </Background>
            </template>
        </section>
    </main>
</template>

<script setup>
import { Expand, Shrink } from 'lucide-vue-next';
import { useConfigStore } from '@/stores/config'
import { useBackgroundStore } from '@/stores/background'
import { toast } from 'vue-sonner'
import { fontFamilys } from '@/services/mapping/config'
const configStore = useConfigStore();
const { config, videoPlay } = storeToRefs(configStore)
const backgroundStore = useBackgroundStore();
const { backgrounds } = storeToRefs(backgroundStore)
const { debounce, isEmpty } = utils
const isHidden = ref(false)

const { VITE_SITE_LOGO, VITE_TITLE } = import.meta.env




const timerAttrs = computed(() => ({
    display: config.value.timeDisplay,
    fontFamily: fontFamilys[config.value.timeFontFamily].value,
}))


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
const testClick = () => {
    toast.success('测试成功', {
        description: '这是一个测试消息',
        position: 'top-center',
        duration: 999000, 
        closeButton:true,
    })
}



onMounted(async () => {
    setTimeout(() => {
        autoHide()
    }, 800)
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseleave)
    // console.log(fontStyles)
    // console.log(config.value.timeFontStyle)
    // console.log(fontStyles[config.value.timeFontStyle])
})

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseleave)
    autoHide.cancel()
})


</script>

<style scoped></style>