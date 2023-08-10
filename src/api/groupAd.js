import axios from '~/axios'

/**
 * game Controller
 */

// 查询adGroup  分页
export function getAdGroupByQuery(data) {
    return axios.post("/cms/backend/cms/advertGroup/getByQuery", data)
}

// 查询adGroup 分页 根据floorId排除分组
export function getExGroupByQuery(data) {
    return axios.post("/cms/backend/cms/advertGroup/getExGroupByQuery", data)
}

// 创建 adGroup
export function createAdGroup(data) {
    return axios.post("/cms/backend/cms/advertGroup/createAdvertGroup", data)
}

// 根据id查询
export function getAdvertByGroupId(id) {
    return axios.get("/cms/backend/cms/advertGroup/getById?groupId=" + id)
}
// 查询当前分组下的所有内容
export function getAdvertByGroupIdQuery(data) {
    return axios.post("/cms/backend/cms/advertGroup/getByIdQuery",data)
}

// 修改 adGroup
export function updateAdvertGroup(data) {
    return axios.post("/cms/backend/cms/advertGroup/updateAdvertGroup", data)
}

// 删除 adGroup
export function deleteAdvertGroup(groupId) {
    return axios.get("/cms/backend/cms/advertGroup/deleteGroup?groupId="+groupId)
}

// 更新排序
export function updateAdGroupSort(data) {
    return axios.post("/cms/backend/cms/advertGroup/updateSort", data)
}

// 更新状态
export function updateAdGroupStatus(data) {
    return axios.post("/cms/backend/cms/advertGroup/updateStatus", data)
}

/**
 * group 关联 Ad 支持批量
 */
export function groupLinkAd(data) {
    return axios.post("/cms/backend/cms/advertGroup/groupLinkAd", data)
}
/**
 * group 解除关联 Ad 支持批量
 */
export function groupUnlinkAd(data) {
    return axios.post("/cms/backend/cms/advertGroup/groupUnlinkAd", data)
}
