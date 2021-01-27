import Axios from 'axios';
import { GlobalStore } from '../store/GlobalStore';

/**
 * 允许在向服务器发送前，修改请求数据
 * 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
 * 函数必须返回一个字符串，或 ArrayBuffer，或 Stream
 * @param {*} data
 */
let transformRequest = function (req: any) {
    return JSON.stringify(req);
};

/**
 * 在拦截器之前执行，在传递给 then/catch 前，允许修改响应数据
 * @param {*} data
 */
let transformResponse = function (res: any) {
    try {
        return JSON.parse(res)
    } catch (error) {
        return {}
    }
};

let ajax = Axios.create({
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    withCredentials: true, //跨域请求带上cookie
    transformRequest: [transformRequest],
    transformResponse: [transformResponse],
    // `maxContentLength` 定义允许的响应内容的最大尺寸
    // maxContentLength: 1024 * 10,
    // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 reject
    validateStatus: function (status) {
        return status >= 200 && status < 300; // 默认的
    },
    // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
    // 如果请求话费了超过 `timeout` 的时间，请求将被中断
    timeout: 0
});


// 添加请求拦截器,transformRequest之后执行
ajax.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log("http filed!" + error);
    }
);

// 添加响应拦截器，transformResponse之后执行
ajax.interceptors.response.use(
    response => {
        return new Promise((resolve, reject) => {
            resolve(response.data)
        });
    },
    error => {
        console.log("response filed!");
        console.log(error);
    }
);

export function httpGet(url: string, params?: { [key: string]: any }, headers?: { [key: string]: any }) {
    return ajax.get(url, {
        params,
        baseURL: GlobalStore.getStore().getStaticValue("baseUrl"),
        headers
    })
}