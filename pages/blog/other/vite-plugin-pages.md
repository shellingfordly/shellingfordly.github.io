---
title: vite-plugin-pages打包刷新页面丢失问题
date: 2023-09-01 17:14:00
tags:
  - bug
---

# 文件自动路由插件 vite-plugin-pages 打包路由丢失问题

> 已修复，并不是 **vite-plugin-pages** 的问题，查看[vercel 构建项目刷新页面 404 问题](/blog/other/vercel-build-err)

vite-plugin-pages 配置

```ts
Pages({
  extensions: ["vue", "md"],
  dirs: "pages",
  extendRoute(route) {
    const path = resolve(__dirname, route.component.slice(1));
    if (path.endsWith(".md")) {
      const md = fs.readFileSync(path, "utf-8");
      const { data } = matter(md);
      route.meta = Object.assign(route.meta || {}, { frontmatter: data });
    }
    return route;
  },
});
```

使用 vite-plugin-pages 插件根据文件自动生成路由，文件目录如下

```
pages
--blog
----index.md
--projects.md
```

![](/images/blog/vite-plugin-pages_2.png)

使用`vite-ssg build`打包出来之后，会生成 blog.html, project.html

![](/images/blog/vite-plugin-pages_1.png)

路由打印

![](/images/blog/vite-plugin-pages_3.png)
