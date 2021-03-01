<template>
  <div class="discovery-container">
    <div class="carousel-container">
      <el-carousel :interval="4000" type="card" height="200px" v-if="banners && banners.length">
        <el-carousel-item v-for="(item, i) in banners" :key="i">
          <img :src="item.imageUrl" :alt="item.typeTitle">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div>
      <h2>推荐歌单</h2>
      <div class="music-container">
        <div v-for="item in recommendMusics" :key="item.id" @click="handleMusicDetail(item)">
          <span class="music-copywriter" :title="item.copywriter">{{item.copywriter}}</span>
          <div class="img-box">
            <img :src="item.picUrl" :alt="item.name">
            <i class="el-icon-video-play"></i>
          </div>
          <div :title="item.name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div>
      <h2>最新音乐</h2>
      <div class="new-container">
        <div v-for="item in newMusics" :key="item.id">
          <div class="img-box" @click="handlePlayAudio(item)">
            <img :src="item.picUrl" :alt="item.name">
            <i class="el-icon-video-play"></i>
          </div>
          <div>
            <div :title="item.name">{{item.name}}</div>
            <div :title="item.song.artists[0]['name']">{{item.song.artists[0]['name']}}</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2>推荐MV</h2>
      <div class="mv-container">
        <div v-for="item in recommendMV" :key="item.id" @click="handleMvsDetail(item)">
          <div class="img-box">
            <img :src="item.picUrl" :alt="item.name">
            <i class="el-icon-video-play"></i>
            <div>
              <i class="el-icon-caret-right"></i>{{item.playCount}}
            </div>
          </div>
          <div>
            <div :title="item.copywriter">{{item.copywriter}}</div>
            <div :title="item.artists[0]['name']">{{item.artists[0]['name']}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  getBannerList, getRecommendMusicList,
  getNewMusicList, getRecommendMV, getMusicUrl
} from '@/api/discovery'

export default {
  setup (props, { roots }) {
    const store = useStore()
    const router = useRouter()

    const state = reactive({
      banners: ref([]),
      recommendMusics: ref([]),
      newMusics: ref([]),
      recommendMV: ref([])
    })

    const bannerList = async () => {
      const res = await getBannerList()
      state.banners = res.banners
    }

    const recommendMusicList = async () => {
      const res = await getRecommendMusicList({ limit: 10 })
      state.recommendMusics = res.result
    }

    const newMusicList = async () => {
      const res = await getNewMusicList()
      state.newMusics = res.result
    }

    const recommendMV = async () => {
      const res = await getRecommendMV()
      state.recommendMV = res.result
    }

    const handlePlayAudio = async (e) => {
      const res = await getMusicUrl({ id: e.id })
      store.dispatch('audio/setAudioUrl', { url: res.data[0]['url'] })
    }

    const handleMusicDetail = (e) => {
      router.push({ name: 'Playlist', params: { id: e.id } })
    }

    const handleMvsDetail = (e) => {
      router.push({ name: 'MvsDetail', params: { id: e.id } })
    }

    onMounted(() => {
      bannerList()
      recommendMusicList()
      newMusicList()
      recommendMV()
    })

    return {
      handleMvsDetail,
      handleMusicDetail,
      handlePlayAudio,
      ...toRefs(state)
    }

  }
}
</script>

<style lang="less" scoped>
.carousel-container {
  margin: 0 auto;
  width: 80%;
  .el-carousel__item {
    line-height: 200px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.music-container {
  text-align: center;
  margin-top: 15px;
  padding: 10px;
  max-width: 1200px;
  & > div {
    position: relative;
    display: inline-block;
    width: 200px;
    margin: 10px;
    cursor: pointer;
    overflow: hidden;
    .music-copywriter {
      max-height: 50px;
      top: -50px;
      padding: 2px 5px;
      left: 0;
      font-size: 14px;
      line-height: 1.5;
      letter-spacing: 1px;
      position: absolute;
      width: 100%;
      text-align: left;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      transition: all 0.5s;
      z-index: 1;
    }
    .img-box {
      position: relative;
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
        font-size: 14px;
        padding: 5px 0;
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
    }
  }
  & > div:hover > .music-copywriter {
    top: 0;
  }
  & > div:hover i {
    opacity: 1;
  }
}

.new-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  padding: 10px;
  flex-wrap: wrap;
  max-width: 1200px;
  & > div {
    padding: 10px;
    margin: 10px 0;
    display: flex;
    width: 45%;
    cursor: pointer;
    .img-box {
      position: relative;
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: bottom;
      }
      & + div {
        flex: 1;
        display: flex;
        flex-direction: column;
        div {
          padding-left: 10px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex: 1;
        }
        & div:last-child {
          font-size: 14px;
          color: gray;
        }
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
    }
    &:hover {
      background-color: #f5f5f5;
    }
    &:hover i {
      opacity: 1;
    }
  }
}

.mv-container {
  margin: 15px 0;
  display: flex;
  justify-content: center;
  padding: 10px 6px;
  flex-wrap: wrap;
  max-width: 1200px;
  & > div {
    margin: 10px;
    width: 22%;
    .img-box {
      position: relative;
      width: 100%;
      height: 100%;
      cursor: pointer;
      div {
        position: absolute;
        top: 5px;
        right: 5px;
        color: #fff;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      i.el-icon-video-play {
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
      & + div {
        margin-top: 5px;
        & > div {
          padding: 2px 0;
        }
        & > div:last-child {
          font-size: 14px;
          padding: 2px 0;
          color: gray;
        }
      }
    }
    &:hover i.el-icon-video-play {
      opacity: 1;
    }
  }
}
</style>