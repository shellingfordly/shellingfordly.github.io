---
title: 49. 字母异位词分组
date: 2023-04-03 16:34:25
tags:
  - algorithms
---

# 49. 字母异位词分组

给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。

字母异位词 是由重新排列源单词的字母得到的一个新单词，所有源单词中的字母通常恰好只用一次。

- 示例 1:

```
输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

- 示例 2:

```
输入: strs = [""]
输出: [[""]]
```

- 示例 3:

```
输入: strs = ["a"]
输出: [["a"]]
```

- 提示：
  - 1 <= strs.length <= 104
  - 0 <= strs[i].length <= 100
  - strs[i]  仅包含小写字母

## 解答

### 解一

遍历 strs，保存第一个字符串，后面的依次比对，如果是异位字符串添加到同一数组

```ts
function groupAnagrams(strs: string[]): string[][] {
  const result: string[][] = [];

  for (let i = 0; i < strs.length; i++) {
    const str = strs[i];
    if (!result.length) {
      result[0] = [str];
    } else {
      let isFind = false;
      for (let i = 0; i < result.length; i++) {
        const s = result[i][0];
        if (isAnagramsWord1(str, s)) {
          result[i].push(str);
          isFind = true;
        }
      }
      if (!isFind) {
        result.push([str]);
      }
    }
  }

  return result;
}
```

比对是否为异位字符串

直接将数组排序转成字符串对比会超时

用对象记录比对不超时，但还是很慢

```ts
// 超时
function isAnagramsWord(s1: string, s2: string) {
  if (s1.length !== s2.length) return false;

  const obj1 = s1.split("").sort();
  const obj2 = s2.split("").sort();

  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// 2s
function isAnagramsWord1(s1: string, s2: string) {
  if (s1.length !== s2.length) return false;
  const obj: Record<string, number> = {};

  for (let i = 0; i < s1.length; i++) {
    const s = s1[i];
    obj[s] ? obj[s]++ : (obj[s] = 1);
  }

  for (let i = 0; i < s2.length; i++) {
    const s = s2[i];
    if (!obj[s]) return false;
    obj[s]--;
  }

  return Object.values(obj).reduce((p, n) => p + n, 0) === 0;
}
```

### 解二

先将字符串转为数组排序生成 key 值，使用 map 记录 key 值，相同 key 值的字符串添加到同一数组，实质上是双 for，但快了很多

```ts
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (let i = 0; i < strs.length; i++) {
    const arr = Array.from(strs[i]);
    arr.sort();
    const key = arr.toString();
    const list = map.has(key) ? map.get(key) : [];

    list?.push(strs[i]);
    map.set(key, list!);
  }

  return [...map.values()];
}
```
