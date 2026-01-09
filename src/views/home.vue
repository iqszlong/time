<template>
    <main class="home-layout">
        <div class="wrapper">
            
            <div class="ctrl-bar" :class="[{'hidden':isHidden}]">
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
const {throttle,debounce} = utils
const isHidden = ref(true)

onMounted(() => {
    document.addEventListener('mouseleave',handleMouseleave)
    document.addEventListener('mouseenter',handleMouseenter)
})

onBeforeUnmount(() => {
  document.removeEventListener('mouseleave', handleMouseleave)
  document.removeEventListener('mouseenter', handleMouseenter)
})

const handleMouseleave = (e) => {
    // console.log('mouseleave',e)
    isHidden.value = true
}

const handleMouseenter = (e) => {
    // console.log('mouseenter',e)
    isHidden.value = false
}
</script>

<style scoped></style>