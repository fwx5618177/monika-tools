import * as vscode from "vscode";
import { getWebviewContent } from "./webviewTemplate";

let panel: vscode.WebviewPanel | undefined; // 存储 Webview 面板引用

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "wgslpreview" is now active!');

  const supportedExtensions = [
    ".wgsl",
    ".wsl",
    ".shader",
    ".spv",
    ".glsl",
    ".frag",
    ".vert",
    ".hlsl",
  ];

  const showWgslPreview = vscode.commands.registerCommand(
    "extension.showWgslPreview",
    () => {
      vscode.window.showInformationMessage(
        "Show WGSL Shader Preview activated!"
      );

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("没有找到激活的编辑器。");
        return;
      }

      const document = editor.document;
      const extname = document.fileName.split(".").pop();

      if (!extname || !supportedExtensions.includes(`.${extname}`)) {
        vscode.window.showErrorMessage("不支持的 Shader 文件格式。");
        return;
      }

      // 如果面板已存在，则直接显示该面板
      if (panel) {
        panel.reveal(vscode.ViewColumn.Two);
      } else {
        // 创建新的 Webview 面板
        panel = vscode.window.createWebviewPanel(
          "wgslPreview",
          "Shader 预览",
          vscode.ViewColumn.Two,
          { enableScripts: true, retainContextWhenHidden: true }
        );

        panel.webview.html = getWebviewContent(document.getText());

        // 监听 Webview 面板被关闭的事件
        panel.onDidDispose(() => {
          panel = undefined; // 重置面板引用
        });
      }

      // 监听文档变动并实时更新 Webview
      const documentChangeListener = vscode.workspace.onDidChangeTextDocument(
        (event) => {
          if (event.document === document) {
            panel?.webview.postMessage({
              type: "updateShader",
              code: event.document.getText(),
            });
          }
        }
      );

      // 确保当 Webview 面板关闭时，取消文档监听
      panel.onDidDispose(() => {
        documentChangeListener.dispose();
      });
    }
  );

  context.subscriptions.push(showWgslPreview);
}

export function deactivate() {
  console.log("wgslpreview extension is now deactivated");
}
