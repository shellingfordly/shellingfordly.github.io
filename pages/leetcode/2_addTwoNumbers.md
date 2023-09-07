---
title: 2. 两数相加
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# [2. 两数相加](https://leetcode.cn/problems/add-two-numbers/)

## 题目

给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，并且每个节点只能存储一位数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0  开头。

- 示例 1：

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

- 示例 2：

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

- 示例 3：

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

提示：

- 每个链表中的节点数在范围 [1, 100] 内
- 0 <= Node.val <= 9
- 题目数据保证列表表示的数字不含前导零

## 解答

遍历两个两个链表，有值取值，无值取 0；由于一个节点只保存一位数字，因此不会`>10`；

因此只有两种情况，`>=10`时进位，`<10`直接赋值；这里用一个变量去记录是否有进位，如果有，下一次计算时`+1`，这里直接用`Number(flag)`的形式偷了个懒。

移动 move 指针，并对 next 创建 ListNode 节点；这里需要判断是否新增最后一个节点。当最后两个节点数相加没有进位时，不需要增加，`>10`时才增加，此时 val = 1。

```ts
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  let sum = 0;
  const result = new ListNode(0, null);
  let move = result;
  let flag = false;

  while (l1 || l2) {
    sum = (l1?.val ?? 0) + (l2?.val ?? 0) + Number(flag);
    if (sum >= 10) {
      move.val = sum % 10;
      flag = true;
    } else {
      move.val = sum;
      flag = false;
    }
    l1 && (l1 = l1.next);
    l2 && (l2 = l2.next);
    if (l1 || l2 || flag) {
      move = move.next = new ListNode(Number(flag), null);
    }
  }

  return result;
}
```
