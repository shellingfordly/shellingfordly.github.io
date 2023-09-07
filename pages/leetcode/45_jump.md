---
title: 45. 跳跃游戏 II
date: 2022-09-30 18:00:25
tags:
  - algorithms
---

# 45. 跳跃游戏 II

给你一个非负整数数组 nums ，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

你的目标是使用最少的跳跃次数到达数组的最后一个位置。

假设你总是可以到达数组的最后一个位置。

- 示例 1:

```
输入: nums = [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
```

- 示例 2:

```
输入: nums = [2,3,0,1,4]
输出: 2
```

- 提示:

```
1 <= nums.length <= 104
0 <= nums[i] <= 1000
```

## 贪心

### 反向查找出发位置

目标是到达数组最后一个位置，并且题目假定一定能走到最后一个位置。

因此初始 position 为数组的最后一个位置，即 **nums.length - 1**，去找到一个能够到达这个位置的数的**下标**；将 position 更新为此下标，继续找一个能够到达这个位置的数的下标。

由于是从左向右查找，因此找到的数是下标更小并且能到 position 位置的数；

```ts
function jump(nums: number[]): number {
  let position = nums.length - 1;
  let steps = 0;
  while (position > 0) {
    for (let i = 0; i < position; i++) {
      if (nums[i] + i >= position) {
        position = i;
        steps++;
        break;
      }
    }
  }
  return steps;
}
```

### 正向查找可达到的最大位置

从左遍历数组，每次记录当前下标能达到的最大位置，当 i 移动到最大位置的下标时，记录这个最大位置并增加一次步数。

```ts
function jump(nums: number[]): number {
  let maxPosition = 0;
  let end = 0;
  let steps = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    maxPosition = Math.max(maxPosition, i + nums[i]);
    if (i == end) {
      end = maxPosition;
      steps++;
    }
  }
  return steps;
}
```
