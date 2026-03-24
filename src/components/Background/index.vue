<template>
    <div class="media-bg">
        <Transition name="site-bg">
            <Preview :source="source"></Preview>
        </Transition>
        <z-pagevisible @get-state="pageState"></z-pagevisible>
    </div>
</template>



<script setup>
import utils from '@/utils'
import { getCurrentInstance, ref, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/stores/config';
import { useRoute } from 'vue-router'

const props = defineProps({
    source: {
        type: Object,
        default: () => ({})
    },
    sourcePath: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: 'play'
    },
    visible: {
        type: Boolean,
        default: true
    }
})



const route = useRoute()



const configStore = useConfigStore();
const { config } = storeToRefs(configStore);




function pageState(e) {
    const pageName = route.name || '';
    if (pageName == 'play' || !props.visible) return;
    const state = e.detail[0];

    if (state == 'hidden') {
        config.state = 'pause';
        // config.visible = false;
    }
    if (state == 'visible') {
        // config.visible = true;
        config.state = 'play';
    }
    // console.log(props.state);
}


onMounted(() => {
    // console.trace('onMounted');
    // console.log(props.source);
})



</script>

<style scoped>

</style>