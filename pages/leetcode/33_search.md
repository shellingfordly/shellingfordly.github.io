---
title: 33. 搜索旋转排序数组
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 33. 搜索旋转排序数组

整数数组 nums 按升序排列，数组中的值 互不相同 。

在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。

给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。

你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。

- 示例 1：

```
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4
```

- 示例 2：

```
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1
```

- 示例 3：

```
输入：nums = [1], target = 0
输出：-1
```

- 提示：

```
1 <= nums.length <= 5000
-104 <= nums[i] <= 104
nums 中的每个值都 独一无二
题目数据保证 nums 在预先未知的某个下标上进行了旋转
-104 <= target <= 104
```

## 解答

**需要注意：**

1. 判断值是否相等时，如果对 left 和 right 端点值进行了判断，那么递归时 **target>leftVal** 和 **target<rightVal** 就不需要再判断了；并且下传 left 和 right 时可以-1，因为已经判断过是否等于 target，因为进入下一次递归避免重复判断。

2. 循环处理中同理，因为没有先做判断，因此条件中需要判断等于 **target>=leftVal**、**target<=rightVal**，以及**leftVal <= midVal**，否则会漏掉端点值；退出条件也需要加上等于判断 **left<=right**，否则当 left=right 刚好是 target 时无法得到正确答案；并且因为循环中本来直接调整 left 和 right 的值为 mid-1 还是 mid+1，没有判断端点也正好不用调整 left、right 去-1。

3. 因此我感觉循环更适合只判断 midVal，否则每次更新 left=mid+1 或者 right=mid-1 时还需要同时调整 left--或者 right--来防止端点值的重复判断。

### 递归

```js
var search = function (nums, target) {
  function bisect(nums, left, right, target) {
    if (right < left) return -1;
    let mid = Math.floor((left + right) / 2);
    let leftVal = nums[left],
      rightVal = nums[right],
      midVal = nums[mid];

    if (target == leftVal) return left;
    if (target == rightVal) return right;
    if (target == midVal) return mid;

    if (leftVal < midVal) {
      if (target > leftVal && target < midVal) {
        return bisect(nums, left + 1, mid - 1, target);
      } else {
        return bisect(nums, mid + 1, right - 1, target);
      }
    } else {
      if (target > midVal && target < rightVal) {
        return bisect(nums, mid + 1, right - 1, target);
      } else {
        return bisect(nums, left + 1, mid - 1, target);
      }
    }
  }
  return bisect(nums, 0, nums.length - 1, target);
};
```

### 循环

```ts
const search1 = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let leftVal = nums[left];
    let rightVal = nums[right];
    let midVal = nums[mid];

    if (target == midVal) return mid;

    if (leftVal <= midVal) {
      if (target >= leftVal && target < midVal) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (target > midVal && target <= rightVal) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
};
```
