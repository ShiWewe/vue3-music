import request from '@/utils/request'

// 搜索
export const getSearchList = (params) => {
    return request.get('/search', {
        params
    })
}
