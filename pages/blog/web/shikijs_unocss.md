---
title: shikijs add unocss
date: 2024-4-26 14:45:08
tags:
  - shikijs
---

# shikijs add unocss

1. 需要解析 md 内容，检测有 `css unocss`，在有 css 样式的 element 上添加上 class 标记

怎么去匹配 `display: none;` `class="bg-red"`

2. 在 MarkdownItShiki 里的 transformers 注入

## 分析

解析的字段有两种形式

1. 原生 css 样式 -> unocss

在 css 代码中，匹配 `display: none;`

在内链样式中，匹配 `style="display: none;"`

3. unocss -> 原生 css 样式

class 类名，`class="bg-red"`
标签属性，`<div bg-red>`

## 处理思路

1. 在 preprocess 中处理 code

2. span 里处理合并项

3. line 里添加 hover 弹窗

```less unocss
.container {
  display: none;
  background: red;
}
```

```html unocss
<style>
  .container {
    display: none;
    color: red;
  }
</style>
<div class="bg-red"></div>
<div bg-red></div>
<div style="background: red; color: red;"></div>
```
