/**
 * @Author: Sun Rising
 * @Date: 2021-01-07 13:25:13
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-01-26 11:42:13
 * @Description: 插件通讯工具
 */
import { uuid } from "./utils";

export const vscode = acquireVsCodeApi();

// 消息队列
let messageQueue = {};
// 超时时间
const timeout = 1000 * 60 * 2

// 监听插件发来的消息
window.addEventListener('message', event => {
    console.log("接收到vscode信息", JSON.stringify(event.data));
    const { token, command, data } = event.data;
    if (!messageQueue[token]) return
    if (command == "reject") {
        messageQueue[token].reject(data)
    } else {
        messageQueue[token].resolve(data)
    }
    delete messageQueue[token]
});

/**
 * 向插件发送消息
 * @param {*} command 执行类型
 * @param {*} data 数据
 */
export let postMessage = (command, data) => {
    return new Promise((resolve, reject) => {
        const token = uuid()
        messageQueue[token] = {
            resolve,
            reject,
            data
        }
        vscode.postMessage({ token, command, data })
        setTimeout(() => {
            if (messageQueue[token]) {
                messageQueue[token].reject(new Error("等待超时."))
                delete messageQueue[token]
            }
        }, timeout)
    })
}
