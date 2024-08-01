---
title: LCP 40. 心算挑战
date: 2024-8-1 10:13:41
tags:
  - algorithms
---

# LCP 40. 心算挑战

「力扣挑战赛」心算项目的挑战比赛中，要求选手从 N 张卡牌中选出 cnt 张卡牌，若这 cnt 张卡牌数字总和为偶数，则选手成绩「有效」且得分为 cnt 张卡牌数字总和。 给定数组 cards 和 cnt，其中 cards[i] 表示第 i 张卡牌上的数字。 请帮参赛选手计算最大的有效得分。若不存在获取有效得分的卡牌方案，则返回 0。

示例 1：

> 输入：cards = [1,2,8,9], cnt = 3
>
> 输出：18
>
> 解释：选择数字为 1、8、9 的这三张卡牌，此时可获得最大的有效得分 1+8+9=18。

示例 2：

> 输入：cards = [3,3,1], cnt = 1
>
> 输出：0
>
> 解释：不存在获取有效得分的卡牌方案。

提示：

- 1 <= cnt <= cards.length <= 10^5
- 1 <= cards[i] <= 1000


## 方法一：一次遍历

### 思路

将 cards 从大到小排序后，先贪心的将后 cnt 个数字加起来，若此时 sum 为偶数，直接返回即可。

若此时答案为奇数，有两种方案:

在数组前面找到一个最大的奇数与后 cnt 个数中最小的偶数进行替换；

在数组前面找到一个最大的偶数与后 cnt 个数中最小的奇数进行替换。

两种方案选最大值即可。

### 代码

```ts
export function maxmiumScore(cards: number[], cnt: number): number {
  cards = cards.sort((a, b) => b - a);
  let count = 0;
  let odd = -1;
  let even = -1;
  for (let i = 0; i < cnt; i++) {
    const card = cards[i];
    count += card;
    if (card % 2 == 0) even = card;
    else odd = card;
  }

  if (count % 2 == 0) return count;

  let sum = 0;
  for (let i = cnt; i < cards.length; i++) {
    const card = cards[i];
    if (card % 2 == 0) {
      if (odd != -1) sum = Math.max(sum, count - odd + card);
    } else {
      if (even != -1) sum = Math.max(sum, count - even + card);
    }
  }
  return sum;
}
```
