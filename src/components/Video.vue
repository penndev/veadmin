<template>
  <video ref="videoTag" class="video-main video-js vjs-16-9" />
</template>

<script setup>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { onMounted, ref, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    },
  },
});

let player = null;

const videoTag = ref(null);

onMounted(() => {
  player = videojs(videoTag.value, props.options, () => {});
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});

watch(props, () => {
  if (player) {
    player.src(props.options.sources);
  }
});
</script>

<style lang="scss" scoped>
.video-main {
  width: 100%;
  max-height: auto;
}
</style>
