---
title: 41. 缺失的第一个正数
date: 2022-09-23 18:06:21
tags:
  - algorithms
---

# 41. 缺失的第一个正数

给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

示例 1：

输入：nums = [1,2,0]
输出：3
示例 2：

输入：nums = [3,4,-1,1]
输出：2
示例 3：

输入：nums = [7,8,9,11,12]
输出：1

提示：

1 <= nums.length <= 5 \* 105
-231 <= nums[i] <= 231 - 1

## 解答

### 哈希表

根据题意，可以得出需要对于长度为 len 的数组，没有出现的最小正整数在[1,len+1]中。利用哈希表保存 nums 出现的数字，遍历[1,len+1],返回第一个没有出现的数字就是最小正整数。

当然，这样做的话就不能满足时间复杂度为 O(N)的条件；由于数组的下标刚好可以表示 **[1,len+1]** ，因此可以用原数组替代哈希表；最终根据 **nums[i]** 是否和下标 **i** 匹配来判断缺少的数字。

因为是要找最小正整数，我们可以先对数组进行一些操作：

1. 首先遍历第一次把 **num[i]<=0** 的数进行特殊处理（这里设置为 len+1，方便后续判断即可）；

2. 然后遍历第二次，把 **nums[i]** 的值处于 **[1,len+1]** 区间的数字作为下标位置进行标记，表示此下标位置能对应上正确的数。这里使用 **nums[i]\*-1** 进行标记；取下标时对 num[i] **取绝对值**，因为可能会重复取到同一个数。

3. 最后遍历第三次，当遇到第一个 **>0** 的数时，此下标对应的正整数 **（i+1）** 即是缺少的最小正整数。

```ts
function firstMissingPositive(nums: number[]): number {
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    if (nums[i] <= 0) nums[i] = len + 1;
  }

  for (let i = 0; i < len; i++) {
    const index = Math.abs(nums[i]) - 1;
    if (index < len && nums[index] > 0) nums[index] *= -1;
  }

  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) return i + 1;
  }
  return len + 1;
}
```

### 置换

由于正常的正整数数组为[1,len+1]，因此我们可以将 nums 中的数字置换到与其标准下标对应的位置出，即是 nums[i] 正确的位置应该是 nums[num[i] - 1] 的位置；最后遍历判断第一次满足 **nums[i] !== i + 1** 的位置就是缺少的最小正整数 ** i+1 **。

> 注意：
>
> 一开始我将不该置换的数进行返回，可是总会出现某个示例出错；后面根据官方解答，改为只将正确的数进行替换，错误的数不管它，就能通过了。
>
> 正确数满足的条件：**nums[i] > 0 && nums[i] <= len**，其实表示的数就是在[1, len]的闭区间内的数，替换位置不相等的条件是为了减少不必要的替换。
>
> 这里使用循环是因为，替换过后的数可能也是在区间内的，所以继续替换到次数不满足条件。

```ts
function firstMissingPositive3(nums: number[]): number {
  const len = nums.length;
  for (let i = 0; i < len; ++i) {
    while (nums[i] > 0 && nums[i] <= len && nums[nums[i] - 1] != nums[i]) {
      const temp = nums[nums[i] - 1];
      nums[nums[i] - 1] = nums[i];
      nums[i] = temp;
    }
  }
  for (let i = 0; i < len; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return len + 1;
}
```

- 置换的另一种写法

此写法与上面一种算法的思想是一样的，只是在判断上，稍微做了一点变形。

当**nums[i]-1**不在[0,len-1](和上面nums[i]在[1,len]一个道理)，或者当数字已经满足和下标对应时，跳过此次循环，并且 i+1；

当**nums[i]-1**属于正确数字时，将 nums[i] 替换为未知的 nums[index]，然后将 nums[index] 设置为 index 下标对应的正确数字 index+1；

巧妙的地方就在此处，因为 nums[i] 是属于[1,len]的正确数字，而它的正确位置应该在 index（nums[i] - 1）处；将 nums[index]赋给 nums[i]，然后将 nums[index]赋值为正确的数，由于 index 处的标准数就是 index+1，因此不需要向上面一样使用变量 temp 来记录了。

并且此时没有去增加 i 的值，所以此次操作结束后，会继续判断置换到 i 处的 nums[index]是否满足判断，还是需要调整位置。（相当于上面的 while 做的事）

```ts
function firstMissingPositive2(nums: number[]): number {
  const len = nums.length;
  for (let i = 0; i < len; ) {
    const index = nums[i] - 1;
    if (index < 0 || index >= len || nums[index] == index + 1) {
      i++;
      continue;
    }
    nums[i] = nums[index];
    nums[index] = index + 1;
  }

  for (let i = 0; i < len; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return len + 1;
}
```

### 排序判断

这是我没有看题解时自己做的答案，虽然也满足时间复杂度的 O(N)的条件，但是感觉不是很好理解，因为我自己都不知道判断条件是否满足测试用例。

首先，对 nums 进行了排序，因此如果 nums[0] > 1 或者 nums[nums.length - 1] <= 0 就可以知道数组内部没有 1，直接返回。

遍历数组，nums[i] <0 则跳过；

当满足 **nums[i] - nums[i - 1] == 1** 时跳过，满足此条件则说明此数在[1,len]的正确范围。

当出现 **nums[i] - nums[i - 1] > 1** 时，说明在此处有缺少数字；
如果 **nums[i - 1] >= 0**，说明缺少的最小数就是 **nums[i - 1] + 1**；
如果 **nums[i - 1] < 0 && nums[i] > 1**，说明缺少了 1。

循环结束，如果是标准数组，那最小的便是 nums[len-1]+1。

即使这个算法也通过了 leetcode 的所有测试，但我感觉它不好的原因在于，判断的条件比较局限，没有很清晰得表示出所有情况，让人有一种还有情况没有考虑到的感觉。

```ts
function firstMissingPositive1(nums: number[]): number {
  nums = nums.sort((a, b) => a - b);
  const last = nums[nums.length - 1];
  if (nums[0] > 1 || last <= 0) return 1;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) continue;

    if (i > 0 && nums[i] - nums[i - 1] == 1) {
      continue;
    }
    if (nums[i] - nums[i - 1] > 1) {
      if (nums[i - 1] >= 0) return nums[i - 1] + 1;
      else if (nums[i] > 1) return 1;
    }
  }
  return nums[nums.length - 1] + 1;
}
```
