---
title: js实现中文数字计算器
date: 2022-07-15 17:49:00
tags:
  - js
---

# js 实现中文数字计算器

要实现数学表达式计算器，涉及到两个方法，[波兰表示法(维基百科)](https://zh.wikipedia.org/wiki/%E6%B3%A2%E5%85%B0%E8%A1%A8%E7%A4%BA%E6%B3%95#:~:text=%E6%B3%A2%E5%85%B0%E8%A1%A8%E7%A4%BA%E6%B3%95%EF%BC%88Polish%20notation,%E7%94%A8%E4%BA%8E%E7%AE%80%E5%8C%96%E5%91%BD%E9%A2%98%E9%80%BB%E8%BE%91%E3%80%82)和[逆波兰表示法(维基百科)](https://zh.wikipedia.org/wiki/%E9%80%86%E6%B3%A2%E5%85%B0%E8%A1%A8%E7%A4%BA%E6%B3%95)，详细的概念可以自行查看百科。

波兰表达式是将操作符前置，也就是前缀表达式；逆波兰表达式是将操作符后置，即后缀表达式。而我们正常去输入的叫中缀表达式，要是直接去对中缀表达式进行计算，那么优先级的判断就不是很方便，而前缀或者后缀就很方便去写计算逻辑。

### 效果展示

- [在线 Demo](https://shellingfordly.github.io/my-tools/#/common/counter)
- [代码地址](https://github.com/shellingfordly/my-tools)

![chinese_ calculator](/images/blog/chinese_calculator.gif)

## 实现思路

### 转换表达式

所以首要任务是将输入的数学表达式进行转换，在这里我选择的是将中缀转换成后缀表达式来计算，当然用前缀也一样。

我们需要声明两个栈，一个用来存符号，一个用来存输出的后缀表达式。

```ts
const stack: string[] = [];
const output: string[] = [];
```

先处理输入的表达式字符串，将其分割为数字和符号两种，都存在同一个数组中。这里我将`-`(减号)替换成`+`号处理，方便后面做计算。

split 支持使用正则表达式去分割字符串，这里就是用操作符去分割字符串，需要注意的是，得加上将正则匹配项加上()，split 才会收集用来分割的操作符。

```ts
const reg = new RegExp(/(\+|\*|x|\/|\(|\))/g);
const list = value.replace(/\-/g, "+-").split(reg);
```

- 符号优先级

用一个对象去记录符号的优先级，方便转换的时候判断是符号还是数字，以及入栈的顺序。

优先级 `) < 加减 < 乘除 < (`

这里多加了 `x` 是因为我想用 x 表示乘法，打字时少按一个键

```ts
export const Single = {
  "+": 1,
  "-": 1,
  "*": 2,
  x: 2,
  "/": 2,
  "(": 3,
  ")": -1,
};
```

- 核心转换逻辑

便利我们处理好的 list，我没有提前对空格做处理，因为我不想先用 filter 便利一遍，所以在转换得时候得去判断一下，如果 `str` 为空，跳过此次循环；

`str` 有两种情况，数字或者是操作符：

数字很简单，直接 `push` 到 `output` (最终的表达式)中；

如果是操作符，就要分情况处理了。

- 当栈顶没有元素时，直接 push 到 `stack` 操作符栈中
- 如果当前操作符的优先级大于栈顶元素，或者当前是左括号操作符，直接推到符号栈，由于我用 pop 获取的栈顶元素，因此还得把栈顶元素 push 回去
- 如果当前操作符的优先级小于栈顶元素，则把栈顶元素 push 到表达式栈中，然后继续获取栈顶元素
  - 当栈顶元素是 `(` 并且当前操作符不是 `)` ，需要把 `(` push 回去，保证括号内表达式的优先级
  - 当遇到 `)` 时，`(` 就被 pop 掉了

这里没有直接去判断 str 是否等于 `()` ，因为我们提前做了优先级的设定的

`(` 的优先级最高，会被直接推入栈中； `)` 的优先级最低，遇到时会把左括号后的操作符处理掉，并且做了 `index>0` 的限制，右括号不会入栈。

```ts
for (let i = 0; i < list.length; i++) {
  const str = list[i];
  if (!str) continue;
  const index = Single[str];
  if (!!index) {
    let topValue = stack.pop() || "";
    let topIndex = Single[topValue];
    if (topIndex === undefined) {
      stack.push(str);
      continue;
    }

    if (index > topIndex || topIndex === 3) {
      stack.push(topValue);
      stack.push(str);
      continue;
    } else {
      while (topIndex && index <= topIndex) {
        if (topIndex < 3) output.push(topValue);
        topValue = stack.pop() || "";
        topIndex = Single[topValue];
        // 处理括号
        // topIndex === 3 标识 符号 栈顶 为 (
        // index > 0 表示 当前检索 符号 不为 )
        // 由于符号 不为 ) 时，pop掉的 ( 需要加回去
        if (topIndex === 3 && index > 0) {
          stack.push(topValue);
          break;
        }
      }
      if (index > 0) stack.push(str);
    }
  } else if (/\d/.test(str)) {
    output.push(str);
  }
}
```

### 计算表达式

其实主要麻烦就在转换表达式，转换完成后就很简单了。后缀表达式的计算逻辑就是遇到操作出栈两个元素，进行运算。

- 声明计算方法
- 声明计算方法对应的操作符

```ts
const counterFn = {
  add: (a: number, b: number) => a + b,
  minus: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => a / b,
};
const counterMap = {
  "+": counterFn.add,
  "-": counterFn.minus,
  "*": counterFn.multiply,
  x: counterFn.multiply,
  "/": counterFn.divide,
};
```

遍历后缀表达式，数字之间入栈

遇到操作符，获取对应的计算方法，出栈两个元素，进行计算

```ts
export function counter(list: string[]) {
  const stack: number[] = [];
  let result = 0;

  for (let i = 0; i < list.length; i++) {
    const value = list[i];
    if (/\d/.test(value)) {
      stack.push(Number(value));
    } else {
      const a = stack.pop() || 0;
      const b = stack.pop() || 0;
      const res = counterMap[value](b, a);
      stack.push(res);
      result = res;
    }
  }
  return result;
}
```

## 扩展

再顺便加一点好玩的东西，输入的是中文数字的话能计算吗

OK，来做一下中文数字的兼容，去写中文数字转换阿拉伯数字太麻烦也有点复杂，我直接找了一个第三库[cnwhy/nzh](https://github.com/cnwhy/nzh)

其实使用库就变得很简单了，因为核心逻辑我们已经写好了，只需要在处理字符串的时候兼容中文数字就可以了。

给我们的正则匹配项加上中文操作符，就可以根据 `加|减|乘|除|左括号|右括号` 来进行分割。还有一个问题，那数字呢，数字还是中文啊，不能进行计算；当然也可以在这里遍历分割的数组，用 map 把去处理中文数字，但是我不想在这里多一次数组的循环，去转换逻辑里面做。

```ts
const reg = new RegExp(/(\+|\*|x|\/|\(|\)|\^|加|减|乘|除|左括号|右括号)/g);
```

只需要在转换的判断逻辑最后加上一个 else 调用 nzh 提供的 `Nzh.cn.decodeS` 方法转换一下即可。因为除了操作符和数字，就是中文数字了。

```ts
import Nzh from "nzh";

if (/\d/.test(str)) {
  output.push(str);
} else {
  output.push(Nzh.cn.decodeS(str));
}
```

细心的小伙伴应该发现了，还有一个问题，转换了数字，操作符还是中文呢。中文操作符我们不在这里处理，只需要再计算中给 `counterMap` 多加几个映射就可以了。

```ts
const counterMap: any = {
  "+": counterFn.add,
  "-": counterFn.minus,
  "*": counterFn.multiply,
  x: counterFn.multiply,
  "/": counterFn.divide,
  加: counterFn.add,
  减: counterFn.minus,
  乘: counterFn.multiply,
  除: counterFn.divide,
};
```

OK，大功告成，一个数学表达式的计算工具就完成了，并且支持中文数字计算。当然，还有一个问题，没有对输入的字符串做错误处理以及提示，今天暂时不弄了，改天再弄吧。
