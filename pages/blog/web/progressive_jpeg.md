---
title: 使用渐进式 JPEG 来提升用户体验
date: 2023-09-08 13:12:00
tags:
  - js
---

# 使用渐进式 JPEG 来提升用户体验

[原文链接](https://www.biaodianfu.com/progressive-jpeg.html)

## 如何转换

原文写了好几种处理方式，我想有没有 js 的处理工具，看到这个 jpegtran 的时候我在想有没有 js 包可以直接使用，果然有[jpegtran](https://www.npmjs.com/package/jpegtran)。

````bash

```bash
jpegtran -copy none -progressive <inputfile> <outputfile>
````
