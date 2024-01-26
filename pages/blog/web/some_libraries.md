---
title: Some cool Libraries
date: 2024-1-26 15:40:30
tags:
  - library
  - plugin
---

[[toc]]

## [markdown-it](https://github.com/markdown-it/markdown-it)

Markdown 解析器

### [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown)

将 Markdown 编译为 Vue 组件

#### 在 vite 中使用

```ts
// vite.config.ts
import Vue from "@vitejs/plugin-vue";
import Markdown from "unplugin-vue-markdown/vite";

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/], // <-- allows Vue to compile Markdown files
    }),
    Markdown({
      /* options */
    }),
  ],
});
```

#### 设置 markdown 插件

使用下面的插件，扩展 markdown-it 的功能

```ts
import MarkdownItGitHubAlerts from "markdown-it-github-alerts";
import LinkAttributes from "markdown-it-link-attributes";

export default defineConfig({
  plugins: [
    Markdown({
      // settings/plugins
      async markdownItSetup(md) {
        md.use(MarkdownItGitHubAlerts /* Options */);
        md.use(LinkAttributes /* Options */);
        md.use(require("markdown-it-anchor").default);
        md.use(require("markdown-it-table-of-contents"));
      },
    }),
  ],
});
```

### [markdown-it-github-alerts](https://github.com/antfu/markdown-it-github-alerts)

支持 Markdown-it 的 GitHub 样式警报

> [!NOTE] 注意
> 突出显示用户应考虑的信息，即使在略读时也是如此。

> [!TIP] 提示
> 帮助用户获得更多成功的可选信息。

> [!IMPORTANT] 重要
> 用户成功所需的关键信息。

> [!WARNING] 警告
> 由于存在潜在风险，需要立即引起用户注意的关键内容。

> [!CAUTION] 谨慎
> 操作的负面潜在后果。

#### 使用

```ts
import MarkdownIt from "markdown-it";
import MarkdownItGitHubAlerts from "markdown-it-github-alerts";

const md = MarkdownIt();

md.use(MarkdownItGitHubAlerts /* Options */);

const html = md.render(/* ... */);
```

### [markdown-it-table-of-contents](https://github.com/cmaas/markdown-it-table-of-contents)

Markdown-it 的目录插件

#### 使用

```ts
var MarkdownIt = require("markdown-it");
var md = new MarkdownIt();

// Optional, but makes sense as you really want to link to something, see info about recommended plugins below
md.use(require("markdown-it-anchor").default);
md.use(require("markdown-it-table-of-contents"));
```

### [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor)

为 markdown-it 设计的标题锚点生成

#### 使用

```ts
const md = require("markdown-it")().use(require("markdown-it-anchor"), opts);
```

### [markdown-it-link-attributes](https://github.com/crookedneighbor/markdown-it-link-attributes)

Markdown 解析器的链接属性插件

#### 使用

```ts
const md = require("markdown-it")();
const mila = require("markdown-it-link-attributes");

md.use(mila, {
  attrs: {
    target: "_blank",
    rel: "noopener",
  },
});

var result = md.render("[Example](https://example.com");

result; // <a href="https://example.com" target="_blank" rel="noopener">Example</a>
```
