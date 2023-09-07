---
title: 4. 寻找两个正序数组的中位数
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 4. 寻找两个正序数组的中位数

给定两个大小分别为 m 和 n 的正序（从小到大）数组  nums1 和  nums2。请你找出并返回这两个正序数组的 中位数 。

算法的时间复杂度应该为 O(log (m+n)) 。

- 示例 1：

```
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```

- 示例 2：

```
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

- 提示：

```
nums1.length == m
nums2.length == n
0 <= m <= 1000
0 <= n <= 1000
1 <= m + n <= 2000
-106 <= nums1[i], nums2[i] <= 106
```

## 思路

由于 js 原生 api 的优势，js 做这题十分简单

只需要合并两个数组用 sort 排序，判断数组长度是单数还是双数取中间一位还是两位的平均数

```ts
export function findMedianSortedArrays(
  nums1: number[],
  nums2: number[]
): number {
  const list = [...nums1, ...nums2].sort();
  const mid = Math.floor(list.length / 2);

  return !(list.length % 2) ? (list[mid - 1] + list[mid]) / 2 : list[mid];
}
```
