<template>
    <div class="fixed right-8 bottom-8 z-50">
        <NPopover :trigger="trigger">
            <template #trigger>
                <slot name="button"></slot>
            </template>
            <slot></slot>
        </NPopover>
    </div>
</template>

<script setup>
import { NPopover } from 'naive-ui'

const props = defineProps({
    trigger: { type: String, default: "click" },
})

</script>

<style lang="scss" scoped></style>