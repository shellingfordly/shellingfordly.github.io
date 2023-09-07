---
title: 21. 合并两个有序链表
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 21. 合并两个有序链表

将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

- 示例 1：

```
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
```

- 示例 2：

```
输入：l1 = [], l2 = []
输出：[]
```

- 示例 3：

```
输入：l1 = [], l2 = [0]
输出：[0]
```

- 提示：

```
两个链表的节点数目范围是 [0, 50]
-100 <= Node.val <= 100
l1 和 l2 均按 非递减顺序 排列
```

## 解法

### 暴力解法

声明一个头节点和移动指针，便利节点，指针指向更小的节点

- 时间复杂度: O(M+N)
- 空间复杂度：O(1)

```ts
export function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  let head = new ListNode(-1, null);
  let flag = head;

  while (list1 && list2) {
    if (list1.val < list2.val) {
      flag.next = list1;
      list1 = list1.next;
    } else {
      flag.next = list2;
      list2 = list2.next;
    }
    flag = flag.next;
  }

  flag.next = list1 || list2;

  return head.next;
}
```

### 递归

合并(list1, list2)的问题等价于合并(list1.next, list2)；
使用递归解决子问题

- 时间复杂度: O(M+N)
- 空间复杂度：O(M+N)

```ts
export function mergeTwoLists1(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;

  if (list1.val < list2.val) {
    list1.next = mergeTwoLists1(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoLists1(list1, list2.next);
    return list2;
  }
}
```
