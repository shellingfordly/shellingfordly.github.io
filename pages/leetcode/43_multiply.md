---
title: 43. 字符串相乘
date: 2022-09-28 10:09:23
tags:
  - algorithms
---

# 43. 字符串相乘

给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。

注意：不能使用任何内置的 BigInteger 库或直接将输入转换为整数。

示例 1:

输入: num1 = "2", num2 = "3"
输出: "6"
示例 2:

输入: num1 = "123", num2 = "456"
输出: "56088"

提示：

1 <= num1.length, num2.length <= 200
num1 和 num2 只能由数字组成。
num1 和 num2 都不包含任何前导零，除了数字 0 本身。

## 解答

由于 **num1 \* num2** 的最大长度为 **m+n**，创建长度为 m+n 的数组存储乘积。

num1[i] \* num2[j] 的个位放入 arr[i+j+1] 中，十位放入 arr[i+j] 中。

最终遍历数组处理大于 10 的数，进位，join 连接数组输出结果。

```ts
function multiply(num1: string, num2: string): string {
  if (num1 == "0" || num2 == "0") return "0";

  let m = num1.length;
  let n = num2.length;
  let arr: number[] = Array(m + n).fill(0);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const r = Number(num1[i]) * Number(num2[j]);
      arr[i + j + 1] += r % 10;
      arr[i + j] += Math.floor(r / 10);
    }
  }

  for (let i = m + n - 1; i > 0; i--) {
    if (arr[i] >= 10) {
      arr[i - 1] += Math.floor(arr[i] / 10);
      arr[i] = arr[i] % 10;
    }
  }

  if (arr[0] === 0) arr.shift();
  return arr.join("");
}
```

由于从左到右遍历不符合我们做大数乘法的计算，模拟纸面上计算大数乘法，从个位相乘然后相加；

从右向左遍历时，将 num1[i]\*num2[j] 的结果加上原本 arr[i+j+1] 处的数，也就是加上乘积个位上个的数，再取十位和个位。

由于是从右向边左遍历，即使 i+j 处大于 10，也会被进位，就不需要最后做一次遍历处理相加时产生的大于 10 的数。

```ts
function multiply1(num1: string, num2: string): string {
  if (num1 == "0" || num2 == "0") return "0";
  let m = num1.length;
  let n = num2.length;
  let arr: number[] = Array(m + n).fill(0);

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let sum = Number(num1[i]) * Number(num2[j]) + arr[i + j + 1];
      arr[i + j] += Math.floor(sum / 10);
      arr[i + j + 1] = sum % 10;
    }
  }
  if (arr[0] === 0) arr.shift();
  return arr.join("");
}
```
