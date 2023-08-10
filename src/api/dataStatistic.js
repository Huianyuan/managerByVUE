import axios from '~/axios'

/**
 * game Controller
 */



// 日活
export function memberDailyActivity(data) {
    return axios.post("/data/backend/data/memberDailyActivity", data )
}

// 新用户统计
export function newMemberCount(data) {
    return axios.post("/data/backend/data/newMemberCount", data )
}
// 用户留存
export function memberRetention(data) {
    return axios.post("/data/backend/data/memberRetention", data )
}


// 游戏点击次数
export function gameStartTimes(data) {
    return axios.post("/data/backend/data/gameStartTimes", data )
}

// 游戏点击次数，游戏详情
export function gameStartTimesDetails(data) {
    return axios.post("/data/backend/data/gameStartTimesDetails", data )
}