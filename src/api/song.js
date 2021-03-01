import request from '@/utils/request'

// 最新音乐
export const getTopMusicList = (params) => {
    return request.get('/top/song', {
        params
    })
}
