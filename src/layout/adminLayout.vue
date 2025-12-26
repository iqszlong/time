<template>
    <div class="wrapper w-full h-full">
        <z-layout :showSidebar="sideState">
            <div slot="logo" class="flex gap-8 items-center">
                <RouterLink to="/">
                    <z-logo :src="logo" title="logo" size="min"
                        class="text-black dark:text-white">{{ baseTitle }}</z-logo>
                </RouterLink>
                <div class="header-menu flex gap-4">
                    <RouterLink to="/single">单页</RouterLink>
                </div>
            </div>

            <SettingMenu slot="menu"></SettingMenu>

            <SideMenu slot="side" @selected="selectedItem"></SideMenu>
            <div class="content relative z-0 w-full h-full">
                <RouterView v-slot="{ Component, route }">
                    <Transition name="page">
                        <component :is="Component" />
                    </Transition>
                </RouterView>
            </div>
            <Footer slot="footer"></Footer>
        </z-layout>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
const baseTitle = import.meta.env.VITE_TITLE
const sideState = ref(false);

function selectedItem() {
    // console.log('selectedItem');
    if (matchMedia("(max-width: 640px)").matches) {
        sideState.value = !sideState.value;
    }
}
</script>

<style scoped></style>