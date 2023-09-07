---
title: 48. 旋转图像
date: 2023-04-03 11:31:02
tags:
  - algorithms
---

# 48. 旋转图像

## 题目

给定一个 n × n 的二维矩阵  matrix 表示一个图像。请你将图像顺时针旋转 90 度。

你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。

```
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[[7,4,1],[8,5,2],[9,6,3]]
```

```
输入：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
输出：[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

## 解答

### 解一

使用一个辅助数组，直接对每一列进行旋转 90 度，再将其赋值到原数组

```ts
function rotate(matrix: number[][]): void {
  if (!matrix.length) return;

  const copy: number[][] = [];

  const len = matrix.length;

  for (let i = 0; i < len; i++) {
    copy[i] = [];
    for (let j = len - 1; j >= 0; j--) {
      copy[i][len - j - 1] = matrix[j][i];
    }
  }

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      matrix[i][j] = copy[i][j];
    }
  }
}
```

### 解二

对一个 n\*n 的矩阵进行水平翻转，再主对角线翻转，得到的就是翻转 90 度的效果

```ts
function rotate1(matrix: number[][]) {
  const n = matrix.length;
  // 先 水平翻转
  for (let i = 0; i < n / 2; i++) {
    for (let j = 0; j < n; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[n - i - 1][j];
      matrix[n - i - 1][j] = temp;
    }
  }
  // 再 主对角线翻转
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}
```
