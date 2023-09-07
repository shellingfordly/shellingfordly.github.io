---
title: 28. 实现 strStr()
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 28. 实现 strStr()

实现 strStr() 函数。

给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回 -1 。

- 说明：

当 needle 是空字符串时，我们应当返回什么值呢？这是一个在面试中很好的问题。

对于本题而言，当 needle 是空字符串时我们应当返回 0 。这与 C 语言的 strstr() 以及 Java 的 indexOf() 定义相符。

- 示例 1：

```
输入：haystack = "hello", needle = "ll"
输出：2
```

- 示例 2：

```
输入：haystack = "aaaaa", needle = "bba"
输出：-1
```

- 提示：

```
1 <= haystack.length, needle.length <= 104
haystack 和 needle 仅由小写英文字符组成
```

## 解答

### 一

```ts
export function strStr(haystack: string, needle: string): number {
  for (let i = 0; i < haystack.length; i++) {
    if (haystack[i] == needle[0]) {
      let isStr = true;
      for (let j = 1; j < needle.length; j++) {
        if (haystack[i + j] != needle[j]) {
          isStr = false;
          break;
        }
      }
      if (isStr) {
        return i;
      }
    }
  }
  return -1;
}
```

### 二

```ts
export function strStr1(haystack: string, needle: string): number {
  for (let i = 0; i < haystack.length; i++) {
    if (
      haystack[i] == needle[0] &&
      haystack.slice(i, i + needle.length) == needle
    )
      return i;
  }
  return -1;
}
```

### 三

```ts
export function strStr2(haystack: string, needle: string): number {
  return haystack.indexOf(needle);
}
```
