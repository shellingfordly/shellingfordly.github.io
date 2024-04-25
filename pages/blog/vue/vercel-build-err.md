---
title: vercel构建项目刷新页面404问题
date: 2023-9-15 17:28:57
tags:
  - bug
---

## vercel 构建项目刷新页面 404 问题

我用 vercel 构建我的博客项目时，发现只有第一次打开页面时是正常的，当页面刷新后会出现 404 找不到页面的情况，

![404](/images/blog/vercel-build-err_1.png)

直到我看到了这篇文章[How to solve Vercel and Netlify "Page Not Found" after page refresh [SOLVED]](https://dev.to/devvsakib/how-to-solve-vercel-and-netlify-page-not-found-after-page-refresh-solved-2ol7)

在 public 中添加一个名为 **\_redirects** 的文件，并加上这行代码

```
/* /index.html 200
```

并创建一个 **vercel.json** 加入下面的配置，页面就能正常刷新了。

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```
