<template>
    <div class="media-bg">
        <Transition name="site-bg">
            <z-bg class="mask [--mask-rgb:255,255,255] dark:[--mask-rgb:0,0,0]"
                :class="[{ 'mask-disabled': !config.mask.enabled }]" v-if="visible" :style="{
                    '--mask-from': config.mask.from + '%',
                    '--mask-to': config.mask.to + '%',
                    '--content-fit': config.fit
                }">
                <template v-if="isImg(sourcePath)">
                    <z-img :src="pathReplace(sourcePath)" class="img"></z-img>
                </template>
                <template v-if="isAssetTypeAnVideo(fileExt(sourcePath))">
                    <video ref="videoDom" :src="pathReplace(sourcePath)" loop muted class="video" @loadeddata="autoplay"
                        @playing="changeState" @play="changeState" @pause="changeState"></video>
                </template>
            </z-bg>
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
    sourcePath: {
        type: String,
        default: ''
    },
    fit: {
        type: String,
        default: 'cover'
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

const { fileExt, isAssetTypeAnImage, isAssetTypeAnVideo, pathReplace } = utils

const route = useRoute()

const videoDom = ref(null);
const videoState = ref('idle');

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


function changeState(e) {
    videoState.value = e.type;

    // console.log(videoState.value);
}

function autoplay(e) {
    // console.log(e.target);
    // console.log(props.state);
    if (props.state == 'pause') return;
    const videoDom = e.target;
    videoDom.play();
}

const isImg = (path) => {
    if (path.startsWith('data') && path.includes('image')) return true;
    if (fileExt(path).includes('bing')) return true;
    return isAssetTypeAnImage(fileExt(path))
}


onMounted(() => {
})


watchEffect(() => {
    const state = props.state
    if (!videoDom.value) return;
    if (state == 'pause') {
        if (videoState.value == 'play' || videoState.value == 'playing') videoDom.value.pause();
    }
    if (state == 'play') {
        if (videoState.value == 'idle' || videoState.value == 'pause') videoDom.value.play();
    }
})


</script>

<style scoped>
.mask {
    --bg: radial-gradient(ellipse at center, rgba(var(--mask-rgb), 0) var(--mask-from,0%), rgba(var(--mask-rgb), 1) var(--mask-to, 100%));
    --content-fit: var(--content-fit, 'cover');
}

.mask-disabled {
    --bg: none;
}

.img {
    --object-fit: v-bind('config.fit');
    --object-position: v-bind('config.hposition') v-bind('config.vposition');
    --img-w: 100%;
    --img-h: 100%;
    z-index: -1;
}

.video {
    width: 100%;
    height: 100%;
    object-fit: v-bind('config.fit');
    object-position: v-bind('config.hposition') v-bind('config.vposition');
    z-index: -1;
}
</style>