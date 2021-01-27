import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs-extra';

// 创建请求路径
export function generateUrl(intfaceItem: any) {
    let str_arr = [intfaceItem.method, ...intfaceItem.path.split("/").filter((item: any) => item.length > 0)]
    let _str_arr = str_arr.map((item, index) => {
        let _item = item.replace(/[\{\}]/g, "").toLowerCase().split("")
        if (index != 0)
            _item[0] = _item[0].toUpperCase()
        return _item.join("")
    })
    return _str_arr.join("")
}

// 获取目标路径
export function getFolderPath(agrs: any) {
    return fs.lstatSync(agrs.fsPath).isDirectory() ? agrs.fsPath : path.dirname(agrs.fsPath)
}

// 处理json-schema
export function handleJsonSchema(jsonSchema: any, title: string) {
    if (jsonSchema.properties) {
        for (const key in jsonSchema.properties) {
            if (jsonSchema.properties[key].type == "array") {
                Object.assign(jsonSchema.properties[key].items, {
                    "$ref": "#",
                    title: `${title}${key}Item`
                })
            }
        }
    }
    return jsonSchema
}

// 处理json_schema
export async function resolveinJsonSchema(data: string, interfaceName: string) {
    let jsonSchema = JSON.parse(data)
    if (Object.keys(jsonSchema).length == 0) return
    delete jsonSchema.title
    handleJsonSchema(jsonSchema, interfaceName)
    return jsonSchema
}

// 获取文件的头部注释
export function getBannerComment(data: any) {
    return `/**\n* 作者:${data.username}\n*/`
}

/**
 * 获取某个扩展文件相对于webview需要的一种特殊路径格式
 * 形如：vscode-resource:/Users/toonces/projects/vscode-cat-coding/media/cat.gif
 * @param context 上下文
 * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
 */
export function getExtensionFileVscodeResource(context: vscode.ExtensionContext, relativePath: string) {
    const diskPath = vscode.Uri.file(path.join(context.extensionPath, relativePath));
    return diskPath.with({ scheme: 'vscode-resource' }).toString();
}

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
export function getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    // /(<link.+?href=(?!http)|<script.+?src=(?!http)|<img.+?src="(?!http)|url\("(?!http))(.+?)[\s|>]/g
    html = html.replace(/(<link.+?href=(?!http))(.+?)\s/g, (m, $1, $2) => {
        return $1 + '"' + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '" ';
    });
    html = html.replace(/(<script.+?src=(?!http))(.+?)>/g, (m, $1, $2) => {
        return $1 + '"' + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"> ';
    });
    html = html.replace(/(<img.+?src="(?!http)|url\("(?!http))(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
}