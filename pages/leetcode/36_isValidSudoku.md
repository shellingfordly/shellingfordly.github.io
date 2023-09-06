---
title: 36. 有效的数独
date: 2022-09-17 11:44:18
tags:
  - algorithms
---

# 36. 有效的数独

请你判断一个 9 x 9 的数独是否有效。只需要 根据以下规则 ，验证已经填入的数字是否有效即可。

数字 1-9 在每一行只能出现一次。
数字 1-9 在每一列只能出现一次。
数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）

- 注意：

一个有效的数独（部分已被填充）不一定是可解的。
只需要根据以上规则，验证已经填入的数字是否有效即可。
空白格用 '.' 表示。

- 示例 1：

```js
// 输入：
board = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];
// 输出：true
```

- 示例 2：

```js
// 输入：
board = [
  ["8", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];
// 输出：false
```

解释：除了第一行的第一个数字从 5 改为 8 以外，空格内其他数字均与 示例 1 相同。 但由于位于左上角的 3x3 宫内有两个 8 存在, 因此这个数独是无效的。

- 提示：

```
board.length == 9
board[i].length == 9
board[i][j] 是一位数字（1-9）或者 '.'
```

## 解答

### 三次遍历

三次遍历，分别判断横向纵向，九宫格是否符合要求

```ts
function isValidSudoku(board: string[][]): boolean {
  let map: any = {};
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] == ".") continue;
      if (map[board[i][j]]) return false;
      else map[board[i][j]] = 1;
    }
    map = {};
  }

  map = {};

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[j][i] == ".") continue;
      if (map[board[j][i]]) return false;
      else map[board[j][i]] = 1;
    }
    map = {};
  }

  map = {};

  for (let k = 0; k < 9; k += 3) {
    for (let f = 0; f < 9; f += 3) {
      for (let i = k; i < k + 3; i++) {
        for (let j = f; j < f + 3; j++) {
          if (board[i][j] == ".") continue;
          if (map[board[i][j]]) return false;
          else map[board[i][j]] = 1;
        }
      }
      map = {};
    }
  }

  return true;
}
```

### 一次遍历

> 一次遍历巧妙的地方就在于，都是为了用一个数组去记录 9 个数字的出现次数，在遍历 board 的时候能很容易的记录横向或者纵向的 9 个数字出现次数，使用 board 的 i 或者 j 去做下标记录即可；而 9 宫格的下标不能直接给 boxes 做下标记录，因此我们主要是为了使用 i 和 j 组合出一个能表示同一个 9 宫格的下标，把同一个 9 宫格的数字出现次数记录到 boxes 内的同一个子数组中去。（不管是用三维数组还是二维数组，都是为了把 9 个数字的次数记录到同一个子数组中，这样就可以通过次数判断是否符合要求。）

使用二维数组记录横向纵向的数字出现的次数

使用三位数组记录九宫格数字出现的次数

```ts
function isValidSudoku1(board: string[][]): boolean {
  const rows = new Array(9).fill(0).map(() => new Array(9).fill(0));
  const columns = new Array(9).fill(0).map(() => new Array(9).fill(0));
  const boxes = new Array(3)
    .fill(0)
    .map(() => new Array(3).fill(0).map(() => new Array(9).fill(0)));

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const c = board[i][j];
      if (c == ".") continue;

      if (c != ".") {
        const index = c.charCodeAt(0) - "0".charCodeAt(0) - 1;
        rows[i][index]++;
        columns[j][index]++;
        boxes[Math.floor(i / 3)][Math.floor(j / 3)][index]++;

        if (
          rows[i][index] > 1 ||
          columns[j][index] > 1 ||
          boxes[Math.floor(i / 3)][Math.floor(j / 3)][index] > 1
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
```

- 使用二维数组记录九宫格数字出现的次数

横向便利，j 表示横向的坐标，而 j/3 就表示横向九宫格的个数(坐标)，i/3 表示纵向九宫格个数；

因此，**(i/3)\*3 + j/3** 就可以记录所有九宫格的个数，把它当作数组的下标，就可以用二维数组表示出每个九宫格中的数字出现次数

```ts
function isValidSudoku2(board: string[][]): boolean {
  const rows = new Array(9).fill(0).map(() => new Array(9).fill(0));
  const columns = new Array(9).fill(0).map(() => new Array(9).fill(0));
  const boxes = new Array(9).fill(0).map(() => new Array(9).fill(0));

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const c = board[i][j];
      if (c == ".") continue;

      if (c != ".") {
        const index = c.charCodeAt(0) - "0".charCodeAt(0) - 1;
        const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        rows[i][index]++;
        columns[j][index]++;
        boxes[boxIndex][index]++;

        if (
          rows[i][index] > 1 ||
          columns[j][index] > 1 ||
          boxes[boxIndex][index] > 1
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
```
