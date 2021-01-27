/**
 * @Author: Sun Rising 
 * @Date: 2021-01-07 13:55:30 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-01-22 16:16:00
 * @Description: 工具
 */
import { Message } from "element-ui";

// 唯一主键生成
export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

//操作级成功
export function sayOpSuccess(message, duration = 3000) {
    Message({
        title: "成功",
        message: message,
        type: "success",
        duration: duration
    });
}

//操作级错误
export function sayOpError(message, duration = 3000) {
    Message({
        title: "错误",
        message: message,
        type: "error",
        duration: duration
    });
}

// 对象key转树结构
export function objKeyToResTree(obj, parent = []) {
    if (obj.type == "object") {
        for (const key in obj.properties) {
            if (obj.properties[key].type == "array") {
                parent.push({
                    label: key,
                    value: key,
                })
            }
            if (obj.properties[key].type == "object") {
                parent.push({
                    label: key,
                    value: key,
                    children: objKeyToResTree(obj.properties[key], parent.children)
                })
            }
        }
    }
    return parent
}

// 对象key转树结构
export function objKeyToReqTree(obj, parent = []) {
    if (obj.type == "object") {
        for (const key in obj.properties) {
            if (obj.properties[key].type == "object") {
                parent.push({
                    label: key,
                    value: key,
                    children: objKeyToReqTree(obj.properties[key], parent.children)
                })
            }
        }
    }
    return parent
}
