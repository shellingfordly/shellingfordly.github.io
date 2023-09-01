---
title: 解析RSSHub文档自动生成API
date: 2022-02-15 18:00:00
tags:
  - rsshub
---

# 解析 RSSHub 文档自动生成 API

### 前言

项目正式版发布了，最近比较清闲，闲逛的时候看到 rsshub 这个库，想玩一下，但是 rsshub 文档里的接口太多了，自己手敲又嫌麻烦，突发奇想解析 rsshub 的文档自动生成所有文档出现的 api 给前端页面使用。

不是什么原因我的 yarn 和 npm 都装不了 rsshub 这个包，我是直接拉 GitHub 的 rsshub 下来用的，能装的可以直接安装，不行的也可以像我一样拉下来用，就是有点丑陋。

### 项目地址

[rsshub-demo](https://github.com/shellingfordly/rsshub-demo)

### 效果图

没有特地去写样式，有部分接口有问题，可能获取不到数据

![](/images/blog/rsshub.png)

### 代码

首先第一步也是最核心的一步就是解析文档，提取有效信息，当然是用正则去解析对应的 api 名称，标题，path 等，我定义了一个常量先声明这些正则规则。

```js
const RegMap = {
  Type: new RegExp(/\s#\s(.+)\s/g),
  Content: new RegExp(
    /\s##.+\s+###.+\s+(<Route.+>)|(<\/Route>\s+###.+\s+<Route.+>)/g
  ),
  Title: new RegExp(/\s##\s(.+)\s/g),
  ChildTitle: new RegExp(/\s###(.+)/g),
  Route: new RegExp(/(\<Route.+\>)/g),
  Example: new RegExp(/example="(\S+)"/g),
  Path: new RegExp(/path="(\S+)"/g),
  ParamsDesc: new RegExp(/paramsDesc="(.+)"/g),
};
```

解析文档内容，这里我是直接下载了文档的，你也可以去请求文档来解析，找有效信息的代码稍微有点 low，解析之后生成接口具体的标题、path 等信息的 json 文件

```js
let type;
const data = await fs
  .readFileSync(join(__dirname, `../../docs/${file}`))
  .toString();
data.replace(RegMap.Type, (_, val) => (type = val));
const list = data.match(RegMap.Content);
if (!list) return;
const result = [];
for (let index = 0; index < list.length; index++) {
  const content = list[index];
  let title, childTitle, route, example, path, paramsDesc;
  content.replace(RegMap.Title, (_, val) => (title = val));
  content.replace(RegMap.ChildTitle, (_, val) => (childTitle = val));
  content.replace(RegMap.Route, (_, val) => (route = val));
  if (route) {
    route.replace(RegMap.Example, (_, val) => (example = val));
    route.replace(RegMap.Path, (_, val) => (path = val));
    route.replace(RegMap.ParamsDesc, (_, val) => (paramsDesc = val));
  }
  if (title) {
    result.push({
      title,
      children: [
        {
          title: childTitle,
          example,
          path,
          paramsDesc,
        },
      ],
    });
  } else {
    const parent = getParent(result, index);
    if (parent) {
      parent.children.push({
        title: childTitle,
        example,
        path,
        paramsDesc,
      });
    }
  }
}
fs.writeFileSync(`./api/${file}.json`, JSON.stringify({ type, result }));
```

读取生成的接口信息 json 文件。

```js
const apiPath = join(__dirname, "../api");
const files = await fs.readdirSync(apiPath);
files.forEach(async (file) => {
  const data = await fs.readFileSync(join(apiPath, file)).toString();
  routeList.push(JSON.parse(data));
});
```

使用 express 创建服务，读取并处理接口 json，配置对应的后端 api，并向前端页面提供 routeList，方便一会页面直接获取其他接口。

```js
const express = require("express");
const RSSHub = require("./RSSHub/lib/pkg");
const app = express();
const createRoute = require("./utils/create-route");

function GetData(url) {
  return new Promise((res, rej) => {
    RSSHub.init({});
    RSSHub.request(`https://rsshub.app${url}`).then(res).catch(rej);
  });
}

app.use(express.static("./static"));

const list = [];
await createRoute(list);

const routeList = list
  .map((v) => v.result)
  .flat()
  .map((v) => v.children)
  .flat();

// 根据routeList配置api
routeList.forEach((route) => {
  app.get(`/api${route.example}`, async function (req, res) {
    const data = await GetData(route.example);
    res.send(data.item);
  });
});

// 给前端提供routeList，方便前端调用其他接口
app.get("/api/alldata", (req, res) => {
  res.send(list);
});

app.listen(8088, () => {
  console.log("http://localhost:8088 端口启动".green);
});
```

页面上使用 axios 发起请求，使用 petite-vue 快速铺数据

```html
<script src="https://cdn.bootcdn.net/ajax/libs/axios/0.24.0/axios.min.js"></script>
<script type="module">
  import { createApp } from "https://unpkg.com/petite-vue?module";
  import { API } from "./api.js";

  createApp({
    navList: [],
    subNavList: [],
    data: [],
    selete: {
      nav: "",
      subNav: "",
      title: "",
      menu: "",
    },
    titleList: [],
    menus: [],
    content: "",
    link: "",
    async mounted() {
      const navList = await axios.get("/api/alldata");
      this.navList = navList;
    },
    onClickNav(item) {
      this.selete.nav = item.type;
      this.subNavList = item.result;
    },
    onClickSubNav(item) {
      this.selete.subNav = item.title;
      if (item.children.length) {
        this.titleList = item.children;
        this.selete.title = item.children[0].title;
        axios.get(`/api${item.children[0].example}`).then((data) => {
          this.menus = data;
        });
      }
    },
    onClickTitle(item) {
      this.selete.title = item.title;
      axios.get(`/api${item.example}`).then((data) => {
        this.menus = data;
      });
    },
    onMenuItem(menu) {
      this.selete.menu = menu.title;
      this.content = menu.description;
      this.link = menu.link;
    },
  }).mount();
</script>

<div id="app" v-scope @vue:mounted="mounted">
  <div class="top">
    <div class="nav">
      <div
        class="nav-item"
        :class="{selected:selete.nav===item.type}"
        v-for="item in navList"
        :key="item.type"
        @click="onClickNav(item)"
      >
        {{item.type}}
      </div>
    </div>
    <div class="sub-nav" v-show="subNavList.length">
      <div
        class="sub-nav-item"
        :class="{selected:selete.subNav===item.title}"
        @click="onClickSubNav(item)"
        v-for="item in subNavList"
        :key="item.title"
      >
        {{item.title}}
      </div>
    </div>
  </div>
  <div class="bot" v-show="menus.length">
    <div class="title">
      <div
        class="title-item"
        :class="{selected:selete.title===item.title}"
        v-for="item in titleList"
        @click="onClickTitle(item)"
      >
        {{item.title}}
      </div>
    </div>
    <div class="menu">
      <div
        class="menu-item"
        :class="{selected:selete.menu===menu.title}"
        v-for="menu in menus"
        :key="menu.link"
        @click="onMenuItem(menu)"
      >
        {{menu.title}}
      </div>
    </div>
    <div class="content" v-if="content" v-html="content"></div>
    <iframe
      v-else
      :src="link"
      frameborder="0"
      width="100%"
      height="2000px"
    ></iframe>
  </div>
</div>
```
