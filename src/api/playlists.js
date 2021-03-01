import request from '@/utils/request'

// 推荐歌单-主题
export const getPlaylistHighquaLity = (params) => {
    return request.get('/top/playlist/highquality', {
        params
    })
}

// 推荐歌单-分页列表
export const getPlayList = (params) => {
    return request.get('/top/playlist', {
        params
    })
}