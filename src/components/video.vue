<template>
        <video ref="videoTag" class="video-main video-js" />
</template>

<script setup>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

import { onMounted, ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: {
    type: Object,
    default () {
      return {}
    }
  }
})

let player = null

const videoTag = ref(null)

const main = () => {
  player = videojs(videoTag.value, props.options, () => {
    console.log('播放器准备中...')
  })
}

onMounted(main)

onBeforeUnmount(() => {
  console.log('dispose=>', player)
  if (player) {
    player.dispose()
  }
})

</script>

<style lang="scss" scoped>
.video-main{
    max-width: 100%;
    max-height: 400px;
}
</style>
