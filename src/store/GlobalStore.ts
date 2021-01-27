/**
 * @Author: Sun Rising
 * @Date: 2020-12-26 11:53:35
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-01-27 16:50:45
 * @Description: 全局数据管理
 */
import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';

export class GlobalStore {

    private static store: GlobalStore

    private static extensionContext: ExtensionContext

    private static staticValue: { [key: string]: any } = {}

    private constructor() { }

    // 初始化全局数据管理器
    static init(context: vscode.ExtensionContext) {
        this.extensionContext = context
    }

    // 获取全局数据管理器
    static getStore() {
        if (GlobalStore.store == null) {
            GlobalStore.store = new GlobalStore()
        }
        return GlobalStore.store
    }

    // 设置上下文变量，变量不可获取只可设置，用于 "when"
    setContextValue(key: string, value: any) {
        vscode.commands.executeCommand('setContext', key, value);
    }

    // 设置全局变量，变量可获取
    setGlobalContextValue(key: string, value: any) {
        // 方便获取上下文变量
        GlobalStore.extensionContext.globalState.update(key, value)
        this.setContextValue(key, value)
    }

    // 获取全局变量
    getGlobalContextValue(key: string) {
        return GlobalStore.extensionContext.globalState.get(key)
    }

    // 设置实例变量
    setStaticValue(key: string, value: any) {
        GlobalStore.staticValue[key] = value
    }

    // 获取实例变量
    getStaticValue(key: string) {
        return GlobalStore.staticValue[key]
    }

    // 获取上下文对象
    getExtensionContext() {
        return GlobalStore.extensionContext
    }

}