import axios from '~/axios'

/**
 * pageFloorController
 */


//查询所有pageFloor信息
export function getAllPageFloor(data) {
    return axios.get("/cms/backend/cms/advert/v1/getAll",data)
}
//更新pageFloor信息
export function updatePageFloor(data) {
    return axios.get("/cms/backend/cms/advert/v1/update",data)
}
//更改pageFloor状态
export function updatePageFloorStatus(data) {
    return axios.post("/cms/backend/cms/advert/v1/changeStatus",data)
}

//查看一个pageFloor信息
export function getPageFloorByFloorId(floorId) {
    return axios.get("/cms/backend/cms/advert/v1/getById?floorId="+floorId)
}
//关联 多个 group
export function floorLinkGroup(data) {
    return axios.post("/cms/backend/cms/advert/v1/floorLinkGroup",data)
}
//关联 多个 group
export function floorUnlinkGroup(data) {
    return axios.post("/cms/backend/cms/advert/v1/floorLinkGroup",data)
}
//修改floor关联分组的排序值
export function updateSort(data) {
    return axios.post("/cms/backend/cms/advert/v1/updateSort",data)
}
