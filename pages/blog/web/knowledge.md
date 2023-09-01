---
title: 一些零碎的知识点
date: 2021-11-25 10:21:25
tags:
  - web
  - js
  - css
---

# 一些零碎的知识点

## CSS

### 复合图层以及硬件加速

#### 硬件加速

网页中绘制 3D 图形是使用 webgl 的 api（基于 gpu 的 api 开源库 opengl 实现），为了让 3D 动效的性能更好，可以使用 css 的一些属性开启 gpu 渲染，也就是硬件加速，当然，这会耗费一些内存。

浏览器在处理 transform、opacity、filter、will-change 时会使用 gpu 渲染。浏览器会把内容分到不同的图层进行分别渲染，最后合并到一起，触发 gpu 渲染硬件加速需要新建图层，把元素移动到新图层是个耗时的操作，界面可能会闪一下，所有可以提前告诉浏览器一开始就把元素放到新的图层，方便后面直接用 gpu 渲染。

- 手动开启 gpu 渲染
  - 打开浏览器调试，蓝色框的元素是 cpu 渲染的，黄色框的元素是 gpu 渲染的
  - transform、opacity、filter 会默认开启 gpu 渲染

```css
 {
  /* 1 */
  will-change: transform;
  will-change: opacity;
  will-change: filter;
  /* 2 */
  transform: translate3d(0, 0, 0);
}
```

在 Chrome、FireFox、Safari、IE9+和最新的 Opera 都支持硬件加速，当使用到 transform、opacity、filter、will-change 这些 css 规则时就会开启，比如下面的 css 就会默认开启硬件加速。

```css
 {
  transform: translate3d(10px, 10px, 10px);
  transform: rotate3d(1, 1, 1, 45deg);
  transform: scale3d(0.5, 0.5, 0.5);
}
```

- 但有时可能我们不需要对元素应用 3D 变化的效果，此时可以借助 transform 欺骗浏览器开启硬件加速

```css
 {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}
```

- 解决使用 transform/animations 时页面闪烁

```css
 {
  backface-visibility: hidden;
  perspective: 1000;
}
```

- webkit 内核浏览器，有另一个方法

```css
 {
  transform: translate3d(0, 0, 0);
}
```

- 需要注意
  - 太多元素使用 css3 硬件加速会导致内存占用过大，有性能上的问题
  - 由于 GPU 和 CPU 的算法不同，GPU 渲染字体会导致抗锯齿无效，如果不在动画结束后关闭硬件加速，会产生字体模糊

### css 预加载

### 布局方式

### 定位

- 绝对定位
- 相对定位

### em/rem/px/rpx/vh/vw

### flex/grid

### 1px 问题

## JS

### promise

#### promise 原理

promise 的实现原理就是使用回调函数，当调用 then 方法时，将回调函数收集在 promise 内部，执行 resovle 时去依次执行收集的回调数组

#### promise 实现

```js
class Promise {
  callbacks = [];
  state = "pending"; //增加状态
  value = null; //保存结果
  constructor(fn) {
    fn(this._resolve.bind(this));
  }
  then(onFulfilled) {
    if (this.state === "pending") {
      //在resolve之前，跟之前逻辑一样，添加到callbacks中
      this.callbacks.push(onFulfilled);
    } else {
      //在resolve之后，直接执行回调，返回结果了
      onFulfilled(this.value);
    }
    return this;
  }
  _resolve(value) {
    this.state = "fulfilled"; //改变状态
    this.value = value; //保存结果
    this.callbacks.forEach((fn) => fn(value));
  }
}
```

#### promise all 实现

1. 作用

- 需要请求多个 api 并且有执行顺序时，因为 promise.all 返回的结果和传入的的顺序是一致的
- 提高请求速度

2. 实现
   首先，promise.all 接受一个 promise 数组，定义一个变量存储 promise 数组的长度，然后返回一个 promise，在这个 promise 中循环 promise 数组调用其 then 方法，如果抛错则直接执行返回 promise 的 reject 回调。
   反之定一个数组收集到所有的 resolve，记录成功返回数，当 count 等于接受的 promise 数组时调用 resolve 返回结果数组

#### 执行顺序

[promise 执行顺序](https://www.jianshu.com/p/910e22a3ba18)

### setTimeout

- 最短时间间隔不得低于 4ms，老版本为 10ms
- 对于 dom 变动，重新渲染的部分通常不会立即执行，每 16ms 执行一次
- requestAnimationFrame 的效果好于 setTimeout

- setTimeout 只是将事件插入了“任务队列“，必须等到当前代码（执行栈内部的同步代码）的执行结束，主线程才会去执行它的回调函数，因此如果当前代码执行时间很长，setTimeout 的回调函数就得继续等待，所以是无法保证准时执行的

### event loop

- 事件循环
  首先是脚本，然后是微任务，渲染等

![](/images/blog/event-loop.png)

- 每个宏任务之后，引擎会立即执行微任务队列中的所有任务，然后再执行其他的宏任务，或渲染，或进行其他任何操作

- 微任务会在执行任何其他事件处理，或渲染，或执行任何其他宏任务之前完成

首先会执行栈中的代码，同步任务，就是全局的同步代码，其他的点击事件，以及 ajax 请求、setTimeout 等等异步任务将会进入任务队列中等待，当执行栈的任务执行完毕之后，会从任务队列中按照先进先出的原则执行。当一个宏任务执行完毕之后，会清空所有的微任务，然后再读取下一个宏任务，反复如此。

- 点击事件会先被加入任务队列？异步任务在其后？
- 异步队列存放宏任务和微任务吗？
- 微任务是有别的队列吗？
- 只有同步任务和异步任务，异步任务是指不进入主线程，而进入任务队列的任务，那异步的宏任务和微任务在队列中怎么排列的？以怎样顺序加入任务队列的？

js 是一个单线程的，异步和多线程的实现是通过 event loop 事件循环机制来实现的。首先是从全局的同步代码一行一行的压入执行栈中执行，当遇到 setTimeout 等属于宏任务的异步代码时，将其添加到消息队列（Message Queue）中；当遇到 promise 等微任务的异步代码时，将其添加到微任务队列（Microtask Queue）中；执行完执行栈中的同步代码之后，会先清空 Microtask Queue 内的代码，然后再从 Message Queue 中读取一个事件执行

#### 宏任务

- setInterval
- setTimeout

#### 微任务

- new Promise
- new MutaionObserver

### 函数柯里化

### 防抖

- 函数防抖

  - 就是指触发事件后，在 n 秒后只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数的执行时间
  - 简单点说就是在一段时间内只执行最后一次
    - 🌰 坐公交，司机需要等最后一个人进入才能关门。每次进入一个人，司机就会多等待几秒再关门
  - 解决某些频繁执行的事件，比如点击事件，滚动事件等等

- 应用场景
  - 搜索框搜索输入，只需要用户最后一次输入完再发送请求
  - 手机号、邮箱格式的输入验证检测
  - 窗口大小的 resize ，只需窗口调整完成后，计算窗口的大小，防止重复渲染

```js
function debounce(callback, delay) {
  let timer = null;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(callback, delay);
  };
}
```

```js
/**
 * 优化代码
 *    1. 修改通过debounce处理后的函数的this指向为调用时所处的环境的this
 *    2. 传递参数
 */
function debounce(callback, delay) {
  let timer = null;
  // 修改为function声明形式，否则this指向debounce内部this
  return function () {
    // 保存实际调用返回函数时传递的参数
    const arg = arguments;
    // 保存this
    const _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    // 使用apply改变this指向为 callback 实际调用的环境，传递参数
    timer = setTimeout(() => callback.apply(_this, arg), delay);
  };
}

// 使用
const fn = debounce(function (xx) {
  console.log(xx, this);
}, 1000);
btn.onclick = function () {
  // 需要使用call改变this指向，否则此时是在window下直接调用的
  fn.call(this, "xxx");
};
```

- 优化
  - 由于箭头函数没有 this 和 arguments，因此可以简略一些代码

```js
function debounce(callback, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(this, arguments);
    }, delay);
  };
}
```

### 节流

- 函数节流

  - 限制一个函数在一定时间内只能执行一次
    - 🌰 过地铁/火车闸机时，每个人进入后 3 秒后门关闭，等待下一个人进入

- 应用场景
  - 滚动加载，加载更多或滚动到底部监听
  - 谷歌搜索框，搜索联想功能
  - 高频点击提交，表单重复提交
  - 省市信息对应字母快速选择

```js
function throttle(callback, delay) {
  let timer = timer;

  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      callback();
      timer = null;
    }, delay);
  };
}
```

```js
// 优化this指向和传参

function throttle(callback, delay) {
  let timer = timer;

  return function () {
    const args = arguments;
    const _this = this;
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      callback.apply(this, args);
      timer = null;
    }, delay);
  };
}
```

### 防抖和节流对比

- 共同点
  - 都是一段时间内只执行一次函数
- 不同点
  - 防抖在一段时间内只执行最后一次，一但此事件被连续执行，会清除之前开启的定时器，重新开启新的定时器
  - 节流在一段时间内只执行第一次，当事件被连续执行时，只有第一次进入函数是会开启定时器，之后一段时间内判断定时器已开启，就会直接 return，直到第一次执行完毕，清除了定时器 id 才会重新执行
  - 因此，防抖和节流的效果对比，当连续点击 btn 执行函数时，防抖是只有在停止点击之后一段时间之后执行函数；而节流在连续点击时是以设置的 delay 时间为间隔，连续执行函数，停止点击后执行完最后一段时间内的一次函数则不在执行

### 深拷贝/浅拷贝

#### 浅拷贝

- =
- {...object}
- Object.assign(target, ...sources)

#### 深拷贝

- 代码最少，性能最差，有缺陷
  - 只有能正确处理 Number, String, Boolean, Array, 扁平对象，RegExp 对象无法拷贝（拷贝成空对象{}），function 也不行，直接拷贝不了这个属性

```js
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
```

- 简洁版，for in 性能略差

```js
function deepCopy(obj) {
  const newObj = Array.isArray(obj) ? [] : {};
  if (typeof obj !== "object") {
    return obj;
  }
  for (let key in obj) {
    newObj[key] = deepCopy(obj[key]);
  }
  return newObj;
}
```

### call/apply

- call 和 apply

### 实现 setInterval

```js
function mySetInterval(callback, delay) {
  setTimeout(() => {
    callback();
    mySetInterval(callback, delay);
  }, delay);
}
```

### 原型链

- instanceof 怎么判断类型的

#### prototype

- 属性为什么要挂载在原型链上

### 继承

- 有哪些继承方式
- 为什么舍弃原来的继承方式
- es5 实现继承
- prototype 继承的缺陷

#### 继承方式

```js
// 父类
function Person(name) {
  this.name = name;
  this.say = function () {
    console.log("I am " + name);
  };
}
Person.prototype.age = "10";
```

1. 原型链继承

- 优点
  - 继承属性：父类的私有属性，父类的原型属性
- 缺点
  - 无法向父类的构造函数传参
  - 继承单一
  - 不管是父类的实例私有属性还是原型上的公有属性统统被设置成了子类原型上的公有熟悉
  - 所有实例共享父类实例的属性，因为子类 Per 的原型上的属性是子类实例共享的，一个实例修改了原型上的属性，所有实例继承的这个属性都被修改了

```js
function Per() {
  this.name = "per";
}
Per.prototype = new Person();
const p = new Per("tom");
```

- 此种继承方法会导致子类直接修改到父类的公有属性

```js
Per.prototype = Person.prototype;
```

2. 使用构造函数继承

- 优点
  - 可以在子类中向父类传参
  - 解决了原型链继承的缺点：无法传参、继承单一，属性共有问题
- 缺点
  - 只继承了构造函数 Person 的私有属性，无法继承 Person 原型 prototype 的公有属性
  - 每次都要重新调用，无法实现构造函数的复用
  - 每个子实例都相当于去拷贝一份父类 Person 的副本，比较臃肿

```js
function PerCall() {
  // 使用call传递PerCall创建的实例给Person，相当于去做了一遍this.xxxx的赋值操作，拷贝了一份Person实例的属性
  Person.call(this, "percall");
}
```

3. 组合继承

- 优点
  - 可以传参、可复用
  - 父类的私有属性在子类中还是私有属性
- 缺点
  - 调用了两次父类 Person 的构造函数
  - Person.call 已经设置过的私有属性，在 prototype 上又被 new 父类的实例再次挂载到了子类的原型上

```js
function PerAll(name) {
  Person.call(this, name);
}
PerAll.prototype = new Person();
```

- 解决组合式继承原型上多一份父类 Person 的私有属性问题

```js
function Fn() {}
Fn.prototype = Person.prototype;
PerAll.prototype = new Fn();
```

4. 原型式继承

- 特点
  - 所有实例都会继承原型链上的属性
  - Object.create()的原理
- 缺点
  - 无法实现复用

```js
function Extends(obj) {
  function Fn() {}
  Fn.prototype = obj;
  return new Fn();
}
const p = new Person();
const p4 = Extends(p);
```

5.

### super

### 基础知识

#### 字符串方法

- slice(start, end) 切割字符串，不包含 end
- substr(start, end) 切割字符串，包含 end

### 迭代器

### async/await

- 它是什么的语法塘

## ts

### keyof

### typeof

## 设计模式

### ES Module

- ES6 Module 特点
  - 只能作为模块顶层的语句出现
  - import 的模块名只能是字符串常量
  - import binding 是 immutable 的

### CommonJS

### 导入导出方式

## 浏览器

### 思考

- 浏览器解析完 dom 树之后做什么
- 浏览器将 html 展示到页面做了什么
- 回流和重绘
  - 什么样的情况下触发回流
  - 什么样的情况下触发重绘

### 浏览器渲染过程

1. 解析 HTML，生成 DOM 树，解析 CSS，生成 CSSOM 树
2. 将 DOM 树和 CSSOM 树结合，生成渲染树（render tree）
3. reflow（回流）：根据生成的渲染树，进行回流，得到节点的几何信息（位置、大小）
4. painting（重绘）： 根据渲染树以及回流的到的几何信息，得到节点的绝对像素
5. display：将像素发送给 GPU，展示在页面上（比如 GPU 将多个合成层合并成同一层）

#### 构建渲染树

1. 从 DOM 树的根节点开始遍历每个可见节点
2. 对每个可见节点，找到 CSSOM 树种对应规则，并应用
3. 根据每个可见节点以及对应的样式，组成渲染树

- 非可见节点
  - script、meta、link
  - display: none 隐藏的节点
- 可见节点
  - visibility/opacity 隐藏的节点还是会显示到渲染树上
- 渲染树只有可见节点

- 问题
  - 那么非可见节点如何挂载到渲染树上
  - 添加/删除元素，以及元素的 display 显隐是怎么处理渲染树的，有什么区别

### 回流和重绘

#### 回流

- 当 render tree 的一部分因为元素的规模尺寸、布局、隐藏等改变时需要重新构建，这就是回流
- 每个页面至少需要一次回流，在页面第一次加载的时候，一定会发生回流，因为要构建 render tree
  - render tree 是 dom tree 和 css tree 组合构建而成
- 在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树
- 完成回流后，浏览器会重新绘制受影响的部分到页面上，此过程为重回

- 引起回流的因素
  - 添加删除可见 dom
  - 元素位置改变
  - 元素尺寸改变（边框、边距、填充、宽度、高度）
  - 内容发生变化，
    - 文本变化
    - 图片被不同尺寸的图片替换
    - input 框输入文字
    - css3 动画
  - 激活 CSS 伪类，比如 hover
  - 操作 class 属性
  - 计算 offset 等等属性
  - 设置 style 属性值
  - 页面一开始渲染时
  - 浏览器窗口尺寸变化（因为回流是根据视口大小来计算元素位置和大小的）
  - 改变字体
  - 增加或者移除样式表

#### 重绘

- 通过构建渲染树和回流阶段，得到了可见节点的样式和具体几何信息（位置、大小），把渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫重绘节点

- 当 render tree 中的一些元素需要更新属性，比如影响元素外观、风格此类不会影响布局的属性，浏览器会重新绘制这个元素，这个过程就是重绘

#### 区别

- 回流必会引起重绘，而重绘不一定会引起回流
  - 比如颜色改变等等
- 当页面布局和几何属性改变时就需要回流
  - 比如操作 dom、改变位置等等
- 而重绘是视觉效果变化引起
  - 比如修改 color、background

#### 浏览器优化机制

根据改变的范围和程度，渲染树中或大或小的部分需要重新计算，有些改变会触发整个页面的重排，比如出现滚动条和修改根节点

每次重排都会造成额外的计算消耗，浏览器会通过队列化修改并批量执行来优化重排过程。将修改操作放入队列里，直到过了一段时间或操作达到了一个阈值，再清空队列。

- 当获取布局信息时会强制队列刷新
- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeigh
- clientTop、clientLeft、clientWidth、clientHeight
- getComputedStyle()
- getBoundingClientRect

#### 减少重绘和重排

- 由于重绘和重排代价比较高，所以最好减少其发生的次数，可以通过合并多次对 DOM 的样式修改，一次性处理掉
  - 使用 cssText
  - 通过修改 css 的 class 来改变元素样式
- 批量修改 DOM
  - 使元素脱离文档流，对其进行多次操作，再将元素带回文档
- 脱离文档流
  - 隐藏元素 --> 应用修改 --> 重新显示
  - 使用文档片段（document fragment）构建一个子树，再把它拷贝回文档
  - 将原始元素拷贝到一个脱离文档的节点中，修改完再替换原始元素
- 避免 table 布局

```js
// 隐藏元素进行修改
ul.style.display = "none";
handleUlAction(ul, data);
ul.style.display = "block";

// 文档片段修改
const fragment = document.createDocumentFragment();
appendDataToElement(fragment, data);
ul.appendChild(fragment);

// 拷贝修改
const clone = ul.cloneNode(true);
appendDataToElement(clone, data);
ul.parentNode.replaceChild(clone, ul);
```

#### 问题

1. 添加删除不可见（display: none）元素会不会引起回流？

- 自我感觉是不会的，因为 display 的元素不是可见元素，不会在被挂在渲染树上，因为删除/添加都不会引起渲染树的变化，不会引起回流。而显示隐藏元素只会触发重绘，不会触发回流，因此不管怎么操作不可见元素都不会引起回流重绘，只有在显示的时候、或者隐藏的时候触发重绘。

2. 滚动条会触发回流吗

- 如果使用了 fixed 定位的元素，其 dom 是相对于浏览器的窗口进行定位的，没滚动一点，元素就会重新计算定位高度位置，导致触发回流。fixed 定位只会对自身元素进行渲染，不会影响身边的 DOM

3. 修改根节点会触发回流重绘吗

- 从上述资料来看，修改根节点会触发回流重绘这个问题不够严谨，看修改的是什么属性导致可能触发回流，也可能只触发重绘

## HTTP

### 请求头

### 状态码

### http 缓存

- 强缓存协商缓存

## ajax

### axios

### fetch

### axios 对比 fetch

## VUE

### 生命周期

- 每个生命周期做了什么

### 发布订阅模式

### 观察者模式

- 什么是观察者模式

### VUE2

- 一个组件从编译到渲染的过程

### nextTick

- 实现原理

### VUE3

- 新特性
- setup 语法塘

### VUE2/VUE3 对比

### MVVM

### MVM

### SPA/MPA

## React

## 优化

- 性能优化
- 响应优化
- 首屏优化
- seo
- cdn 网络加速
- 前端页面优化
- 数据优化
- 百万级数据的表格

## 打包

### webpack

- 从入口到出口这个过程做了什么
- gzip

#### 关于 webpack

- webpack 是一个模块打包工具，使用 webpack 管理模块依赖，编译输出所需要的静态文件，能够很好的管理、打包 web 开发中所用到的 html、css、js 等各种静态文件，提高开发效率
- webpack 的两大特色：代码分割和模块处理
- webpack 是基于入口的，它会自动地递归解析入口所需要加载的所有资源文件，然后用不同的 loader 来处理不同的文件，用 plugin 来扩展 webpack 的功能。
- 所有的资源都当作单个模块处理，更够更好的实现热更新，代码拆分和热加载

1. 构建流程，从读取配置到输出文件的过程

- 打包过程
  - (1)识别入口文件
  - (2)通过逐层识别模块以来（CommonJS、AMD、ES6 的 import 都会分析）
  - (3)分析代码，转换代码，编译代码，输出代码
  - (4)最终形成打包后的代码
- 打包原理
  - (1)先逐级递归识别依赖，构建依赖图谱
  - (2)将代码转化成 AST 抽象语法树
  - (3)在 AST 阶段中去处理代码
  - (4)把 AST 抽象语法树变成浏览器可以识别的代码，输出

2. 常见的 loader/plugin

- loader
  - file-loader 把文件输出到一个文件夹中，在代码中通过相对的 url 引用输出文件
  - url-loader 在文件很小的情况下以 base64 的方式把文件内容注入代码中
  - image-loader 加载压缩图片文件
  - babel-loader 把 es6 转换成 es5
  - css-loader 加载 css，支持模块化、压缩、文件导入等特性
  - style-loader 把 css 代码注入到 js 中，通过 dom 操作去加载 css
  - eslint-loader 通过 eslint 检查 js 代码
- plugin
  - ExtractTextWebpackPlugin: 将入口中引入的 css 文件打包到独立的 css 中，而不是内嵌在 js 打包文件中
  - HtmlWebpackPlugin：依据简单的 index.html 模块，自动生成引用了打包后 js 文件的新 index.html
  - HotModuleReplacementPlugin：它允许你在修改组件代码时，自动刷新实时预览修改后的结果，注意不要在生产环境中使用 HMR

3. 常见的 plugin

- define-plugin 定义环境变量
- commons-chunk-plugin 提取公共代码

4. loader、plugin

- 使用

  - test：匹配文件
  - loader：设置处理文件的 loader 名称
  - include/exclude：手动添加处理文件和屏蔽不需要处理的文件
  - query：提供额外的设置选项

- 作用

  - loader 译为加载器，webpack 将一切文件视为模块，但是原生 webpack 只能解析 js，而 loader 就是让 webpack 拥有加载和解析非 js 文件的能力
  - plugin 译为插件，可以扩展 webpack 的功能，让 webpack 具有更多的灵活性，在 wenpack 运行的生命周期中会广播出许多时间，plugin 可以监听这些时间，在合适的时机通过 webpack 提供的 api 改变输出结果
    - 压缩打包
    - 代码优化

- 用法
  - loader 在 module.rules 中配置，类型为数组，每一项都是一个 Object，包括文件类型、加载 loader、使用参数 options
  - plugin 在 plugins 中单独配置，类型为数组，每一项都是 plugin 实例，参数通过构造函数传入

5. loader 编写思路

loader 就是把读到的源文件内容转义成新的文件内容，并且每个 loader 通过链式操作，将源文件一步步翻译成想要的结果。

编写 loader 要遵循单一原则，每个 loader 只做一种转义工作，每个 loader 拿到源文件的内容 source，可以通过返回值得方式将处理后的内容输出，也可以调用 this.callback()方法，将内容返回给 webpack。还可以通过 this.async()生成一个 callback 函数，再用这个 callback 将处理后的内容输出出去。

6. 热更新原理
   HMR(Hot Module Replacement)

- 一旦服务器资源有更新，能够及时通知客户端，从而实时的反馈到用户界面上。本质上是一个 http，通过 response 流实时推送服务器信息到客户端。链接断开后会持续出发重连。
- \_webpck_hmr: 每隔 10s 推送一条消息到服务器

- EventSource/websocket
  - eventSource 本质还是 http，仅提供服务器端到浏览器端的单向文本传输，不需要心跳链接，链接断开回持续重发链接
  - websocket 是基于 TCP 的协议，提供双向数据传输，支持二进制，需要心跳链接，断开链接不会重连
  - eventSource 更简洁轻量，websocket 支持更好，功能更强

7. 优化性能

- 压缩代码，删除多余代码(console.log)、注释、简化代码，压缩 js、css
- cdn 加速，将引起的静态资源路径换为 cdn 对应路径，使用 webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径
- 删除死代码(tree shaking)，将永远不会走到的代码删除掉，启动 webpack 时加--optimize-minimize 参数实现

8. 提高 webpack 构建速度

- 多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
- 通过 externals 配置来提取常用库
- 利用 DllPlugin 和 DllReferencePlugin 预编译资源模块，通过 DllPlugin 来对那些绝对不会修改的 npm 包进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来
- 使用 Happypack 实现多线程加速编译
- 使用 webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度，原理上是采用了多核并行压缩提升速度
- 使用 Tree-shaking 和 Scope Hoisting 来剔除多余代码

9. 配置单页面、多页面

- 单页应用是 webpack 的标准模式，直接在 entry 中指定单页应用入口即可
- 多页应用可以使用 webpack 的 AutoWebPlugin 来完成自动化的构建，前提是项目的目录结构必须遵守预设规范
  - 每个页面都有公共代码，将这些代码抽离出来，避免重复加载，比如公共 css
  - 让入口的配置足够灵活，避免添加新页面入口时需要修改构建配置

10. npm 打包需要注意的点

- 要支持 CommonJS 模块化规范
- 打包结果为 ES5 编写，如果 ES5 是转换的，最好连同 SourceMap 一同上传
- npm 包大小控制
- 不能将依赖模块一同打包，让用户自行选择安装

- 解决 fangan
  - CommonJS 模块化规范的解决方案：设置 output.libraryTarget=commonjs2 使输出的代码符合 CommonJS2 模块化规范
  - 输出 ES5 解决方案：使用 babel-loader 把 ES6 代码转换成 ES5 代码，再通过开启 devtool:'source-map'输出 SourceMap 以发布调试
  - npm 包大小控制：Babel 在把 ES6 代码转换成 ES5 时会注入一些辅助函数，最终导致每个输出的文件中都包含这段辅助函数代码，造成代码冗余，解决方法是修改.babelrc 文件，添加 transfomr-runtime 插件
  - 不能将依赖打包到 npm：使用 externals 配置项来告诉 webpack 哪些模块不需要打包
  - 对依赖资源打包：通过 css-loader 和 extract-text-webpack-plugin 来实现

11. 按需加载

- Element 和 AntDesign 中都有对应的 babel-plugin-import 插件，在.babelrc 配置中或者 babel-loader 参数中设置

```json
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

12. bundle/chunk/module

- bundle：webpack 打包出来的文件
- chunk：webpack 在进行模块依赖分析的时候，代码分割出来的代码块
- module：单个模块

13. 长缓存

浏览器在用户访问页面的时候，为了加快速度，回对用户的静态资源进行存储，但是每一次代码升级或者更新，都需要浏览器去下载新的代码，最方便和简单的更新方式就是引入新的文件名称。

在 webpack 中，可以在 output 输出的文件制定 chunkhash，并分离经常更新的代码和框架代码，通过 NameModulsPlugin 或者 HashedModulesPlugin 使再次打包文件名不变

14. entry/output

- entry 入口文件，整个依赖关系的根
  - 单入口 {entry:'./src/index.js'}
  - 多入口 {entry:{main:'./src/index.js'}}
- output 即使入口文件有多个，也只有一个输出配置
  - 单入口
    - output:{filename:'main.js',path:path.resolve('./build')}
  - 多入口 使用占位符来确保输出文件的唯一性
    - output:{filename: '[name].js', path: path.resolve('./build')}
- resolve 配置导入包的路径，设置路径别名
  - resolve:{alias : { "@" : "src/views"}

#### webpack 优化

1. 异步加载模块

- 单页面应用中首次加载代码过多会导致首屏过慢，影响用户体验。通过使用 import(_)语句来控制加载时机，webpack 内置对于 import(_)的解析，会将 import(_)中引入的模块作为一个新的入口在生成一个 chunk，当代吗执行到 import(_)语句时，会去加载 Chunk 对应生成的文件。import(\*)会返回一个 Promise 对象，为了让浏览器支持，需要事先注入 Promise polyfill

2. OccurenceOrderPlugin

为组件分配 ID，通过此插件使 webpack 可以分析和优先考虑使用最多的模块，然后为它们分配最小的 ID

3. UglifyJsPlugin

压缩代码

#### webpackde 的优点

1. webpack 是以 commonJS 的形式来书写脚本，对 AMD/CMD 的支持也很全面，方便旧项目进行代码迁移
2. 不仅是 js 能被模块化，配合 loader 可以使 css，img 等资源也模块化
3. 开发便捷，替代部分 grunt/gulp 的工作
4. 扩展性强，插件机制完善

#### webpack 的缺点

1. 缓慢的服务器启动

- 当冷启动开发服务器时，基于打包器的方式是在提供服务前去急切地抓去和构建整个应用

2. 预构建依赖的打包器是使用 nodejs 实现

3. 热更新效率低下

- 当机遇打包器启动时，编辑文件后将重新构建文件本身。显然不应该重新构建整个包，当应用体积增大时更新嘟嘟也会随之下降
- 一些打包器的开发服务器将构建内容存入内存，这样只需要在文件更改时使模块一部分失活，但 webpack 仍然需要整个重新构建并重载页面，代价很高，并且重新加载页面会消除应用当前的状态。
- 打包器支持了动态模块热重载（HMR），允许模块“热更新”自己，对页面其余部分没有影响，这大大提高了开发体验。然而实际上 HMR 的更新速度也会随着应用规模的曾长而下降

### vite

底层实现上，vite 是基于 esbuild 预构建依赖的，exbuild 是使用 go 编写，语言层面上就快了 10-100 倍

#### 原理

- 当声明一个 script 标签类型为 module 时，浏览器就会想服务器发起一个 get 请求
- 浏览器请求到了 main.js 文件，检测到内部含有 import 引入的包，会对其内部的 import 引用发起 http 请求获取模块的内容文件
- vite 会劫持浏览器的这些请求，在后端进行相应的处理，将项目中使用的文件通过简单的分析和整合，然后返回给浏览器，vite 整个过程中没有对文件进行打包编译，所以速度比 webpack 开发编译速度快很多

#### 启动方式

- webpack 先打包，然后启动开发服务器，请求服务器时直接给予打包结果
- vite 是直接启动开发服务器，请求哪个模块时在对该模块进行实时编译
  - 由于现代浏览器本身支持 ES Modult，会自动向依赖 Module 发出请求，vite 则是利用了这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是想 Webpack 那样进行打包合并
  - 由于 vite 在启动时不需要打包，不需要分析模块的依赖、不需要编译，因此启动速度非常快；也就是官方说的实现真正意义的按需家在，这种按需动态编译的方式极大的缩减了编译时间，项目越复杂，模块越多，vite 的优势越明显

#### HMR（热更新）

当改动了一个模块后，仅需要浏览器重新请求该模块即可，而 webpack 则需要把该模块的相关依赖模块全部编译一次，效率更高

#### vite 对于 webpack 缺点的优化

- webpack 缺点

  - 缓慢的服务器启动
  - 使用 nodejs 实现
  - 热更新效率低下

- vite 通过一开始将应用中的模块区分为依赖和源码两类，改进了开发服务器启动时间
- 依赖大多为纯 js 在开发时不会变动，依赖通常以某些方式（ESM）被拆分到大量小模块中
- vite 以原生的 ESM 方式服务源码，这实际上是让浏览器接管了打包程序的部分工作，vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入的代码，仅是在当前屏幕上实际使用时才会被处理
- vite 会使用 esbuild 预构件依赖，速度比 nodejs 更快
- 在 vite 中，HMR 是在原生的 ESM 上执行的，当编辑一个文件时，vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失效（大多数时候只需要模块本身），使 HMR 更新始终快速，无论应用大小
- vite 同时利用 http 头来加速整个页面的重新加载（再次让浏览器做更多的事情），源码模块的请求会根据 304 Not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-Control:max-age=31536000,immutable 进行强缓存，因此一旦被缓存，将不需要再次请求

#### vite 的缺点

1. 生态

2. prod 环境的构建，目前用的 Rollup

- 原因是 esbuild 对于 css 和代码分割不是很友好

3. 还没有被大规模使用，隐藏问题还没有被发现

### webpack/gulp/grunt

- 区别
- 各自的优势

1. webpack

- webpack 是一个模块打包器，强调前段模块化方案，侧重模块打包，把所有的资源都看成是模块，通过 loader/plugin 对资源进行处理

2. gulp

- gulp 是前端自动化构建工具，强调前端开发的工作流程，通过配置一系列的 task，第一 task 处理的事情（比如代码压缩、合并、编译、浏览器实时更新等）。然后定义这些执行顺序，来让 glup 执行这些 task，从而构建项目的整个开发流程。自动化构建工具并不能把所有的模块打包到一起，也不能构建不同模块之间的依赖关系

#### 区别

1. 作用

- gulp 是工具链，可以配合各种插件做 js、css 压缩，less 编译，而 webpack 能把各种文件打包合并成一个或多个文件，主要用于模块化方案
- gulp 侧重整个过程的控制管理，webpack 侧重模块打包，gulp 的打包功能是通过 gulp-webpack 实现的
- grunt/gulp 更加强调的是前端流程的自动化，模块化不是其核心

2. 使用

- webpack 处理的应该是各种 lint 检查，各种编译处理的代码，而各种预处理应该交给 gulp

- gulp 会使用 watcher 实时检查文件是否更新，检查到有更新则马上跑相应的构建任务，gulp 每次都只能通过通配符匹配大量的文件，而不能就单单获取修改过的文件，这种情况在大型项目中每次构建都会花不少的时间

#### 问题

1. 哪些预处理交给 gulp

### Tree-sharking

1. 概念

Tree-shaking 是指在打包中去除那些引入了但在代码中没有被用到的那些死代码，在 webpack 中 Tree-shaking 是通过 uglifySPlugin 来 Tree-shakingJS，css 需要使用 Purify-CSS

Tree-shaking 本质是消除无用代码，存在于传统的编程语言编译器中，称为 DCE（dead code elimination）。Tree-shaking 是 DCE 的一种实现，传统 DCE 在于消灭不可能执行的代码，而 Tree-shaking 更关注消除没有用到的代码。

- Dead Code

  - 代码不会被执行，不可到达
  - 代码执行的结果不会被用到
  - 代码只会影响死变量（制毒不写）

- 支持 tree-shaking 构建工具：Rollup、Webpack2、Closure compiler；实际做 Tree-shaking 的是压缩优化工具 uglify

- ES6 模块的依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这是 Tree-shaking 的基础。所谓静态分析就是不执行代码，从字面亮上对代码进行分析，ES6 之前的模块画，比如动态 require 一个模块，只有在执行后才知道引用的模块，就无法通过静态分析去做优化，这也是为什么没有直接采用 CommonJS。

2. 消除机制

- 函数消除 Tree-shaking 对函数效果较好，可能这也是 hooks 写法现在成为主流的原因之一
  - 函数的副作用相对较少，顶层函数相对来说更容易分析
- 类消除

  - rollup 之处理函数和顶层的 import/export 变量，不能把没用到的类方法消除掉
  - js 动态语言的特效使得静态分析比较困难
  - Side Effect 广泛存在
    - 类上的属性、原型链上的属性具有不确定性，静态分析无法完全分析出哪些属性可用，哪些不可用

- 在类消除方面，Closure Compiler 可以得到完美结果，但是 cc 需要约束规范，这种侵入式的规则使得难以应用到项目中，迁移成本较大

## git

## 算法

- 广度遍历
- 深度遍历
- 实际应用案例

## 项目

## 感谢

- event loop
  - [javascript.info](https://zh.javascript.info/event-loop)
- 回流重绘
  - [我不是陈纪庚](https://segmentfault.com/a/1190000017329980)
  - [你滴止痛药儿](https://www.jianshu.com/p/e081f9aa03fb)
  - [anran758](https://zhuanlan.zhihu.com/p/82378692)
- 打包构建
  - [柠檬与断章](https://www.jianshu.com/p/7ae1604216ed)
  - [echo 丶若梦](https://www.cnblogs.com/gaoht/p/11310365.html)
  - [前端大镖客\_](https://www.jianshu.com/p/825858259fd9)
  - [魔术师卡颂](https://cloud.tencent.com/developer/article/1801741)
- Tree-shaking
  - [百度外卖大前端技术团](https://juejin.cn/post/6844903544756109319)
