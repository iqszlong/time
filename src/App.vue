<template>
    <NaiveDom>
        <RouterView v-slot="{ Component, route }">
            <Transition name="page">
                <!-- <component :is="Component" :key="route.fullPath" /> -->
                <component :is="Component" />
            </Transition>
        </RouterView>
        <Teleport to="body">
            <Toaster theme="system" richColors position="top-center"
                :toastOptions="{ style: { margin: '20px' }, closeButtonPosition: 'bottom-right' }"
                class="pointer-events-auto" />
            <z-network @is-online="networkOnline"><template></template></z-network>
        </Teleport>
    </NaiveDom>
</template>
<script setup>
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'vue-sonner'
// router切换时刷新页面
const isRouter = ref(true);
const reload = () => {
    isRouter.value = false;
    nextTick(() => {
        isRouter.value = true;
    });
};
provide("reload", reload);

const networkOnline = (e) => {
    const isOnline = e.detail[0];
    if (isOnline) {
        // toast.success('网络已连接');
        console.log('网络已连接');
    } else {
        toast.error('网络已断开', {
            description: '请检查网络连接',
            duration: 1e7,
            action: {
                label: '知道了',
                onClick: () => console.log('Done')
            },
        });
    }
};

</script>
<style scoped></style>
