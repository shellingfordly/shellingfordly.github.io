---
title: JavaScript学习笔记
date: 2019-10-10
tags:
  - js
---

# JavaScript 学习笔记

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
JavaScript 是属于 HTML 和 Web 的编程语言。
所有现代的 HTML 页面都使用 JavaScript。
下面是关于JavaScript学习笔记，未完善，内容较乱
</span>
<!-- more -->

## 变量的声明

### var

- 声明所有的数据类型
- 变量什么都可以存

### function

- 专门用来声明函数
- 函数是一种变量
- 也是一个特殊的对象类型

#### 有名函数

```js
function fn() {}
```

<font color='red'>注意：</font>

> 变量不一定是函数，但是函数名可以叫做变量
> 这里的 fn 可以叫 `函数fn` ，也可以叫 `变量fn`

#### 匿名函数

function (){}
直接这样写是会报错的，匿名函数必须付给某个对象（变量或者事件）

#### 函数的声明

- 函数声明

```js
function fn() {}
```

- 函数表达式

```js
var fn = function () {};
```

### 函数执行方式

#### 函数自执行

定义就执行

```js
//<1>、
(function () {
  函数内容;
})();
//<2>、
(function () {
  函数内容;
})();
//<3>、+ - ~ !
+(function () {
  函数内容;
})();
-(function () {
  函数内容;
})();
~(function () {
  函数内容;
})();
!(function () {
  函数内容;
})();
```

> 注：函数外不可访问函数内的内容

#### 被动执行

直接调用

### 函数传参

#### 对应传参

传什么类型的东西形参都接收

```js
var a;
function fn(x, y) {
  //形参
  a = x + y;
  alert(a);
}
fn(1, 1); //实参
function fn1(x, y) {
  a = x + y;
}
fn(10, 20);
alert(a); //a=30
```

#### 任意传参

- argunments -- 类数组
- argunments.length -- 参数个数
- argunments[index] -- 访问每一个

```js
var a;
function fn(a) {
  alert(a);
}
fn(1, 2, 3, 4); // a 为1
function fn1() {
  alert(arguments.length);
}
fn1(1, 2, 3, 4); // 结果为4
```

#### return

默认函数返回值：undefined

```js
function fn() {
  return undefined; //默认返回undefined
}
function fn(x, y) {
  return x + y; //不需要定义 a = x + y;
}
fn(1, 1); // 返回结果为2
```

> 注：
>
> - alert(fn()); alert 某个函数时,弹窗显示的是函数的返回值，即 return 后的内容
> - 直接写 fn(); 是调用函数
> - 函数 return 之后的内容不会执行

例 1

```js
function fn() {
  alert("ok");
  return;
}
fn(); //此时弹窗显示 ok
alert(fn()); //此时弹窗显示 ok，之后显示 undefined
```

例 2

```js
function fn() {
  alert("fn的内容");
  return function () {
    alert("return的返回值");
  };
}
// 将fn整个内容付给a，a相当于fn，换个名字而已
var a = fn;
// 将fn的返回值付给a，并且此时fn()被执行，弹'fn的内容'
// 相当于 function a(){alert('return的返回值')};
var a = fn();
// 弹'return的返回值'
a();
```

### 作用域

`作用范围，有效范围`

- 全局变量 -- 直接在 script 标签下声明的变量

- 局部变量 -- 所有的花括号都会形成单独的作用域

> `注：`在 ES5 中，for and if 的 {} 是不存在作用域的，只有函数存在作用域

#### 全局域

全局变量：直接在 script 下声明的变量(即 window 的属性)

#### 局部域

局部变量：在函数内部声明的变量，任何一个函数在执行时就会开启一个局部域

#### 作用域链

1. 内部变量会覆盖外部变量

只要内部声明了和外部一样的`变量`，函数就不会到外部去找这个变量

```js
var a = "ok";
function fn() {
  // 此时a为undefined，因为变量提升，a还没有值
  alert(a);
  var a = 123;
}
```

2. 就近原则

只要是内部声明了和外部一样的`形参`或者`变量`，那么在函数内修改和访问的都是这个`形参`、或者`变量`。

```js
var a = "ok";
function fn(a) {
  alert(a); //123
  a = "我是a";
  alert(a); //我是a
}
fn(123);
alert(a); //ok
```

### continue / break

- continue 跳出当前一层循环
- break 跳出整个循环

## 元素

### 对属性的操作

- getAttribute('属性名') 获取属性
- setAttribute('属性名','值') 修改属性
- removeAttribute('属性名') 删除属性
- hasAttribute('属性名') 判断属性是否存在
- xxx.classList
- xxx.add() 加类名
- xxx.remove() 移除类名
- xxx.toggle() 切换类名（有则删，无则加）
- xxx.contains() 返回布尔值（有 true，无 false）

#### getComputedStyle();

- 获取元素样式
- 不兼容 IE8 及以下浏览器
- 获取：getComputedStyle().width

#### obj.currentStyle;

- IE8 及以下兼容写法
- 获取：obj.currentStyle.width

### 代码解析

#### 预解析

> 先去找带 `var 等关键词` ，`变量声明`以及`函数声明`，然后将他们存在一个仓库中，会给每个变量都赋 undefined，所以当在变量赋值前查看变量时都等于 undefined

```js
var a = undefined; // 变量提升
function fn() {} // 函数提升
// 同名函数会被后面的覆盖
```

#### 解析

#### 编译

隐式过程：传参（在编译最后，执行之前执行，也可以理解为优先级更高）

执行顺序

```js
var num = 5;
(function fn(num) {
  alert(num); //5
  var num = 10;
  alert(num); //10
})(num);
```

```js
var num = 5;
(function fn(num) {
  alert(num); //5
  var num;
  alert(num); //5
})(num);
```

### 闭包

1. 当函数执行完毕后，就把解析那个所谓的仓库直接丢掉，`释放内存`
2. 而如果`fn()函数`带有 return 的话，return 的内容会被返回给 fn()；return 的内容（变量/函数）不会被丢掉，而是保存下来，而没有 return 的函数 fn()中的内容会被丢掉
3. 所以，当定义一个变量 f 去接收带有 return 的函数 fn() 时，执行变量函数 f() 时，会将 return 后面的函数内容执行

```js
function fn() {
  alert("fn函数返回值");
  return function () {
    alert("return返回值");
  };
}
var f = fn();
alert(f());
/*
弹窗结构：
    fn函数返回值
    return返回值
    undefined
原因：
    var f = fn(); 执行了fn
    alert(f()); 执行f，f相当于function f(){alert("return返回值");}
    alert(f()); f函数没有返回值，默认返回undefined
*/
```

> `注意：` fn()执行完毕之后虽说将`解析的那个仓库`丢掉了，但是只是将`内存中执行的函数内容释放了`，函数 fn 依然存在的,后面依然可以调用；而 return 会使的 fn() 函数的内容/声明的变量保存下来，即 return 内部函数使用的外部函数变量会被保存下来，不会被 js 的垃圾回收机制给回收掉

### 定时器

#### 回调函数

函数 a 作为参数传入函数 b，由函数 b 执行函数 a，那么函数 a 就叫做回调函数。

#### setTimeout();

- 只执行一次
- 启动定时器
  - 参数 1：处理函数/回调函数
  - 参数 2：时间间隔

```js
function fn(){}
setTimeout(fn,1000); 1秒之后执行fn
```

#### setTnterval();

循环执行

#### 清除定时器

> 参数为序号

- clearTimeout();
- clearInterval();

```js
var timer1 = setInterval(function (){
    console.log();
}，10000)
```

> `浏览器的最低频率一般是 13 - 20 之间`

### 获取样式

1. 普通的 `.style.height` ,获取到的是行内样式（如果没有行内样式就获取不到）

```js
var oDiv = document.getElementById("div");
alert(oDiv.style.height); //获取到的是行内样式
```

2. 函数 `getComputedStyle()` ，获取到的是 div 最终的样式（不管样式写在哪，获取 div 的最终呈现的样式）

```js
alert(getComputedStyle(oDiv).height);
```

3. 兼容 IE
   IE8 以下不认识 getComputedStyle 函数

```js
var h；
if( window.getComputedStyle ){
    h = getComputedStyle(oDiv).height;
}else{
    h = oDiv.currentStyle.height;
}
```

`注:`

- 不要获取没有定义的样式
- 不要获取复合样式

### 封装

例：用函数封装兼容 IE8 的 getComputedStyle 函数

```js
// 获取某个对象（obj）的某个属性（attr）
function getStyle(obj,attr
attr
){
    if( window.getComputedStyle ){
        return getComputedStyle(obj).attr
attr
;
    }else{
      return obj.currentStyle.attr
;
    }
}
```

### 添加/移除属性

- 添加属性：setAttribute('','');
- 移除属性：removeAttribute('');

## 数据

### 数据类型

- number 类型 -- 数字类型
- string 类型
  - 字符串只是数据，不是类型
  - 所有带引号包裹的都是字符串
  - 字符串的类型为 string 类型
- boolean 类型 -- 布尔值`true/false`
- undefined -- 未定义，没有值，系统默认给的值
- null -- 空，空的指针对象，表示没有对象，这里不该有值
- object -- 对象

#### 引用型数据类型

- object 每 var 一个都会新建一个内存地址去存放这个 object
- 而其他的五种数据类型，属于基本数据类型，是直接比较值，只比较数据值的‘形’是否一样

#### 基本数据类型

### 字符串

#### 字符串定义

```js
var str = "helloWorld"; // 直接量
var str = new String("helloWorle");
var str = String("helloWorle");
```

- concat 字符串拼接

```js
var str1 = "OK";
var new_str = str.concat(str1);
alert(new_str); // helloWorleOK
```

#### 查找字符串

- 通过指定字符查找位置
  - indexOf('val',num)
    - 查询字符，val 查询值，num 开始下标
    - 找不到返回-1
  - lastIndexOf 从后面往前找

```js
var str = "helloWorld";
alert(str.indexOf("h")); // 0 -- 第0个
```

- 指定索引返回字符串

```js
alert(str.charAt(1)); // e
```

- 指定索引返回字符串的 ASCII 码

```js
alert(str.charAt(1)); // 101 -- e的ASCII码
```

- 指定字符的 ASCII 码返回字符

```js
alert(String.fromCharCode(80)); // P -- P的ASCII码为80
```

- 查询下标并返回其 ASCII 码

```js
alert(str.charCodeAt(1)); // 101 -- e的ASCII码
```

- 指定索引和长度返回字符串
  - substr('num','sum')
  - num 开始下标，sum 长度

```js
alert(str.substr(1, 2)); // el
```

#### 截取字符串

- substring('num1','num2')
  - num1 开始位置，num2 结束位置
  - 不包含 num2 下标的字符，区间表示为 [num1，num2)
  - 会自动取从小到大的顺序，所以写反也没关系
  - substring('num1')：相当于 [num1，∞)

```js
alert(str.substring(1, 9));
alert(str.substring(9, 1));
//结果为elloWorl
```

- slice
  - 正数同上，截取索引可以为负数，（-5，-1）截取倒数第 5 位~最后一位，不包含最后一位的字符
  - 正数从 1 开始数，倒数第一个是 -1

```js
alert(str.slice(-5, -1)); // 结果为Worl
```

#### 转换（不常用）

- LowerCase 转小写

```js
var str = "helloWORLD";
var new_str = str.LowerCase();
alert(new_str); // helloworld
```

- toUpperCase 转大写

```js
var str = "helloWORLD";
var new_str = str.toUpperCase();
alert(new_str); // HELLOWORLD
```

#### 查找

- match

通过指定字符串查找，可以匹配一个或者多个字符，如果找到会直接返回查找的字符串，没有则返回 `null`

```js
var str = 'helloworld';
alert（ str.match('hell') )；// hell
```

- search

匹配字符下标，找到返回下标值，找不到返回 `-1`

```js
alert(str.search("m")); //-1
```

#### 替换

replace( value, newval )

查找第到第一个与 `value` 匹配的字符或者字符串，将它替换成 `newval`

```js
alert(str.replace("o", 123));
// hell123world
alert(str.replace("ell", 123));
// h123oworld
```

#### 分割

split( val );

以 `val` （val 可以是字符串）将字符串分割，分别放入数组中

```js
console.log(str.split("o"));
// 返回为：hell,w,rld
var s = str.split("o");
// 当我将它付给变量s时，返回s的类型为object
```

> 注：上面的修改字符串的方法都是不会改变原数组的，只是改变了返回值

### 数组

- 数组也是一个特殊的对象类型

#### 创建

```js
var arr1 = [];
var arr2 = Array();
var arr3 = new Array();
```

#### 方法

- indexOf('val') 查询值 val,返回下标
- pop
- shift
- unshift
- jion
- sort 排序
- reverse 反向
- concat 连接数组
- Array.isArray() 判断数组
- filter 过滤，去重
  - return self.indexOf(item) === index
- map 遍历数组，不改变原数组
- forEach 遍历数组，改变原数组

#### 类数组

一个对象有规律数字的属性名（下标），并且有 length 属性，可以通过普通的 for 来遍历的对象

#### 冒泡排序

- 虚拟数组思想
- 两数交换位置

```js
arr[j] = [arr[j - 1], (arr[j - 1] = arr[j])][0];
```

### json

- 实际上来说是一个字符串类型
- {}内的内容所有的内容必须用双引号

```js
var json = '{"name":"刘谣"，"age":"20"}';
```

- 所有的数据传输都是字符串形式

#### 方法

- JSON.stringify() 反序列化，将对象转换成 json 字符串格式
- JSON.parse() 序列化，将 json 字符串转换成 object 对象，常用

### 转换

#### Number()

对一个字符串整体进行转换，非法的就转换成 NaN

出现 NaN 的情况：

- 进行了非法的数学运算 (如字符串,undefined,{},json)

> 六种转换成 false：
>
> - 0，"" 空字符串，undefined，null，false，NaN
> - NaN === NaN，NaN == NaN 都是 false，NaN 自己都不等于自己(在 es6 中这个坑被填了)
>
> 转换成 0：""空字符串，null,false,空数组[ ]
>
> 转换成 NaN：""空字符串,布尔值，空数组

#### parseInt()

从左到有右检查，遇到非数字就停止，转换出前面的数字，还有取整的功能

### Math 函数

- Math.ceil() -- 向上取整

- Math.floor() -- 向下取整

- Math.round() -- 四舍五入

- Math.random() -- 随机数

- Math.max() -- 返回较大的一个值

- Math.min() -- 返回较小的一个值

- Math.sin() -- 三角函数中：接收的是弧度制

### 判断数据类型

#### 三目运算

- 适合 `if/else` 类型
- 表达式是否成立 ? 成立输出 1 ： 不成立输出 2 ;

```js
var a = 0 ;
a == 0 ? a = 1 : a = -1 ;
等价于 a = a == 0 ? 1 : -1 ;
```

#### switch 语句

```js
switch(){
    case 1:
        输出1；
        break；
    case 2：
        输出2；
        break；
    default：
        输出其他；
        break；
}
```

#### 自增自减

- 后自增：先赋值后自增（自减同理）

```js
var i = 20;
var a = i++;
a = 20;
i = 21;
```

- 前自增：先自增后赋值（自减同理）

```js
var i = 20;
var a = ++i;
a = 21;
i = 21;
```

#### 循环

```js
//在网页中输出内容
document.write("");
```

> `注`
>
> 写在 window.onload 里面的代码会覆盖掉 body 里面的所有内容

### 数组

#### 创建数组

```js
var arr = [1, 2, 3]; // 内容有几个长度为几
// 后面两种当数组中只有一个值时，长度为那个值
var arr = Array(1, 2, 3);
var arr = new Array(1, 2, 3);
// 不过es6填了这个坑，一个时就一个元素，长度为1
```

#### 修改数组

1. 修改长度：超出长度的内容就没有了

```js
var arr = [1, 5, 3, 6];
arr.length = 3;
alert(arr); //结果为 1,5,3
```

2. 修改内容：将数组中的某个内容替换掉

```js
var arr = [1, 5, 3, 6];
arr[0] = "hello";
alert(arr); //结果为 hello,5,3，6
```

3. 增加内容：再数组中的最后增加内容

```js
var arr = [1, 5, 3, 6];
arr[0] = "OK";
alert(arr); //结果为 1,5,3,6,OK
```

#### 稀疏数组

```js
var arr = [1, , 3, , 5];
alert(arr.length); //5
```

#### 方法

> `注：` 这些方法都会改变原数组

1. 添加元素 (`返回新长度`)

- 在数组开头

```js
var arr = [1, 2, 3, 4, 5];
arr.unshift("hello"); // hello,1,2,3,4,5
```

- 在数组末尾

```js
var arr = [1, 2, 3, 4, 5];
arr.push("hello"); // 1,2,3,4,5,hello
```

2. 删除元素 (`返回删除的元素`)

- 删除首个元素并返回

```js
arr.shift();
alert(arr); //结果为 2,3,4,5
alert(arr.shift()); //结果为 1
```

- 删除末尾元素

```js
arr.pop();
alert(arr); //结果为 1,2,3,4
alert(arr.pop()); //结果为 5
```

3. splice

添加，删除，替换一体

```js
/*
第一位数：在第几个位置
第二个数：0 为不删除，1/2/3代表删几个
第三个数：添加或者替换的元素
*/
var arr = [1, 2, 3, 4, 5];
//在第二个位置上添加hello
arr.splice(1, 0, "hello"); //返回结果 1,hello,2,3,4,5
//删除第二个后面两个元素
arr.splice(1, 2); //返回结果 1,4,5
//将第二个元素换成hello
arr.splice(1, 1, "hello"); //返回结果 1,hello,3,4,5
//可以添加多个值，替换同理
arr.splice(1, 1, "a", "b", "c", "d");
```

#### 排序

- sort() 默认排序，只笔每个元素的首位，没卵用

```js
arr.sort(function (a, b) {
  return a - b;
  return b - a;
});
```

- 冒泡法 `数组元素在10个以内` `性能差`

  - '>' 调换位置（返回值为正时）
  - '0' 不调换位置（相等）
  - '<' 不调换位置（返回值为负）

- 二分法 `当数组元素在10个以上时`

#### 别的操作

- reverse() 将数组颠倒
- concat() 数组和数组拼接，不会改变原数组
- slice(1,3) 截取，从第二位到第三位，不包括第四位
- join 拼接成字符串，用某元素把数组拼接成字符串
- Array.isArray( arr ) 判断数组，返回值为 true/false

### ECMAscript5

> 是 javascript 的执行标准

#### 参数

- value ：是数组的项
- index ：当前项的下标
- arr ：是数组本身

1. forEach 遍历数组

```js
forEach(function (value, index, arr) {});
```

2. map 计算

有返回值，返回值是一个数组，return 是什么就是什么

```js
map(function (val) {
  return val * 2;
});
```

3. filtre 过滤

有返回值，返回值是一个数组，retuern 为真（true）的 value 值会进入数组

```js
filter(function (value) {
  return value > 5;
});
```

4. every 有点判断的意思

每一个为 true，才返回 true，否则为 false

```js
every(function (val) {
  return val != "h"; //是否每个值都等于h
});
```

5. some 也有判断的意思

每一个为 true，才返回 true，否则为 false

```js
some(function (val) {
  return val == "h"; //是否有一个值都等于h
});
```

> `随机数：` Math.random() 随机一个 0~1 之间的数，不包括 1

## 节点

- 元素节点
- 文本节点
- 属性节点
- 注释节点

### 获取节点

obj.childNodes 获取所有的子节点

【子节点：IE8 及以下都会忽略空格和换行】

#### obj.children 获取所有的子`元素`节点

obj.nodeType 获取节点的类型，返回其编号
元素节点：1
属性节点：2
文本节点：3
注释节点：8

4、obj.tagName 获得`元素节点`的名称

5、obj.nodeName 获取所有节点的`节点名称`

6、obj.getAttributeNode() 获取指定节点的指定属性节点名称，【不常用】

`以下方法不常用`

7、obj.firstChild 获取第一个子节点

8、obj.lastChild 获取最后一个子节点

9、obj.firstElementChild 获取第一个子元素节点，【不兼容 IE8，一般不用】

10、obj.lastElementChild 获取最后一个子元素节点，【同上】

1obj.nextSibling 下一个兄弟节点【同上】

1obj.nextElementSibling 下一个兄弟元素节点【同上】

1obj.previousSibling 上一个兄弟节点【同上】

14、obj.previousElementSibling 上一个兄弟元素节点【同上】

#### 15、obj.parentNode 获取父节点，没有兼容性问题

16、obj.offsetParent 返回定位了的父级元素，它相对于谁定位的，谁就是他的定位父级

17、obj.childElementCount 获取子元素节点的个数【不兼容 IE8 及以下】

#### 常用方法:

children , offsetParent , parentNode ， tagName

#### 创建一个元素节点

document.createElement(obj)
以前之前用“ innerHTML += ” ，添加标签时，实际上只是一个字符串，在使用时还需要获取元素
obj.appendChild(div);

```html
<div id="wrap"></div>
<script>
  var oWrap = ducoment.getElementById("wrap");
  var div = document.createElement("div");
  //相比“ += ”的方法，这种方法对于添加事件，添加id更方便
  div.onclick = function () {
    console.log("这是一个div元素节点");
  };
  div.id = "box";
  //在oWrap最后面添加一个节点，只能是节点，不能加 "" ，不然就变成字符串
  oWrap.appendChild(div);
  //innerHTML 在只是写一个文本时，用这个更合适
</script>
```

#### 克隆节点

节点.cloneNode(bool);
参数默认为 false；
true 深度克隆，复制所有
false 浅度克隆，不复制内容

添加子节点
obj.insertBefore(要添加的子节点，需要放在哪个子节点的前面)

删除子节点
obj.removeChild(节点) 通过父节点删除子节点

替换子节点
obj.replaceChild(子节点，被替换的节点)

## css 试图模式

### client

获取文档可视区域的宽高（不包括滚动条）
clientWidth
clientHeight

获取边框厚度
clientTop 元素上边框厚度
4、clientLeft 元素左边框厚度

### inner

获取窗口的可视区域宽高（包括滚动条）
【IE8 以下不兼容】
innerWidth
innerHeight

### offset 与定位有关

获取元素的实际大小，即 content+padding+border，即写的是宽高是多少就是多少
offsetWidth
offsetHeight

获取从元素的`外边框开始`到定位父级的`内边框`距离（不包括定位父级的边框）
offsetTop 元素顶部到定位父级的顶部的距离
4、offsetLeft 元素左部到定位父级的左部的距离

### scroll

获取元素 Content+padding 的大小，当元素内容的东西超出的时候，会把超出的部分算进去；当超出时，下 padding 可能就没有了，这时算的就是上 padding 到内容底部的距离。
【当元素有 overflow：hidden 时，得到的是上下 padding+content+超出的部分】
scrollWidth
scrollHeight

获取 X，Y 轴方向被挡住的那部分大小
scrollTop
4、scrollLeft

### page

pageY 到 document 的 y 轴方向的距离，包括没有显示的部分

## 事件对象

DOM 零级事件，绑定 on+"...."事件
即 obj.onclick，这种事件没有兼容性问题
只同一个对象绑定的相同事件只能有一个
事件对象 e

```js
document.onclick = function (e) {
  //兼容IE
  e = e || window.event; //事件对象
};
```

监听事件
DOM 二级事件
obj.addEventListener("事件类型"，事件函数(回调函数)，布尔值);
兼容 IE：obj.attachEvent("事件类型"，事件函数)；
IE 不支持捕获
布尔值：
默认 false：冒泡；
true：捕获；（与冒泡相反，从最上面的事件向下调用）

事件捕获：父级事件向下执行到子级事件；
捕获比冒泡优先，并且比冒泡执行快一点

```js
obj.addEventListener("click", function () {
  e.stopPropagation(); //也能阻止冒泡事件
});
```

事件冒泡
子集将一直向上调用父级事件，直到 document

阻止事件冒泡
e.stopPropagation();
兼容 IE：e.cancelBubble = true;
true 阻止，false 不阻止

```js
obj.onclick = function (e) {
  e = e || window.event;
  e.cancelBubble = true; //IE写法
  e.stopPropagation(); //阻止冒泡事件，即所有的父级事件都不执行
};
```

4、解绑监听事件
obj.removeEventListener("事件类型"，函数名);
兼容 IE
obj.detachEvent("事件类型"，函数名);

### 事件代理

触发事件源的元素
e.target
e.srcElement

### DOM 零级事件

obj.onclick = function (){}
DOM 二级事件
obj.addEventListener("click",function(){});

DOM 零级事件即使不点击时，也开辟了内存把 function 存起来了，并将 obj 的 onclick 的属性指向这个 function；
而 DOM 二级事件则是，当触发这个事件时才会开辟内存读取这个 function，没有触发时不会读取 function

### 阻止默认行为

#### oncontextmenu

检测鼠标右键单击
阻止默认行为：e.preventDefault();
IE8 及以下：e.returnValue = false;
true 不阻止， false 阻止；

```js
//return false也能阻止默认行为，但是只能在DOM零级事件中使用
document.oncontextmenu = function () {
  return false;
};
//而在DOM二级事件中就无法使用了
document.addEventListener("contextmenu", function () {
  return false;
});
//零级二级都可以
document.oncontextmenu = function () {
  //阻止默认行为
  //鼠标右键时不弹窗
  e.preventDefault();
  //IE
  e.returnValue = false;
  //兼容写法
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);
};
```

#### onmousedown

左键右键都能够监听
（不能在这里面阻止默认行为）

### 鼠标滚动事件

#### document.onscroll

监听浏览器的滚动条变化，只要滚动条的滑块发生了变化就会被触发；

#### document.onmousewheel

只监听鼠标滚轮的滚动事件，而直接拖动滚动条的滑块是不会被触发的；
【火狐浏览器没有 onmousewheel 属性]
火狐浏览器写法：document.DOMmouseScroll
【但是在火狐里面不能以 DOM 零级的方式绑定滚轮事件，所以要 DOM 二级事件写法】

判断滚轮方向：
e.wheelDelta
向下滚动 ： -120，
向上滚动 ： +120；

火狐 ：
e.detail
向下滚动 ： +3，
向上滚动 ： -3；

```js
document.onmousewheel = function () {
  //滚轮方向
  console.log(e.wheelDelta);
};
//兼容火狐浏览器：DOMmouseScroll,但是在火狐里面不能以DOM零级的方式绑定滚轮事件
documnet.DOMmouseScroll = function () {}; //不会触发

document.addEventListener(
  "DOMMoueScroll",
  function (e) {
    e = e || window.event;
    console.log(e.detail);
  },
  false
);
```

### 鼠标滚轮事件兼容

```js
//用户写的函数
function wheel(e, d) {
  console.log(d); //鼠标滚动方向的判断数值
  console.log("事件处理函数");
}
//调用自定义滚轮函数
mouseWheel(document, wheel);
//鼠标滚轮兼容函数
function mouseWheel(dom, efn) {
  var type;

  //真正的事件处理函数，用来处理很多统一的值
  function fn(e) {
    e = e || window.event;
    //统一滚动方向数值，+1向上，-1向下
    var direction = e.wheelDelta / 120 || -e.detail / 3;
    //每次调用fn之后改变this指向，并且把鼠标滚动方向，数值都传出去给用户的wheel函数
    //判断用户函数的返回值是否为false，即用户是否要阻止浏览器的默认行为
    if (efn.call(dom, e, direction) === false) {
      //判断是否为IE8及以下
      if (dom.addEventListener) {
        e.preventDefault(); //阻止默认行为
      } else {
        e.returnValue = false;
      }
    }
  }

  //判断浏览器，火狐与其他浏览器
  if (dom.onmousewheel === null) {
    //其他浏览器
    type = "mousewheel";
  } else {
    //火狐浏览器
    type = "DOMMouseScroll";
  }

  //判断IE浏览器，决定绑定方式
  if (dom.addEventListener) {
    dom.addEventListener(type, fn);
  } else {
    dom.attachEvent("on" + type, fn);
  }
}
```

`注：所有on....事件的默认值都为null`

## BOM

## 表单事件

onblur 失去焦点
onfocus 获得焦点

obj.focus(); 给元素自动聚焦，必须是能获取到光标的元素

obj.onchange
当能获得焦点的元素内容被改变并且元素失去焦点之后会被触发，优先级比 onblur 高一点

obj.oninput
当内容改变时马上触发

## 键盘事件

obj.onkeydown
当按下键盘时立即触发

```js
obj.onkeydown = funcion(e){
    console.log(e.key);//直接返回按键名称
    console.log(e.code);//返回带标识的 按键名称
    console.log(e.keyCode);//按键的编码
}
```

obj.onkeypress
按下键盘触发【只会相应数字键，字母键等能输出文字的键，不响应功能键】

obj.onkeyup
按键抬起时触发

判断 alt 和 ctrl 有没有触发
e.altKey
e.ctrlKey

## 正则表达式

【正则匹配的是连续性的字符】

match 方法
根据字符串查找相同的字符串，符合条件的字符串放到数组中并返回

- 正则表达式可以直接写中文

```js
var str = /学习/; //字面量方式  str既是一个正则规则
//构造函数形式
var reg = new RegExp("学习"); //正则
```

### text(str) 正则的方法

检测 str 中有没有符合正则规则匹配的字符串
有符合条件的：返回 true
没有：返回 false

### 元字符

【在正则有特殊意义】

\d ：匹配数字
\D ：匹配非数字

\s ：匹配空格
\S ：非 k 空格

\w ：数字、字母、下划线
\W ：非字符，除了\w 之外的所有字符

\b ：独立部分/单词边界

```
var reg = /\bhappy\b/; //只会匹配为happy的完整的独立的单词
```

\B ：非单词边界

. ：匹配任意的字符，不包括\n \r

\r ：制表符，【基本用不到】

\ ：反斜杠，转移，会把紧跟着的字符转义为别的意义

#### 量词

规则后面写，给某一个相同的规则设定连续出现多少次

> 量词的匹配模式：
> 贪婪匹配：默认从最高次数匹配，知道底线次数；如果不满足底线次数，则跳过。
> var reg = /\d{2,5}/;【从 5 次开始匹配】

> 懒惰匹配：从低次开始匹配，在贪婪模式后加“ ？”；
> var reg = /\d{2,5}?/;【从 2 次开始匹配】

```js
var reg = /\d{5}/; //匹配5个连续数字
var reg = /\d{1,9}/; //最少1个，最多9个
var reg = /\d{1,}/; //最少1个，上不封顶
```

- --> {0,} 0 到正无穷，所有，不限个数

* --> {1,} 1 到正无穷，最少要有一个
  ? --> {0,1} 要么没有，要么一个

#### 修饰符/标识符

g ：golbal 全局匹配

```
var str = "123abc456def";
var reg = /\d/g;
```

i ：忽略大小写

```
var str = "123abc456def";
var reg = /ABC/ig;
```

m ：换行匹配

```
var str = "\n123abc456def\n";
var reg = /ABC/igm;
```

() ：组/子项，只会匹配一个整体
\1 代表第一个子集匹配的内容
\2 代表第二个子集匹配的内容

```
var str = "abccccabc";
var reg = /adc+/g; // [abcccc,abc]
var reg2 = /(abc)+/g; //[abc,abc]
```

[] ：字符集
字段：返回两个字符 Unicode 码之间的所有码对应的字符
[0-9][a-z][A,Z] 可以一起写[0-9a-zA,Z][()//?+*{}-] 这些在字符串中都是无意义的，普通符号
[059] 匹配 0 或者 5 或者 9

```
var str = "14376423987";
var reg = /[1-5]/g; //[1,4,3,4,2,3]
```

中文编码 ：\u4e00-\u9fa5

| ：或者，“|”前面的一个整体和后面的一个整体

^ ：以什么开始的字符
【在字符集中表示除了^跟着的字符以外的东西】

\$ ：以什么结束的字符

## 存储/缓存数据

### cookie

上限 4kb，数据默认有时间限制，默认是一次会话的时间（打开一个窗口，关闭后就结束）
过期时间可以设置：每次与后台交互请求的时候，都会自动发送 cookie 过去，如果遇上和 cookie 里的数据没有很大关系的请求时，发送 cookie 就是占用资源

> 大部分的 cookie 必须在服务器下存储，cookie 是在 document 下的
> 传输的必须是字符串，键值对

```js
document.cookie = "name=刘谣";
document.cookie = "age=20";
//设置到期时间,一天
document.cookie =
  "name=刘谣;expire" +
  new Date(new Data().getTime() + 24 * 60 * 60 * 1000).toUTCString();
```

### localStorage 和 sessionStorage

同：
存储的数据没有上限
在 window 下

异：
localStorage：永久保存，除非认为清楚或者清楚浏览器缓存

> 不需要服务器也可以

sessionStorage：一次会话的时间，并且不能设置过期时间

【以上三种都遵守同源策略】

```js
localStorage.setItem("name", "刘谣");
localStorage.setItem("age", "20");
```

用 json 存储数据

```js
localStorage.setItem(
  "json",
  JSON.stringify({
    name: "刘谣",
    age: "20",
  })
);

//获取数据，获取到的就是JSON的字符串内容
localStorage.getItem("json");

//利用json的反序列化转成对象
console.log(JSON.parse(localStorage.getItem("json")));

//删除某一个数据
localStorage.removeItem("json");

//删除所有数据
localStorage.clear("json");
```

## 字符串模板

```js
var obj = {
  name: "刘谣",
  age: "20",
};
//反引号,所有内容都在 `` 里面写
//所有的换行都会保留
var str = `我是${obj.name}，几年${obj.age}岁`;
```

## ajax

asyncChronous javascript and XML
【同源策略，不可跨域】

> 在不刷新页面的前提下，更新当前这个页面或者局部的数据；
> 实现与后台的数据交互，同时在页面进行更新

ajax 是一个`对象`，必须被 new 执行的对象

```js
//创建一个ajax对象
var ajax = new XMLHttpRequest();
```

open( get/post , 接口地址 , 是否异步/同步 true(异步)/false(同步) );

```js
ajax.open("get", "www.baidu.com/xxx", true);
```

send(); 发送到后台

监听状态，当与后台交互的状态发生变化的时候，就会触发一个函数

```js
ajax.pnreadystatechange = function(){
    //当前的状态码ajax.readyState
    //当数据全部接收完成时
    if(ajax.readyState ==== 4){
        //判断服务器的好坏，服务器状态码，http状态码
        if(ajax.status >= 200 && ajax.status < 300 || ajax.status === 300){
            //获取的数据反映出来
            console.log(ajax.responseText);
        }
    }
}

```

与后台交互时当前的状态码 ajax.readyState
0 ：ajax 已经创建，但是没有调用 open 方法
1 ：open 已经调用，没有 send 发法发送
2 ：已经发送给后台，但是还没有得到数据
3 ：正在接受数据
4 ：数据全部接收完成
【但是也存在有状态码为 4 的时候数据没有接收完成，这时可能是服务器出问题了】

服务器状态码/http 状态码 ajax.status
大于 200 并且小于 300，或者等于 300 表示服务器没有问题

当用户的网络很差或者其他情况，后台处理时间很长；后台应该达到一定时间自动关闭这个请求，让用户不需要继续等待了，无法访问

```js
//一秒后关闭请求
setTimeout(function () {
  ajax.abort(); //关闭请求
}, 1000);
```

### get 和 post 的区别

同：都是使用键值对格式，传输数据都是没有上限的
异：但是 get 一般只用来传输小数据，因为 get 的数据（传输）会直接显示在地址栏处，浏览器会对 url 地址栏的字符长度做限制

#### get

所有发送的数据都跟在 “？” 后面，在地址栏显示，保密性极差
数据：http:www.baidu.com/xxx?xxxxxx
ajax.open("get","http:www.baidu.com/xxx?xxxxxx",true);

#### post

可以在 network 中看到数据
数据前不带 “？” 问号，以字符串形式放在 send 里面，保密性和 get 差不多的，只是不像 get 一样直接在地址栏显示出来
数据：xxxxxx
ajax.open("get","http:www.baidu.com/xxx",true);
ajax.send("xxxxxx");
post 必须设置请求头
ajax.setRequestHeader("Content-Type","xxxxx")

## jsonp

是一种非正式的传输`协议`
jsonp 是利用了 script 的 src 属性的跨域漏洞，可以去其他不同的服务器拿数据

> 比如：img 的 src，能够跨域访问别的网页的图片，其他的底层定义的 src 的属性的一些标签也可以实现跨域访问，但是只能显示它本身标签的内容形式

### callback

回调函数，是 jsonp 里比传的参数

## 面向对象

面向对象编程

面向过程编程
以过程为中心得编程思想
缺点：不利于扩展

### 面向对象三大特征：

封装、继承、多态

对象都有的属性：共性
特有的属性：特性

利用 function 创造一个工厂/流水线

```js
function Person(name, age, sex) {
  var obj = {};
  obj.name = name;
  obj.age = age;
  obj.sex = sex;
  return obj;
}
var p1 = Person("刘谣", 20, "男");
```

### new

> 通过 new 关键字执行的函数，new 后面的函数叫做构造函数

> `new的特性`：

    每次执行函数都会在函数内部创建一个对象，最终会把这个对象返回出来，对象是引用性数据类型，所以每次new执行调用函数时，返回的都是一个新的对象

```js
var a = "字符串1", //字面量
    b = String("字符串2"), //String方法/内建方法
    c = new String(字符串"); //构造函数
```

> new 执行构造函数的过程：叫做构造函数的实例化/类的实例化；
> 构造函数执行结束以后返回的对象：叫做实例/实例化对象

```js
function Person(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
}
var p1 = new Person("刘谣", 20, "男");
```

> 使用 new 会隐式创建一个对象并返回出来，并且构造函数中的 this 会指向 new 创建的那个对象
> 就不需要 var 一个对象并 return

> 构造函数一般的函数名一般第一个字母大写

### 原型 prototype

> 就是一个仓库，并且仓库里的东西都是共享的，里面存储的每个对象都可以共享方法/属性
> 本质上是一个对象

```js
function Person(name, age, sex) {
  //私有属性-->实例对象的属性
  this.name = name;
  this.age = age;
  this.sex = sex;
}
//原型方法
Person.prototype = {
  //共有属性
  say: function (say) {
    console.log(say);
  },
  constructor: Person,
};
var p1 = new Person("刘谣", 20, "男");
p1.say("我是" + this.name);
```

### 原型链

所有的仓库
"1".\_\_proto\_\_

`__proto__`： 原型链，就是一个引用
所有的对象都有的属性，除了 null 和 undefined

> 原型链：一个对象的原型（\_\_proto**）指向它的构造函数那个仓库的原型对象（prototype）的原型（\_\_proto**）
> 在找原型时，只会在构造函数的原型里面找，不会构造函数的私有属性里面找

> 实例对象的`__proto__`指向生成这个实例对象的构造函数的原型对象，既是构造函数的 prototype 原型对象

prototype ： 原型对象
只有函数/方法才有的属性

> 原型（prototype）是一个对象，这个对象的\_\_proto\_\_指向创建这个对象的构造函数的原型（prototype）

constructor：每个原型都有 constructor 属性，指向当前原型的构造函数

> 【先创建构造函数，在创建实例化对象】

## 多态

> 多种状态，根据参数的不同，做出不同的反馈

## es6 新增

### let const class import

es5 ：全局作用域、局部作用域
es6 ：全局作用域、函数作用域、块作用域

### const 声明常量

声明时必须赋值，后续不可以进行第二次等号操作，引用性数据类型是可以向变量里面添加内容的

### 解构赋值

本质上是一种模式，只要等号两边的结构值相同，那么等号左边的变量就会被赋予对应的值。

- 当右边的值比左边的变量少的时候，左边的变量会自动赋予 undefined
- 左右值不对应时，左边多余的变量会赋予 undefined 值，右边多余的时候多余的不管
- 默认值：在左边给变量用=赋予默认值，默认值只有在变量匹配到 undefined 的时候才会生效，如果匹配到了值，则使用右边的值

#### 扩展运算符 “...”

将数组/类数组展开，将展开的东西变为数组

```js
let [a, ...b] = [1, 2, 3, 4, 5];
//a = 1
//b = [2,3,4,5]
```

```js
let a = 1,
  b = 2;
[a, b] = [b, a];
//a = 2 , b = 1
```

### includes()

查找 xxx 字符串，返回布尔值 true/false

### starrsWith()

判断是否以 xxx 字符开头，返回布尔值 true/false

### endsWith()

判断是否以 xxx 字符结尾，返回布尔值 true/false

### repeat(n)

重复原字符串 n 次返回出一个新字符串，并且默认向下取整。

- -1 到+1 取 0
- false 为 0
- true 为 1
- NaN 为 0
- 字符串会默认转化为数字，转化不了时为 false，即为 0

## padStart(n,str) padEnd(n,str)

es8 的方法
"str"可以没有，默认补全空格
n 小于等于原字符串的长度时，返回原字符串

### padStart()

往字符串前面补全到设置长度，返回新字符串

```js
var str = "abc".padStart(5, "defg");
//str = "abcde"
```

### padEnd()

往后补全，与 padStart()同理

isFinite() 检测是否为一个有限数值
Infinity 无穷大

## es6

Number.isFinite() 不会进行隐式类型转换

#### Number.isInteger() 判断整数

有精度问题

### Math 函数

#### Math.trunc()

砍掉小数点，会隐式调用 Number 进行类型转换

#### Math.sign()

整数返回+1，负数返回-1，-0 返回-0,0 返回 0

#### Math.cbrt() 计算一个立方根

#### Math.hypot() 勾股定理，求第三边

es7 新增指数运算符 **
2**3 = 2*2*2 = 8

## 函数的扩展

- 当()里面没有参数默认值的时候，默认声明变量的方式是 var
- 当参数有默认值的时候，为 let 声明

arguments 实际获取的是实参

### 临时作用域

- 当函数的形参有默认值的时候，整个()内会形成一个作用域
- 当设置默认值时，会先在()内的作用域里面找，如果没有再在此函数上面的全局作用域中找
- 暂时性死区

```js
function fn(x = x) {}
```

> var 没有暂时性死区

### rest 参数 ...参数名

### 箭头函数 () => {}

箭头右边如果只有一个表达式或者一个变量的时候表示返回这个东西

- 通常箭头函数用在回调函数上
- 箭头函数，本质上是一个表达式，它没有 this
- this 固定为父作用域的 this
- 不能使用 arguments，要使用 rest 参数代替
- 不可以把箭头函数当做构造函数

## 数组的扩展

### 拷贝数组

#### arr.concat();

#### ...arr

#### 浅拷贝

- 复制数组时，如果原数组的成员里有一个引用性数据，那么复制原数组时，新数组的这个引用性数据和原数组中的是一样的，指向同一个内存地址

### Object.assgin() 合并对象

Object.assgin(obj1, obj2, obj3)
将 obj2 和 obj3 合并到 obj1 中，改变了 obj1，obj2 和 obj3 不变

### Object.keys() 键名

### Object.values() 键值

### Object.entries() 键值对

用一个数组存键[0]和值[1]

## 判断一个对象是否是数组

### Array.isArray(obj)

### obj instanceof Array

### 判断是否有 length/join/constructor === Array

## jq 操作

### \$().offset()

返回一个包含元素到文档顶部（包括未显示的 top/left 区域，包括 margin 值）的 top/left 值得对象

### 1.\$().offset({top: num,left: num})

当传值的时候，会强制将元素的 top/left 值变更达到元素距离文档上左的距离只有 num 值

### \$().position()

返回一个包含元素到定位父级的 top/left 值的对象

### \$().srollTop()

返回当前元素滚动条的高度

### 3.\$().srollTop(num)

当有传值的时候，触发一个事件时，回时元素立刻到达设置的 nun 滚动条的高度

### 4、获取宽度

#### <1> \$().width()

元素设置的 width 为多少返回的就是多少

#### <2> \$().innerWidth()

返回元素的 width+内部的距离(padding)

#### <3> \$().outerWidth()

返回元素的 width+外部的距离(margin)

#### <4> 传值的时候

- \$().width(num)
  会强行改掉元素的宽度 width
- \$().innerWidth(num)
  会强行改成元素的宽度 width 使得 width+padding 的值等于 num
- \$().outerWidth(num)
  会强行改成元素的宽度 width 使得 width+margin 的值等于 num

### \$().map(function(index,val){})

- index：下标
- val：dom 元素节点
- return：写什么返回什么

### \$().each(function(index,val){})

- index：同上
- val：同上
- return：管你写什么，老子就返回操作对象

## 获取地理位置

使用 navigator 下面的 geolocation()方法获取用户位置

- 检测是否支持地理定位
- 如果支持，则运行 getCurrentPositio()方法。如果不支持，则向用户显示一段消息。
- 如果 getCurrentPosition()运行成功，则向参数 showPosition 中规定的函数返回一个 coordinates 对象
- 如果运行失败，则向参数 showError 中规定的函数返回错误信息
  - Permission denied---用户不允许地理定位
  - Position unavailable - 无法获取当前位置
  - Timeout - 操作超时
- showPosition()函数获得并显示经度和纬度

```js
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
// 获取成功
function showPosition(position) {
  let lat = position.coords.latitude; //经度
  let lon = position.coords.longitude; //纬度
}
//获取失败运行
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}
```

## console 的方法

- console.log()

- console.dir()

- console.error() 以红色报错的形式输出

- console.time("tag"); console.timeEnd("tag") 设定一个 tag 标记点，打印之间代码执行时间，误差很大

- Console.assert() 判断第一个参数是否为真，false 的话抛出异常并且在控制台输出相应信息。

- Console.clear() 清空控制台。

- Console.count() 以参数为标识记录调用的次数，调用时在控制台打印标识以及调用次数。

- Console.debug() console.log 方法的别称，使用方法可以参考 Console.log()

- Console.dir() 打印一条以三角形符号开头的语句，可以点击三角展开查看对象的属性。

- Console.dirxml() 如果可以，打印 XML/HTML 元素表示的指定对象，或者 JavaScript 对象视图。

- Console.error() 打印一条错误信息，使用方法可以参考 string substitution。

- Console.\_exception() error 方法的别称，使用方法参考 Console.error()

- Console.group() 打印树状结构，配合 groupCollapsed 以及 groupEnd 方法;

- Console.groupCollapsed() 创建一个新的内联 group。使用方法和 group 相同，不同的是 groupCollapsed 打印出来的内容默认是折叠的。

- Console.groupEnd() 结束当前 Tree

- Console.info() 打印以感叹号字符开始的信息，使用方法和 log 相同

- Console.log() 打印字符串，使用方法比较类似 C 的 printf 格式输出，可参考 string substitution 。

- Console.profile() 可以以第一个参数为标识，开始 javascript 执行过程的数据收集。和 chrome 控制台选项开 Profiles 比较类似，具体可参考 chrome profiles

- Console.profileEnd() 配合 profile 方法，作为数据收集的结束。

- Console.table() 将数据打印成表格。Console.table [en-US]

- Console.time() 计时器，接受一个参数作为标识。

- Console.timeEnd() 接受一个参数作为标识，结束特定的计时器。

- Console.timeStamp() 添加一个标记到浏览器的 Timeline 或 Waterfall 工具.

- Console.trace() 打印 stack trace.

- Console.warn() 打印一个警告信息，使用方法可以参考 string substitution。

## ajax

### get 接收

```js
const xhr = new XMLHttpRequest();
// 发送
xhr.open("GET", URL, true / false);
// 监听
xhr.send();

xhr.onload / onreadystatechange = () => {
  // 判断ajax本身的状态码
  if (xhr.readyState === 4) {
    // 判断服务器状态码
    if ((200 <= xhr.status && xhr.status < 300) || xhr.status === 304) {
      // 请求成功

      // 服务器返回的数据
      xhr.responseText;
    }
  }
};
```

### post 发送

```js
const xhr = new XMLHttpRequest();
xhr.open("POST", URL, true / false);
// 请求头
xhr.setRequestHeader("Content-Type", "application/x-WWW-form-urlencoded");
xhr.send("user=xxxx&pwd=xxxx");

xhr.onload / onreadystatechange = () => {
  // 判断ajax本身的状态码
  if (xhr.readyState === 4) {
    // 判断服务器状态码
    if ((200 <= xhr.status && xhr.status < 300) || xhr.status === 304) {
      // 请求成功

      // 服务器返回的数据
      xhr.responseText;
    }
  }
};
```

### jq 封装的方法

```js
$.ajax({
  url: url,
  // 根据GET/POST自动选择调用参数
  method: "POST/GET",
  data: {
    user: xxxx,
    pwd: xxxx,
  },
  success(data) {
    // 请求成功
  },
  error() {
    // 请求失败
  },
});
```

## 跨域

> 浏览器不允许跨域请求
> cors、反向代理、jsonp

- 实现跨域：
  - 通过 script 的 src：属性具备跨域请求资源的能力，JSONP 形式
  - CORS 在后台程序里，设置可以让对应域进行访问

## jsonp

> jsonp 是 json 的一种使用模式

- 作用：跨域获取数据
- callback：回调函数

## 类库(工具 api 的集合)

jQuery

## 框架

vue react

### jQuery

### \$().each( (i, v, s) => {} )

- i 序号
- v 值，一个个的对象
- s 自己本身

### \$().length

长度

### \$("xxx", context)

\$("xxx").context 指向给的 context 对象

### \$().get(index)

- \$()[index] 转原生对象
- 转 jq 对象 \$(原生对象)

### \$().index()

- 不传值，返回在父级的下标

```html
<div></div>
<div>
  <p class="p1"></p>
  <p></p>
</div>
<script>
  $(".p1").index(); //0
</script>
```

### \$().data()

> h5 规定自定义标签属性前加上 data

```html
<div data-liuyao="liuyao">
  <script>
    console.log($("div").data(liuyao)); //liuyao
  </script>
</div>
```

- removedata() 移除使用 jq 添加的属性【没什么卵用】

## jq 选择器

### \$("xxx:first")

第一个

### \$("xxx:last")

最后一个

### \$("xxx:not(XXX)")

不包括 XXX

### \$("xxx:even")

### \$("xxx:odd")

### \$("xxx:eq(index)")

选择下标为 index 的

### \$("xxx:gt(index)")

选择下标大于 index 的

### \$("xxx:lt(index)")

匹配所有小于给定索引值的元素

### \$("xxx:contains(text)")

匹配包含给定文本的元素

### \$("xxx:animated")

匹配所有正在执行动画效果的元素

### \$(":empty")

匹配所有不包含子元素或者文本的空元素

- 换行的选不到，空格换行属于字符

### \$("xxx:parent")

匹配含有子元素或者文本的元素

- 没有子元素或者没有文本就取不到

### \$("xxx:has(XXX)")

匹配含有 XXX 的 xxx 元素

### \$("xxx:hidden")

匹配所有不可见元素，或者 type 为 hidden 的元素

### \$("xxx:visible")

匹配所有的可见元素

### \$("xxx[attribute]")

> 匹配包含给定属性的元素，attribute 元素的属性

- \$("xxx[id=div]")
- \$("xxx[id!=thediv]")
- \$("xxx[id^='t']")
- \$("xxx[id$='v']")
- \$("xxx[id*='edi']")
- \$("xxx[id][class='box'][name]")

### \$("xxx:checked")

匹配所有选中的被选中元素

## jq 属性 api

> 处理对象的核心思想：get first / set all

- get(获取)操作默认获取第一个

```js
// 获取第一个class为box的name
$(".box").prop("name");
```

- set(设置)操作默认为设置全部

```js
// 设置全部class为box的name为aaa
$(".box").prop("name", "aaa");
```

### attr

- 主要用来操作自定义属性
- 类似 getAttribute 和 setAttribute 操作
- 获取值为布尔值的属性返回布尔值
- 而 getAttribute 和 setAttribute 在获取 checked 此类属性是返回 checked 的值，不一定返回布尔值

### prop

- 主要用来操作合法属性
- 类似 obj.id 操作

### removeAttr

删除自定义属性

### removeProp

删除合法属性

### addClass()

添加 class 类名

### removerClass()

删除 class 类名

### hasClass()

有没有某某 class 类名

### toggleClass()

没有添加，有则删除

### html()

- 对应 innerHTML
- 没有参数为取值
- 有参数为设置

### text()

- 对应 innerText
- 没有参数为取值
- 有参数为设置

### val()

- 对应 value
- 没有参数为取值
- 有参数为设置

## jqCSSapi

### css()

- 获取时取第一个并只能获取一个属性

```js
// 获取高度
$(".box").css("height");
```

- 整个集合全部设置

```js
$(".box").css({
  width: 200,
  heigth: 200,
  backgroundColor: "red",
});
```

### offset()

没参数时返回一个包含元素到(视口)文档顶部(包括未显示的 top/left 区域，包括 margin 值)的 top/left 值得对象

### \$().offset({top: num,left: num})

当传值的时候，会强制将元素的 top/left 值变更达到元素距离文档上方、左方的距离只有 num 值

### \$().position()

返回一个包含元素到`定位父级`的 top/left 值的对象

### \$().srollTop()

返回当前元素纵向滚动条的高度

### \$().srollTop(num)

当有传值的时候，触发一个事件时，元素纵向滚动条立刻到达设置的 num 的高度

### \$().srollLeft()

返回当前元素的高度

### \$().srollLeft(num)

当有传值的时候，触发一个事件时，元素横向滚动条立刻到达设置的 num 的高度

### \$().height()

- 无参数，获取高度
- 有参数，设置高度

### \$().width()

- 无参数，获取宽度
- 有参数，设置宽度

### \$().innerHeight()

- 无参数，获取内部区域高度(包括补白、不包括边框)
- 对可见和隐藏元素均有效

### \$().innerWidth()

- 无参数，获取内部区域宽度(包括补白、不包括边框)
- 此方法对可见和隐藏元素均有效

### \$().outerHeight()

- 无参数，获取外部高度(默认包括补白和边框)
- 对可见和隐藏元素均有效

### \$().outerWidth()

- 无参数，获取外部宽度(默认包括补白和边框)
- 此方法对可见和隐藏元素均有效

## jq 文档处理

### \$("div").append("<p></p>")

- 向每个匹配的(div)元素内部`追加`(后面)内容(p 标签)
- 这个操作与对指定的元素执行 appendChild 方法，将它们添加到文档中的情况类似

```js
$("div").append((index, html) => {
  console.log(rest);
  // index 为div的下标
  // html为div的内容
  return "<p>111</p>";
});
// ...rest用()框起来
$().append((...rest) => {
  console.log(rest);
  //
  return "<p>111</p>";
});
```

### \$("div").prepend("<p></p>")

- 向每个匹配的(div)元素内部的最前面添加内容(p 标签)

### \$("p").appendTo("div")

- 会把原始的 p 移除
- 把所有的 p 标签(包括内容)放入每一个 div 中

### \$("div").after("<p></p>")

- 向每个匹配的(div)元素的后面添加内容(p 标签)

### \$("<p></p>").insertAfter("div")

- 把(p 标签)内容添加到匹配的(div)元素后面
- 与 after 一样

### \$("div").before("<p></p>")

- 向每个匹配的(div)元素的前面添加内容(p 标签)
- 与 after 相反

### \$("<p></p>").insertBefore("div")

- 把(p 标签)内容添加到匹配的(div)元素前面
- 与 before 一样
- 与 insertAfter 相反

### \$("p").wrap("<div class="father"></div>")

- 向匹配的(p)元素每一个都添加一个父级 div
- "认爹"

### \$("p").unwrap()

- 移除匹配的(p)元素的父级
- "逝父"

### \$("p").wrapAll()

- 向匹配的所有(p)元素添加同一个父级 div
- "大家一起认一个爹"

### \$("div").wrapInner("<div class="father"></div>")

- 将每一个匹配的 div 元素的子内容(包括文本节点)用一个新的 div 包裹起来
- "儿子变孙子"

### \$("p").replaceWith("<b></b>")

- 将所有匹配的 p 元素替换成指定的 HTML 或 DOM 元素(b 标签)

### \$("<b></b>").replaceAll("p")

- 用匹配的元素(b 标签)替换掉所有匹配到的元素(p 标签)

### \$("div").empty()

- 把 div 内的所有元素(包括文本)`全部删除`

### \$("p").remove()

- 移除所有匹配的 p 标签
- "自杀，并且所有遗产都没有"

### \$("p").detach()

- 所有绑定的事件、附加的数据等都会保留下来
- "自杀，保留遗产，为了复活"

### \$("div").clone(true/false)

- 不传参默认浅克隆，true(深克隆)/false(浅克隆)
  - 与原生不一样
  - 所有找到的 div 都会被克隆
- 与原生 cloneNode(true/false)类似
  - true 完全复制(深克隆)
  - false 只复制标签外表，不包括内容(浅克隆)
  - 原生克隆不会复制事件(例如 click 等事件，不管是一级还是二级)
  - 被克隆对象在 script 中写所有事件和自定义属性都不会克隆
  - 行内事件本质上是自执行的，为零级事件，与 js 内设置的绑定事件不一样；此时 onclick 相当于写了标签属性，所以写在行内时会克隆这个属性

### id 的唯一性

- id 获取时，只会获取第一个，后面的不管
- 但不报错

## es6

### const 常量

- 申明的变量不能进行二次等号赋值，再次赋值会操错；
- 但引用性数据，例如[]数组,{}json 对其添加内容不会报错;
- 只是不能改变它的地址指向，它并不是只读的，数组和 json 添加内容时都没有改变它的地址指向

### 解构赋值

- [] = []/{} = {}

```js
// 对应赋值
let [a, b, c] = [1, 2, 3];
// 匹配模式，同名赋值
// 属性匹配，赋值
let { x: d, y: e } = {
  x: 4,
  y: 5,
};
// 属性名与值一致时可以简写
let { d: d, e: e } = {
  d: 4,
  e: 5,
};
let { d, e } = {
  d: 4,
  e: 5,
};
```

- 展开运算符“...”

```js
let [...a] = [1, 2, 3];
// 将类数组展开转换成真的数组
let box = [...document.getElementsByTagName("div")];
```

- 惰性求值

```js
let { a: f = 1 } = {
  a: undefined,
};
// f = 1
```

- 默认值

```js
function fn(x = 1, y = 2) {}
fn();
```

- 使用

```js
let { max, min } = Math;
max(1, 10); // 10
min(1, 10); // 1
```

```js
function fn(obj) {
  let { a, b, c } = obj;
}
function fn(arr) {
  let [a, b, c] = arr;
}
function fn([a, b, c]) {}
let arr = [1, 2, 3];
fn(arr);
// es6中没arguments，不确定传的参数时用...
function fn(...a) {}
```

## es6 字符串扩展

### 查询(返回布尔值)

#### str.includes(str1, num)

- str 内是否存在 str1
- 有返回 true
- 没有返回 false
- num：从什么位置开始

```js
let str = "hello javascript";
str.includes("java"); //返回true，存在
```

#### str.startWith(str1, num)

- str 是否以 str1 开始
- 有返回 true
- 没有返回 false
- num：从什么位置开始

```js
let str = "hello javascript";
str.includes("java"); //返回true，存在
```

#### str.endWith(str1, length)

- str 是否以 str1 结束
- 有返回 true
- 没有返回 false
- length：选择字符串长度```

#### attributes

> 一个节点的所有属性

- nodeName 属性名
- nodeValue 属性值

#### document.createDocumentFragment()

> dom 标签片段仓库

- 虚拟的 dom
- 在需要连续添加 dom 节点时使用
- 提高性能

## 回调地狱

### Promise(异步操作)

解决异步回调，但不是最优秀的

```js
Promise(异步操作)
  .then(回调-- - 1)
  .then(回调1的回调-- - 2)
  .then(回调2的回调-- - 3);
```

```js
new Promise((resolve, reject) => {
  // resolve成功
  // reject失败
  $.ajax({
    success(msg) {
      resolve(msg);
    },
    error(error) {},
  });
})
  .then((data) => {
    // then的第一个参数为resolve(msg)成功的回调函数传的值
    // 一般接收成功用then
    $.ajax({
      success(msg) {
        resolve(msg);
      },
      error(error) {},
    });
  })
  .catch((err) => {
    // 一般接收失败用catch
    console.log(err);
  });
```

#### p = Promise.all([new Promise, new Promise, new Promise])

- 所有成功即成功，返回所有成功参数的数组
- 有一个失败即失败，返回第一个失败的结果

#### p = Promise.race([p1, p2, p3])

- 最先成功的函数的返回的状态就是他的状态

### async 函数

es2017 提出

## DOM(document object model)文档对象模型

> 文档对象模型是表示和操作 HTML、XML 文档内容的基础 API
> 当网页被加载时，浏览器会根据 DOM 模型将文档解析成一系列节点，构成了一个树状结构。

![image](https://7n.w3cschool.cn/attachments/image/20170619/t_document.png)

> 图中每一个方框都是一个节点，表示一个 node 对象，所有的 node 构成了 DOM Tree

### 节点有 7 个类型

- **Document：整个文档树的顶层节点**
- DocumentType：比如<!DOCTYPE html>
- **Element：网页的各种 HTML 标签**
- Attribute：网页元素的属性
- Text：标签之间或标签包含的文本
- Comment：注释
- DocumentFragment：文档片段

### 通过 CSS 选择器选取元素

```js
document.querySelectorAll(".div"); //选择所有class为div的元素
document.querySelectorAll('[data-tip="title"]'); //选择所有data-tip为title的元素
document.querySelectorAll("div:not(.ignore)"); //选择所有claa不为ignore的div元素
```

- 不支持伪元素的选择器，比如：first-line 和 first-letter；也不支持伪类的选择器，比如：link 和：visited。

## 文档结构的遍历

> Document 对象、它的 Element 对象和文档中表示文本的 Text 对象都是 Node 对象。

### Node 属性：

- parentNode

> 作为**元素树**遍历，只遍历 Element 对象，不包含 Text 和 Comment 对象

- children：返回 NodeList 对象，children 列表只包含 Element 对象。（下同）
- nextElementChild、lastElementChild
- nextElementSibling、previousElementChild
- childElementCount：返回子元素数量，同 children.length
- offsetParent：返回最靠近当前元素的父元素，且此父元素 position 不为 static

> 作为**节点树**遍历，因此会有 Text 和 Comment 对象。@不推荐 🤮

- childNodes：返回只读类数组对象(NodeList 对象)，包含 Text 和 Comment。
- firstChild、lastChild：分别返回第一个子节点、最后一个子节点，同样包含 Text 和 Comment
- nextSibling、previousSibling：分别返回下一个兄弟节点、前一个兄弟节点，包含 Text 和 Comment
- textContent：返回该节点和它所有后代节点的文本内容
- nodeType：返回该节点类型代号-number
- nodeName：返回该节点类型名称-string
- nodeValue：返回 Text 和 Comment 的文本内容，其他类型的节点将返回 null

### NodeList 和 HTMLCollection

- NodeList 实例对象可能是动态集合也可能是静态集合。DOM Tree 每新增或删除一个节点，都可以反映在 NodeList 接口中。NodeList 实例对象提供 length 属性和数字索引，但不能使用 pop（）、push（）之类数组特有的方法。
- HTMLCollection 实例对象同 NodeList 实例对象，也是节点的集合，返回类数组对象。
- HTMLDocument 类中，有一些属性可以快捷访问节点。比如 images、forms、links 属性指向类数组\<img>、\<form>、\<a>元素集合，返回的都是 HTMLCollection 实例对象。

![HTMLDocument](/images/blog/old/js.jpg)

- **注: HTMLDocument 是类名，调用的是类的实例如 document**

```js
document.forms.length; //返回document文档里<form>个数
document.doby; //返回<body>
document.head; //返回<html>
document.documentElement; //返回<html>
```

|          | HTMLDocument         | NodeList               |
| -------- | -------------------- | ---------------------- |
| 节点类型 | Element              | Element、Text、Comment |
| 实例对象 | 只能是动态集合       | 可动态可静态           |
| 索引方式 | 可数字还可 class、id | 只能数字索引           |

## 文档的内容

- innerHTML：返回当前元素包含的 Element+Text，可读可写
- outerHTML:返回当前元素及当前元素包含的 Element+Text，可读可写
- textContext：返回当前元素中所有后代节点的所有纯文本，可读可写。若写的内容包含 Element，如<.span>，文档节点不会改动，因为此时<.span>被当作纯文本处理而不是标签。

```js
<div id="div">
  <p>123</p>
</div>;
var d = document.getElementById("div");
d.innerHTML; // "<p>123</p>"
d.outerHTML; // "<div id="div"><p>123</p></div>"
/*写innerHTML*/
d.innerHTML = "<span>99</span>";
// <div id="div"><span>99</span></div>
//标签被换了
```

- insertAdjacentHTML(beforebegin|afterbegin|beforeend|afterend,'tag')
  - 此方法可将 HTML 标记符插入到指定元素的指定位置，第一个参数为插入的位置，第二个参数为要插入的标签名称

![image](https://7n.w3cschool.cn/attachments/image/20170619/t_insertAdjacentHTML.png)

- document.createElement('tag')：创建一个标签
- document.createTextNode('these are some text ~')：创建文本节点
- createAttribute('attribute','value'); 为一个标签创建属性
- cloneNode('tag',true|false); 复制一个标签，第二个参数可选，默认 false（不复制子标签）

|        | appendChild(new)           | insertBefore(new,old)   |
| ------ | -------------------------- | ----------------------- |
| 相同点 | 都是在子元素列表中插入元素 |
| 不同点 | 在子元素列表的最后插入     | 在 old 元素前面插入 new |

**注：如果要插入的节点是已存在与文档中，那么将从原来的位置移除插到指定位置。**

- parentNode.removeChild(childnode)：父元素调用此方法删除一个子元素
- parentNode.replaceChild(newNode,oldNode)：父元素调用此方法，替换掉一个不需要的子元素。

> DocumentFragment 是一种特殊的 Node，它作为其他节点的一个临时的容器。DocumentFragment 是独立的，而不是任何其他文档的一部分。它的 parentNode 总是为 null。但类似 Element，它可以有任意多的子节点，也可以使用 appendChild()等方法。

- DocumentFragment 的特殊之处在于它使得一组节点被当做一个节点看待。

```js
var frag = docment.createDocumentFragment();
```

## 坐标、尺寸

- getBoundingClienRect()：返回一个 rectangle 对象，此对象有 width、height、left、right、top、bottom
- 由于元素的默认 position 为 static，是相对于 viewport 的（视口：实际显示 DOM 文档的部分——不包括浏览器的标签栏、搜索栏等），因此会随着页面滚动变化。实现位置固定的一种方法：left+window.scollX, top+window.scollY
- elementFromPoint(X,Y)：返回在指定位置的一个元素
- Element.scrollLeft 属性表示网页元素的水平滚动条向右侧滚动的像素数
- Element.scoollTop 属性表示网页元素的垂直滚动条向下滚动的像素数

```js
//查看整张网页的水平的和垂直的滚动距离
document.body.scrollLeft;
document.body.scrollTop;
//这两个属性都可读可写
```

> 还可以用 scrollBy(X, Y )控制网页的滚动
> 所有元素都有 clientWidth、clientHeight 属性，值为 width+padding，不包含 border、margin、滚动条

```js
//没有垂直滚动条时
document.documentElement.clientHeight === window.innerHeight; // true
```

> 对于<.i>、<.code>和<.span>这些内联元素，clientWidth 和 clientHeight 总是 0

- scollWidth、scollHeight 属性，值也是 width+padding，但包括溢出内容的 width

- offsetWidth 为 clientWidth+border

### Document 属性

- domain 当前文档的域名
- lastModified 文档修改时间的字符串
- location 与 window 对象的 located 属性引用同一个 location 对象
- referree 返回一个字符串，表示访问本文档的来源。如果无法获取来源或用户直接键入网址，则返回空字符串
- title title 节点之间的内容可读写
- doctype document 两个子节点的第一个子节点<!DOCTYPE html>
- documentElement document 两个子节点的第二个子节点<.html>
- defaultview 返回 window 对象
- activeElement 返回文档中当前获得焦点的那个元素
- characterset 返回渲染当前文档的字符集
- readyState 返回当前文档状态 1loading 加载 HTML2interactive 加载外部资源 3complete 加载完成

### Document 方法

- write() writerIn()
  - 可为标签设置 contenteditable 属性为 true 使其可被编辑

### execCommand（aCommandName, aShowDefaultUI, aValueArgument）

- 功能：插入元素、改变样式

### HTML 属性

- getAttribute('attr') 返回属性值
- seAttribute('attr', 'value') 为元素新增/修改属性
- hasAttribute('attr') 判断某元素是否有某属性，返回布尔值
- removeAttribute('attr') 为元素移除属性

### 数据集（dataset）属性

- 在 HTML5 文档中，任意以'data-'为前缀的小写属性都是合法的
- Element 有一个 dataset 属性，Element.dataset 对应一个对象，这个对象的属性对应于'data-'后面的部分，如果有多个-则用驼峰命名。

```html
<div id="top" data-tip="title"></div>
<script>
  var t = document.getElementById("top");
  t.dataset.tip; //title
  t.dataset.tip = "title2"; //该属性是实时双向的，任何改变都会影响标签原属性
</script>
```

### attribute 属性是只读类数组对象，索引方式有多种

```js
document.body.attributes[0]; //<body>元素的第一个属性
document.body.attributes.bgcolor; // <body>元素的bgcolor属性
document.body.attributes["ONLOAD"]; // <body>元素的onload属性。
//同时，属性节点又有name(nodeName)和value（nodeValue）的属性
var t = document.getElemntById("top");
t.attributes[0].name; // "id"
t.attributes[0].nodeName; // "id"
t.attributes[0].value; // "top"
t.attributes[0].nodeValue; // "top"
```

## CSS

- Element.style 返回的值是一个 CSSStyleDeclaration

```js
var t = document.getElementById("top");
t.style.color = "red";
//或
t.setAttribute("style", "background:red;");
```

- style 对象的 cssText 也可以用来读写或删除整个 style 属性。

```js
t.style.cssText = "background:red";
```

- **写法注意**
  - float 在 JS 中是关键字，因此要写 style.cssFloat
  - border-left-width 要写 borderLeftWidth
  - 三个方法的第一个参数，都是 CSS 属性名，且不用改写连词线。

```js
t.style.setProperty("background-color", "red");
t.style.getPropertyValue("background-color");
t.style.removeProperty("background-color");
```

### window.getComputedStyle()

- 可以用来获取 CSS 伪对象伪元素的样式，第一个参数是元素，第二个参数通常为 null 或空字符串，但也可以是 :before :after :first-line first-letter

```html
<style>
  #top {
    line-height: 30px;
  }
  #top:before {
    content: "before";
    color: red;
  }
</style>
<div id="top" style="background:red"></div>
<script>
  var t = document.getElementById("top");
  window.getComputedStyle(t, null).lineHeight; //30px 去掉连字符
  window.getComputedStyle(t, null).getPropertyValue("line-height"); //30px，无需去掉连字符
  window.getComputedStyle(t, ":before").content; // "before"
</script>
```
