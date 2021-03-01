import request from '@/utils/request'

// 最新MV-分页
export const getNewsMVList = (params) => {
    return request.get('/mv/all', {
        params
    })
}
