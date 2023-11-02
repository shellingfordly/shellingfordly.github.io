---
title: vscode 插件开发
date: 2023-9-13 15:05:05
tags:
  - vscode
---

# vscode 插件开发

我的 vscode 插件工具

[安装 simple-tools](https://marketplace.visualstudio.com/items?itemName=shellingfordly.simple-tools)

[源码地址](https://github.com/shellingfordly/vsce-simple-tools)

## 时间快捷键

有时候想要输出一下当前的时间

![](/images/blog/get_now_time.png)

```js
const showNowTimeCommand = vscode.commands.registerCommand(
  "vscode_extension.showNowTime",
  () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    const items = [
      `${date.replace(/\//g, "-")} ${time}`,
      `${date} ${time}`,
      date,
      date.replace(/\//g, "-"),
      time,
    ];

    vscode.window.showQuickPick(items).then((selectedItem) => {
      if (selectedItem) {
        // 处理用户选择的项目
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          // 将选项内容插入到文档中
          editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, selectedItem);
          });
        } else {
          vscode.window.showErrorMessage("No active text editor.");
        }
      }
    });
  }
);
```

- 快捷键

```json
"contributes": {
  "commands": [
    {
      "command": "vscode_extension.showNowTime",
      "title": "Show Quick Pick"
    }
  ],
  "keybindings": [
    {
      "command": "vscode_extension.showNowTime",
      "key": "ctrl+win+1",
      "mac": "cmd+ctrl+1",
      "when": "editorTextFocus"
    }
  ]
}
```
