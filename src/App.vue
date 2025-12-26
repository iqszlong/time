<template>
    <NaiveDom>
        <RouterView v-slot="{ Component, route }">
            <Transition name="page">
                <!-- <component :is="Component" :key="route.fullPath" /> -->
                 <component :is="Component"/>
            </Transition>
        </RouterView>
    </NaiveDom>
</template>
<script setup>
// router切换时刷新页面
const isRouter = ref(true);
const reload = () => {
    isRouter.value = false;
    nextTick(() => {
        isRouter.value = true;
    });
};
provide("reload", reload);

</script>
<style scoped></style>
