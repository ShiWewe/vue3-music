import request from '@/utils/request'

// MV-video-url
export const getMVVideo = (params) => {
    return request.get('/mv/url', {
        params
    })
}

// MV-相关推荐
export const getRecommendList = (params) => {
    return request.get('/simi/mv', {
        params
    })
}

// MV-详情信息
export const getMVDetail = (params) => {
    return request.get('/mv/detail', {
        params
    })
}

// MV-头像
export const getMVAvatar = (params) => {
    return request.get('/artists', {
        params
    })
}

// MV-热门评论
export const getMVHotComment = (params) => {
    return request.get('/comment/hot', {
        params
    })
}

// MV-最新评论
export const getMVNewComment = (params) => {
    return request.get('/comment/mv', {
        params
    })
}
