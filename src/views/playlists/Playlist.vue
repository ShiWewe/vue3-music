<template>
  <div class="playlist-container">
    <div class="playlist-top">
      <div class="top-img">
        <img :src="musicInfo && musicInfo.coverImgUrl">
      </div>
      <div>
        <div>
          <span>{{musicInfo && musicInfo.name}}</span>
        </div>
        <div>
          <img :src="musicInfo && musicInfo.creator.avatarUrl">
          <span>{{musicInfo && musicInfo.creator.nickname}}</span>
          <span>{{musicInfo && $filters.reTimeY(musicInfo.createTime)}} 创建</span>
        </div>
        <div>
          <span>标签：<i>{{musicInfo && reTags(musicInfo.tags)}}</i></span>
        </div>
        <div>
          <span>简介：<i>{{musicInfo && musicInfo.creator.signature}}</i></span>
        </div>
      </div>
    </div>
    <div class="playlist-bottom">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲列表" name="first">
          <el-table :data="musicTableList" stripe style="width: 100%" :empty-text="'暂无数据'">
            <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
            <el-table-column align="center">
              <template #default="scope">
                <div class="img-box" @click="handlePlayAudio(scope.row)">
                  <img class="img" :src="scope.row.al.picUrl">
                  <i class="el-icon-video-play"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="音乐标题">
              <template #default="scope">
                <div class="video">
                  {{ scope.row.name }}
                  <i v-if="scope.row.mv" class="el-icon-video-camera" @click="handleMvsDetail(scope.row.mv)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="歌手">
              <template #default="scope">{{ scope.row.ar[0] && scope.row.ar[0]['name'] }}</template>
            </el-table-column>
            <el-table-column align="center" label="专辑">
              <template #default="scope">{{ scope.row.al['name'] }}</template>
            </el-table-column>
            <el-table-column align="center" prop="duration" label="时长">
              <template #default="scope">{{ $filters.reDuration(scope.row.dt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="'评论(' + commentTotal + ')'" name="second">
          <div class="mv-bottom">
            <div class="hot-comment" v-if="hotCommentList.length">
              <div class="hot-title">
                <span>热门评论 <i>({{hotCommentList.length}})</i></span>
              </div>
              <div class="hot-list" v-for="(item, idx) in hotCommentList" :key="idx">
                <div>
                  <img :src="item.user.avatarUrl">
                </div>
                <div class="hot-box">
                  <span>
                    <i>{{item.user.nickname}}：</i>
                    <i>{{item.content}}</i>
                  </span>
                  <div v-if="item.beReplied.length != 0" class="re-content">
                    <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                    <span class="comment">{{ item.beReplied[0].content }}</span>
                  </div>
                  <span class="t">{{$filters.reTime(item.time)}}</span>
                </div>
              </div>
            </div>
            <div class="new-comment">
              <div class="hot-title">
                <span>最新评论 <i>({{total}})</i></span>
              </div>
              <div class="hot-list" v-for="(item, idx) in newCommentList" :key="idx">
                <div>
                  <img :src="item.user.avatarUrl">
                </div>
                <div class="hot-box">
                  <span>
                    <i>{{item.user.nickname}}：</i>
                    <i>{{item.content}}</i>
                  </span>
                  <div v-if="item.beReplied.length != 0" class="re-content">
                    <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                    <span class="comment">{{ item.beReplied[0].content }}</span>
                  </div>
                  <span class="t">{{$filters.reTime(item.time)}}</span>
                </div>
              </div>
              <div class="music-pagination">
                <el-pagination background layout="prev, pager, next" :total="total" :page-size="limit" :current-page="currentPage" @current-change="handleChangePage"></el-pagination>
              </div>
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
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { getMusicPlaylist, getMusicCommentlist } from '@/api/playlist'
import { getMusicUrl } from '@/api/discovery'

export default {
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      activeName: ref('first'),
      musicInfo: ref(null),
      musicTableList: ref([]),
      currentPage: ref(1),
      total: ref(0),
      limit: ref(5),
      hotCommentList: ref([]),
      newCommentList: ref([]),
      commentTotal: ref(0)
    })

    const reTags = computed(() => {
      return (e) => {
        if (Array.isArray(e)) {
          return e.join(' / ')
        } else {
          return e
        }
      }
    })

    const musicPlaylist = async (params) => {
      const res = await getMusicPlaylist(params)
      state.musicInfo = res.playlist
      state.musicTableList = res.playlist.tracks
    }

    const musicCommentlist = async (params) => {
      const res = await getMusicCommentlist(params)
      state.newCommentList = res.comments
      state.total = res.total
      if (res.hotComments && res.hotComments.length) {
        state.hotCommentList = res.hotComments
        state.commentTotal = res.hotComments.length + res.total
      } else {
        state.commentTotal = res.total
      }
    }

    const handleChangePage = (e) => {
      state.currentPage = e
      musicCommentlist({
        id: route.params.id,
        offset: (state.currentPage - 1) * state.limit,
        limit: state.limit
      })
    }

    onMounted(() => {
      musicPlaylist({ id: route.params.id })
      musicCommentlist({
        id: route.params.id,
        offset: 0,
        limit: state.limit
      })
    })

    const handlePlayAudio = async (e) => {
      const res = await getMusicUrl({ id: e.id })
      store.dispatch('audio/setAudioUrl', { url: res.data[0]['url'] })
    }

    const handleMvsDetail = (id) => {
      router.push({ name: 'MvsDetail', params: { id } })
    }

    return {
      reTags,
      handleMvsDetail,
      handleChangePage,
      handlePlayAudio,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.playlist-container {
  padding: 20px;
  .playlist-top {
    display: flex;
    margin-bottom: 20px;
    .top-img {
      width: 200px;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
      }
    }
    .top-img + div {
      flex: 1;
      & > div {
        padding: 10px;
        padding-left: 30px;
        i {
          font-size: 14px;
        }
      }
      & > div:nth-of-type(2) {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: bottom;
          margin-right: 15px;
        }
        img + span {
          margin-right: 15px;
        }
        img + span + span {
          font-size: 14px;
        }
      }
    }
  }
  .playlist-bottom {
    .video {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    i.el-icon-video-camera {
      margin-left: 10px;
      font-size: 18px;
      color: #dd6d60;
      cursor: pointer;
    }
    .img-box {
      margin: 0 auto;
      width: 70px;
      height: 70px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
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
    .mv-bottom {
      padding-bottom: 20px;
      .hot-comment {
        margin-bottom: 80px;
        .hot-title {
          margin-bottom: 20px;
          font-size: 20px;
          i {
            font-size: 18px;
          }
        }
        .hot-list {
          display: flex;
          padding: 10px 0;
          margin-bottom: 20px;
          font-size: 15px;
          & > div:first-child {
            margin-right: 10px;
            img {
              width: 60px;
              height: 60px;
              vertical-align: bottom;
              border-radius: 50%;
            }
          }
          & > div:last-child {
            display: flex;
            flex-direction: column;
            span {
              line-height: 1.2;
              margin-bottom: 8px;
              & > i:first-child {
                color: #517eaf;
              }
            }
            span.t {
              font-size: 14px;
              color: #bebebe;
            }
            .re-content {
              margin-bottom: 8px;
              font-size: 15px;
              padding: 8px;
              background-color: #e6e5e6;
              border-radius: 5px;
              .name {
                color: #517eaf;
              }
            }
          }
        }
      }
      .new-comment {
        .hot-title {
          margin-bottom: 20px;
          font-size: 20px;
          i {
            font-size: 18px;
          }
        }
        .hot-list {
          display: flex;
          padding: 10px 0;
          margin-bottom: 20px;
          font-size: 15px;
          & > div:first-child {
            margin-right: 10px;
            img {
              width: 60px;
              height: 60px;
              vertical-align: bottom;
              border-radius: 50%;
            }
          }
          & > div:last-child {
            display: flex;
            flex-direction: column;
            span {
              line-height: 1.2;
              margin-bottom: 8px;
              & > i:first-child {
                color: #517eaf;
              }
            }
            span.t {
              font-size: 14px;
              color: #bebebe;
            }
            .re-content {
              margin-bottom: 8px;
              font-size: 15px;
              padding: 8px;
              background-color: #e6e5e6;
              border-radius: 5px;
              .name {
                color: #517eaf;
              }
            }
          }
        }
        .music-pagination {
          text-align: center;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
