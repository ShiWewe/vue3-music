<template>
  <div id="app">
    <!-- 头部 -->
    <Top></Top>
    <!-- 菜单 -->
    <div class="container-box">
      <Content></Content>
      <!-- 右侧内容 -->
      <div class="main-box">
        <router-view class="router-view" v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        <!-- <div id="vue"></div> -->
        <!-- <router-view></router-view> -->
      </div>
    </div>
    <Audio></Audio>
    <el-backtop :bottom="100"></el-backtop>
  </div>
</template>

<script>
import Top from './components/Top.vue'
import Content from './components/Content.vue'
import Audio from './components/Audio.vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'App',
  components: {
    Top,
    Content,
    Audio
  }
}
</script>

<style>
.container-box {
  padding-top: 60px;
  flex: 1;
  display: flex;
}
.main-box {
  padding: 20px 200px 100px;
  flex: 1;
  margin-left: 200px;
  padding-left: 200px;
  overflow-y: auto;
}
#app {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}
#vue {
  border: 1px solid red;
}
</style>
