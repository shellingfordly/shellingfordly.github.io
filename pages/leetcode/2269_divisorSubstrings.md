---
title: 2269. 找到一个数字的 K 美丽值
date: 2024-8-7 14:32:54
tags:
  - algorithms
---

# 2269. 找到一个数字的 K 美丽值

一个整数 num 的 k 美丽值定义为 num 中符合以下条件的 子字符串 数目：

- 子字符串长度为 k 。
- 子字符串能整除 num 。
- 给你整数 num 和 k ，请你返回 num 的 k 美丽值。

注意：

- 允许有 前缀 0 。
- 0 不能整除任何值。
- 一个 子字符串 是一个字符串里的连续一段字符序列。

示例 1：

> 输入：num = 240, k = 2
>
> 输出：2
>
> 解释：以下是 num 里长度为 k 的子字符串：
>
> - "240" 中的 "24" ：24 能整除 240 。
> - "240" 中的 "40" ：40 能整除 240 。
>   所以，k 美丽值为 2 。

示例 2：

> 输入：num = 430043, k = 2
>
> 输出：2
>
> 解释：以下是 num 里长度为 k 的子字符串：
>
> - "430043" 中的 "43" ：43 能整除 430043 。
> - "430043" 中的 "30" ：30 不能整除 430043 。
> - "430043" 中的 "00" ：0 不能整除 430043 。
> - "430043" 中的 "04" ：4 不能整除 430043 。
> - "430043" 中的 "43" ：43 能整除 430043 。
>   所以，k 美丽值为 2 。

提示：

- 1 <= num <= 109
- 1 <= k <= num.length （将 num 视为字符串）

## 方法：滑动窗口

刚做完[1456. 定长子串中元音的最大数目](/leetcode/1456_maxvowels)，同样的思路

固定 k 长度的字符串，判断是否满足整除条件

从 k 处遍历，截取 start 到 i 处的字符判断，满足+1

```ts
function divisorSubstrings(num: number, k: number): number {
  const isBeauty = (n: string) => Number(n) > 0 && num % Number(n) == 0;
  const str = num.toString();

  let count = 0;
  let start = 0;
  if (isBeauty(str.slice(start, k))) {
    count++;
  }

  for (let i = k; i < str.length; i++) {
    start++;
    if (isBeauty(str.slice(start, i + 1))) {
      count++;
    }
  }

  return count;
}
```

- 简化一下

取 start 到 end 长度为 k 的字符串，判断是否满足条件，满足则+1
start 从 0 开始，end 从 k 开始

```ts
function divisorSubstrings(num: number, k: number): number {
  const isBeauty = (n: string) => Number(n) > 0 && num % Number(n) == 0;

  let count = 0;
  const str = num.toString();

  for (let start = 0, end = k; end <= str.length; end++, start++) {
    if (isBeauty(str.slice(start, end))) {
      count++;
    }
  }

  return count;
}
```
