---
title: 44. 通配符匹配(难)
date: 2022-09-28 14:12:43
tags:
  - algorithms
---

# 44. 通配符匹配(难)

**动态规划**

---

给定一个字符串 (s) 和一个字符模式 (p) ，实现一个支持 '?' 和 '\*' 的通配符匹配。

- '?' 可以匹配任何单个字符。
- '\*' 可以匹配任意字符串（包括空字符串）。
- 两个字符串完全匹配才算匹配成功。

说明:

s 可能为空，且只包含从 a-z 的小写字母。
p 可能为空，且只包含从 a-z 的小写字母，以及字符 ? 和 \*。

- 示例 1:

```
输入:
s = "aa"
p = "a"
输出: false
解释: "a" 无法匹配 "aa" 整个字符串。
```

- 示例 2:

```
输入:
s = "aa"
p = "_"
输出: true
解释: '_' 可以匹配任意字符串。
```

- 示例 3:

```
输入:
s = "cb"
p = "?a"
输出: false
解释: '?' 可以匹配 'c', 但第二个 'a' 无法匹配 'b'。
```

- 示例 4:

```
输入:
s = "adceb"
p = "*a*b"
输出: true
解释: 第一个 '_' 可以匹配空字符串, 第二个 '_' 可以匹配字符串 "dce".
```

- 示例 5:

```
输入:
s = "acdcb"
p = "a\*c?b"
输出: false
```

## 动态规划

用 dp[i][j]来表示字符串的前 i 个字符和模式的前 j 个字符是否能匹配；

如果 p[j] 是小写字母，那么有 **dp[i][j] = dp[i-1][j-1] ^ s[i] === p[j]**；

如果 p[j]是问号，那么对 s[i]没有要求，**dp[i][j] = dp[i-1][j-1]**；

如果 p[j]是星号，对 s 没有要求，但是星号可以匹配零或任意多个小写字母，因此有两种情况，使用或者不使用星号：**dp[i][j] = dp[i][j-1] V dp[i-1][j]**；

预处理：

- **dp[0][0] = true**，字符串 s 和模式 p 均为空；
- **dp[i][0] = false**，字符串不为空，模式为空；
- **dp[0][j]**有两种情况，p 模式的前 j 个字符均为星号时，为 true，为字符或“?”时为 false。

```ts
function isMatch(s: string, p: string): boolean {
  let slen = s.length;
  let plen = p.length;
  let dp = Array(slen + 1)
    .fill([])
    .map(() => Array(plen + 1).fill(false));

  dp[0][0] = true;

  for (let i = 1; i <= plen; i++) {
    if (p[i - 1] == "*") {
      dp[0][i] = true;
    } else break;
  }

  for (let i = 1; i <= slen; i++) {
    for (let j = 1; j <= plen; j++) {
      if (p[j - 1] == "*") {
        dp[i][j] = Boolean(dp[i][j - 1] | dp[i - 1][j]);
      } else if (p[j - 1] == "?" || p[j - 1] == s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }

  return dp[slen][plen];
}
```
