<template>
        <video ref="videoPlayer" class="video-main video-js" />
</template>

<script setup>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

import { onMounted, ref } from 'vue'

const props = defineProps({
  options: {
    type: Object,
    default () {
      return {}
    }
  }
})

const videoPlayer = ref(null)

const main = () => {
  videojs(videoPlayer.value, props.options, () => {
    console.log('播放器准备中...')
  })
}

onMounted(main)

</script>

<style lang="scss" scoped>
.video-main{
    max-width: 100%;
    max-height: 400px;
}
</style>
