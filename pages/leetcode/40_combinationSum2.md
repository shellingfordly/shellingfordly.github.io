---
title: 40. 组合总和 II
date: 2022-09-22 16:18:42
tags:
  - algorithms
---

# 40. 组合总和 II

给定一个候选人编号的集合 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。

candidates 中的每个数字在每个组合中只能使用 一次 。

注意：解集不能包含重复的组合。

- 示例 1:

```
输入: candidates = [10,1,2,7,6,1,5], target = 8,
输出:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

- 示例 2:

```
输入: candidates = [2,5,2,1,2], target = 5,
输出:
[
[1,2,2],
[5]
]
```

- 提示:

```
1 <= candidates.length <= 100
1 <= candidates[i] <= 50
1 <= target <= 30
```

## 解答

本题和[39. 组合总和](https://github.com/shellingfordly/algorithms/tree/master/src/39_combinationSum)十分相似，几乎可以完全套用 39 题的代码，只需要做一点点的改动。

由于 39 题是可以重复使用一个数字的，因此传递下去的 begin 是不变的，而 40 题中每个数字只能出现一次，因此我们只需要将传入递归中 **begin = i+1**即可；

当然，只是这样的话，结果依然可能出现重复项，因为 candidates 内部的数字是有可能重复的；可以直接将 candidates 进行裁剪传递下去；

这样每次递归传递 **candidates.slice(i + 1)**，满足每个数字也只会使用一次，然后判断**candidates[i]**是否等于**candidates[i - 1]**，如果相同则跳过此数的查找。

```ts
dfs(i + 1, d, path, res);
```

- 疑问

为什么不能只传递使用 i+1，然后去判断 i 和 i-1 是否相等来去重？

只传递 i 下标时，使用的 candidates 是不变的，因为我们已经排序过了，有可能出现多项重复数字，在判断 i 和 i-1 可能会导致丢失一些解，例如：

```
candidates = [1,1,1,2], target = 3
前面三个数都是 1，因此都会跳过，结果只会有 [1,2] 的组合
```

而裁切的方式就不会出现这样的情况了

```
candidates = [1,1,1,2], target = 3

i = 0时
path candidates target
[1]     [1,1,2]   2
[1,1]   [1,2]     1
[1,1,1] [2]       0
res = [[1,1,1]]
pop.....
[1]     [2]       2
res = [[1,1,1],[1,2]]
pop.....
最外层的循环i = 1，2 时都会 continue，i = 3 时已经没有后续的数相加了，结束递归。
```

- 代码

```ts
function combinationSum2(candidates: number[], target: number): number[][] {
  const path: number[] = [];
  const res: number[][] = [];

  candidates = candidates.sort((a, b) => a - b);
  dfs(candidates, target, path, res);

  function dfs(
    candidates: number[],
    target: number,
    path: number[],
    res: number[][]
  ) {
    if (target == 0) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < candidates.length; i++) {
      const d = candidates[i - 1];
      if (d < 0) break;
      if (candidates[i] == candidates[i - 1]) continue;
      path.push(candidates[i]);
      dfs(candidates.slice(i + 1), d, path, res);
      path.pop();
    }
  }

  return res;
}
```
