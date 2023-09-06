---
title: 11. 盛最多水的容器
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 11. 盛最多水的容器

给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

说明：你不能倾斜容器。

- 示例 1：

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

- 示例 2：

```
输入：height = [1,1]
输出：1
```

- 提示：

```
n == height.length
2 <= n <= 105
0 <= height[i] <= 104
```

## 思路

接水容器的大小取决于短板的长度，因此我们需要去找大最大的短边。声明两个指针从数组的左边和右边开始扫描，很容易能计算出面积为 `j-i` 乘上最短边，即 `(j - i) * Math.min(height[i], height[j])`；然后去移动较短一边的指针，寻找更长的边。

```ts
export function area(height: number[]): number {
  let i = 0;
  let j = height.length - 1;
  let result = 0;

  while (i < j) {
    const left = height[i];
    const right = height[j];
    const h = Math.min(left, right);
    result = Math.max(result, (j - i) * h);
    left > right ? j-- : i++;
  }

  return result;
}
```
