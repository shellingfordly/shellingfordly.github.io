---
title: 1456. 定长子串中元音的最大数目
date: 2024-8-7 13:56:35
tags:
  - algorithms
---

# 1456. 定长子串中元音的最大数目

给你字符串 s 和整数 k 。

请返回字符串 s 中长度为 k 的单个子字符串中可能包含的最大元音字母数。

英文中的 元音字母 为（a, e, i, o, u）。

示例 1：

> 输入：s = "abciiidef", k = 3
> 输出：3
> 解释：子字符串 "iii" 包含 3 个元音字母。

示例 2：

> 输入：s = "aeiou", k = 2
> 输出：2
> 解释：任意长度为 2 的子字符串都包含 2 个元音字母。

示例 3：

> 输入：s = "leetcode", k = 3
> 输出：2
> 解释："lee"、"eet" 和 "ode" 都包含 2 个元音字母。

示例 4：

> 输入：s = "rhythms", k = 4
> 输出：0
> 解释：字符串 s 中不含任何元音字母。

示例 5：

> 输入：s = "tryhard", k = 4
> 输出：1

提示：

- 1 <= s.length <= 10^5
- s 由小写英文字母组成
- 1 <= k <= s.length

## 方法一：暴力解法

无法通过

```ts
function maxVowels(s: string, k: number): number {
  const vowel = "aeiou";
  let short = 0;
  let count = 0;
  let sum = 0;
  let tag = true;

  for (let i = 0; i < s.length; i++) {
    if (vowel.includes(s[i])) {
      count++;
      tag = false;
    } else {
      if (tag) short = i;
    }

    if (i - short == k - 1) {
      sum = Math.max(sum, count);
      count = 0;
      short++;
      i = short - 1;
    }
  }
  return sum;
}
```

## 方法二：滑动窗口

定长滑动窗口

先取到固定长度 k 的位置，得到满足字符的数量
取第一位字符串，如果满足减一，不满足数量不变
取下一位字符串，如果满足则加一，不满足不变

```ts
function maxVowels(s: string, k: number): number {
    const vowel = "aeiou"
    let count = 0;
    let sum = 0;

    for (let i = 0; i < k; ++i) {
        if (vowel.includes(s[i])) count++
    }

    sum = count

    for (let i = k; i < s.length; ++i) {
        if (vowel.includes(s[i - k])) count--
        if (vowel.includes(s[i])) count++

        sum = Math.max(sum, count)
    }

    return sum;
};
```
