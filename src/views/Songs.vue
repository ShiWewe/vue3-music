<template>
  <div class="song-container">
    <div class="song-tab">
      <span v-for="item in tabs" :key="item.value" :class="{'active': type == item.value}" @click="handleChange(item)">{{item.label}}</span>
    </div>
    <div class="song-table">
      <el-table :data="topMusicList" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" stripe style="width: 100%" :empty-text="'暂无数据'">
        <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
        <el-table-column align="center">
          <template #default="scope">
            <div class="img-box" @click="handlePlayAudio(scope.row)">
              <img class="img" :src="scope.row.album.picUrl">
              <i class="el-icon-video-play"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="音乐标题"></el-table-column>
        <el-table-column align="center" label="歌手">
          <template #default="scope">{{ scope.row.artists[0] && scope.row.artists[0]['name'] }}</template>
        </el-table-column>
        <el-table-column align="center" label="专辑">
          <template #default="scope">{{ scope.row.album['name'] }}</template>
        </el-table-column>
        <el-table-column align="center" prop="duration" label="时长">
          <template #default="scope">{{ $filters.reDuration(scope.row.duration) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTopMusicList } from '@/api/song'
import { useStore } from 'vuex'
import { onMounted, ref, toRefs, reactive } from 'vue'
import { getMusicUrl } from '@/api/discovery'

export default {
  setup () {
    const store = useStore()

    const state = reactive({
      loading: ref(true),
      tabs: [{
        value: 0,
        label: '全部',
      }, {
        value: 7,
        label: '华语',
      }, {
        value: 9,
        label: '欧美',
      }, {
        value: 8,
        label: '日本',
      }, {
        value: 1,
        label: '韩国',
      }],
      topMusicList: ref([]),
      type: ref(0)
    })

    const topMusicList = async (params) => {
      state.topMusicList = []
      state.loading = true
      const res = await getTopMusicList(params)
      state.topMusicList = res.data
      state.loading = false
    }

    const handleChange = (e) => {
      state.type = e.value
      topMusicList({
        type: state.type
      })
    }

    onMounted(() => {
      topMusicList({
        type: state.type
      })
    })

    const handlePlayAudio = async (e) => {
      const res = await getMusicUrl({ id: e.id })
      store.dispatch('audio/setAudioUrl', { url: res.data[0]['url'] })
    }

    return {
      handlePlayAudio,
      handleChange,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.song-container {
  padding: 20px;
  .song-tab {
    text-align: right;
    padding: 5px;
    margin-bottom: 20px;
    span {
      display: inline-block;
      padding: 5px;
      font-size: 15px;
      color: gray;
      margin-right: 20px;
      cursor: pointer;
    }
    span.active {
      color: #dd6d60;
    }
  }
  .song-table {
    .img-box {
      position: relative;
      cursor: pointer;
      .img {
        width: 70px;
        height: 70px;
        vertical-align: bottom;
        border-radius: 5px;
      }
      i.el-icon-video-play {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
        font-size: 30px;
        opacity: 0;
        color: #dd6d60;
        transition: all 0.5s;
      }
    }
    .img-box:hover i.el-icon-video-play {
      opacity: 1;
    }
  }
}
</style>