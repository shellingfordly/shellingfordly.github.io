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

```css unocss
.container {
  display: none;
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
```

```ts twoslash
const a: string = "";
```
