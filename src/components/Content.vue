<template>
  <div class="index-container">
    <div class="nav">
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
        <!-- <li>
          <router-link to="/home">
            <span class="iconfont icon-mv"></span>
            乾坤Test1
          </router-link>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
  }
}
</script>

<style lang="less">
.index-container {
  position: fixed;
  height: 100%;
  .nav {
    background-color: #ededed;
    width: 200px;
    height: 100%;
    li {
      height: 60px;
      cursor: pointer;
      display: flex;
      align-items: center;
      &:hover {
        background-color: #e7e7e7;
      }
      .iconfont {
        margin-right: 10px;
        font-size: 20px;
      }
      a {
        color: black;
        padding-left: 30px;
        font-size: 18px;
        line-height: 60px;
        width: 100%;
        height: 100%;
        &.router-link-active {
          color: #dd6d60;
          .iconfont {
            color: #dd6d60;
          }
        }
      }
    }
  }
}
</style>