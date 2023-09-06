---
title: 解决vite创建的vue3项目中按需引入vant问题
date: 2021-11-12
tags:
  - vue
  - vant
---

我是使用 vite 创建的 vue-ts 模板的项目，安装 vant 按照官方的配置 babel.config.js 组件样式并没有生效

![vue3_vant_1](/images/blog/vue3_vant_1.png)

而采用官方的手动引入样式也无法生效

```js
import "vant/lib/datetime-picker/style/less";
```

反而会直接报错

![vue3_vant_2](/images/blog/vue3_vant_2.png)

最后在 es 文件中引入样式才生效

```js
import "vant/es/datetime-picker/style";
```

最终效果

![vue3_vant_3](/images/blog/vue3_vant_3.png)
