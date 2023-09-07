---
title: 18. 四数之和
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 18. 四数之和

给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。请你找出并返回满足下述全部条件且不重复的四元组 [nums[a], nums[b], nums[c], nums[d]] （若两个四元组元素一一对应，则认为两个四元组重复）：

- 0 <= a, b, c, d < n
- a、b、c 和 d 互不相同
- nums[a] + nums[b] + nums[c] + nums[d] == target

你可以按 任意顺序 返回答案 。

- 示例 1：

```
输入：nums = [1,0,-1,0,-2,2], target = 0
输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
```

- 示例 2：

```
输入：nums = [2,2,2,2,2], target = 8
输出：[[2,2,2,2]]
```

- 提示：

```
1 <= nums.length <= 200
-109 <= nums[i] <= 109
-109 <= target <= 109
```

## 解答

### 排序 + 双指针

和[15. 三数之和](https://github.com/shellingfordly/algorithms/tree/master/src/15_threeSum)类似，只是四数之和需要固定两位数，然后再用指针查找满足的剩下两位数。

```ts
export function fourSum(_nums: number[], target: number): number[][] {
  const nums = _nums.sort((a, b) => a - b);
  const result: number[][] = [];
  const len = nums.length;

  if (len < 4) return result;

  for (let i = 0; i <= len - 4; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    for (let j = i + 1; j <= len - 3; j++) {
      if (j > i + 1 && nums[j] == nums[j - 1]) continue;
      let q = j + 1;
      let p = len - 1;
      while (q < p) {
        const sum = nums[i] + nums[j] + nums[q] + nums[p];
        if (sum == target) {
          result.push([nums[i], nums[j], nums[q], nums[p]]);
          while (q < p && nums[q] == nums[q + 1]) q++;
          while (q < p && nums[p] == nums[p - 1]) p--;
          q++;
          p--;
        }
        if (sum < target) {
          q++;
        } else if (sum > target) {
          p--;
        }
      }
    }
  }

  return result;
}
```
