---
title: 3128. 直角三角形
date: 2024-8-2 10:54:23
tags:
  - algorithms
---

# 3128. 直角三角形

给你一个二维 boolean 矩阵 grid 。

请你返回使用 grid 中的 3 个元素可以构建的 直角三角形 数目，且满足 3 个元素值 都 为 1 。

注意：

- 如果 grid 中 3 个元素满足：一个元素与另一个元素在 同一行，同时与第三个元素在 同一列 ，那么这 3 个元素称为一个 直角三角形 。这 3 个元素互相之间不需要相邻。

示例 1：

![alt text](./image-1.png)

> 输入：grid = [[0,1,0],[0,1,1],[0,1,0]]
>
> 输出：2
>
> 解释：
>
> 有 2 个直角三角形。

示例 2：

![alt text](./image-2.png)

> 输入：grid = [[1,0,0,0],[0,1,0,1],[1,0,0,0]]
>
> 输出：0
>
> 解释：
>
> 没有直角三角形。

示例 3：

![alt text](./image-3.png)

> 输入：grid = [[1,0,1],[1,0,0],[1,0,0]]
>
> 输出：2
>
> 解释：
>
> 有两个直角三角形。

## 方法一

### 思路

遍历找到每个为 1 的坐标，再找到此坐标能形成的直角三角形，由于每个坐标都收到同行同列的影响，因此并不会出现重复计算的情况。

遍历 grid 数据，记录为 1 的坐标，同时 hMap 记录每一行为 1 的下标，以及 1 的个数；lMap 记录每一列为 1 的下标，以及 1 的个数。

遍历所有为 1 的下标位置，获取此行为 1 的数量，此列为 1 的数量，排除当前位置的同行同列，将数量相乘即是三角形的数量

### 代码

- 执行用时分布: 843ms 击败 6.67%
- 复杂度分析: 消耗内存分布 169.55MB 击败 6.67%

```ts
export function numberOfRightTriangles(grid: number[][]): number {
  const arr: [number, number][] = [];
  const hMap: any = {};
  const lMap: any = {};

  for (let i = 0; i < grid.length; i++) {
    hMap[i] = { length: 0 };
    for (let j = 0; j < grid[i].length; j++) {
      if (!lMap[j]) lMap[j] = { length: 0 };
      if (grid[i][j] == 1) {
        hMap[i][j] = true;
        hMap[i].length++;
        lMap[j][i] = true;
        lMap[j].length++;
        arr.push([i, j]);
      }
    }
  }

  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    const h = arr[i][0];
    const l = arr[i][1];
    let hl = hMap[h].length;
    let ll = lMap[l].length;
    if (hMap[h][l]) hl--;
    if (lMap[l][h]) ll--;
    count += hl * ll;
  }
  return count;
}
```

## 方法二：枚举

[官方解答](https://leetcode.cn/problems/right-triangles/solutions/2861202/zhi-jiao-san-jiao-xing-by-leetcode-solut-zbz2/?envType=daily-question&envId=2024-08-02)

### 思路

直接枚举三个点判断是否为直角三角形的方法未免过于低效，我们可以固定一个点，然后来统计其他两个点的合法方法数。

考虑枚举两条直角边的交点，然后将「该点所在行的其他点」与「该点所在列的其他点」一一匹配，即可得到所有以该点为直角边交点的所有方案。
设 row 为交点所在行 1 的个数，col 为交点所在列 1 的个数，那么它的贡献是 (row−1)×(col−1)，将所有交点的贡献加起来就是答案。

### 代码

```ts
function numberOfRightTriangles(grid: number[][]): number {
  const n = grid.length;
  const m = grid[0].length;
  const col = new Array(m).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      col[j] += grid[i][j];
    }
  }

  let res = 0;
  for (let i = 0; i < n; i++) {
    let row = grid[i].reduce((a, b) => a + b, 0);
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        res += (row - 1) * (col[j] - 1);
      }
    }
  }

  return res;
}
```

### 分析

解答稍微有一点不清晰，简单的说，把每行每列存在 1 的个数都记录下来。遍历二维数组，当在具体的 1 位置时，它所在的行和列存在的 1 的数量减一相乘就是此处可以组成的直角三角形数量。

```ts
export function numberOfRightTriangles(grid: number[][]): number {
  const n = grid.length;
  const m = grid[0].length;
  const row = new Array(n).fill(0);
  const col = new Array(m).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      row[i] += grid[i][j];
      col[j] += grid[i][j];
    }
  }

  let res = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j] === 1) {
        res += (row[i] - 1) * (col[j] - 1);
      }
    }
  }

  return res;
}
```

修改一下官方代码，将 row 单独记录一下更方便理解。

row为每行有多少个1，col为每列有多少个1，遍历数组：

当 grid[i][j] 为1时，减去本身自己的基数， (row[i] - 1) * (col[j] - 1) 就是此处的能组成三角形的个数

```ts
grid = [
  [0,1,0],
  [0,1,1],
  [0,1,0]
]

row = [1,2,1]
col = [0,3,1]

grid[0][1] == 1
row[0] == 1
col[1] == 3
count =1-1 * 3-1 =0

grid[1][1] == 1
row[1] == 2
col[1] == 3
count =2-1 * 3-1 =2
```
