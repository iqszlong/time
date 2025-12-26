<template>
    <RouterView v-slot="{ Component, route }">
        <component :is="Component" />
    </RouterView>
</template>

<script setup>
</script>

<style scoped></style>