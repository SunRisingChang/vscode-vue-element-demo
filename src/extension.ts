import * as vscode from 'vscode';
import { menus } from './command';
import { GlobalStore } from './store/GlobalStore';

/**
 * 扩展启用
 * @param {vscode.ExtensionContext} context
 */
export async function activate(context: vscode.ExtensionContext) {

	console.log("vscode-vue-element-demo 扩展启用");

	GlobalStore.init(context)

	// 注册命令
	for (const item of menus) {
		context.subscriptions.push(vscode.commands.registerCommand(item.command, args => item.handle(args, item.command)));
	}

}

/**
 * 扩展停用
 */
export function deactivate() { }
