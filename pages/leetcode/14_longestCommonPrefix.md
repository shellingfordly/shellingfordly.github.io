---
title: 14. 最长公共前缀
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 14. 最长公共前缀

编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

- 示例 1：

```
输入：strs = ["flower","flow","flight"]
输出："fl"
```

- 示例 2：

```
输入：strs = ["dog","racecar","car"]
输出：""
解释：输入不存在公共前缀。
```

- 提示：

```
1 <= strs.length <= 200
0 <= strs[i].length <= 200
strs[i] 仅由小写英文字母组成
```

## 纵向扫描

找到 strs 中最短的字符串，循环最短长度，每一遍对比每一个的字符的第一个、第二个...字符是否相等，如果不想等，直接返回；循环结束，找到公共前缀（如果循环没有提前退出，也就是最短字符串为公共前缀）。

```ts
export function longestCommonPrefix(strs: string[]): string {
  let j = 0;
  let prefix = "";
  let minLength = Math.min(...strs.map((v) => v.length));

  while (minLength > 0) {
    prefix += strs[0][j];
    for (let i = 0; i < strs.length; i++) {
      if (strs[i][j] !== prefix[j]) {
        return prefix.slice(0, j);
      }
    }
    j++;
    minLength--;
  }

  return prefix;
}
```

时间复杂度是 O(mn)，m 是字符串数量，n 是最短字符串长度+2。

- 精简优化代码

取第一个字符串做 prefix，进行对比，遇到不同字符返回 `0～j` 下标位置的字符串；

不需要计算最短长度，因为当某个字符串的字符取不到的时候就会触发返回条件了。

```ts
export function longestCommonPrefix1(strs: string[]): string {
  let prefix = strs[0];
  for (let j = 0; j < prefix.length; j++) {
    for (let i = 1; i < strs.length; i++) {
      if (strs[i][j] !== prefix[j]) {
        return prefix.slice(0, j);
      }
    }
  }
  return prefix;
}
```

### 横向搜索

取两个字符串，找出它们的公共前缀，再用此前缀继续和后面的字符串找公共前缀

```ts
export function longestCommonPrefix(strs: string[]): string {
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    prefix = commonPrefix(prefix, strs[i]);
    if (!prefix) break;
  }
  function commonPrefix(str1: string, str2: string) {
    let j = 0;
    while (j < str1.length && str1[j] == str2[j]) j++;
    return str1.slice(0, j);
  }
  return prefix;
}
```
