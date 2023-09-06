---
title: 15. 三数之和
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 15. 三数之和

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

- 示例 1：

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
```

- 示例 2：

```
输入：nums = []
输出：[]
```

- 示例 3：

```
输入：nums = [0]
输出：[]
```

- 提示：

```
0 <= nums.length <= 3000
-105 <= nums[i] <= 105
```

## 排序 + 双指针搜索

直接暴力解法很难去解决去重这个问题

先对数组排序，排完序便于跳出重复数字的循环；以及当数字已经大于 0 时可以提前退出循环

排序之后，固定一位数，生命 l 和 r 两个指针分别从固定位后一位和数组最后一位寻找相加等于 0 的数；

- 当三数相加大于 0 时，说明数 r 指向的正数大了，此时 r 应该左移 `r--`；
- 当三数相加小于 0 时，说明数 l 指向的复数小了，此时 l 应该右移 `l++`；
- 当三数相加小于 0 时，添加到结果数组中，为了避免添加组合，l 右移和 r 左移对比数字是否相同，直到不同时退出循环，此时数字还是相同的，还需要执行 `l++; r--` 修正一下位置。

## 代码

```ts
export function threeSum(nums: number[]): number[][] {
  if (nums.length < 3) return [];
  const result: number[][] = [];
  nums = nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    if (nums[i] > 0) break;

    let l = i + 1;
    let r = nums.length - 1;

    while (l < r) {
      const n = nums[i] + nums[l] + nums[r];
      if (n > 0) {
        r--;
      } else if (n < 0) {
        l++;
      } else {
        result.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        r--;
        l++;
      }
    }
  }
  return result;
}
```
