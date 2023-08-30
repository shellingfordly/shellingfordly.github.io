---
title: HTML5的一些学习笔记
date: 2019-10-04 23:00:03
tags:
  - html
---

# HTML5的一些学习笔记

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
HTML5是HTML最新的修订版本，HTML5的设计目的是为了在移动设备上支持多媒体。

</span>

<!-- more -->

## 拖拽

### 事件

- 鼠标事件

| 属性        | 描述                                                               |
| ----------- | ------------------------------------------------------------------ |
| ondragstart | 拖拽**开始**时触发                                                 |
| ondrag      | 拖拽着时，**连续**触发                                             |
| ondragend   | 拖拽**结束**时触发                                                 |
| ondragenter | 拖拽**进入**目标元素时触发                                         |
| ondragover  | 拖拽进入目标元素内，**连续**触发；在其内部应阻止默认事件和事件冒泡 |
| ondragleave | 拖拽**离开**目标元素时触发                                         |
| ondrop      | 拖拽到目标元素内**释放**鼠标时触发                                 |

注：

- 只有将draggable属性为true时元素才能被拖拽
- 拖拽进入离开时都是以鼠标指针进入离开判定的

代码实例

```html
<div id="div1"></div>
<div id="div2" draggable="true"></div>
<script type="text/javascript">
  let i = 0,
    j = 0;
  // 开始拖拽时
  div2.ondragstart = function () {
    this.style.background = "springgreen";
  };
  // 拖拽结束时
  div2.ondragend = function () {
    this.style.background = "turquoise";
  };
  // 拖拽着连续触发
  div2.ondrag = function () {
    this.innerHTML = i++;
  };
  // 进入div1时
  div1.ondragenter = function () {
    this.style.background = "springgreen";
  };
  // 离开div1时
  div1.ondragleave = function () {
    this.style.background = "pink";
  };
  // 在div1中时连续触发
  div1.ondragover = function () {
    this.innerHTML = j++;
  };
  // 没有触发
  div1.ondrop = function () {
    this.style.background = "turquoise";
  };
</script>
```

- 问题：ondrop事件没有触发

解决：ondrop想要生效，必须在ondragover中阻止默认事件

```js
div1.ondragover = function (e) {
  // 阻止默认事件后ondrop生效
  e.preventDefault();
  e.stopPropagation();
};
```

### 火狐浏览器兼容(疑惑)

- dataTransfer

```html
<div id="div"></div>
<ul id="ul">
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</ul>
<script type="text/javascript">
  let aLi = ul.querySelectorAll("li");
  aLi.forEach((item, index) => {
    item.setAttribute("draggable", "true");
    item.ondragstart = function (e) {
      // 设置当前拖拽元素索引
      e.dataTransfer.setData("key", index);
    };
  });
</script>
```

- 挂载图标
  - 拖拽元素时，鼠标显示拖拽的元素为此图片
  - 隐藏img标签
    - display为none，火狐可用；谷歌不行，使用后元素无法拖拽
    - 一般将img标签定位到十万八千里之外

```html
<img id="oImg" />
<script>
  item.ondragstart = function (e) {
    // 后两位数据表示定位
    e.dataTransfer.setDragImage(oImg, 20, 20);
  };

  div.ondrop = function (e) {
    // 获取当前拖拽的元素的索引
    let i = e.dataTransfer.getData("key");
    ul.removeChild(aLi[i]);
  };
</script>
```

### 文件操作

- 阻止默认事件

```html
<div id="box"></div>
<script type="text/javascript">
  box.ondragover = function (e) {
    // 阻止默认事件后ondrop生效
    e.preventDefault();
    e.stopPropagation();
  };
  box.ondrop = function () {
    // ondrop中也要阻止默认事件, 否则浏览器默认浏览图片
    e.preventDefault();
    e.stopPropagation();
  };
</script>
```

- 图片信息 dataTransfer.files 列表

  - files[i].name 图片名称
  - files[i].type 图片(相对)路径
  - files[i].size 图片大小
  - files[i].lastModified 图片时间
  - files[i].lastModifiedData 图片最后修改时间

- 获取图片并预览

```js
// 一个拖拽元素的信息
let oFile = e.dataTransfer.files[i];
// 创建文件读取对象
let file = new FileReader();
// 分析文件
file.readAsDataURL(oFile);
file.onload = function () {
  // 判断读取元素是否是图片
  if (/image/.test(this.result)) {
    // this.result图片路径
    let img = new Image();
    img.src = this.result;
    img.onload = function () {
      // 添加到box中显示
      box.appendChild(img);
    };
  }
};
```
