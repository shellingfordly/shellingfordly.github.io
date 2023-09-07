---
title: 131 分割回文串
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 131 分割回文串

## 暴力回溯

切分字符串 s，切出的子串如果是回文串，则基于子串结束的位置继续往下切，直到越界；如果不是，则此分支错误。

```js
function isPali(str, start, end) {
  while (start < end) {
    if (str[start] === str[end]) {
      start++;
      end--;
    } else {
      return false;
    }
  }
  return true;
}

function partition(s) {
  const res = [];
  function dfs(temp, start) {
    if (start === s.length) {
      res.push(temp.slice());
      console.log("res: ", res);
      return;
    }

    for (let i = start; i < s.length; i++) {
      if (isPali(s, start, i)) {
        temp.push(s.substring(start, i + 1));
        console.log("start:", start, "i:", i, ";temp: ", temp);
        dfs(temp, i + 1);
        temp.pop();
        console.log("dfs: ", start, i, temp);
      }
    }
  }

  dfs([], 0);
  return res;
}

console.log("result ===>", partition("aab"));
```

## 逐步解析

第一步 `start = 0`，`i = 0`，在本次 dfs 的递归中 把素有单值都取了出来，单值必为回文串；

第二步，当 `start === s.length` 时，`temp = ['a', 'a', 'b']`，此时 res 添加了第一种情况，全单值；

第三步，当 res 添加了第一种情况后，第三次调用的 dfs 递归结束，此时将 temp 的最后一个值 pop 出去；妙就妙在每次 dfs 递归结束都会把最后一个值 pop 出去；

因为第三次递归结束时 `start = i = 2`，传入 `dfs(temp, i + 1)` 因此 res 得到的第一种结果；然后结束 dfs 的递归后，pop 了 temp 的最后一个值，此时循环没有结束，执行 `i++`；因此 `i = 3` 导致第二次调用的 dfs 结束，此时又 pop 了，也就是 temp 的倒数第二个值；

此时返回第一次调用的 dfs，此时 `start = i = 1`，循环执行 i++，此时就会去判断之前 pop 出去的两个字符串是否为回文。

如果是就在此进入 dfs，此时 start = s.length 就会添加第二种情况；若不是，跑完循环第一次调用的 dfs 结束，pop 出最后一个值。此时 `start = 0; i = 1`，回到第一步，循环开始去切两个、三个的字符串并判断是否为回文。

![partition](https://user-images.githubusercontent.com/39196952/159428212-e2d29ef3-e8d0-42e9-9108-6150d79ecda2.png)
