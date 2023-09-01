---
title: Three.js学习 - 物体阴影
date: 2021-12-15 10:36:00
tags:
  - three.js
---

# Three.js - 物体阴影

## 创建物体阴影

1. 添加阴影需要给地面设置接受阴影的属性 receiveShadow
2. 给几何体设置投射阴影的属性 castShadow
3. 给可投射的光源设置投射阴影属性 castShadow
4. 在 renderer 上设置阴影开启的属性 renderer.shadowMap.enabled

- 代码

```js
const scene = new THREE.Scene();
// 创建地面
const planeGeometry = new THREE.PlaneGeometry(300, 300, 30);
const planeMaterial = new THREE.MeshPhonegMaterial({
  color: 0xeeeeee,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = 0.5 * Math.PI;
// 地面接受阴影
plane.receiveShadow = true;
scene.add(plane);
// 创建几何体
const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
const boxMaterial = new THREE.MeshPhongMaterial({
  color: 0x277234,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
// 几何体投射阴影
box.castShadow = true;
box.position.y = 10;
scene.add(box);
// 创建点光源
const point = new THREE.PointLight(0xaaaaaa);
point.position.set(100, 100, 20);
// 设置点光源的投射阴影
point.castShadow = true;
scene.add(point);
// 创建环境光
const ambient = new THREE.AmbientLight(0xcccccc);
ambient.box;
scene.add(ambient);

// 创建相机
var camera = new THREE.OrthographicCamera("未设置参数");
camera.position.set(100, 100, 200);
camera.lookAt(scene.position);
// 创建renderer对象
var renderer = new THREE.WebGLRenderer();
renderer.setSize(
  window.document.body.clientWidth,
  window.document.body.clientHeight
);
renderer.setClearColor(0xb9d3ff, 1);
// 开启阴影
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
```

- 效果

![](/images/blog/threejs_shadow.png)
