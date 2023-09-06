---
title: swiper7.2.0设置autoplay自动播放不生效
date: 2021-12-14
tags:
  - swiper
---

## swiper7.2.0 设置 autoplay 自动播放不生效

新版本设置 autoplay 怎么都不生效，看了官方的 Demos 才发现需要在 SwiperCore 上使用 Autoplay 组件，包括鼠标滚动这些都需要 use 对应的组件

```vue
<script>
import SwiperCore, { Autoplay, FreeMode, Scrollbar, Mousewheel } from "swiper";
SwiperCore.use([Autoplay, FreeMode, Scrollbar, Mousewheel]);
</script>

<template>
  <swiper
    :direction="'vertical'"
    :spaceBetween="50"
    :scrollbar="true"
    :mousewheel="true"
    :autoplay="{
      delay: 1500,
      disableOnInteraction: false,
    }"
    class="mySwiper"
  />
</template>
```
