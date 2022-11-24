<template>
    <div>
        <video ref="videoPlayer" class="video-js"></video>
    </div>
</template>

<script setup>
import videojs from 'video.js';
import { ref } from 'vue';

const props = defineProps({
    options: {
        type: Object,
        default() {
            return {};
        }
    }
})

const videoPlayer = ref()

// const player = 
videojs(videoPlayer, props.options, () => {
    console.log("播放器准备中...")
})

</script>