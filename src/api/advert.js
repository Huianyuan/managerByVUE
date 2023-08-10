import axios from '~/axios'

/**
 * game Controller
 */

// 根据query查询（分页）
export function getAdvertByQuery(data) {
    return axios.post("/cms/backend/cms/advert/getByQuery",data)
}
// 根据query查询（分页）
export function getExGroupAdByQuery(data) {
    return axios.post("/cms/backend/cms/advert/getExGroupAdByQuery",data)
}

// 创建 ad
export function createAdvert(data) {
    return axios.post("/cms/backend/cms/advert/createAdvert",data)
}

// 根据id查询 Advert
export function getAdvertById(data) {
    return axios.get("/cms/backend/cms/advert/getById?adId="+data)
}

// 设置 Ad 的状态
export function updateAdvertStatus(data) {
    return axios.post("/cms/backend/cms/advert/updateStatus",data)
}

// 修改
export function updateAdvert(data) {
    return axios.post("/cms/backend/cms/advert/updateAdvert",data)
}