<template>
    <div class="media-bg">
        <Transition name="site-bg">
            <Preview :source="source" :state="state" :visible="source.visible"></Preview>
        </Transition>
        <z-pagevisible @get-state="pageState"></z-pagevisible>
    </div>
</template>



<script setup>
import utils from '@/utils'

const props = defineProps({
    source: {
        type: Object,
        default: () => ({})
    },
})

const state = ref('play')


function pageState(e) {
    const stateVal = e.detail[0];
    if (stateVal == 'hidden') state.value = 'pause';
    if (stateVal == 'visible') state.value = 'play';
}

watchEffect(() => {
    // console.log('background watchEffect',props.source);
})

</script>

<style scoped>

</style>