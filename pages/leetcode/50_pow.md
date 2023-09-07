---
title: 50. pow
date: 2023-04-03 17:10:48
tags:
  - algorithms
---

# 50. pow

实现  pow(x, n) ，即计算 x 的整数  n 次幂函数（即，xn ）。

- 示例 1：

```
输入：x = 2.00000, n = 10
输出：1024.00000
```

- 示例 2：

```
输入：x = 2.10000, n = 3
输出：9.26100
```

- 示例 3：

```
输入：x = 2.00000, n = -2
输出：0.25000
解释：2-2 = 1/22 = 1/4 = 0.25
```

- 提示：
  - -100.0 < x < 100.0
  - -231 <= n <= 231-1
  - n  是一个整数
  - -104 <= xn <= 104

## 解

其实本身 js 做数据计算就有精度问题

直接递归会超时，计算本身也需要时间

如果是 2 的倍数，则用 n/2 计算再取结果的平方
不是则多乘一个 x

```ts
function myPow(x: number, n: number): number {
  const _pow = (x: number, n: number): number => {
    if (n == 0) return 1;

    const r = _pow(x, Math.floor(n / 2));
    return n % 2 == 0 ? r * r : r * r * x;
  };
  if (n === 0) return 1;

  return n > 0 ? _pow(x, n) : 1 / _pow(x, -1 * n);
}
```
