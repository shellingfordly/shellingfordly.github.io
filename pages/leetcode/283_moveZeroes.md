---
title: 283 移动零
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 283 移动零

> 题目： 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。请注意 ，必须在不复制数组的情况下原地对数组进行操作。

示例 1:

```
输入: nums = [0,1,0,3,12]
输出: [1,3,12,0,0]
```

示例 2:

```
输入: nums = [0]
输出: [0]
```

## 解法

1. 将所有 0 的下标记录下来，删除 0，补全 0

- 性能最差 264ms

```ts
export function moveZeroes(nums: number[]): void {
  let indexList: null | number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (!nums[i]) {
      indexList.push(i);
    }
  }
  indexList.reverse().forEach((index) => {
    nums.splice(index, 1);
  });

  Array(indexList.length)
    .fill(0)
    .forEach((_) => nums.push(0));
  indexList = null;
}
```

2. 将不为零的数字从 0 开始填，最后补全剩余的 0

```ts
export const moveZeroes1 = function (nums: number[]): void {
  let m = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[m] = nums[i];
      m++;
    }
  }

  nums.fill(0, m);
};
```

3. 用一个指针 j 指向非 0 的数字位置，遍历 nums，将非 0 数字从 j 为 0 开始依次填写，最后将剩余位置填 0，然后将 nums[j]和不为零的数交换位置

```ts
export var moveZeroes3 = function (nums: number[]) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      let temp = nums[j];
      nums[j] = nums[i];
      nums[i] = temp;
      j++;
    }
  }
};
```

4. 指针 index 指向 0 坐标，当 num[i] = 0 时加 1，遇到非 0 时如果 index > 0，则将 nums[i-index] 和 nums[i]交换，i-index 位置为第一次出现 0 的坐标。

> 此作法优秀在交换时不需要生命新的变量，直接略过非 0 数，当遇到 0 时，才做交换

```ts
export function moveZeroes4(nums: number[]): void {
  let index = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      index++;
    } else if (index > 0) {
      nums[i - index] = nums[i];
      nums[i] = 0;
    }
  }
}
```

5. 与解 4 差不多的道理，当 nums 非 0 时 index + 1，如果 i 与 index 不等则交换，此时 index 停留在第一次出现 0 的坐标

```ts
export function moveZeroes5(nums: number[]): void {
  let index = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      if (i != index) {
        nums[index] = nums[i];
        nums[i] = 0;
      }
      index++;
    }
  }
}
```
