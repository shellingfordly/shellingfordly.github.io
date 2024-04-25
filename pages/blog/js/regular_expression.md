---
title: 正则表达式学习记录
date: 2019-10-09 17:06:12
tags:
  - 正则
---

# 正则表达式学习记录

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
正则表达式(regular expression)描述了一种字符串匹配的模式（pattern），可以用来检查一个串是否含有某种子串、将匹配的子串替换或者从某个串中取出符合某个条件的子串等。

</span>

<!-- more -->

## 语法大纲

- `.` 任何单个字符，除换行符(即\n、\r)
- `\s` 所有空白符，包括换行，即[\f\n\r\t\v]
- `\S` 任何非空白符，不包括换行，即[^\f\n\r\t\v]
- `\w` 字母、数字、下划线，即[A-Za-z0-9_]
- `\d` 0 到 9， 即[0-9]
- `\f` 换页符
- `\n` 换行符
- `\r` 回车符
- `\t` 制表符， 即[\x09 和 \cI]
- `\v` 垂直制表符
- `^` 开始位置
- `$` 结尾位置
- `|` 两项之间的一个选择
- `()` 获取子表达式
- `*` 零次或多次
- `+` 一次或多次
- `?` 零次或一次
- `{n}` 匹配 n 次
- `{n,}` 至少匹配 n 次
- `{n,m}` n<=m，最少匹配 n 次且最多匹配 m 次

## 正则表达式

- 正则是一个对象

### 规则

- 字面量方式 //
- 构造函数

```js
let reg = new RegExp("字符串");
```

### 元字符

在正则中有特殊意义

#### \d 和\D

- \d 匹配数字
- \D 匹配非数字

#### \s 和\S

- \s 空格
- \S 非空格

#### \w 和\W

- \w 数字、字符、下划线\_
- \W 除\w 之外的所有字符

#### \b

独立部分/单词边界

> 指的是匹配到一个完整的独立的单词，其前后都没有多余的东西；除\w 匹配的数字、字符、下划线之外的所有字符都可以被认为是单词边界(,;.中文等)，包括起始位置和终止位置

```js
let str = "hhelloo 1hello,hello_ 中文hello.";
let reg = /\bmy\b/;
// 将会匹配到最后一个hello
console.log(str.match(reg));
```

#### .

匹配任意字符，不包括 **\n**和 **\r**

#### \

将有意义的字符转换为普通字符；对正则中所有有意义的字符的匹配时都必须使用“\”转义

```js
let str = "abc . def";
// 直接写 /./ 将匹配到a
let reg = /\./;
// 返回 .
console.log(str.match(reg));
```

#### \r

制表符，基本看不到

#### 量词/数量

匹配相同规则连续出现 n 词的字符

- 只对紧跟着的前面的规则连续匹配

```js
let str = "12345 67890";
// 匹配3个数字
let reg = /\d{3}/;
```

规则

- {n} n 个
- {n,m} 最少 n 个，最多 m 个
- {n,} 最少 n 个，最多无穷个

简写

- {0,} === \* 表示 0 到正无穷个
- {1,} === + 表示 1 到正无穷个
- {0,1} === ? 表示要么有 1 个，要么没有

#### 贪婪匹配

量词默认使用贪婪模式匹配，从最大值开始匹配。若满足最大值则递减直到最小值，否则匹配失败

```js
let str = "12345 67890";
// 匹配5个数字
let reg = /\d{2,10}/;
```

#### 非贪婪/懒惰匹配

在量词后加上 **?** 则表示使用懒惰模式匹配

```js
let str = "12345 67890";
// 匹配2个数字
let reg = /\d{2,10}?/;
```

### 修饰符/标识符

#### g

golbal 全局匹配，匹配整个字符串中所有符合正则规则的全部字符串

```js
let str = "1231adad124314cszf45";
let reg = /\d+/g;
// 返回 [ '1231', '124314', '45' ]
console.log(str.match(reg));
```

#### i

忽略大小写

```js
let str = "abc";
let reg = /ABC/gi;
// 返回 ["abc"]
console.log(str.match(reg));
```

#### m

换行匹配

#### ()组/子项

将()内的字符串作为一个整体来匹配

```js
let str = "abccccabc";
let reg = /abc+/g;
// 此时得到的结果为 [ 'abcccc', 'abc' ]
console.log(str.match(reg));
// 此时得到的结果为 [ 'abc', 'abc' ]
reg = /(abc)+/g;
console.log(str.match(reg));
```

- \1 表示第一个子集匹配的内容
- \2 表示第二个子集匹配的内容
- 以此类推

```js
let str = "abcabcbc";
let reg = /(abc)\1/g;
console.log(str.match(reg)); // [ 'abcabc' ]
reg = /(aa)|(bc)\2/;
console.log(str.match(reg)); // [ 'bcbc' ]
```

#### ^

匹配以某字符串为起始的字符串

```js
let str = "abccccabc";
let reg = /^abc/g;
```

#### \$

匹配以某字符串为结束的字符串

```js
let str = "abccccabc";
let reg = /^abc$/g;
```

#### []字符集

匹配符合区间内的字符

1. 字段：返回两个字符的 Unicode 码之间的所有对应的字符
2. 在字符集中的`(){}//?+*-`等有特殊意义的字符都会失去其意义，变为普通字符

- [1-9][a-z]

```js
let str = "abcdefgabcd";
let reg = /[a-c]/g;
// [ '1', '2', '3' ]
console.log(str.match(reg));
```

- [123] 表示或者，1 或者 2 或者 3

```js
let str = "123456789";
let reg = /[123]/;
console.log(str.match(reg)); //[ '1' ]
reg = /[123]/g; // 匹配全部
console.log(str.match(reg)); //[ '1', '2', '3' ]
```

- 匹配中文的 Unicode 码：[\u4e00-\u9fa5]

```js
let str = "中abcdefgabcd文";
let reg = /[\u4e00-\u9fa5]/g;
```

- 在[]字符集中^有特殊含义，表示匹配除了^后的字符的所有字符

```js
let str = "123a";
let reg = /[^12]/g;
console.log(str.match(reg)); // [ '3', 'a' ]
```

#### str1 | str2

或者

- 匹配时`|`前后的字符串将被视为一个整体
- 若找到 str1 则返回匹配到的 str1；若没有则寻找 str2
- 若加上 g 全局匹配，则匹配到 str1 和 str2

```js
let str = "abcdefgabcd";
let reg = /a|b/;
console.log(str.match(reg)); // 匹配到 a
```

### 方法

#### reg.test(str)

检测 str 字符串中是否有符合正则匹配规则的字符串

```js
let str = "这是一个字符串";
let reg = /字符串/;
console.log(reg.test(str)); //值为true
```

#### str.match(reg)

返回匹配规则的字符串数组
