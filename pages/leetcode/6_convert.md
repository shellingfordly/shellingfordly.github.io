---
title: 6. Z 字形变换
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 6. Z 字形变换

- [源码](https://github.com/shellingfordly/algorithms/tree/master/src/6_convert/convert.ts)
- [测试](https://github.com/shellingfordly/algorithms/tree/master/src/6_convert/convert.spec.ts)

## 题目

将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：

```
P A H N
A P L S I I G
Y I R
```

之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。

请你实现这个将字符串进行指定行数变换的函数：string convert(string s, int numRows);

- 示例 1：

```
输入：s = "PAYPALISHIRING", numRows = 3
输出："PAHNAPLSIIGYIR"
```

- 示例 2：

```
输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
解释：
P I N
A L S I G
Y A H R
P I
```

-示例 3：

```
输入：s = "A", numRows = 1
输出："A"
```

- 提示：

```
1 <= s.length <= 1000
s 由英文字母（小写和大写）、',' 和 '.' 组成
1 <= numRows <= 1000
```

---

## 解法

### 找规律

虽然题目叫 Z 字变形，但竖着看其实更像 N 字，不过无所谓，不管 Z 字还是 N 字道理都差不多；

首先能发现的一个规律，排成 i 行时，`(i-1)*2` 列一定是每个位置都需要填字符的一列；题目根据条件可以得出，`j % (numRows - 1) === 0` 的列是需要填字符的列；这样 N 字的两条边就被找到了。

接下来就是处理 N 字的斜边，我们用二维数组模拟，将需要填字符的下标标出来，如下展示：

```bash
# 3行
00    02    04
10 11 12 13 14 15
20    22    24
# 4行
00       03       06
10    12 13 14    16
20 21    23    25 26
30       33       36
```

其实斜边的规律也不难发现，斜边上的下标相加等于与直边相交处下标的倍数 `0+2=2 1+2=2 0+2=2 1+3=4 2+4=6`；

我们可以用一个变量去记录直边上最后一个 i+j 的值，然后当遇到斜边时，`(i + j) % flag === 0` (下标相加是相交点的倍数)的下标就是需要填字符的地方；其余的地方给空就好。

最后，我们只要遍历处理好的二维数组，将每个值依次取出拼接成字符串即可。代码如下：

```ts
function convert(s: string, numRows: number): string {
  const arr: string[][] = [];
  let index = 0;
  let flag = 0;
  for (let j = 0; j < s.length; j++) {
    if (!s[index]) break;
    for (let i = 0; i < numRows; i++) {
      if (!s[index]) break;
      if (!arr[i]) arr[i] = [];
      // 双数列
      if (!(j % (numRows - 1))) {
        arr[i][j] = s[index++];
        flag = i + j;
      } else {
        // 对角线
        if (!((i + j) % flag)) arr[i][j] = s[index++];
        else arr[i][j] = "";
      }
    }
  }
  // return arr.flat().join(""); 速度稍慢
  return arr.reduce(
    (p, n) =>
      p +
      n.reduce((_p, _n) => {
        return _p + (typeof _n == "string" ? _n : "");
      }, ""),
    ""
  );
}
```

使用了双 for 创建数组还是比较暴力了一点，leetcode 上跑完测试稍微有点慢, 不过本地测试时给了一个长度 300 多的字符串也就是 1ms，实际应该没有 leetcode 的测试结果这么慢，业务场景中应该是可以接受的速度。

![](/images/leetcode/6_convert_1.png)
![](/images/leetcode/6_convert_2.png)

其实 return 遍历结果的时候也可以写的比较简单一点，直接使用 flat 扁平化数组再 join 拼接成字符串即可；代码一下简洁了很多，不过就是在 leetcode 上的运行速度差距实在有点大。

不过本地测试也都只有几毫秒而已，应该问题也不大，这样写代码简洁很多，也比 reduce 更好懂些。

![](/images/leetcode/6_convert_3.png)


