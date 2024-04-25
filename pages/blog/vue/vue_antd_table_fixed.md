---
title: antd vue table 滚动页面固定表头
date: 2021-04-16
tags:
  - vue
---

## antd vue table 滚动页面固定表头

### 思路

由于直接去控制 antd table 的头部置顶会导致头部样式丢失，每列去获取宽度设置感觉太麻烦，最后决定使用两个 table，一个只做表头固定使用，不赋予数据。
具体做法时，将传入的属于都付给两个 table，隐藏表头 table 的内容部分，当滚动页面超过内容 table 时，显示表头 table。

### template

- :data-source="[]" 表头 table 的数据为空
- v-loading="false" 避免出现两个 loading

```
<template>
  <div style="overflow: hidden">
    <div class="w1-table-fixed">
      <a-table
        v-show="isShowHead"
        v-bind="$attrs"
        :data-source="[]"
        v-loading="false"
      >
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data" />
        </template>
      </a-table>
    </div>
    <a-table
      class="w1-table"
      ref="tableRef"
      v-bind="$attrs"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data" />
      </template>
    </a-table>
  </div>
</template>
```

### js 代码

```js
import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
  unref,
} from "vue";

export default defineComponent({
  setup() {
    const tableRef = ref();
    const isShowHead = ref(false);

    function scrollLeft() {
      const el = unref(tableRef);
      const tableBody = document.getElementsByClassName("ant-table-body")[1];
      const fixedTableBody = document.getElementsByClassName(
        "ant-table-body"
      )[0];

      // 实现内容table和头部table的滚动联动
      tableBody.addEventListener("scroll", () => {
        fixedTableBody.scrollLeft = tableBody.scrollLeft;
      });

      fixedTableBody.addEventListener("scroll", () => {
        tableBody.scrollLeft = fixedTableBody.scrollLeft;
      });
    }

    function srollListener() {
      const el = unref(tableRef);
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      // 滚动大于table到页面顶部高度时，显示固定table头部
      if (scrollTop > el.$el.offsetTop) {
        isShowHead.value = true;
      } else {
        isShowHead.value = false;
      }
    }

    onMounted(async () => {
      const el = unref(tableRef);

      // 确保table已经创建成功
      if (el) {
        await nextTick();
        window.addEventListener("scroll", scrollListener, true);
        scrollLeft();
      }
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", scrollListener, true);
    });

    return {
      tableRef,
      isShowHead,
    };
  },
});
```

css 样式

```less
.w1-table-fixed {
  position: fixed;
  top: 0;
  z-index: 999;
  overflow: hidden;

  .ant-table-body {
    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .ant-table-placeholder {
    // 隐藏头部table的内容
    display: none !important;
  }
}
```

### 问题

不过这个方式就是在显示表头 table 的时候会有卡顿感，如果有好的优化方式可以评论告诉我
