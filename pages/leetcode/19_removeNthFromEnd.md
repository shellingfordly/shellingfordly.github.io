---
title: 19. 删除链表的倒数第 N 个结点
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 19. 删除链表的倒数第 N 个结点

给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

- 示例 1：

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

- 示例 2：

```
输入：head = [1], n = 1
输出：[]
```

- 示例 3：

```
输入：head = [1,2], n = 1
输出：[1]
```

- 提示：

```
链表中结点的数目为 sz
1 <= sz <= 30
0 <= Node.val <= 100
1 <= n <= sz
```

> 进阶：你能尝试使用一趟扫描实现吗？

## 解答

### map 记录下标

直接记录每个 node 的下标，再进行删除。

比较简单，占内存

```ts
export function removeNthFromEnd(head: ListNode | null, n: number) {
  const map: any = {};
  let i = 0;
  while (head) {
    map[i] = head;
    head = head.next!;
    i++;
  }
  if (i === n) map[0] = map[0].next;
  else if (i > n) map[i - n - 1].next = map[i - n].next;

  return map[0];
}
```

### 双指针记录

一个指针先走 n 步，再一起走完，second.next 就是要删除的元素

```ts
export const removeNthFromEnd = function (head: ListNode | null, n: number) {
  let first: ListNode | null = head;
  let second: ListNode | null = head;
  while (n >= 0) {
    if (first) first = first.next;
    else return head?.next;
    n--;
  }
  while (first) {
    first = first.next;
    second = second!.next;
  }
  second!.next = second!.next!.next;
  return head;
};
```
