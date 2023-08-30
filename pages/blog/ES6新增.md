---
title: ES6新增语法
date: 2019-10-03 23:17:26
tags:
  - js
  - es6
---

# ES6新增语法

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
ES6，全称ECMAScript6.0，是JavaScript的版本标准。
ES6主要是为了解决ES5的先天不足，比如JavaScript里并没有类的概念。
</span>

<!-- more -->

## 变量声明

### 声明方式

#### es5

- ver
- function

#### es6

- var
- function
- let
- const
- class
- import

#### 区别

- var
  - 会变量提升, 当在赋值前访问变量时返回undefined
  - 全局下声明时变量会挂载到顶层对象window上, 污染环境
  - 允许同名变量声明, 后面的会覆盖前面的

```js
console.log(a); // undefined
var a = 1;
console.log(window.a); // 1
var a = 2;
console.log(a); // 2
```

- let const class import

  - 没有变量提升, 提前访问报错 --- 暂时性死区
  - 不会挂载到window上污染环境
  - 同一个作用域中不允许同名声明

- 暂时性死区
  在作用域到let声明前都是暂时性死区

### 作用域

- 全局作用域
- 函数作用域
- 块作用域

在es6中, 每一个"{}"都是一个作用域, 外面访问不到里面的变量, 如 if中 for中 都回形成一个块作用域

```js
for (let i = 0; i < 3; i++) {
  aLi[i].onclick = function () {
    // 每一个 i 存在于自己的作用域中
    // 不会像 var 一样所有的 i 都为3, 需要通过为aLi元素绑定属性的方法来获取到 i 的值
    console.log(i); // 0 1 2
  };
}
```

- 形参的顺序

```js
function(x=y, y=2 ){}
// 报错, y is not defined
// y需要在x前声明
```

### 常量

- 声明时必须赋值
- 且不允许二次赋值
- 应用型变量, 对其添加元素则可以
  - 可以理解为指向不变, 只改变了其内容

```js
const arr = [];
arr.push("1");
```

### 解构模式

- 模式匹配 --- 相同结构模式对应赋值

```js
let [a, b, c, d] = [1, 2, 3, 4];
// abcd分别为1234
let [a, b, c, d] = [1, 2];
// cd为undefined
let obj = {
  a: 1,
  b: 2,
};
let { a, b } = obj;
// 匹配同名属性, 匹配不到为undefined
// a为1 b为2
```

- 默认值

```js
let [a = "默认值"] = [];
// 没有匹配到值时,(即undefined), a为"默认值"
let [a = "默认值"] = ["新值"];
// 有东西可以匹配时, 取新赋予的值, a为"新值"
```

### 展开运算符 ...

- 把数组展开
- 把类数组变成数组

```js
let [a, b] = [1, 2, 3, 4, 5];
// a为1, b为数组[2,3,4,5]
```

- 不定参
  当不知道数据的长度时

```js
// 当不知道传给fn的数据的长度时
function fn(...arr) {
  // 得到一个arr数组
}
fn(1, 2, "3", [4, 5], { a: 7 });
```

- 交换值

```js
let a = 1,
  b = 2;
[a, b] = [b, a];
// a为 2, b为 1
```

- 复制数组 -- 浅拷贝
  - 内部数据一样

```js
let a = 2;
let arr = [1, a, "xxx", { name: "Tom" }, [3, 4]];
let arr2 = [...arr];
// 改变aar2, 不会改变arr
console.log(arr[n] === arr2[n]); // 都是true
```

- 展开字符串变成一个数组

```js
[...."abcde"]
```

## 方法

### 字符串方法

#### str1.includes(str2)

在str1中查找str2, 有返回true, 没有返回false

#### str1.startsWith(str2)

检查str2是否为str1的开头部分, 是返回true, 不是返回false

#### str1.endsWith(str2)

检查str2是否为str1的结尾部分, 是返回true, 不是返回false

#### str.repeat(n)

返回一个新字符串, 其内容为重复str字符串n次

#### str1.padStart(num,str2)

返回一个新字符串, 其内容为向str1前面补(num-str1.length)个str2, 使其长度为num

- num小于str1时, 返回str1原字符串
- str2项可以不要, 默认补空格

#### str1.padEnd(num,str2)

返回一个新字符串, 其内容为向str1后面补(num-str1.length)个str2, 使其长度为num

### 字符串模板 ``

- 可以换行
- 引用变量${}

```js
let name = "Tom";
console.log(`我是${name}`); //打印我是Tom
```

- 另类调用函数

```js
console.log`嘿嘿嘿`; // 打印一个数组, 第一项为嘿嘿嘿字符串
```

### 数字方法

#### Number.isFinite(xxx)

检测xxx是否为一个有限的数值

- 没有隐式类型转换
- xxx为字符串时返回false

#### Number.isNaN(xxx)

检测xxx是否为NaN

- 没有隐式类型转换
- xxx为字符串时返回false

#### Infinity 正无穷大

#### -Infinity 负无穷大

#### Number.parseInt(str)

从开头取str的整数部分

- 与原parseInt(str)一样
- 会进行类型转换

#### Number.parseFloat(str)

从开头取str的数字部分

#### Math.cbrt(num)

求立方根

#### Math.hypot(num1,num2)

求num1, num2的平方和的平方根, 勾股定理

#### 指数运算符 \*\*

```js
let a = 2 ** 4; // a = 16
```

### 函数

#### 默认值

- 没有默认值时, 参数是使用var声明的
- 有默认值时, 参数是使用let声明的

```js
function fn(x, y = "默认值") {}
fn("x的值"); // 不给y传值时使用默认值
```

#### 解构传值

```js
function fn({x, y=3 }){
}
fn({x=1})
fn() // 不传值报错
// 改成这样则不传值时不报错
function fn({x, y=3} = {}){
}
```

#### 箭头函数

- 本质上是一个表达式
- 没有this, this默认指向父级对象

```js
let fn = (x) => x;
// 等同于
let fn = function (x) {
  return x;
};
```

- 我发现当自执行函数放在fn()执行后面时, 会报错, fn()的执行必须在自执行函数的后面

```js
(function () {
  console.log(this); // 指向window
})();

function fn() {
  console.log(this); // 指向window
}
fn();
let obj = {
  fn1: {
    fn1: function () {
      console.log(this); // 指向fn1
    },
    fn2: () => {
      console.log(this); // 指向window
    },
  },
  fn2: function () {
    console.log(this); // 指向obj
  },
};
obj.fn1.fn1();
obj.fn1.fn2();
obj.fn2();
```

- bind/call/apply 对箭头函数无效

- 不能使用arguments, 不定参使用...

### 数组

#### Array.from(xxx)

将一个类数组转换为真的数组

#### Array.of()

创建数组

#### find()

返回第一个符合条件的值

#### findInedx()

返回第一个符合条件的值的下标, 没有返回-1

#### fill(xxx)

用xxx填充数组

#### for of

```js
let arr = ["a", "b", "c"];
for (let key of arr) {
  // key为arr的值
}
for (let key in arr) {
  // key为arr的下标
}
```

#### includes()

- 数组也可以使用

### 对象

#### 属性

- 简洁表示法

```js
let a = "123";
// es5的写法
let data = {
  a: a,
};
// es6简写
let data = {
  a,
};
```

- 属性获取以及添加

```js
let data = {};
data.a = 1;
data[b] = 2;

let fn = "objFunction";
let n = "name";
let data1 = {
  // 把objFunction做函数名
  [fn]() {},
  // 把name做键名
  [n]: shellingfordly,
};
console.log(data1.name); // shellingfordly
```

#### 函数

```js
// es5的写法
let data = {
  fn: function () {},
};
// es6简写
let data = {
  fn() {},
};
```

#### Object.is

判断是否相等

```js
NaN === NaN; // false
Object.is(NaN, NaN) + // true
  0 ===
  -0; // true
Object.is(+0, -0); // false
```

#### Object.assign(obj1, obj2, obj3)

- 把后面两个对象填充到obj1中并返回obj1对象
- 相同属性会被后者覆盖

```js
let obj1 = { a: 1 };
let obj2 = { b: 1 };
let obj3 = { c: 1 };
Object.assign(obj1, obj2, obj3); // obj1 = {a:1, b:2, c:3}
```

#### Object

都返回一个数组

- Object.keys() 键名
  - 键名数组
- Object.values() 键值
  - 键值数组
- Object.entries() 键值对
  - 键值对二维数组

#### 展开运算符...

```js
let { a, b, x } = { a: 1, b: 2, c: 3, d: 4 };
// x = {c:3, d:4}
```

### 对象拷贝

- 浅拷贝
  引用型数据拷贝时，其指向还是原来的数据

```js
let arr1 = [{ name: "xxx" }];
let arr2 = [{ age: "22" }];
let arr3 = a1.concat(a2);
a3[0].name = "yyy"; // 会改变arr1中的值
```

- 判断一个对象是否是数组

  - Array.isArray(obj); 不兼容IE9及以下
  - obj instanceof Array 判断obj是否有Array的原型
  - length && join && constructor === Array

- 深拷贝

```js
let obj1 = { a: }
function extend(obj, deep){	// deep 判断是否深拷贝，默认浅拷贝
	// 空对象，存拷贝数组；判断类型，初始化为[]或者{}
	let newObj = obj instanceof Array? [] : {};
	for(let key in obj){
		let val = obj[key];
		if(deep && typeof val === "object"){
			// 深拷贝，判断当前取到的obj[key]属性是否是一个数组或{}
			// 注：typeof 判断数组和{}时返回值都为object
			// 递归判断val中的val.....是否为数组或{}
			newObj[key] = extend(val, deep);
		}else{
			// 浅拷贝
			newObj[key] = val;
		}
	}
	return newObj;
}
// 浅拷贝
let obj2 = extend(obj1);
// 深拷贝
let obj2 = extend(obj1, true);
```

### Symbol

新的数据类型

- 避开属性名冲突
- 独一无二的值

```js
let a = Symbol(123);
let b = Symbol(123);
console.log(a === b); // false
```

- 只能将其转成字符串和布尔值

```js
let a = Symbol(123);
console.log(Boolean(a)); // true
console.log(String(a)); // 字符串"Symbol(123)"
```

- 作为对象属性名时，只能用[]，不能使用 . 操作

```js
let a = Symbol();
let obj = {
  [a]: 123, // 通过obj[a]获取
  a: "xxx", // 通过obj.a获取
};
```

- 用for in遍历时找不到Symbol创建的属性名
- 将对象中所有Symbol的属性名以数组形式返回
  - Reflect.ownKeys(obj)
  - Object.getOwnPropertySymbols(obj)
