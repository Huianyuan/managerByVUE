import axios from '~/axios'

/**
 * gameStore Controller
 */

//分页查询
export function queryGameStore(data) {
    return axios.post("/games/backend/games/gameStore/query",data)
}
//查询所有游戏库
export function getAllGameStore() {
    return axios.post("/games/backend/games/gameStore/getByAll")
}


//创建游戏库
export function createGameStore(data) {
    return axios.post("/games/backend/games/gameStore/create",data)
}

//修改游戏库
export function updateGameStore(data) {
    return axios.post("/games/backend/games/gameStore/updateById",data)
}

//修改游戏库Sort值
export function batchUpdateSort(data) {
    return axios.post("/games/backend/games/gameStore/batchUpdateSort",data)
}

// 删除游戏库
export function deleteGameStore(id) {
    return axios.get("/games/backend/games/gameStore/deleteById?catId="+id)
}

// 删除游戏库
export function updateGameStoreStatus(data) {
    return axios.post("/games/backend/games/gameStore/updateStatus",data)
}