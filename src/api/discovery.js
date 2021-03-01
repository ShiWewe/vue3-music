import request from '@/utils/request'

// 轮播图列表
export const getBannerList = () => {
    return request.get('/banner')
}

// 推荐歌单列表
export const getRecommendMusicList = (params) => {
    return request.get('/personalized', {
        params
    })
}

// 最新音乐列表
export const getNewMusicList = () => {
    return request.get('/personalized/newsong')
}

// 推荐MV
export const getRecommendMV = () => {
    return request.get('/personalized/mv')
}

// 音乐链接
export const getMusicUrl = (params) => {
    return request.get('/song/url', {
        params
    })
}