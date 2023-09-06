---
title: 17. 电话号码的字母组合
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 17. 电话号码的字母组合

给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

- 示例 1：

```
输入：digits = "23"
输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

- 示例 2：

```
输入：digits = ""
输出：[]
```

- 示例 3：

```
输入：digits = "2"
输出：["a","b","c"]
```

- 提示：

```
0 <= digits.length <= 4
digits[i] 是范围 ['2', '9'] 的一个数字。
```

## 解法

### 回溯

[leetcode 参考题解](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/solution/tong-su-yi-dong-dong-hua-yan-shi-17-dian-hua-hao-m/)

这一题需要使用回溯，原因是每次需要从输入的数字中取一个数字对应的字符串中取出一个字符，和下一个数字对应字符串中取一个字符进行拼接；

直到取到最后一个数字对应的字符串时，对每个字符进行组合，添加到结果数组；然后返回上一个数字对应字符串，取下一个字符与最后一个组合，然后再返回上一层；

![](/images/leetcode/17_letterCombinations.png)

#### 代码

记录每次取出的字符，进入递归，用 slice 获取下一个数字；反复递归直到数字取完，添加字符串 `con`；返回上一层递归。

```ts
export function letterCombinations(digits: string): string[] {
  const hashMap: Record<string, string> = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };
  const res: string[] = [];

  function backtrack(con: string, next: string) {
    // 没有下一个数字输入了，添加字符串
    if (next.length == 0) con && res.push(con);
    else {
      // 数字对应的字符串
      const s = hashMap[next[0]];
      for (let i = 0; i < s.length; i++) {
        // 每次取一个字符，然后取下一个数组字符串中的字符
        backtrack(con + s[i], next.slice(1));
      }
    }
  }

  if (digits) backtrack("", digits);
  return res;
}
```

执行过程

```
backtrack("" , "23")
2 -> abc
i = 0
backtrack("a", "")
3 -> def
j = 0
backtrack("ad", "")
push
j = 1
backtrack("ae", "")
push
j = 2
backtrack("af", "")
j = 3 return
i = 1
backtrack("b", "3")
3 -> def
j = 0
backtrack("bd", "")
push
...

```
