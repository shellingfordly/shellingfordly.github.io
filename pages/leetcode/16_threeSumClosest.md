---
title: 16. 最接近的三数之和
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 16. 最接近的三数之和

给你一个长度为 n 的整数数组 nums 和 一个目标值 target。请你从 nums 中选出三个整数，使它们的和与 target 最接近。

返回这三个数的和。

假定每组输入只存在恰好一个解。

- 示例 1：

```
输入：nums = [-1,2,1,-4], target = 1
```

- 输出：2

```
解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
```

- 示例 2：

```
输入：nums = [0,0,0], target = 1
输出：0
```

- 提示：

```
3 <= nums.length <= 1000
-1000 <= nums[i] <= 1000
-104 <= target <= 104
```

## 解法

### 排序 + 双指针

本题和[15. 三数之和](https://github.com/shellingfordly/algorithms/tree/master/src/15_threeSum)十分相似，只是把找三数之和换成了找最接近的数。

可以套用 15 题的做法，排序+双指针查询。固定一个数 nums[i]，从剩下的数中枚举出另个数 nums[l] 和 nums[r]，对比相加的结果。

- 最好的情况是两个数相等，可以直接返回;
- 如果 n > target，由于是有序的，可以移动右指针让数变小，即 `r--`;
- 如果 n < target，移动左指针尝试让数变大，即 `l++`;

```ts
export function threeSumClosest1(nums: number[], target: number): number {
  if (!nums || nums.length < 3) return 0;
  let result = Infinity;
  nums = nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    let l = i + 1;
    let r = nums.length - 1;

    while (l < r) {
      const n = nums[i] + nums[l] + nums[r];
      if (n === target) return n;

      if (Math.abs(n - target) < Math.abs(result - target)) result = n;

      if (n > target) r--;
      else l++;
    }
  }
  return result;
}
```

### 优化

上面的实现会出现一些重复的查找，可以去掉这些重复项

- result 取前三个数相加替换特殊值，length 为 3 时直接返回；
- 当固定的数 nums[i] 相同时，跳过；
- 当查询的数相同时：
  - nums[l] 和 nums[l+1] 相同，l++；
  - nums[r] 和 nums[r-1] 相同，r++；

```ts
export function threeSumClosest(nums: number[], target: number): number {
  const length = nums.length;
  if (!nums || length < 3) return 0;
  let result = nums[0] + nums[1] + nums[2];
  if (length === 3) return result;

  nums = nums.sort((a, b) => a - b);

  for (let i = 0; i < length - 2; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) {
      continue;
    }

    let l = i + 1;
    let r = nums.length - 1;

    while (l < r) {
      const n = nums[i] + nums[l] + nums[r];
      if (n === target) return n;

      if (Math.abs(n - target) < Math.abs(result - target)) result = n;

      if (n > target) {
        while (l < r - 1 && nums[r] == nums[r - 1]) r--;
        r--;
      } else {
        while (l + 1 < r && nums[l + 1] == nums[l]) l++;
        l++;
      }
    }
  }
  return result;
}
```

但是这个真的是个玄学东西，尤其在 leetcode 上。没有优化之前能在 `108ms` 通过，优化之后反而需要 184ms。只是说按道理来说是减少了查询的，是会更快的。

![](/images/leetcode/16_threeSumClosest.png)
