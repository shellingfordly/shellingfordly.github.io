---
title: hexo基础使用学习
date: 2019-10-10
tags:
  - hexo
---

# hexo基础使用学习

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
Hexo是一个快速、简洁且高效的博客框架。
Hexo使用Markdown(或其他渲染引擎)解析文章，在几秒内，
即可利用靓丽的主题生成静态网页。下面是关于它的一些基础使用介绍
</span>

<!-- more -->

## 概述

### 安装

```shell
npm install -g hexo-cli
```

## 建站

```
hexo init <folder>
cd <folder>
npm install
```

## 配置

```
title	网站标题
subtitle	网站副标题
description	网站描述
keywords	网站的关键词, 搜索引擎会解析到. 使用半角逗号 , 分隔多个关键词。
author	您的名字
language	网站使用的语言
```

### 文章

- external_link --- 在新标签中打开链接 --- 默认true

### 分页

| 参数           | 描述                              | 默认值 |
| -------------- | --------------------------------- | ------ |
| per_page       | 每页显示的文章量 (0=关闭分页功能) | 10     |
| pagination_dir | 分页目录                          | page   |

## 命令

- 清除缓存文件(db.json)和已生成的静态文件(public)

```shell
hexo clean
```

- 生成静态文件
  - 监视

```shell
hexo generate
hexo generate --watch
```

- 启动服务器
  - 默认
  - 修改端口
  - 静态模式

```shell
hexo server
hexo server -p 5000
hexo server -s
```

- 部署网站

```shell
hexo deploy
```

- 设置
  - 在 ~/.pow 文件夹建立链接(symlink)
  - 网站将会在 http://myapp.dev 下运行，网址根据链接名称而定

```shell
cd ~/.pow
ln -s /path/to/myapp
```

## 写作

### 布局

- 三种默认布局：post、page 和 draft

| 布局  | 路径            |
| ----- | --------------- |
| post  | source/\_posts  |
| page  | source          |
| draft | source/\_drafts |

- 如果不想文章被处理，将Front-Matter中的layout:设为false

### 模板

- 在新建文章时，Hexo会根据scaffolds文件夹内相对应的文件来建立文件

```shell
# Hexo会尝试在scaffolds文件夹中寻找 photo.md模板
hexo new photo "My Gallery"
```

## Front-matter

### 模板参数

| 参数       | 描述                 | 默认值 |
| ---------- | -------------------- | ------ |
| layout     | 布局                 |        |
| title      | 标题                 |        |
| comments   | 开启文章的评论功能   | true   |
| tags       | 标签（不适用于分页） |        |
| categories | 分类（不适用于分页） |        |
| permalink  | 覆盖文章网址         |

### 分类和标签

- 分类具有顺序性和层次性
  - Foo, Bar 不等于 Bar, Foo
- 而标签没有顺序和层次

```
categories:
- Diary
tags:
- PS3
- Games
```

## 标签插件

### 文章摘要和截断

> 在文章中使用 < !-- more --> 那么 < !-- more --> 之前的文字将会被视为摘要。
> 首页中将只出现这部分文字，同时这部分文字也会出现在正文之中。

```html
主页显示内容
<!-- more -->
正文
```

- 注意，摘要可能会被 Front Matter 中的 excerpt 覆盖

## 资源文件夹

### 文章资源文件夹

> 当资源文件管理功能打开后，Hexo将会在你每一次通过 hexo new [layout] [title]
> 命令创建新文章时自动创建一个文件夹, 存放着文章有关的资源

```
_config.yml
post_asset_folder: true
```

## 数据文件

- 在 source/\_data 文件夹中新建 menu.yml 文件

```
Home: /
Gallery: /gallery/
Archives: /archives/
```

- 在模板中使用这些资料

- 渲染结果

```html
<a href="/"> Home </a>
<a href="/gallery/"> Gallery </a>
<a href="/archives/"> Archives </a>
```

## 自定义

- 参数

| 参数                          | 结果                        |
| ----------------------------- | --------------------------- |
| :year/:month/:day/:title/     | 2013/07/14/hello-world      |
| :year-:month-:day-:title.html | 2013-07-14-hello-world.html |
| :category/:title              | foo/bar/hello-world         |

- 新建文章

```
hexo new "Hello World" --lang tw
source/_posts/tw/Hello-World.md
```

地址 http://localhost:4000/tw/hello-world/
