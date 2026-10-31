<template>
    <div class="inline-flex items-center justify-center gap-1">
        <span>{{ hours }}</span>
        <span class="colon">:</span>
        <span>{{ minutes }}</span>
        <template v-if="seconds">
            <span class="colon">:</span>
            <span>{{ seconds }}</span>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    time: String,
})

const hours = computed(() => props.time.split(':')[0])
const minutes = computed(() => props.time.split(':')[1])
const seconds = computed(() => props.time.split(':')[2])
</script>

<style scoped>
.colon {
    transform: translateY(-0.08em);
}
</style>