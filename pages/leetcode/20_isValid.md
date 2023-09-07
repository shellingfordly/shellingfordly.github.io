---
title: 20. 有效的括号
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 20. 有效的括号

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

- 示例 1：

```
输入：s = "()"
输出：true
```

- 示例 2：

```
输入：s = "()[]{}"
输出：true
```

- 示例 3：

```
输入：s = "(]"
输出：false
```

- 示例 4：

```
输入：s = "([)]"
输出：false
```

- 示例 5：

```
输入：s = "{[]}"
输出：true
```

- 提示：

```
1 <= s.length <= 104
s 仅由括号 '()[]{}' 组成
```

## 解答

遇左括号入栈，遇右括号出栈，验证是否有效

```ts
function isValid(s: string): boolean {
  const len = s.length;
  if (len % 2 !== 0) return false;
  const map: Record<string, string> = {
    "(": ")",
    "[": "]",
    "{": "}",
  };
  const stack: string[] = [];
  for (let i = 0; i < len; i++) {
    const str = s[i];
    if (map[str]) {
      stack.push(str);
    } else {
      const top = stack.pop();
      if (top && map[top] == str) {
        continue;
      } else return false;
    }
  }
  return !stack.length;
}
```
