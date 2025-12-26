<template>
    <main class="home-layout">
        <div class="wrapper">

            <Timer class="timer"></Timer>
            <Footer></Footer>
        </div>
        
        <Background class="media" :sourcePath="config.sourcePath"></Background>
    </main>
</template>

<script setup>
import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore();
const { config } = storeToRefs(configStore)
</script>

<style scoped></style>