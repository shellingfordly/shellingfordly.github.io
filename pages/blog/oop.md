---
title: 面向对象编程思维
date: 2019-10-03 18:15:40
tags:
  - js
---

# 面向对象编程思维

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
面向对象编程(Object Oriented Programming), 简称OOP,是一种编程思维。
</span>

<!-- more -->

## 构造函数

### 概念

- 带new关键字的函数叫做构造函数
- new执行构造函数的过程, 叫做构造函数的实例化/或者类的实例化
- 构造函数返回的对象叫做实例化/实例化对象
- 构造函数内部的this, 指向new创建的对象

### 特性

- 用new去调用一个函数时, 默认会创建一个对象并作为函数的返回值
- 在函数中的this指向创建的这个对象

```js
// 模拟构造函数
function personfn(name, age, sex){
		let obj = {}
		obj.name = name;
		obj.age = age;
		obj.sex = sex;
		console.log(this) // 指向window
(*)	obj.say = function(say){
		console.log(say)
	}
	return obj;
}

let p1 = personfn()
function Person(name, age, sex){
	// 私有对象的属性---实例对象的属性
	this.name = name;
	this.age = age;
	this.sex = sex;
	console.log(this) // 指向new创建的对象 p
}
// p自带name/sge/sex属性
let p = new Person()
```

- 构造函数的函数名一般大写

### 原型prototype

> 就是一个仓库, 存着的每个对象都共享的方法/属性

#### 定义

```js
Person.protoptye = {
  say: function (asy) {
    console.log(say);
  },
};
```

- 上面(\*)的方面定义的对象下的方法, 每个对象通过obj.say调用它时, 就会为函数(函数本质是对象)在内存开辟存储空间
- 原型上的方法/属性在内存中只会存一次, 每个对象调用时都是使用protoptye中定义的同一个方法/属性
- 对象的protoptye属性中存着定义的方法/属性
- 只有函数有protoptye属性，其他对象只有\_\_proto\_\_的属性，js是不希望我们在\_\_proto\_\_中的添加方法/属性的
- 而当我给一个构造函数的protoptye中添加方法/属性后，这个方法就能被其new的任意实例化对象所使用/访问

#### 原型链

当使用/调用某个属性/函数时，先到自己的protoptye仓库中查找，若仓库中没有；则像上级的protoptye仓库中去寻找，以此类推，直到找到Object中的protoptye仓库。

#### protoptye和\_\_proto\_\_

- \_\_proto\_\_ 原型链
  - 就是一个引用，对构造函数原型对象的引用，
  - 所有对象都有\_\_proto\_\_属性
- protoptye 原型对象
  - 原型也是一个对象
  - 简单的说，它属于构造函数下的属性
  - 比如上面的Person.protoptye
  - 只有函数有protoptye属性
- 联系：实例对象的\_\_proto\_\_**指向**生成这个实例对象的构造函数的原型(protoptye)

当一个字符串str调用其方法时，先在自己身上找；
如果没有，向str自己的\_\_proto\_\_属性下找，也就是父级的String构造函数的protoptye对象中找；
如果没有，向String的\_\_proto\_\_属性下找，也就是父级Object构造函数的protoptye对象下找；
图示
![protoptye和__proto__](/images/blog/old/oop.jpg)

### 对象包装

#### 数据类型

- 原始值数据类型---非引用型对象，在es5里除了object都属于原始值类
  - number、string、boolean、object
  - undefined、null 比较特殊，这两种对象没有原型，不能进行.操作调用父级的方法/属性
- 引用型数据类型---引用型对象

#### 临时对象

一次性对象，用完就丢

## 继承

### 全部继承

- 继承了所有的属性以及方法
- 弊端: 所有继承的属性都在子类的原型里

```js
function Father(name, age) {
  this.name = name;
  this.age = age;
}
Father.prototype.fatherfn = function () {};
let f = new Father();
function Child() {}
Child.prototype = new Father();
Child.prototype.childfn = function () {};
let c = new Child();
```

### 继承父类原型

- 通过一个中间空类实现

```js
// 父类
function Father(name, age) {
  this.name = name;
  this.age = age;
}
Father.prototype.fatherfn = function () {};
// 中介 -- 空类:  只用来辅助子类继承父类的原型
function Three() {}
Three.prototype = Father.prototype;
// 子类
function Child() {}
Child.prototype = new Three();
Child.prototype.childfn = function () {};
let c = new Child();
```

- 通过遍历父类的原型

```js
function Father(name, age) {
  this.name = name;
  this.age = age;
}
Father.prototype.fatherfn = function () {};

function Child() {}
for (let key in Father.prototype) {
  Child.prototype[key] = Father.prototype[key];
}
Child.prototype.childfn = function () {};
let c = new Child();
```

### 继承父类所有

- 继承父类的属性为自己的私有属性
- 继承父类的原型在自己的原型中

```js
function Father(obj) {
  this.name = obj.name;
  this.age = obj.age;
}
Father.prototype.fatherfn = function () {};
function Child() {
  // 执行Father函数并改变其this指向为子类创建的实例对象
  // 传入一个对象作为参数
  Father.call(this, {
    name: "childname",
    age: "childage",
  });
}
for (let key in Father.prototype) {
  Child.prototype[key] = Father.prototype[key];
}
Child.prototype.childfn = function () {};
let c = new Child();
```

## 多态

### 静态属性

- 静态属性: 只能被类/构造函数本身调用的属性, 不能被实例化对象调用
- 私有属性: 只能被这个实例化对象调用, 不能被其他实例化对象调用
- 公有属性: 能被所有实例化对象调用的属性/方法

```js
function Father(obj){
	this.name = obj.name;
	this.age = obj.age;
};
Father.onlyFatherFn(){
	console.log("我是静态属性")
};
```

### in关键字

- 检测对象上是否有此属性
- 会遍历其原型链上的属性, 性能不好

```js
function Father(obj) {
  this.name = obj.name;
  this.age = obj.age;
}
Father.prototype.fatherfn = function () {};
let obj = new Father({});
console.log(fatherfn in obj); // 结果 true
```

### hasOwnProperty

- 检测实例对象的属性是私有属性还是公有属性(继承原型上的属性)
- true表示私有, false表示公有

```js
function Father(obj) {
  this.name = obj.name;
  this.age = obj.age;
}
Father.prototype.fatherfn = function () {};
let obj = new Father({});
console.log(obj.hasOwnProperty("name")); // 结果 true
console.log(obj.hasOwnProperty("fatherfn")); // 结果 false
```

### instanceof

- 检测某个实例化对象的原型链上是否有某个类的原型
  - [也就是说某个实例化对象是否是某个类(构造函数)实例化的]

```js
function Father1(obj) {}
function Father2(obj) {}
let obj = new Father1({});
console.log(obj instanceof Father1); // 结果 true
console.log(obj instanceof Father2); // 结果 false
```

### 面向对象编程

```js
function Person(obj) {
  this.name = obj.name;
  this.age = obj.age;
  this.init();
}
Person.prototype = {
  constructor: Person,
  // 初始化函数
  init: function () {
    console.log(this);
  },
};
// 指向prototype
Person.prototype.fn();
/*
指向实例化对象
 这里的this可以获取到实例化对象的name属性
*/
new Person({});
```

### Dome

[Dome源码](https://github.com/shellingfordly/OOP-dome)
[Dome效果](https://shellingfordly.github.io/OOP-dome/)
