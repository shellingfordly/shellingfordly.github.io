---
title: 46. 全排列
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 46. 全排列

给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

- 示例 1：

```
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

- 示例 2：

```
输入：nums = [0,1]
输出：[[0,1],[1,0]]
```

- 示例 3：

```
输入：nums = [1]
输出：[[1]]
```

- 提示：

```
1 <= nums.length <= 6
-10 <= nums[i] <= 10
nums 中的所有整数 互不相同
```

## 解法

此题和[17. 电话号码的字母组合](https://github.com/shellingfordly/algorithms/tree/master/src/17_letterCombinations)十分类似，我们依旧可以用回溯的方式来实现。

[leetcode 题解](https://leetcode.cn/problems/permutations/solution/hui-su-suan-fa-python-dai-ma-java-dai-ma-by-liweiw/)

### 回溯

遍历 nums，取第一个数保存到 con 中；将 con 和裁剪掉此数的数组递归处理；取出第一个数添加到 con 中，直到裁剪的数组为空时，得到第一种顺序排列的数组添加的结果数组中。

需要注意的是，由于我们递归时传递的 con 是数组，会一直被重复使用；因此我们需要在得到一种顺序之后将 con 数组回溯。

但是我们也不能直接将 con 数组置空，在只有两个数字的时候；比如 [1, 2]，置空没有影响，因为选了 1 之后只有 2 可选，选了 2 就结束了递归。这时置空数组，重新添加以 2 开头的排序。

但是当数字大于两个时就不行了，当递归结束的时候，所有顺序的排序并没有完成添加，需要保存前面的顺序，改变后面数字的顺序，因此应该没有递归结束之后 pop 出 con 的最后一个值；重新添加新的数字组成不同顺序。

```ts
export function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  function backtrack(con: number[], _nums: number[]) {
    if (_nums.length == 0) {
      res.push([...con]);
    } else {
      for (let i = 0; i < _nums.length; i++) {
        con.push(_nums[i]);
        backtrack(con, [..._nums.slice(0, i), ..._nums.slice(i + 1)]);
        con.pop();
        // con = [];
      }
    }
  }
  if (nums.length) backtrack([], nums);
  return res;
}
```
