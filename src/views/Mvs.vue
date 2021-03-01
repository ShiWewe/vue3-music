<template>
  <div class="mvs-container">
    <div class="mvs-tab">
      <div>
        <span>地区：</span>
        <span :class="{'actived': item == area}" v-for="item in areaList" :key="item" @click="chooseTabs('area', item)">{{item}}</span>
      </div>
      <div>
        <span>类型：</span>
        <span :class="{'actived': item == type}" v-for="item in typeList" :key="item" @click="chooseTabs('type', item)">{{item}}</span>
      </div>
      <div>
        <span>排序：</span>
        <span :class="{'actived': item == order}" v-for="item in orderList" :key="item" @click="chooseTabs('order', item)">{{item}}</span>
      </div>
    </div>
    <div class="mvs-container">
      <div class="mvs-list">
        <div v-for="item in mvsList" :key="item.id" @click="handleMvsDetail(item)">
          <div>
            <span class="music-copywriter">
              <i class="el-icon-caret-right"></i>
              {{$filters.rePlayCount(item.playCount)}}
            </span>
            <img :src="item.cover" alt="">
          </div>
          <span :title="item.name">{{item.name}}</span>
        </div>
      </div>
      <div class="music-pagination">
        <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page="currentPage" @current-change="handleChangePage"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, toRefs, reactive, onMounted } from 'vue'
import { getNewsMVList } from '@/api/mvs'

export default {
  setup () {
    const router = useRouter()

    const state = reactive({
      areaList: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      typeList: ['全部', '官方版', '原声', '现场版', '网易出品'],
      orderList: ['上升最快', '最热', '最新'],
      area: ref('全部'),
      type: ref('全部'),
      order: ref('上升最快'),
      offset: ref(0),
      limit: ref(12),
      total: ref(0),
      currentPage: ref(1),
      mvsList: ref([])
    })

    const newsMVList = async (params) => {
      const res = await getNewsMVList(params)
      state.mvsList = res.data
      if (res.count != undefined) {
        state.total = res.count
      }
    }

    const chooseTabs = (t, e) => {
      state.currentPage = 1
      state.offset = 0
      state[t] = e

      newsMVList({
        area: state.area,
        type: state.type,
        order: state.order,
        offset: state.offset,
        limit: state.limit
      })
    }

    onMounted(() => {
      newsMVList({
        area: state.area,
        type: state.type,
        order: state.order,
        offset: state.offset,
        limit: state.limit
      })
    })

    const handleChangePage = (e) => {
      state.currentPage = e

      newsMVList({
        area: state.area,
        type: state.type,
        order: state.order,
        offset: (state.currentPage - 1) * 12,
        limit: state.limit
      })
    }

    const handleMvsDetail = (e) => {
      router.push({ name: 'MvsDetail', params: { id: e.id } })
    }

    return {
      chooseTabs,
      handleMvsDetail,
      handleChangePage,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.mvs-container {
  .mvs-tab {
    & > div {
      padding: 10px;
      margin: 10px 0;
      font-size: 14px;
      & > span:not(:first-child) {
        border-radius: 20px;
        margin: 20px;
        color: gray;
        cursor: pointer;
        padding: 5px 20px;
        text-align: center;
        &::after {
          top: 2.5;
          left: 40px;
          position: relative;
          content: "";
          display: inline-block;
          height: 14px;
          width: 1px;
          border-right: 1px solid #f2f2f1;
        }
        &.actived {
          color: #dd6d60;
          background-color: #fcf6f5;
        }
      }
    }
  }
  .mvs-container {
    display: flex;
    flex-direction: column;
    .mvs-list {
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      & > div {
        margin: 10px 20px;
        width: 270px;
        cursor: pointer;
        & > div {
          margin-bottom: 10px;
          position: relative;
          .music-copywriter {
            position: absolute;
            right: 6px;
            top: 4px;
            font-size: 14px;
            color: #fff;
          }
        }
        & > div + span {
          display: inline-block;
          width: 100%;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
        border-radius: 5px;
      }
    }
    .music-pagination {
      margin-top: 10px;
      text-align: center;
    }
  }
}
</style>