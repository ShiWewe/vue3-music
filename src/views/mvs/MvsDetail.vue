<template>
  <div class="mv-detail-container">
    <div class="mv-top">
      <div class="mv-video">
        <div class="mv-title">mv详情</div>
        <div class="video-box">
          <video :src="videoUrl" controls></video>
        </div>
        <div class="mv-avatar">
          <div>
            <img :src="nvInfo.picUrl">
            <span :title="nvInfo.artistName">{{nvInfo.artistName}}</span>
          </div>
          <div>
            <span :title="nvInfo.name">{{nvInfo.name}}</span>
          </div>
          <div>
            <span>发布：{{nvInfo.publishTime}}</span>
            <span>播放：{{$filters.rePlayCount(nvInfo.playCount)}}</span>
          </div>
        </div>
      </div>
      <div class="mv-recommend">
        <div class="mv-title">相关推荐</div>
        <div class="list" v-for="item in recommendList" :key="item.id" @click="handleToMV(item
				)">
          <div>
            <div class="list-item">
              <span class="music-copywriter">
                <i class="el-icon-caret-right"></i>
                {{$filters.rePlayCount(item.playCount)}}
              </span>
              <img :src="item.cover">
              <i class="el-icon-video-play"></i>
              <span class="music-time">
                {{$filters.reDuration(item.duration)}}
              </span>
            </div>
          </div>
          <div>
            <div>{{item.name}}</div>
            <div>{{item.artistName}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mv-bottom">
      <div class="hot-comment">
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
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { toRefs, reactive, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import {
  getMVVideo, getRecommendList, getMVDetail,
  getMVAvatar, getMVHotComment, getMVNewComment
} from '@/api/mvsDetail'

export default {
  setup () {
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      videoUrl: ref(null),
      recommendList: ref([]),
      nvInfo: ref({
        picUrl: '',
        name: '',
        artistName: '',
        playCount: '',
        publishTime: ''
      }),
      hotCommentList: ref([]),
      currentPage: ref(1),
      total: ref(0),
      limit: ref(5),
      newCommentList: ref([])
    })

    const mvVideo = async (params) => {
      const res = await getMVVideo(params)
      state.videoUrl = res.data.url
    }

    const recommendList = async (params) => {
      const res = await getRecommendList(params)
      state.recommendList = res.mvs
    }

    const mvDetail = async (params) => {
      const res = await getMVDetail(params)
      const resp = await getMVAvatar({ id: res.data.artistId })
      for (let key in state.nvInfo) {
        state.nvInfo[key] = res.data[key]
      }
      state.nvInfo.picUrl = resp.artist.picUrl
    }

    const mvHotComment = async (params) => {
      const res = await getMVHotComment(params)
      state.hotCommentList = res.hotComments
    }

    const mvNewComment = async (params) => {
      const res = await getMVNewComment(params)
      state.total = res.total
      state.newCommentList = res.comments
    }

    const handleChangePage = (e) => {
      state.currentPage = e
      mvNewComment({
        id: route.params.id,
        offset: (state.currentPage - 1) * state.limit,
        limit: state.limit
      })
    }

    const handleToMV = (e) => {
      router.push({ name: 'MvsDetail', params: { id: e.id } })
    }

    // 当前mv的详情信息
    const getMVInfo = (id) => {
      state.currentPage = 1
      mvVideo({ id })
      recommendList({ mvid: id })
      mvDetail({ mvid: id })
      mvHotComment({ id, type: 1 })
      mvNewComment({
        id,
        offset: 0,
        limit: state.limit
      })
    }

    // onMounted(() => {
    //   getMVInfo(route.params.id)
    // })

    const stop = watchEffect(() => {
      if (route.params.id) {
        getMVInfo(route.params.id)
      }
    })

    onUnmounted(() => {
      stop()
    })

    return {
      handleToMV,
      handleChangePage,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.mv-detail-container {
  padding: 0 30px;
  .mv-top {
    display: flex;
    .mv-title {
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 700;
    }
    .mv-video {
      width: 800px;
      .video-box {
        padding: 0 10px 10px;
        video {
          width: 100%;
          height: 450px;
          vertical-align: bottom;
        }
      }
    }
    .mv-recommend {
      flex: 1;
      .list {
        display: flex;
        margin: 4px 40px;
        font-size: 14px;
        cursor: pointer;
        .list-item {
          position: relative;
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
          .music-copywriter {
            position: absolute;
            top: 4px;
            right: 6px;
            color: #fff;
          }
          .music-time {
            position: absolute;
            bottom: 4px;
            right: 6px;
            color: #fff;
          }
        }
        img {
          width: 100%;
          height: 100%;
          vertical-align: bottom;
          border-radius: 5px;
        }
        & > div:first-child {
          flex: 1.5;
          padding: 10px;
        }
        & > div:last-child {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          & > div {
            padding: 2px 10px;
          }
          & > div:last-child {
            color: gray;
          }
        }
        &:hover {
          background-color: #f5f5f5;
          i.el-icon-video-play {
            opacity: 1;
          }
        }
      }
    }
    .mv-avatar {
      padding: 10px;
      & > div {
        margin-bottom: 20px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          vertical-align: bottom;
          margin-right: 10px;
        }
        img + span {
          font-size: 24px;
        }
      }
      & > div:nth-of-type(1) {
        display: flex;
        align-items: center;
      }
      & > div:nth-of-type(2) {
        font-size: 40px;
        font-weight: bold;
      }
      & > div:nth-of-type(3) {
        color: #bebebe;
        span {
          margin-right: 40px;
        }
      }
    }
  }
  .mv-bottom {
    padding-bottom: 20px;
    .hot-comment {
      .hot-title {
        margin-bottom: 20px;
        font-size: 24px;
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
      margin-top: 50px;
      .hot-title {
        margin-bottom: 20px;
        font-size: 24px;
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
</style>