---
title: 12. 整数转罗马数字
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 12. 整数转罗马数字

罗马数字包含以下七种字符： I， V， X， L，C，D 和 M。

| 字符 | 数值 |
| ---- | ---- |
| I    | 1    |
| V    | 5    |
| X    | 10   |
| L    | 50   |
| C    | 100  |
| D    | 500  |
| M    | 1000 |

例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做 XXVII, 即为 XX + V + II 。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。

给你一个整数，将其转为罗马数字。

- 示例 1:

```
输入: num = 3
输出: "III"
```

- 示例 2:

```
输入: num = 4
输出: "IV"
```

- 示例 3:

```
输入: num = 9
输出: "IX"
```

- 示例 4:

```
输入: num = 58
输出: "LVIII"
解释: L = 50, V = 5, III = 3.
```

- 示例 5:

```
输入: num = 1994
输出: "MCMXCIV"
解释: M = 1000, CM = 900, XC = 90, IV = 4.
```

- 提示：

```
1 <= num <= 3999
```

## 思路

用一个对象记录下 `1/4/5/9/10...` 这些特殊的数字。

把数字各个位数上的数字取出来放在数组中，遍历数字，查看 hash 中是否存在此数。

不存在遍历遍历添加对应位数的罗马数，比如 30 就添加几个 3 个 X

```ts
export function intToRoman(num: number): string {
  const hash: Record<number, string> = {
    1: "I",
    4: "IV",
    5: "V",
    9: "IX",
    10: "X",
    40: "XL",
    50: "L",
    90: "XC",
    100: "C",
    400: "CD",
    500: "D",
    900: "CM",
    1000: "M",
  };
  const arr: number[] = [];
  while (num > 0) {
    arr.push(num % 10);
    num = Math.floor(num / 10);
  }

  let result = "";
  for (let i = arr.length - 1; i >= 0; i--) {
    const a = arr[i];
    const k = Math.pow(10, i);
    const v = hash[k * a];
    if (v) result += v;
    else {
      let j = k * a;
      if (a > 5) {
        j -= k * 5;
        result += hash[k * 5];
      }
      while (j > 0) {
        result += hash[k];
        j -= k;
      }
    }
  }
  return result;
}
```

### 贪心

每次都用最大的数来表示，将哈希表从大到小顺序排列，遍历哈希表，遇到比 num 小的第一个数就添加值，并让 num 减掉这个数，直到 num 为 0

```ts
export function intToRoman(num: number): string {
  const hash: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [v, k] of hash) {
    while (num >= v) {
      result += k;
      num -= v;
    }
    if (num == 0) break;
  }

  return result;
}
```
