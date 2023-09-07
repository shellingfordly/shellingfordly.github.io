---
title: 35. 搜索插入位置
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 35. 搜索插入位置

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 O(log n) 的算法。

- 示例 1:

```
输入: nums = [1,3,5,6], target = 5
输出: 2
```

- 示例 2:

```
输入: nums = [1,3,5,6], target = 2
输出: 1
```

- 示例 3:

```
输入: nums = [1,3,5,6], target = 7
输出: 4
```

- 提示:

```
1 <= nums.length <= 104
-104 <= nums[i] <= 104
nums 为 无重复元素 的 升序 排列数组
-104 <= target <= 104
```

## 解答

### 暴力解法

便利整个 nums，当遇到第一个大于等于 target 的数时返回 index

时间复杂度：O(n)
空间复杂度：O(1)

```ts
function searchInsert1(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= target) return i;
  }
  return nums.length;
}
```

### 二分查找

本题核心是为了找到 **>=target** 的最接近 target 的值

当 **nums[mid] >= target** 时，记录下标，移动 right 为 mid-1，找到更接近 target 的值；
当小于时，移动 left 为 mid+1；

如果循环结束 ans 没有被赋值，则说明 target>nums[i]，则返回 nums.length

```ts
function searchInsert(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  let ans = nums.length;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] >= target) {
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return ans;
}
```
