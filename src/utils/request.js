import axios from "axios";
import { getToken, removeToken } from "./token";

const request = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)
// 响应拦截器
request.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        // 对响应错误做点什么
        if (error.status === 401) {
            removeToken();
            location.href = '/login'
        }
        return Promise.reject(error)
    }
)


export { request }