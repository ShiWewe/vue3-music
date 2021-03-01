import request from '@/utils/request'

// 音乐详情
export const getMusicPlaylist = (params) => {
    return request.get('/playlist/detail', {
        params
    })
}

// 音乐评论
export const getMusicCommentlist = (params) => {
    return request.get('/comment/playlist', {
        params
    })
}
