<template>
    <div class="media-bg">
        <Transition name="site-bg">
            <Preview :source="source" :state="source.state" :visible="source.visible"></Preview>
        </Transition>
        <z-pagevisible @get-state="pageState"></z-pagevisible>
    </div>
</template>



<script setup>
import utils from '@/utils'
import { getCurrentInstance, ref, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia';
import { useBackgroundStore } from '@/stores/background';
import { useRoute } from 'vue-router'

const props = defineProps({
    source: {
        type: Object,
        default: () => ({})
    },
})

const route = useRoute()

const backgroundStore = useBackgroundStore();
const { updateState } = backgroundStore;
const { currentBackground } = storeToRefs(backgroundStore);

function pageState(e) {
    const state = e.detail[0];
    if (state == 'hidden') {
        updateState(currentBackground.value.id, 'pause');
    }
    if (state == 'visible') {
        updateState(currentBackground.value.id, 'play');
    }
    // console.log(state);
}


onMounted(() => {
    // console.trace('onMounted');
    // console.log(props.source);
})



</script>

<style scoped>

</style>