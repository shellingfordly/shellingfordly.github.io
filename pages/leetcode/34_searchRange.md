---
title: 34. 在排序数组中查找元素的第一个和最后一个位置
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 34. 在排序数组中查找元素的第一个和最后一个位置

给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 target，返回 [-1, -1]。

你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

- 示例 1：

```
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
```

- 示例 2：

```
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
```

- 示例 3：

```
输入：nums = [], target = 0
输出：[-1,-1]
```

- 提示：

```
0 <= nums.length <= 105
-109 <= nums[i] <= 109
nums 是一个非递减数组
-109 <= target <= 109
```

## 解答

### 暴力解法

直接遍历 nums，找到第一个等于 target 和最后一个等于 target 的数的位置

时间复杂度：O(n)
空间复杂度：O(1)

```ts
function searchRange(nums: number[], target: number): number[] {
  let result = [];

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== target) continue;
    if (result.length) result[1] = i;
    else result[0] = i;
  }

  if (result.length == 1) result[1] = result[0];
  else if (result.length == 0) result = [-1, -1];

  return result;
}
```

### 二分查找

使用二分查找去查找和 target 相等的数，但我们不知道这个数是第几次出现；因此我们得查两次，一次找到目标数最左边的位置，一次找目标数最右边的位置。

找第一次出现的位置：
当 **nums[mid] < target** 时，说明 mid 左边都小于 target，因此 **left = mid + 1**；
当 **nums[mid] == target**时，因为我们要去找第一次出现的位置；因此 mid 右边的位置不需要去考虑了，这时候应该去找左边是否还存在 target；如果没有，则第一次出现位置为 mid，因此 **right = mid**。

找最后一次出现的位置
和找第一次差不多，不同的是在 **nums[mid] == target** 时，因为我们要去找最后一次出现的位置，所以应该在 mid 右边找是否还有等于 target 的值，因此 **left = mid**；
需要注意的一个点，当取 mid 值时，**(left+right)/2** 会出现 mid 一直等于 left 的情况，这时如果 nums[left/mid]==target，循环就会一直卡在 **left = mid** 的是循环中，因此在取 mid 时应该+1，**(left + right + 1) / 2** 也就是向上取整，这样 mid 就会取到 left 的下一位，避免 left 和 mid 取同值导致无法退出循环的情况。

而在取第一次位置时不需要是因此，left = mid 时，移动的是 right 值，而且本身就是取靠左的位置，而取最后一次时需要尽可能的靠右。

```ts
function searchRange2(nums: number[], target: number): number[] {
  function findPosition(nums: number[], target: number, type: number): number {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right + type) / 2);
      if (nums[mid] < target) {
        left = mid + 1;
      } else if (nums[mid] == target) {
        !type ? (right = mid) : (left = mid);
      } else {
        right = mid - 1;
      }
    }
    if (nums[left] == target) return left;
    return -1;
  }

  const left = findPosition(nums, target, 0);
  const right = findPosition(nums, target, 1);
  return [left, right];
}
```
