---
title: 25. K 个一组翻转链表
date: 2022-09-17 10:02:27
tags:
  - algorithms
---

# 25. K 个一组翻转链表

给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。

k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

- 示例 1：

```
输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]
```

- 示例 2：

```
输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
```

- 提示：

```
链表中的节点数目为 n
1 <= k <= n <= 5000
0 <= Node.val <= 1000
```

> 进阶：你可以设计一个只用 O(1) 额外内存空间的算法解决此问题吗？

## 解答

### 利用 JS 特性

添加 k 个节点到数组中，反转之后添加到结果数组，最后便利数组修改 next

```ts
export function reverseKGroup(
  head: ListNode | null,
  k: number
): ListNode | null {
  if (k == 1) return head;

  let his: ListNode[] = [];
  let arr = [];

  let p = head;

  while (p) {
    arr.push(p);
    p = p.next;
    if (arr.length === k) {
      his = his.concat(arr.reverse());
      arr = [];
    }
  }
  his = his.concat(arr);

  his.reduce((p, n) => {
    p.next = n;
    return n;
  });

  his[his.length - 1].next = null;

  return his[0];
}
```

### 递归

到第 k 个节点时，将前面的节点反转，后面的节点传入递归函数继续进行。

此题用到了[206. 反转链表](https://github.com/shellingfordly/algorithms/tree/master/src/206_reverseList)题。

```ts
function reverse(h: ListNode | null) {
  let res = null;
  let last = null;
  for (let x: ListNode | null = h; x !== null; x = x.next) {
    res = new ListNode(x.val, res);
    if (!last) last = res;
  }
  return [res, last];
}

export function reverseKGroup2(head: ListNode | null, k: number) {
  function reverseGroup(h: ListNode | null) {
    let p: ListNode | null = h;
    let count = 1;
    while (p) {
      p = p.next;
      if (p) count++;
      if (count == k) {
        const n = p!.next;
        p!.next = null;
        const [first, last] = reverse(h);
        last!.next = reverseGroup(n);
        return first;
      }
    }
    return h;
  }

  if (k == 1) return head;
  return reverseGroup(head);
}
```

- O(1) 的内存空间，在递归的基础上，修改一个 reverse 反转函数即可

reverseGroup 是在原节点上修改，没有创建新节点，reverse 也不创建新节点，即可达成 O(1)内存空间

```ts
function reverse() {
  let prev = null;
  let cur = head;
  while (cur != null) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return [prev, head];
}
```
