---
title: 在vue3-vite中配置less的全局变量
date: 2021-03-29
tags:
  - vue
  - less
---

# 在 vue3-vite 中配置 less 的全局变量

全局定义的颜色变量，只在 main.ts 内部引入 index.less 时，在组件中直接使用会报错

![vue3_less](/images/blog/vue3_less.png)

- index.less

```css
@primary-color: #1890ff;
```

- main.ts

```ts
import "./style/index.less";
```

需要在 vite.config.ts 中配置 css，便可以在组件中使用 index.less 中定义的变量了

```ts
export default {
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            "src/style/global/config.less"
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
};
```
