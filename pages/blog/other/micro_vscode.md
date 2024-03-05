---
title: 用Tauri写一个 micro vscode
date: 2024-3-5 17:39:01
tags:
  - vscode
  - tauri
---

# 用 Tauri 写一个 micro vscode

## 前言

Tauri 是一个构建适用于所有主流桌面和移动平台的轻快二进制文件的框架。开发者们可以集成任何用于创建用户界面的可以被编译成 HTML、JavaScript 和 CSS 的前端框架，同时可以在必要时使用 Rust、Swift 和 Kotlin 等语言编写后端逻辑。

- 对于开发者而言，Tauri 有三个主要优势：
  - 构建应用所需的可靠基础
  - 使用系统原生 webview（网页视图）带来的更小打包体积
  - 使用任何前端技术和多种语言绑定带来的灵活性

详情可到官方文档[What is Tauri](https://beta.tauri.app/guides/)查看。

Tauri 的 2.0 版本支持了移动端，如今 Tauri 已经发布到了[tauri-v2.0.0-beta.8](https://github.com/tauri-apps/tauri/tree/tauri-v2.0.0-beta.8)版本。Tauri 2.0 不仅仅是移动。以下是将包含的一些功能：

- 强大的插件：许多 Tauri API 已转向使用 Tauri 插件系统。这使我们能够使 Tauri 代码更加模块化、更易于维护，但也使我们能够使插件系统更强大，以便开发人员构建自己的插件。
- 插件的 Swift 和 Kotlin 绑定：现在您可以在 Swift 和 Kotlin 中编写特定于平台的代码。Tauri 从 1.0 版本开始就在 Rust 和 JavaScript 代码之间架起了一座桥梁。借助 Tauri 2.0，插件开发人员将能够使用 Swift 和 Kotlin 编写代码，以便与他们正在开发的系统更紧密地集成。
- 支持 iOS 和 Android：您将能够构建 Tauri 应用程序并在 iOS 和 Android 上运行它们。

详情可以到官方[Tauri 2.0 路线图](https://beta.tauri.app/blog/roadmap-to-tauri-2-0/)查看。

## Tauri demo

项目地址[micro-vscode](https://github.com/shellingfordly/micro-vscode)

### 创建项目

详情参考官方文档[Create a Project](https://beta.tauri.app/guides/create/)

```bash
pnpm create tauri-app --beta

cd my-tauri-app
npm install
npm run tauri dev
```

### 目录结构

如下图，其实和普通的 vite 项目没什么区别，就是多了一个 `src-tauri` 的文件夹，存放服务端的代码。

<img-item src="/images/blog/other/tauri/directory_structure.png" />

## 客户端

### git clone

<img-item src="/images/blog/other/tauri/git_clone.png" />

### git commit

使用 `github token` 提交，需要在 user 中设置

<img-item src="/images/blog/other/tauri/git_commit.png" />

### git pull and push

<img-item src="/images/blog/other/tauri/git.png" />

### 设置 git config 的 username 和 email

- 设置 username
- 设置 email
- 设置 gitHub token

<img-item src="/images/blog/other/tauri/git_user.png" />

### 查看项目

<img-item src="/images/blog/other/tauri/view_project.png" />

### 编辑文件

使用 `Cmd + S` 保存

<img-item src="/images/blog/other/tauri/editor_file.png" />

## 服务端

服务端使用 rust 写的，其实我几乎不懂 rust，这个项目的 rust 代码都是 chatgpt 帮我写的

## 写在最后

这是就是一个学习向的 Tauri Demo， 完全是我的第一个 Tauri 应用。

感兴趣的话可以关注项目地址[micro-vscode](https://github.com/shellingfordly/micro-vscode)。
