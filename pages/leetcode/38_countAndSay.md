---
title: 38. 外观数列
date: 2022-09-20 15:34:32
tags:
  - algorithms
---

# 38. 外观数列

> 给定一个正整数 n ，输出外观数列的第 n 项。

「外观数列」是一个整数序列，从数字 1 开始，序列中的每一项都是对前一项的描述。

你可以将其视作是由递归公式定义的数字字符串序列：

countAndSay(1) = "1"
countAndSay(n) 是对 countAndSay(n-1) 的描述，然后转换成另一个数字字符串。
前五项如下：

1. 1
2. 11
3. 21
4. 1211
5. 111221

第一项是数字 1

描述前一项，这个数是 1 即 “ 一 个 1 ”，记作 "11";

描述前一项，这个数是 11 即 “ 二 个 1 ” ，记作 "21";

描述前一项，这个数是 21 即 “ 一 个 2 + 一 个 1 ” ，记
作 "1211";

描述前一项，这个数是 1211 即 “ 一 个 1 + 一 个 2 + 二 个 1 ” ，记作 "111221"。

> 要描述一个数字字符串，首先要将字符串分割为 最小 数量的组，每个组都由连续的最多 相同字符 组成。然后对于每个组，先描述字符的数量，然后描述字符，形成一个描述组。要将描述转换为数字字符串，先将每组中的字符数量用数字替换，再将所有描述组连接起来。

- 示例 1：

```
输入：n = 1
输出："1"
解释：这是一个基本样例。
```

- 示例 2：

```
输入：n = 4
输出："1211"
解释：
countAndSay(1) = "1"
countAndSay(2) = 读 "1" = 一 个 1 = "11"
countAndSay(3) = 读 "11" = 二 个 1 = "21"
countAndSay(4) = 读 "21" = 一 个 2 + 一 个 1 = "12" + "11" = "1211"
```

- 提示：

```
1 <= n <= 30
```

## 解答

### 遍历递推

通过第一项递推出后面的所有项

遍历上一项的字符串，依次记录出现的次数和字符，合并结果；
遍历此结果得出下一项。

- 保存每项字符和出现次数

```ts
function countAndSay1(n: number): string {
  let str = "1";
  for (let i = 1; i < n; i++) {
    const hash: [string, number][] = [];
    let index = 0;
    for (let j = 0; j < str.length; j++) {
      if (str[j] === str[j - 1]) {
        hash[index - 1][1]++;
      } else {
        hash[index] = [str[j], 1];
        index++;
      }
    }
    str = hash.reduce((p, q) => p + q[1] + q[0], "");
  }
  return str;
}
```

- 记录字符起始位置

用一个变量保存字符，一个变量保存字符，一个变量来递增查找字符，直到出现不同字符时，记录更新字符串；

```ts
function countAndSay2(n: number): string {
  let str = "1";
  for (let i = 1; i < n; i++) {
    let start = 0;
    let end = 0;
    let temp = "";
    while (end < str.length) {
      while (str[end] == str[start]) {
        end++;
      }
      // str[start] 某个字符
      // end - start 为 str[start] 字符出现次数
      temp += end - start + str[start];
      start = end;
    }
    // 更新字符串为 上一项的解释字符
    str = temp;
  }
  return str;
}
```
