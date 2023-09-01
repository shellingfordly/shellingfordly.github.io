---
title: Three.js学习 - 物体材质
date: 2021-12-10 14:24:00
tags:
  - three.js
---

# Three.js - Material(物体材质)

## 材料类型

## 属性

![](/images/blog/threejs_material.png)

### side

设置物体如何显示贴图等等

- THREE.FrontSide 前面(默认)
- THREE.BackSide 后面
- THREE.DoubleSide 双面

```js
var material = new THREE.MeshBasicMaterial({
  color: 0xdd00ff,
  side: THREE.DoubleSide,
});
```

### opacity

设置物体透明度，设置 opacity 属性时需要将 transparent 值设置为 true

```js
var material = new THREE.MeshPhongMaterial({
  color: 0x220000,
  transparent: true,
  opacity: 0.4,
});
// 通过访问属性设置
material.transparent = true;
material.opacity = 0.4;
```
