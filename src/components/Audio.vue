<template>
  <div class="audio-play">
    <audio :src="audioUrl" controls autoplay loop></audio>
  </div>
</template>

<script>
import { toRefs, reactive, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    const audioUrl = computed(() => {
      return store.state.audio.audioUrl
    })

    return {
      audioUrl
    }
  }
}
</script>

<style lang="less" scoped>
.audio-play {
  position: fixed;
  height: 60px;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f1f3f4;
  z-index: 2500;
  audio {
    width: 100%;
    border-radius: none;
    outline: none;
  }
}
</style>