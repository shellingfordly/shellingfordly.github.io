---
title: Three.js学习 - 创建立方体
date: 2021-12-10 14:24:00
tags:
  - three.js
---

# Three.js - 创建立方体

- [Three.js 零基础入门教程(郭隆邦)](http://www.yanhuangxueyuan.com/Three.js/)
- [Three.js 中文文档](http://www.yanhuangxueyuan.com/threejs/docs/index.html)

## First Scene

### 几何体 Geometry

- THREE.BoxGeometry(宽, 高, 长) 立方体
- THREE.SphereGeometry(半径, number, number) 球体

```js
var geometry = new THREE.BoxGeometry(100, 100, 100);
var geometry = new THREE.SphereGeometry(60, 40, 40);
```

![image.png](/images/blog/three_1.webp)

### 材料 Material

对立方体的颜色、透明度等等属性进行设置

```js
var material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
```

### 光源 Light

创建一个点光源，参数定义光照强度，光源强度变低时，物体也随之变暗淡

```js
var point = new THREE.PointLight(0xffffff);
```

### 相机 Camera

THREE.OrthographicCamera()创建一个正射投影相机对象，参数改变拍照窗口的大小。取景范围变小，物体变大，反之变小。

```js
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
```

### 整体结构

![image.png](/images/blog/three_2.webp)

### 过程

1. THREE.Scene() 创建场景对象

- new THREE.BoxGeometry 创建物体
- new THREE.MeshLambertMaterial 使用材料
- new THREE.Mesh(box,material) 创建网格，添加物体
- new THREE.PointLight(0xffffff) 创建光源
- new THREE.AmbientLight(0x444444) 创建环境光
- scene.add(mesg/point/ambient) 向场景中添加对象

2. 创造物体对象
3. THREE.OrthographicCamera() 创建相机对象
4. THREE.WebGLRenderer() 创建渲染对象
5. renderer.render(scene,camera) 投影

## 插入多个几何体

### 几何体

```js
//长方体 参数：长，宽，高
var geometry = new THREE.BoxGeometry(100, 100, 100);
// 球体 参数：半径60  经纬度细分数40,40
var geometry = new THREE.SphereGeometry(60, 40, 40);
// 圆柱  参数：圆柱面顶部、底部直径50,50   高度100  圆周分段数
var geometry = new THREE.CylinderGeometry(50, 50, 100, 25);
// 正八面体
var geometry = new THREE.OctahedronGeometry(50);
// 正十二面体
var geometry = new THREE.DodecahedronGeometry(50);
// 正二十面体
var geometry = new THREE.IcosahedronGeometry(50);
```

### 辅助三维坐标系 AxisHelper

```js
// 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
var axisHelper = new THREE.AxisHelper(250);
scene.add(axisHelper);
```

### 同时绘制多个几何体

- 代码

```js
var geometry1 = new THREE.BoxGeometry(100, 100, 100);
var material1 = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
});
var mesh1 = new THREE.Mesh(geometry1, material1);
scene.add(mesh1);
var geometry2 = new THREE.SphereGeometry(60, 40, 40);
var material2 = new THREE.MeshLambertMaterial({
  color: 0xff00ff,
});
var mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.translateX(70); //球体网格模型沿Y轴正方向平移120
scene.add(mesh2);
var geometry3 = new THREE.CylinderGeometry(50, 50, 100, 25);
var material3 = new THREE.MeshLambertMaterial({
  color: 0xffff00,
});
var mesh3 = new THREE.Mesh(geometry3, material3);
// mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
mesh3.position.set(120, 0, 0); //设置mesh3模型对象的xyz坐标为120,0,0
scene.add(mesh3);
```

- 效果

![image.png](/images/blog/three_3.webp)

## 材料

### 材料类型

- MeshBasicMaterial 基础网格材质，不受光照影响的材质
- MeshLambertMaterial Lambert 网格材质，与光照有反应，漫反射
- MeshPhongMaterial 高光 Phong 材质,与光照有反应
- MeshStandardMaterial PBR 物理材质，相比较高光 Phong 材质可以更好的模拟金属、玻璃等效果

### 材料属性

修改 THREE.MeshLambertMaterial()的参数，改变几何体的显示效果

- 线框效果

```js
var sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  wireframe: true, // 将几何图形渲染为线框
});
```

![image.png](/images/blog/three_4.webp)

- 透明效果

```js
var sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  opacity: 0.7,
  transparent: true,
});
```

![image.png](/images/blog/three_5.webp)

- 高光效果

好像没什么区别

```js
// 左边
var sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  specular: 0x4488ee,
  shininess: 12,
});

// 右边
var sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  specular: 0x4488ee,
  shininess: 12,
});
```

![image.png](/images/blog/three_6.webp)

把 shininess 改成-100 稍微明显一点了

![image.png](/images/blog/three_7.webp)

## 光源

没有光源时所有的物体都是黑色，上面所有的示例都是在有光源的情况下展示出来的

### 类型

- AmbientLight 环境光
- PointLight 点光源
- DirectionalLight 平行光，比如太阳光
- SpotLight 聚光源

> 注意： MeshBasicMaterial 基础材料是不会反光的，因此注意切换材料，否则是没有效果的

#### 环境光

环境光只是设置了整个空间的敏感效果，设置了环境光之后能够看清物体的颜色，但无法看清物体的棱角，没有很好的立体效果

```js
var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);
```

![image.png](/images/blog/three_8.webp)

#### 点光源

设置了点光源之后物体就立体起来了，当把点光源的位置设置为(0,0,0)时是无效的，因为光源在物体内部无法照射到物体表面

```js
//点光源
var point = new THREE.PointLight(0xffffff);
point.position.set(400, 200, 300);
scene.add(point);
```

![image.png](/images/blog/three_9.png)

而当打开了鼠标控制，调整到物体的背面时，又是暗的，原因是点光源无法照射到另一面，设置相对位置的点光源则可照亮整个物体

```js
var point = new THREE.PointLight(0xffffff);
point.position.set(-400, -200, -300);
scene.add(point);
```

![image.png](/images/blog/three_10.png)
