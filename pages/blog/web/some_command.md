---
title: 一些指令记录
date: 2019-10-10 11:49:00
tags:
  - git
  - webpack
---

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
一些框架/库/模板/插件的指令记录
</span>

<!-- more -->

## axios

> Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中

- 作用: 获取数据的 http 库

- 安装

```
npm install axios
```

- 使用 cdn

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

- [axios 使用文档](http://www.axios-js.com/zh-cn/docs/)

---

## bootstrap

> ui 框架

- 安装

```
npm install bootstrap@3
```

- 页面引入直接使用

```html
<!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"
  integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
  crossorigin="anonymous"
/>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script
  src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"
  integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
  crossorigin="anonymous"
></script>
```

- [bootstrap 使用文档](https://v3.bootcss.com/css/)

---

## element-ui

> ui 框架

- 安装

```
npm i element-ui -S
```

- 页面引入直接使用

```html
<!-- 引入样式 -->
<link
  rel="stylesheet"
  href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"
/>
<!-- 引入组件库 -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
```

- 引入项目

```js
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 使用
Vue.use(ElementUI);
```

- [element-ui 使用文档](http://element-ui.cn/#/zh-CN/component/radio)

---

## sweiper

> 轮播图插件等

- github 链接[vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper)

- 安装

```
npm install vue-awesome-swiper --save
```

- 引入项目, 在 main.js 中引入

```js
import Vue from "vue";
import VueAwesomeSwiper from "vue-awesome-swiper";
Vue.use(VueAwesomeSwiper);
```

- 基础使用

```html
<template>
  <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
    <!-- 轮播块 -->
    <swiper-slide>I'm Slide 1</swiper-slide>
    <!-- 导航块 -->
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>
<script>
  export default {
    data() {
      return {
        swiperOption: {
          // 设置参数
        },
      };
    },
  };
</script>
```

- 更多功能阅读[swiperApi 文档](https://www.swiper.com.cn/api/index.html)

---

## better-scroll

> 各种滚动场景需求的插件

- 安装

```
npm install better-scroll --save
```

- 配置

```js
// 导入
import BScroll from "better-scroll";
```

- 使用

```js
// 给子节点创建一个scroll属性并将其实例化为BScroll
// 父节点的高度需要 小于 要滚动的节点
// son -- 子节点
son.scroll = new BScroll("要滚动的节点");
```

- 当元素被应用了 BScroll 滚动时, 就无法触发点击事件, 需要设置点击属性

```js
son.scroll = new BScroll(this.$refs.wrapper, { click: true });
```

- [better-scroll 使用文档](http://ustbhuangyi.github.io/better-scroll/doc/)

---

## stylus

> css 预处理框架

- 安装

```
npm install stylus
```

- 使用

```html
<style lang="stylus" scoped></style>
```

- 特点之一

```js
// 定义公共css样式
// mixins.styl文件中定义css样式函数
loaction()
   position:absolute
   right:.2rem
   bottom:0
   top:0
   width:.3rem
   height:.3rem
   margin:auto
   font-size:.3rem
   color:#999
// 在CSS样式中引入别的scc样式
@import '~style/mixins.styl';
// 在css中执行函数
loaction()
```

---

## webpack

### 命令

#### cnpm i --save xxx

- --save：安装的 xxx 包/模块上线的时候需要使用，简写-S
- --save-dev：安装的 xxx 包仅开发时候使用，上线不需要，简写-D

#### webpack

- webpack -d： 开发环境，不压缩代码
- webpack -p： 默认，上线环境，压缩为一行代码
- --watch： 监听文件实时改变，在 webpack -d/webpack -p 后面加上--watch 就能实时监听，不需要改变一次又需要 webpack 编译一次

---
