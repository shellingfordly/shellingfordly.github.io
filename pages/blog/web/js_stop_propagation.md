---
title: 阻止事件冒泡
date: 2021-05-28
tags:
  - js
---

## 阻止事件冒泡

普通 dom 元素阻止事件冒泡只需要调用 event.preventDefault()即可，但是 window、document、document.body 这三个元素需要将 addEventListener 的第三个参数的 passive 属性设置为 false，否则不生效.

```ts
document.body.addEventListener("scroll", listenerScroll, false);
function listenerScroll(event) {
  event.preventDefault && event.preventDefault();
  event.stopPropagation && event.stopPropagation();
}
```
