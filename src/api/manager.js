import axios from '~/axios'

/**
 * 登录管理
 */

export function login(name, pass) {
    return axios.post("/backend/manager/managerLogin", {
        name,
        pass
    })
}


export function getUserInfo() {
    return axios.post("/backend/manager/getUserInfo")
}

export function logout() {
    return axios.post("/admin/logout")
}

export function updatepassword(data) {
    return axios.post("/admin/updatepassword", data)
}