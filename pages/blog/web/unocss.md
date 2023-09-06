---
title: unocs 在 style 模块中使用原子化 css
date: 2022-07-19 17:39:00
tags:
  - unocss
---

# unocs 在 style 模块中使用原子化 css

## unocss

unocss 可以直接在 class 中写原子化 css，但有时候可能我不是很想把很多 css 的样式都堆在 tag 上，导致 tag 的 class 很长，或者 tag 属性过多。

### 配置

官方提供了插件实现在 style 中写原子化 css，[官方文档 #apply](https://github.com/unocss/unocss/blob/main/packages/transformer-directives/README.md#apply)

```ts
// vite.config.ts
import { defineConfig } from "vite";
import Unocss from "unocss/vite";
import transformerDirective from "@unocss/transformer-directives";

export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      transformers: [transformerDirective()],
    }),
  ],
});
```

`@unocss/transformer-directives`插件后允许使用`@apply`指令在 style 中写原子化 css

```vue
<template>
  <div class="container">container</div>
</template>

<style lang="less">
.container {
  @apply p-5 bg-pink c-white;
}
</style>
```
