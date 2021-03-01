<template>
  <div class="play-lists-container">
    <div class="play-lists-top" v-for="item in highquality" :key="item.id">
      <img :src="item.coverImgUrl">
      <div class="play-img">
        <img :src="item.coverImgUrl" :alt="item.copywriter">
      </div>
      <div class="play-info">
        <span>精品歌单</span>
        <span>{{item.name}}</span>
        <span>{{item.description}}</span>
      </div>
    </div>
    <div>
      <div class="tabs-list">
        <span :class="{'actived': cat == item}" v-for="item in tabsList" :key="item" @click="handleChooseTab(item)">{{item}}</span>
      </div>
      <div class="tabs-container">
        <div>
          <div v-for="item in musciList" :key="item.id">
            <span class="music-copywriter">播放量：{{$filters.rePlayCount(item.playCount)}}</span>
            <div class="img-box" @click="handleMusicDetail(item)">
              <img :src="item.coverImgUrl" :alt="item.name">
              <i class="el-icon-video-play"></i>
            </div>
            <div :title="item.description">{{item.description}}</div>
          </div>
        </div>
        <div class="music-pagination">
          <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change="handleChangePage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, reactive, toRefs, onMounted, computed, watch } from 'vue'
import { getPlaylistHighquaLity, getPlayList } from '@/api/playlists'

export default {
  setup () {
    const router = useRouter()

    const state = reactive({
      tabsList: ['全部', '欧美', '华语', '流行', '说唱', '摇滚', '民谣', '电子', '轻音乐', '影视原声', 'ACG', '怀旧', '治愈', '旅行'],
      cat: ref('全部'),
      currentPage: ref(1),
      total: ref(0),
      offset: ref(0),
      highquality: ref([]),
      musciList: ref([]),
    })

    const playlistHighquality = async (params) => {
      const res = await getPlaylistHighquaLity(params)
      if (res.playlists && res.playlists.length) {
        state.highquality = [res.playlists[0]]
      }
    }

    const playlist = async (params) => {
      const res = await getPlayList(params)
      state.musciList = res.playlists
      state.total = res.total
    }

    onMounted(() => {
      playlistHighquality({
        limit: 1,
        cat: state.cat
      })
      playlist({
        offset: 0,
        limit: 10,
        cat: state.cat
      })
    })

    // 分页
    const handleChangePage = (e) => {
      state.currentPage = e
      playlist({
        offset: (state.currentPage - 1) * 10,
        limit: 10,
        cat: state.cat
      })
    }

    // 选择音乐种类
    const handleChooseTab = (e) => {
      state.cat = e
      state.currentPage = 1

      playlistHighquality({
        limit: 1,
        cat: state.cat
      })
      playlist({
        offset: 0,
        limit: 10,
        cat: state.cat
      })
    }

    const handleMusicDetail = (e) => {
      router.push({ name: 'Playlist', params: { id: e.id } })
    }

    return {
      handleChooseTab,
      handleChangePage,
      handleMusicDetail,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.play-lists-container {
  .play-lists-top {
    position: relative;
    display: flex;
    height: 200px;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 5px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    & > img {
      position: absolute;
      top: 0;
      width: 100%;
      vertical-align: bottom;
      z-index: -1;
      filter: blur(10px);
    }
    & > div {
      padding: 20px;
      display: flex;
    }
    & > div.play-img {
      justify-content: center;
      align-items: center;
      width: 160px;
      height: 160px;
      img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
      }
    }
    & > div.play-info {
      flex: 1;
      flex-direction: column;
      height: calc(~"100% - 40px");
      & > span:nth-of-type(1) {
        color: #dfac67;
        border: 1px solid #dfac67;
        width: 100px;
        height: 30px;
        text-align: center;
        border-radius: 5px;
        font-size: 16px;
        line-height: 30px;
        cursor: pointer;
      }
      & > span:nth-of-type(2) {
        color: white;
        padding-top: 10px;
      }
      & > span:nth-of-type(3) {
        line-height: 1.5;
        color: gray;
        font-size: 14px;
        padding-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }
    }
  }
  .play-lists-top + div {
    margin-top: 20px;
    & > .tabs-list {
      font-size: 15px;
      padding: 10px;
      text-align: right;
      color: gray;
      span {
        margin-right: 15px;
        cursor: pointer;
      }
      span:last-child {
        margin-right: 0;
      }
      span.actived {
        color: #dd6d60;
      }
    }
    & > .tabs-container {
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
        width: 190px;
        max-height: 50px;
        top: -25px;
        left: 25px;
        padding: 2px 5px;
        font-size: 14px;
        line-height: 1.5;
        position: absolute;
        text-align: left;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
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
          bottom: 15px;
          right: 15px;
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
      & > div > div:hover .music-copywriter {
        top: 0;
      }
    }
  }
}
</style>