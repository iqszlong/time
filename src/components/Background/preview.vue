<template>
    <z-bg class="mask [--mask-rgb:255,255,255] dark:[--mask-rgb:0,0,0]"
        :class="[{ 'mask-disabled': !source.maskEnabled }]" v-if="visible" :style="{
            '--mask-from': source.maskFrom + '%',
            '--mask-to': source.maskTo + '%',
            '--content-fit': 'cover'
        }">
        <template v-if="isImg(source.filename)">
            <z-img :src="pathReplace(source.sourcePath)" class="img"></z-img>
        </template>
        <template v-if="isAssetTypeAnVideo(fileExt(source.filename))">
            <video ref="videoDom" :src="pathReplace(source.sourcePath)" loop class="video" @loadeddata="autoplay"
                @playing="changeState" @play="changeState" @pause="changeState"></video>
        </template>
    </z-bg>
</template>

<script setup>
import { toast } from 'vue-sonner'
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

const { fileExt, isAssetTypeAnImage, isAssetTypeAnVideo, pathReplace, highPrecisionAdd, highPrecisionReduce, highPrecisionMul, highPrecisionDiv } = utils

const videoDom = ref(null);
const videoState = ref('idle');


function changeState(e) {
    videoState.value = e.type;
    // console.log(videoState.value);
}

function autoplay(e) {
    // console.log(e.target);
    // console.log(props.state);
    const { muted = true } = props.source;
    if (props.state == 'pause' || !muted) return;
    const videoDom = e.target;
    videoDom.play();
}

const isImg = (path) => {
    if (!path) return false;
    if (path.startsWith('data') && path.includes('image')) return true;
    if (fileExt(path).includes('bing')) return true;
    return isAssetTypeAnImage(fileExt(path))
}
// 平滑设置视频音量
function setVolumeSmoothly(video, targetVolume, duration = 1000) {
    const startTime = performance.now();
    const startVolume = video.volume || 0;
    const volumeChange = highPrecisionReduce(targetVolume, startVolume);

    function updateVolume(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(highPrecisionDiv(elapsed, duration), 1);
        const calculatedVolume = highPrecisionAdd(startVolume, highPrecisionMul(volumeChange, progress));
        video.volume = Math.max(0, Math.min(1, calculatedVolume));

        if (progress < 1) {
            requestAnimationFrame(updateVolume);
        }
    }

    requestAnimationFrame(updateVolume);
}

watchEffect(() => {
    // console.log(props.source);
    if (!videoDom.value) return;
    const { volume, muted = true } = props.source;
    const state = props.state
    // console.log(state);
    if (state == 'pause') {
        if (videoState.value == 'play' || videoState.value == 'playing') videoDom.value.pause();
    }
    if (state == 'play') {
        if (videoState.value == 'idle' || videoState.value == 'pause') {
            // 只有在静音状态下才尝试自动播放，避免浏览器自动播放限制
         
                videoDom.value.play().catch(err => {
                    // console.warn('自动播放失败，需要用户交互:', err);
                    toast.warning('自动播放视频失败，请手动播放', {
                        description: `${props.source.filename}`,
                        position: 'top-center',
                        duration: 99999,
                        action: {
                            label: '手动播放',
                            onClick: () => {
                                videoDom.value.play();
                            }
                        }
                    })
                });
                
            
        }
    }
    videoDom.value.muted = muted;
    if (!muted) {
        // console.log(volume);
        setVolumeSmoothly(videoDom.value, volume);
    }
})
</script>

<style scoped>
.mask {
    --bg: radial-gradient(ellipse at center, rgba(var(--mask-rgb), 0) var(--mask-from, 0%), rgba(var(--mask-rgb), 1) var(--mask-to, 100%));
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
    pointer-events: none;
    --object-view-box: inset(v-bind('source.viewSize'));
    rotate: v-bind('source.rotate');
}

.video {
    width: 100%;
    height: 100%;
    object-fit: v-bind('source.fit');
    object-position: v-bind('source.hposition') v-bind('source.vposition');
    z-index: -1;
    pointer-events: none;
    object-view-box: inset(v-bind('source.viewSize'));
    rotate: v-bind('source.rotate');
}
</style>