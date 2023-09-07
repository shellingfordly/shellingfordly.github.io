---
title: 139 单词拆分
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 139 单词拆分

## dfs

深度优先搜索，当拆分的前缀字符串在字典中存在时，从 i 之后的字符串再去拆分查找，如果后面的字符串拆分都能查询，则返回 true；如果后面的单词拆分不能找到对应的，i++，前缀单词增加一个字符，继续去查后面的字符串，直到`startIndex=s.length`。

优化重复查找，声明 history 变量存在某个位置(i)的字符串是否存在，从 history 查询到 i 之前的前缀字符串已经存在/不存在时，就可以直接返回

```ts
export function wordBreak(s: string, wordDict: string[]): boolean {
  const length = s.length;
  const dict = new Set(wordDict);
  const history: boolean[] = Array.from({ length });

  const dfs = (startIndex: number): boolean => {
    if (startIndex === length) return true;
    if (history[startIndex] !== undefined) return history[startIndex];
    for (let i = startIndex + 1; i <= length; i++) {
      const prefix = s.slice(startIndex, i);
      if (dict.has(prefix) && dfs(i)) {
        history[i] = true;
        return true;
      }
    }
    history[startIndex] = false;
    return false;
  };

  return dfs(0);
}
```
