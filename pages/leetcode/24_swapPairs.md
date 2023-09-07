---
title: 24. 两两交换链表中的节点
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 24. 两两交换链表中的节点

给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

- 示例 1：

```
输入：head = [1,2,3,4]
输出：[2,1,4,3]
```

- 示例 2：

```
输入：head = []
输出：[]
```

- 示例 3：

```
输入：head = [1]
输出：[1]
```

- 提示：

```
链表中节点的数目在范围 [0, 100] 内
0 <= Node.val <= 100
```

## 解答

```ts
export function swapPairs(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  let lastNode: ListNode | null = head;
  let index: ListNode | null = head?.next;
  let temp: ListNode | null = null;
  let result = head?.next;

  while (index) {
    temp = index?.next;
    index.next = lastNode;
    lastNode!.next = index = temp?.next || temp;
    lastNode = temp;
  }

  return result;
}
```

### 递归

```ts
function swapPairs(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;
  let newHead = head.next;
  head.next = swapPairs(newHead.next);
  newHead.next = head;
  return newHead;
}
```
