<template>
  <div>
    <div class="result-top">
      <span>{{keyswords}}</span>
      <i>找到{{total}}个结果</i>
    </div>
    <div class="result-bottom">
      <el-tabs v-model="activeName" @tab-click="handleChangeTab">
        <el-tab-pane label="歌曲" name="first">
          <div class="song-table">
            <el-table :data="tableList" stripe style="width: 100%" :empty-text="'暂无数据'" @row-dblclick="handleDblclick">
              <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
              <el-table-column align="left" label="音乐标题">
                <template #default="scope">
                  <div class="video">
                    {{ scope.row.name }}
                    <i v-if="scope.row.mvid" class="el-icon-video-camera" @click="handleMvsDetail(scope.row.mvid)"></i>
                  </div>
                  <div class="gray">{{ scope.row.alias[0] }}</div>
                </template>
              </el-table-column>
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
            <div class="music-pagination">
              <el-pagination background layout="prev, pager, next" :total="total" :page-size="limit1" :current-page="currentPage" @current-change="handleChangePage"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="歌单" name="second">
          <div class="tabs-container">
            <div>
              <div v-for="item in tableListSong" :key="item.id">
                <span class="music-copywriter">播放量：{{$filters.rePlayCount(item.playCount)}}</span>
                <div class="img-box" @click="handleMusicDetail(item)">
                  <img :src="item.coverImgUrl" :alt="item.name">
                  <i class="el-icon-video-play"></i>
                </div>
                <div :title="item.name">{{item.name}}</div>
              </div>
            </div>
            <div class="music-pagination">
              <el-pagination background layout="prev, pager, next" :page-size="limit1" :total="total" :current-page="currentPage" @current-change="handleChangePage"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="MV" name="third">
          <div class="tabs-container2">
            <div>
              <div v-for="item in tableListSong" :key="item.id">
                <span class="music-copywriter">
                  <i class="el-icon-caret-right"></i>
                  {{$filters.rePlayCount(item.playCount)}}
                </span>
                <div class="img-box" @click="handleMvsDetail(item.id)">
                  <img :src="item.cover" :alt="item.name">
                  <i class="el-icon-video-play"></i>
                </div>
                <div :title="item.name">{{item.name}}</div>
                <div :title="item.artistName">{{item.artistName}}</div>
              </div>
            </div>
            <div class="music-pagination">
              <el-pagination background layout="prev, pager, next" :page-size="limit2" :total="total" :current-page="currentPage" @current-change="handleChangePage"></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref, toRefs, watchEffect, onUnmounted } from 'vue'
import { getSearchList } from '@/api/Result'
import { getMusicUrl } from '@/api/discovery'

export default {
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      firstType: 1,
      secondType: 1000,
      thirdType: 1004,
      activeName: ref('first'),
      keyswords: ref(''),
      currentPage: ref(1),
      total: ref(0),
      limit1: ref(15),
      limit2: ref(12),
      tableList: ref([]),
      tableListSong: ref([]),
      tableListMV: ref([])
    })

    const searchList = async (params) => {
      const res = await getSearchList(params)
      state.total = res.result.songCount
      state.tableList = res.result.songs
    }

    const searchListSong = async (params) => {
      const res = await getSearchList(params)
      state.total = res.result.playlistCount
      state.tableListSong = res.result.playlists
    }

    const searchListMV = async (params) => {
      const res = await getSearchList(params)
      state.total = res.result.mvCount
      state.tableListSong = res.result.mvs
    }

    const stop = watchEffect(() => {
      if (route.query.keywords) {
        state.keyswords = route.query.keywords
        state.activeName = 'first'
        searchList({
          keywords: state.keyswords,
          type: state.firstType,
          offset: 0,
          limit: state.limit1
        })
      }
    })

    onMounted(() => {

    })

    onUnmounted(() => {
      stop()
    })

    const handleChangeTab = e => {
      state.currentPage = 1
      if (state.activeName == 'first') {
        searchList({
          keywords: state.keyswords,
          type: state.firstType,
          offset: 0,
          limit: state.limit1
        })
      } else if (state.activeName == 'second') {
        searchListSong({
          keywords: state.keyswords,
          type: state.secondType,
          offset: 0,
          limit: state.limit1
        })
      } else if (state.activeName == 'third') {
        searchListMV({
          keywords: state.keyswords,
          type: state.thirdType,
          offset: 0,
          limit: state.limit2
        })
      }
    }

    const handleChangePage = e => {
      state.currentPage = e
      if (state.activeName == 'first') {
        searchList({
          keywords: state.keyswords,
          type: state.firstType,
          offset: (state.currentPage - 1) * state.limit1,
          limit: state.limit1
        })
      } else if (state.activeName == 'second') {
        searchListSong({
          keywords: state.keyswords,
          type: state.secondType,
          offset: (state.currentPage - 1) * state.limit1,
          limit: state.limit1
        })
      } else if (state.activeName == 'third') {
        searchListMV({
          keywords: state.keyswords,
          type: state.thirdType,
          offset: (state.currentPage - 1) * state.limit2,
          limit: state.limit2
        })
      }
    }

    const handleDblclick = async (e) => {
      const res = await getMusicUrl({ id: e.id })
      store.dispatch('audio/setAudioUrl', { url: res.data[0]['url'] })
    }

    const handleMvsDetail = (id) => {
      router.push({ name: 'MvsDetail', params: { id } })
    }

    const handleMusicDetail = (e) => {
      router.push({ name: 'Playlist', params: { id: e.id } })
    }

    return {
      handleMvsDetail,
      handleChangePage,
      handleDblclick,
      handleChangeTab,
      handleMusicDetail,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.result-top {
  margin-bottom: 30px;
  span {
    font-size: 28px;
    margin-right: 10px;
  }
  i {
    font-size: 14px;
    color: gray;
  }
}
.result-bottom {
  .music-pagination {
    text-align: center;
    padding-top: 30px;
  }
  .song-table {
    .video {
      display: flex;
      align-items: center;
    }
    i.el-icon-video-camera {
      margin-left: 10px;
      font-size: 18px;
      color: #dd6d60;
      cursor: pointer;
    }
    .gray {
      color: #aaa;
    }
  }
  .tabs-container {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    margin: 10px;
    width: ~"calc(100% - 20px)";
    cursor: pointer;
    overflow: hidden;
    & > div {
      display: flex;
      overflow: hidden;
      flex-wrap: wrap;
    }
    & > div > div {
      position: relative;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .music-copywriter {
      position: absolute;
      width: 190px;
      top: 0;
      left: 25px;
      padding: 2px 5px;
      font-size: 14px;
      line-height: 1.5;
      text-align: right;
      color: #fff;
      transition: all 0.5s;
      z-index: 1;
    }
    .img-box {
      position: relative;
      margin: 0 25px;
      width: 200px;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
        vertical-align: bottom;
      }
      & + div {
        width: 200px;
        font-size: 14px;
        margin: 10px 0;
        padding: 0 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
        font-size: 30px;
        color: #dd6d60;
        opacity: 0;
        transition: all 0.5s;
      }
      &:hover i {
        opacity: 1;
      }
    }
    .music-pagination {
      padding-top: 10px;
      div {
        margin: 0 auto;
      }
    }
  }
  .tabs-container2 {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    margin: 10px;
    width: ~"calc(100% - 20px)";
    cursor: pointer;
    overflow: hidden;
    .el-icon-caret-right {
      font-size: 20px;
    }
    & > div {
      display: flex;
      overflow: hidden;
      flex-wrap: wrap;
    }
    & > div > div {
      position: relative;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .music-copywriter {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 260px;
      top: 0;
      left: 25px;
      padding: 2px 5px;
      font-size: 14px;
      line-height: 1.5;
      color: #fff;
      transition: all 0.5s;
      z-index: 1;
    }
    .img-box {
      position: relative;
      margin: 0 25px;
      width: 270px;
      height: 160px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
        vertical-align: bottom;
      }
      & + div {
        width: 200px;
        font-size: 14px;
        margin: 10px 0;
        padding: 0 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      & + div + div {
        width: 200px;
        font-size: 14px;
        margin-bottom: 10px;
        padding: 0 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #c5c5c5;
      }
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
        font-size: 30px;
        color: #dd6d60;
        opacity: 0;
        transition: all 0.5s;
      }
      &:hover i {
        opacity: 1;
      }
    }
    .music-pagination {
      padding-top: 10px;
      div {
        margin: 0 auto;
      }
    }
  }
}
</style>