---
title: 7. 整数反转
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 7. 整数反转

- [源码](https://github.com/shellingfordly/algorithms/tree/master/src/7_reverse/reverse.ts)
- [测试](https://github.com/shellingfordly/algorithms/tree/master/src/7_reverse/reverse.spec.ts)

## 题目

给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 [−231, 231 − 1] ，就返回 0。

假设环境不允许存储 64 位整数（有符号或无符号）。

- 示例 1：

```
输入：x = 123
输出：321
```

- 示例 2：

```

输入：x = -123
输出：-321
```

- 示例 3：

```
输入：x = 120
输出：21
```

- 示例 4：

```
输入：x = 0
输出：0
```

-提示：

```
-231 <= x <= 231 - 1
```

## 解法

- 将数组转换成字符串用 split 切割成数组然后 reverse 反转数组 再 join 连接成字符串，最后转成数字
  - 需要注意负数处理和大数处理

```ts
export function reverse1(x: number): number {
  const min = Math.pow(-2, 31);
  const max = Math.pow(2, 31) - 1;
  let s = String(x);
  if (x < 0) {
    s = s.replace("-", "") + "-";
  }
  const res = Number(s.split("").reverse().join(""));

  if (res < min || res > max) return 0;
  return res;
}
```

- 由于数组的下标和数字的位数刚好相反，数字切割成数组之后直接处理相加

```ts
export function reverse(x: number): number {
  if (!x) return x;
  const _x = Math.abs(x);
  const res = String(_x)
    .split("")
    .reduce((p, n, i) => p + Number(n) * Math.pow(10, i), 0);

  if (res < Math.pow(-2, 31) || res > Math.pow(2, 31) - 1) return 0;

  return res * (x / _x);
}
```

- 用取余的方法拿到每一位数字，然后处理相加

```ts
export function reverse(x: number): number {
  if (!x) return x;
  let _x = Math.abs(x);
  const arr: number[] = [];

  while (_x >= 1) {
    arr.push(_x % 10);
    _x = Math.floor(_x / 10);
  }

  const res = arr.reduce(
    (p, n, i) => p + Number(n) * Math.pow(10, arr.length - i - 1),
    0
  );

  if (res < Math.pow(-2, 31) || res > Math.pow(2, 31) - 1) return 0;

  return x < 0 ? res * -1 : res;
}
```

三个方法速度其实没有太大悬殊，至少在 js 中是这样

第一种因为多调了 reverse 和 join，所以最慢；业务中影响不大

第二种多调了 split 切割，稍微慢一点；

第三种纯数字的处理只需要 reduce 相加结果（当然，直接写 for 也一样），速度最快；

![](/images/leetcode/7_reverse.png)
