<template>
    <z-bg class="mask [--mask-rgb:255,255,255] dark:[--mask-rgb:0,0,0]"
        :class="[{ 'mask-disabled': !source.maskEnabled }]" v-if="visible" :style="{
            '--mask-from': source.maskFrom + '%',
            '--mask-to': source.maskTo + '%',
            '--content-fit': source.fit
        }">
        <template v-if="isImg(source.filename)">
            <z-img :src="pathReplace(source.sourcePath)" class="img"></z-img>
        </template>
        <template v-if="isAssetTypeAnVideo(fileExt(source.filename))">
            <video ref="videoDom" :src="pathReplace(source.sourcePath)" loop muted class="video" @loadeddata="autoplay"
                @playing="changeState" @play="changeState" @pause="changeState"></video>
        </template>
    </z-bg>
</template>

<script setup>
const props = defineProps({
    source: {
        type: Object,
        default: () => ({})
    },
    visible: {
        type: Boolean,
        default: true
    },
    state: {
        type: String,
        default: 'play'
    }
})

const { fileExt, isAssetTypeAnImage, isAssetTypeAnVideo, pathReplace } = utils

const videoDom = ref(null);
const videoState = ref('idle');


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
    if (!path) return false;
    if (path.startsWith('data') && path.includes('image')) return true;
    if (fileExt(path).includes('bing')) return true;
    return isAssetTypeAnImage(fileExt(path))
}

watchEffect(() => {
    // console.log(props.source);
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
    --object-fit: v-bind('source.fit');
    --object-position: v-bind('source.hposition') v-bind('source.vposition');
    --img-w: 100%;
    --img-h: 100%;
    z-index: -1;
}

.video {
    width: 100%;
    height: 100%;
    object-fit: v-bind('source.fit');
    object-position: v-bind('source.hposition') v-bind('source.vposition');
    z-index: -1;
}
</style>