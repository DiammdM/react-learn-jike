import { request } from "@/utils"


export function getUserInfo() {
    return request({
        url: '/user/profile',
        method: 'GET'
    })
}