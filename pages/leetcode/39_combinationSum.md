---
title: 39. 组合总和
date: 2022-09-21 11:00:32
tags:
  - algorithms
---

# 39. 组合总和

给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。

candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。

对于给定的输入，保证和为 target 的不同组合数少于 150 个。

- 示例 1：

```
输入：candidates = [2,3,6,7], target = 7
输出：[[2,2,3],[7]]
解释：
2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
7 也是一个候选， 7 = 7 。
仅有这两种组合。
```

- 示例 2：

```
输入: candidates = [2,3,5], target = 8
输出: [[2,2,2,2],[2,3,3],[3,5]]
```

- 示例 3：

```
输入: candidates = [2], target = 1
输出: []
```

- 提示：

```
1 <= candidates.length <= 30
1 <= candidates[i] <= 200
candidate 中的每个元素都 互不相同
1 <= target <= 500
```

## 回溯 + 剪枝

[leetcode 题解](https://leetcode.cn/problems/combination-sum/solution/hui-su-suan-fa-jian-zhi-python-dai-ma-java-dai-m-2/)

此类问题可以通过画出树形图来分析，再进行编码。通过递归实现每条路径

```
递归之前 => 2，剩余 = 5
递归之前 => 2,2，剩余 = 3
递归之前 => 2,2,2，剩余 = 1
递归之后 => 2,2
递归之前 => 2,2,3，剩余 = 0
递归之后 => 2,2
递归之后 => 2
递归之前 => 2,3，剩余 = 2
递归之后 => 2
递归之后 =>
递归之前 => 3，剩余 = 4
递归之前 => 3,3，剩余 = 1
递归之后 => 3
递归之后 =>
递归之前 => 6，剩余 = 1
递归之后 =>
递归之前 => 7，剩余 = 0
递归之后 =>
```

![](/images/leetcode/39_combinationSum_1.png)

- 优化

将 candidates 排序，当 **target - candidates[i] < 0** 时，结束

![](/images/leetcode/39_combinationSum_2.png)

```ts
function combinationSum1(candidates: number[], target: number): number[][] {
  const path: number[] = [];
  const res: number[][] = [];

  candidates = candidates.sort((a, b) => a - b);
  dfs(0, target, path, res);

  function dfs(begin: number, target: number, path: number[], res: number[][]) {
    if (target == 0) {
      res.push([...path]);
      return;
    }

    for (let i = begin; i < candidates.length; i++) {
      if (target - candidates[i] < 0) break;
      path.push(candidates[i]);
      dfs(i, target - candidates[i], path, res);
      path.pop();
    }
  }

  return res;
}
```
