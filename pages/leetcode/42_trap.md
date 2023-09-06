---
title: 42. 接雨水
date: 2022-09-26 15:48:47
tags:
  - algorithms
---

# 42. 接雨水

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

- 示例 1：

![](/images/leetcode/42_trap_1.png)

```
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。
```

- 示例 2：

```
输入：height = [4,2,0,3,2,5]
输出：9
```

- 提示：

```
n == height.length
1 <= n <= 2 \* 104
0 <= height[i] <= 105
```

## 解答

### 动态规划

从左向右遍历，记录 i 处左边的最大高度，对应的接水量就是 **leftMax[i] - height[i]**；

从右向左遍历，记录 i 处右边的最大高度，对应的接水量就是 **rightMax[i] - height[i]**。

但是左边或者右边都受到相互最大高度的限制，合并两个数组计算，i 处的接水量为 **Math.min(leftMax[i], rightMax[i]) - height[i]**，如下图：

![](/images/leetcode/42_trap_2.png)

```ts
function trap(height: number[]): number {
  const len = height.length;
  const leftMax: number[] = [];
  const rightMax: number[] = [];
  let result = 0;

  for (let i = 0; i < len; i++) {
    leftMax[i] = Math.max(leftMax[i - 1] || 0, height[i]);
  }

  for (let i = len - 1; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1] || 0, height[i]);
  }

  for (let i = 0; i < len; i++) {
    result += Math.min(leftMax[i], rightMax[i]) - height[i];
  }

  return result;
}
```

### 栈

栈记录每个下标，当遇到元素大于栈顶元素时，取出栈顶元素 top 和下一个数 left，这时接水量的宽度为 **i - left - 1**，高度为两个边界减去中间的 top 的高度为 **min(height[left], height[i]) - height[top]**，因此接水量为 **currWidth \* currHeight**。

继续取出栈顶元素计算，直到栈内没有元素，或者取出 top 时没有 left。

![](/images/leetcode/42_trap_3.png)

```ts
function trap(height: number[]) {
  let ans = 0;
  const stack: number[] = [];
  const n = height.length;
  for (let i = 0; i < n; ++i) {
    while (stack.length && height[i] > height[stack[stack.length - 1]]) {
      const top = stack.pop();
      if (!stack.length) break;
      const left = stack[stack.length - 1];
      const currWidth = i - left - 1;
      const currHeight = Math.min(height[left], height[i]) - height[top!];
      ans += currWidth * currHeight;
    }
    stack.push(i);
  }
  return ans;
}
```

### 双指针

双指针有点类似动态规划，只是现在只用两个指针来计算。

leftMax 记录 left 坐标左边的最大高度；
rightMax 记录 right 坐标右边的最大高度；

当 **height[left] < height[right]**时，代表 **leftMax < rightMax**，因此左边是能接到水的，接到量为 **leftMax - height[left]**；反之右边也如此。

因为 leftMax 是 height[left] 的最大值，并且移动的指针是高度更小的一方，所以当**height[left] < height[right]**时，代表最大值也小于右边，能够接到水。

```ts
function trap2(height: number[]) {
  let left = 0;
  let right = height.length - 1;

  let leftMax = 0;
  let rightMax = 0;
  let result = 0;

  while (left < right) {
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);
    if (height[left] < height[right]) {
      result += leftMax - height[left];
      left++;
    } else {
      result += rightMax - height[right];
      right--;
    }
  }
  return result;
}
```
