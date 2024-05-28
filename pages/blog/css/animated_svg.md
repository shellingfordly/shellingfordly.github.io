---
title: 动态的svg图标
date: 2024-5-28 16:32:47
tags:
  - svg
---

# 动态的svg图标

参考antfu的文章[Animated SVG Logo](https://antfu.me/posts/animated-svg-logo)


## 实现

设置一个自己的图标，导出svg格式，这里我用的文章中提到的[figma](https://www.figma.com/)

为svg加上动画即可

```vue
<template>
  <svg viewBox="0 0 247 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask
      id="mask0_634_3"
      style="mask-type: alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="247"
      height="68"
    >
      <path d="..." fill="white" />
    </mask>
    <g mask="url(#mask0_634_3)">
      <path
        class="path1"
        d="..."
        stroke="black"
        stroke-size="5"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<style scoped>
@media (prefers-reduced-motion) {
  .path1 {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}
@media print {
  .path1 {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}
@keyframes grow {
  0% {
    stroke-dashoffset: 1px;
    stroke-dasharray: 0 350px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  40% {
    stroke-dasharray: 350px 0;
  }
  85% {
    stroke-dasharray: 350px 0;
  }
  95%,
  to {
    stroke-dasharray: 0 350px;
  }
}
.path1 {
  stroke-dashoffset: 1px;
  stroke-dasharray: 350px 0;
  animation: grow 10s ease forwards infinite;
  transform-origin: center;
  stroke: #303030;
  animation-delay: 0s;
}
.dark .path1 {
  stroke: #fdfdfd;
}
</style>
```


## 效果


<div flex justify-center>
<LogoIcon w-50  />
</div>
