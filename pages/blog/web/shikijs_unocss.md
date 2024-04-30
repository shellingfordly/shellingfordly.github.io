---
title: 在shiki中添加unocss提示
date: 2024-4-26 14:45:08
tags:
  - shikijs
---

# 在 shiki 中添加 unocss 提示

灵感来自我平时用 vscode 的一个插件[UoT](https://github.com/Simon-He95/unot.git)，原来的版本叫[ToUnocss](https://github.com/Simon-He95/tounocss)。

使用 `@shikijs/twoslash` 插件让 shikijs 支持 `TypeScript Twoslash`。

于是有了这个 `shiki-unocss-transformer`，给 shikijs 添加 `to unocss` 的功能。如下：

```scss unocss
.container {
  display: none;
  background: red;
}
```

```vue unocss
<style>
.container {
  display: none;
  color: red;
}
</style>

<template>
  <div style="background: red; color: red; width: 100px"></div>
</template>
```

本来想做反向的`unocss-to-css`，但是`unocss`提供的`Generator`生成 native-css 是异步，而`shikijs`的`transformer`里不支持异步操作，暂时放弃了。

[shiki-unocss-transformer github](https://github.com/shellingfordly/shiki-unocss-transformer)
