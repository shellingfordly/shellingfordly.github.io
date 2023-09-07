---
title: 23. 合并 K 个升序链表
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 23. 合并 K 个升序链表

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

- 示例 1：

```
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
```

解释：链表数组如下：

```
[
  1->4->5,
  1->3->4,
  2->6
]
```

将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6

- 示例 2：

```
输入：lists = []
输出：[]
```

- 示例 3：

```
输入：lists = [[]]
输出：[]
```

- 提示：

```
k == lists.length
0 <= k <= 10^4
0 <= lists[i].length <= 500
-10^4 <= lists[i][j] <= 10^4
lists[i] 按 升序 排列
lists[i].length 的总和不超过 10^4
```

## 题解

### 暴力求解

将所有节点值平铺添加到数组中，排序后生成新的链表

```ts
export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  let arr = [];

  for (let i = 0; i < lists.length; i++) {
    let item = lists[i];
    while (item) {
      arr.push(item.val);
      item = item.next;
    }
  }
  arr = arr.sort((a, b) => a - b);

  let result = new ListNode(-1, null);
  let flag = result;

  for (let i = 0; i < arr.length; i++) {
    flag.next = new ListNode(arr[i], null);
    flag = flag.next;
  }

  return result.next;
}
```

### 分治

将多个链表的合并拆分为链表合并

```ts
export function mergeKLists1(lists: Array<ListNode | null>): ListNode | null {
  function mergeTwoLists(list1: ListNode | null, list2: ListNode | null) {
    if (!list1) return list2;
    if (!list2) return list1;

    if (list1.val < list2.val) {
      list1.next = mergeTwoLists(list1.next, list2);
      return list1;
    } else {
      list2.next = mergeTwoLists(list1, list2.next);
      return list2;
    }
  }

  function merge(
    lists: (ListNode | null)[],
    l: number,
    r: number
  ): ListNode | null {
    if (l == r) return lists[l];
    if (l > r) return null;
    const mid = (l + r) >> 1;
    return mergeTwoLists(merge(lists, l, mid), merge(lists, mid + 1, r));
  }

  // function merge(list: ListNode | null, i: number): ListNode | null {
  //   if (i === lists.length) return list;
  //   const newList = mergeTwoLists(list, lists[i]);
  //   return merge(newList, i + 1);
  // }

  // if (lists.length === 0) return null;

  return merge(lists, 0, lists.length - 1);
}
```
