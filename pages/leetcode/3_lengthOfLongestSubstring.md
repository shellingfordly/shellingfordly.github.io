---
title: 3. 无重复字符的最长子串
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 3. 无重复字符的最长子串

> 给定一个字符串 s ，请你找出其中不含有重复字符的   最长子串   的长度。

- 示例  1:

```
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

- 示例 2:

```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

- 示例 3:

```
输入: s = "pwwkew"
输出: 3
```

> 解释: 因为无重复字符的最长子串是  "wke"，所以其长度为 3。请注意，你的答案必须是 子串 的长度，"pwke"  是一个子序列，不是子串。

- 提示：

```
0 <= s.length <= 5 \* 104
s  由英文字母、数字、符号和空格组成
```

## 思路

声明两个指针变量 i 和 j，一开始 i 指向字符串的第一个字符，j 指向第二个字符。

然后在循环中，截取 `i~j` 的字符(不包含 j 下标)判断是否包含 `s[j]` 字符；

如果包含，则取 `j-i` 和 count 的最大值更新 count，然后增加 i；因为此时截取的字符串已经存在 `s[j]` 字符，需要更新 i 的位置获取新的字符串。（这时候不管 s[j]是等于 s[i]，还是 i 到 j 之间，这个判断语句只更新了 i，因此会一直++到不存在 s[j]字符的字符串）；

如果不包含，则 `j++`。

需要处理一点边缘 case，因为 j 是从 1 开始的，所以当 s 的长度为 1 时，进入不了循环，count 为 0；

当 s 字符串没有重复字符时，走完循环也没有更新 count，因此返回的时候再取一个 `j-i` 与 count 的最大值；同时也解决了 s 长度为 1 的情况

当 s 为空时，上面的处理会导致 `count = 1`；因此需要单独处理。

```ts
function lengthOfLongestSubstring(s: string): number {
  const len = s.length;
  if (!len) return 0;
  let count = 0;
  let i = 0;
  let j = 1;

  while (j < len) {
    if (s.slice(i, j).includes(s[j])) {
      count = Math.max(count, j - i);
      i++;
    } else {
      j++;
    }
  }
  return Math.max(count, j - i);
}
```
