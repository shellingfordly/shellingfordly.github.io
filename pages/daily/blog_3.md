---
title: 我的博客3.0
date: 2023-09-06
tags:
  - blog
---

## 我的博客 3.0

第一个博客是在大学时候弄的，用的是 hexo 搭建的。但是当时还是个小白，只在 github 上部署了打包后的代码，没有保存源代码，导致后面我就再也没更新过我的个人博客，一直停留在了 2019 年。后来有用 vuepress 搭建了一个学习笔记记录的项目，但感觉不是很好看，没有当主力的博客使用，之后就一直在掘金和思否上写，就没怎么更新个人博客了。

由于今年上半年经常跑出去完，最近突然又想重新搭建一下自己的个人博客，记录一下生活。

[blog github 项目地址](https://github.com/shellingfordly/shellingfordly.github.io)

[blog 预览](https://shellingfordly.github.io)

![blog3_1](/images/blog/blog3_1.png)

设计方面参考了[antfu 大佬的 blog](https://antfu.me/)风格，antfu 的 blog 简约好看，是我喜欢的风格。

主要也是用了他的框架，所以色调和风格很一致。

## plugins

这些插件使得写起来非常的舒服，比如我可以直接在`index.md`里添加一个 icon，使用一个组件，并且传入一些数据。

```markdown
---
title: blog
date: 2023-09-06
tags: ["js", "ts", "vue"]
---

<tag-list :tags="tags" />

<div class="i-uil-github-alt" />
```

1. [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)

用 vite-plugin-pages 自动生成路由。

但是我发现 build 出来的页面使用 live-server 启动时刷新会丢失，我在[vite-plugin-pages issues247](https://github.com/hannoeru/vite-plugin-pages/issues/247)看到有人遇到和我同样的问题，但是我没有找到合适的解决方案。而且当我把 antfu 的博客项目 clone 下来打包之后发现有同样的问题，但是他的网站是 OK 的，我不知道他怎么处理的。

![blog3_2](/images/blog/blog3_2.png)

最后我发现用 vite preview 运行 dist 出来的没有问题，于是我在[vite 静态部署站点](https://cn.vitejs.dev/guide/static-deploy.html#github-pages)中直接复制了`github-pages`构建代码，这样就 github pages 是好了，但是 Vercel 里面自动部署还是有问题。

2. [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown)

这是一个可以将 Markdown 编译成 Vue 组件的 vite 插件，可以解析 md 预设的参与，以及直接使用 vue 组件。和 vite-plugin-pages 搭配实现安心的写 md。

还有一些增强 markdown 的插件

- [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) 添加 id 锚点
- [shikiji](https://github.com/antfu/shikiji) 代码高亮

1. [unocss](https://github.com/unocss/unocss)

unocss 真的很方便，对于个人项目来说，哪里用到就在哪里。公司项目的话，css 全部写在 class 里应该挺头疼的吧，我也不知道。反正我自己的项目用得挺爽的，也没有心智负担，就随便写。

而且配合`unplugin-icons`实现 class 图标真的很方便，不用再为乱七八糟的图标头疼了，[iconify](https://iconify.design/)提供的图标够多了。

4. [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)

api 自动导入

5. [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)

组件自动导入

## references

设计方面主色调是`antfu`大佬的博客，再加上架子差不多所以比较类似，如果侵权马上修改。

blog 页面的时间轴参考了我的老博客 hexo 的主题[hexo-theme-next](https://github.com/iissnan/hexo-theme-next)

主页设计参考了一个 ui 网站[paulineosmont](https://www.paulineosmont.com/)，它的设计很炫酷，我暂时没有实现。
