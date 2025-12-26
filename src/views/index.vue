<template>
    <component :is="page"></component>
</template>

<script setup>
import Home from './home.vue'

const page = Home
</script>

<style scoped>

</style>