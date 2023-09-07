---
title: 206. 反转链表
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 206. 反转链表

给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

- 示例 1：

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

- 示例 2：

```
输入：head = [1,2]
输出：[2,1]
```

- 示例 3：

```
输入：head = []
输出：[]
```

- 提示：

```
链表中节点的数目范围是 [0, 5000]
-5000 <= Node.val <= 5000
```

> 进阶：链表可以选用迭代或递归方式完成反转。你能否用两种方法解决这道题？

## 解答

### 递归

递归获取下一个节点，最后拿到的就是最后一个节点，返回这个节点。

一个递归结束之后，将此节点的 next.next 指向自己，将下一节点置为 null，这样做是为了从最后一个节点反向指回来，然后将前一个节点的 next 断掉

- 分析

第一次递归返回的 head 即是最后一个节点 lastNode；

当 head.next.next 第一次存在时，便是 lastNode 的 next，为 null，此时将它指向 head，就是将 lastNode.next 指向 lastNode 的前一个节点；

然后将 head.next 断掉，结束此次递归。

```ts
export function reverseList1(head: ListNode | null): ListNode | null {
  if (head == null || head.next == null) {
    return head;
  }
  const newHead = reverseList1(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

### 直接修改

每次将前一个节点保存下来，将此节点的 next 指向 prev。

```ts
export function reverseList2(head: ListNode | null): ListNode | null {
  let prev = null;
  let cur = head;
  while (cur != null) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
```

### 便利创建新节点

从第一个节点开始便利，将节点作为新节点的 next 传入 ListNode，每次传入的就是上一个节点。

```ts
export function reverseList3(head: ListNode | null): ListNode | null {
  let res = null;
  for (let i = head; i !== null; i = i.next) {
    res = new ListNode(i.val, res);
  }
  return res;
}
```
