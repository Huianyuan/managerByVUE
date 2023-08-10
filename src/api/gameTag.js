import axios from '~/axios'

/**
 * gameTag Controller
 */

//分页查询Tag
export function queryGameTag(data) {
    return axios.post("/games/backend/games/gameTag/query",data)
}

//创建Tag
export function createGameTag(data) {
    return axios.post("/games/backend/games/gameTag/create",data)
}

//修改Tag
export function updateGameTag(data) {
    return axios.post("/games/backend/games/gameTag/updateById",data)
}

// 删除Tag
export function deleteGameTag(id) {
    return axios.get("/games/backend/games/gameTag/deleteById?catId="+id)
}

//修改游戏库Sort值
export function batchUpdateSort(data) {
    return axios.post("/games/backend/games/gameTag/batchUpdateSort",data)
}

//获取所有便签
export function getAllTags() {
    return axios.post("/games/backend/games/gameTag/getByAll")
}
//获取所有便签
export function updateTagStatus(data) {
    return axios.post("/games/backend/games/gameTag/updateStatus",data)
}