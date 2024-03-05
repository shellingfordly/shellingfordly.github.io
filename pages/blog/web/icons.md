---
title: 现代管理Icon的一些方式
date: 2024-3-5 15:00:58
tags:
  - iconify
---

# iconify

# Web Component

[Iconify Icon Web Component](https://iconify.design/docs/iconify-icon/)

Iconify Icon 是一个渲染图标的 Web 组件

## Usage

```html
<iconify-icon icon="mdi:home"></iconify-icon>
```

Web 组件可以在没有任何 UI 框架的情况下在 HTML 中使用。

它还适用于支持 Web 组件的所有现代框架：

- Svelte and SvelteKit/Sapper
- Vue 2 and Vue 3
- Lit
- Ember
- React and Next
- Solid

#### 布局偏移

为了避免布局偏移，请将其添加到您的 CSS 中：

```css
iconify-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}
```

## Registering the web component

如果您使用打包器构建项目，您可以通过安装 iconify-icon 作为依赖项并将其导入到您的项目中来包含脚本：

```ts
import "iconify-icon";
```

如果您不使用捆绑包或希望单独导入图标 Web 组件，请将脚本添加到您的文档中：

```html
<script src="https://code.iconify.design/iconify-icon/2.0.0/iconify-icon.min.js"></script>
<!-- OR -->
<script src="https://cdn.jsdelivr.net/npm/iconify-icon@2.0.0/dist/iconify-icon.min.js"></script>
```
