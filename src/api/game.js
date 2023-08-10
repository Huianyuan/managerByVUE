import axios from '~/axios'

/**
 * game Controller
 */



// 创建游戏
export function createGame(data) {
    return axios.post("/games/backend/games/manager/create",data)
}

// 删除游戏
export function deleteGameById(id) {
    return axios.post("/games/backend/games/manager/deleteById?gameId="+ id )
}

// 修改游戏信息
export function updateGame(data) {
    return axios.post("/games/backend/games/manager/update",data)
}
//

// 根据ID获取详细信息
export function getById(data) {
    return axios.post("/games/backend/games/manager/getById",data)
}

// 分页查询
export function queryGame(data) {
    return axios.post("/games/backend/games/manager/query",data)
}
// 变更游戏状态
export function updateGameStatus(data) {
    return axios.post("/games/backend/games/manager/updateStatus",data)
}
// 游戏关联游戏库
export function gameLinkStore(data) {
    return axios.post("/games/backend/games/manager/gameLinkStore",data)
}

// 游戏关联游戏标签
export function gameLinkTag(data) {
    return axios.post("/games/backend/games/manager/gameLinkTag",data)
}

// 游戏解除关联的游戏库
export function gameUnLinkStore(data) {
    return axios.post("/games/backend/games/manager/gameUnLinkStore",data)
}

// 游戏解除关联的游戏库
export function gameUnLinkTag(data) {
    return axios.post("/games/backend/games/manager/gameUnLinkTag",data)
}