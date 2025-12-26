<template>
    <z-loading class="fixed">
        <div slot="media" class="flip"><z-logo :src="logoIcon"></z-logo></div>
        <span slot="text">{{ VITE_SITE_LOADING }}</span>
    </z-loading>
</template>

<script setup>
import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()
const { config } = storeToRefs(configStore)
const { VITE_SITE_LOADING } = import.meta.env
const { logo } = utils.icons

const logoIcon = computed(() => {
    return config.value?.website_icon || logo
})
</script>

<style></style>