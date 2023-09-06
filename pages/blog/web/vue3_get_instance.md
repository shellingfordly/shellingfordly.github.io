---
title: vue3组件实列，上下文获取问题
date: 2021-04-16
tags:
  - vue
---

## vue3 组件实列，上下文获取问题

### getCurrentInstance

> 获取当前组件实例

```js
import { getCurrentInstance } from "vue";
const instance = getCurrentInstance();
```

### ctx

> 当前组件的上下文，只能在开发环境下使用，生产环境下的 ctx 将访问不到，ctx 中包含了组件中由 ref 和 reactive 创建的响应式数据对象，以及 proxy 下的属性

```js
const { ctx } = getCurrentInstance();
```

- 注意：在 setup 中不可以调用 getCurrentInstance().ctx 来获取组件内部数据，因为在 prod 模式会被干掉

- 原因：
  - ctx 只是为了便于在开发模式下通过控制台检查
  - 在 prod 模式是一个空对象

![vue3_get_instance](/images/blog/vue3_get_instance.png)

图片来源[掘金 春去春又来](https://juejin.cn/post/6899432348266283022)

### proxy

> 在开发环境以及生产环境下都能放到组件上下文对象（推荐）

包含属性$attrs,$data,$el,$emit,$forceUpdate,$nextTick,$options,$parent,$props,$refs,$root,$slots,\$watch

```js
const { proxy } = getCurrentInstance();
```
