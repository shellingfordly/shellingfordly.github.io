---
title: antd vue table 滚动页面固定表头优化
date: 2021-05-28
tags:
  - vue
---

# antd vue table 滚动页面固定表头优化

由于之前的 [antd vue table 滚动页面固定表头](/blog/web/vue_antd_table_fixed) 存在一些问题。当头部上方还需要置顶一些其他东西时，比如导出案件、筛选框、搜索框、标题等等时，之前的代码不够灵活，没有设置置顶的偏移量。当页面内打开抽屉重复利用 table 时，也会存在问题，由于外面的滚动已经让头部置顶了，打开抽屉时，table 的 head 依然在，并且会遮挡数据。

因此重写了置顶的 js 代码，通过监听对应 dom 的滚动，而不是监听 window。

```ts
// 判断是否出现滚动条
function hasScrolled(el: HTMLElement, direction = "vertical") {
  if (direction === "vertical") {
    return el.scrollHeight > el.clientHeight;
  } else if (direction === "horizontal") {
    return el.scrollWidth > el.clientWidth;
  }
}

// 找到有滚动条的dom
function findScrollDom(el: HTMLElement) {
  if (!el) return null;
  const isScrolled = hasScrolled(el);
  if (isScrolled) {
    return el;
  }
  const pEl = el.parentElement;
  if (pEl) {
    return findScrollDom(pEl);
  } else {
    return null;
  }
}
```

```ts
function useListenerScroll() {
  const containerRef = ref();
  const isFixed = ref(false);
  const width = ref("100%"); // 置顶容易的宽度
  const top = ref("51px"); // 默认的定位高度，导航栏高度
  const titleHeight = ref(0); // head上放的title或其他操作的容器高度

  const initEvent = async () => {
    await nextTick();

    // 如果table组件为空，递归调用
    if (!containerRef.value) {
      initEvent();
      return;
    }

    // 找到滚动容器
    const scrollDom = findScrollDom(containerRef.value);
    if (scrollDom) {
      const titleDom = scrollDom.getElementsByClassName("table-title-content");
      // 获取title内容高度
      if (titleDom[0]) titleHeight.value = titleDom[0].clientHeight;
      else titleHeight.value = 0;
      scrollDom.addEventListener("scroll", listenerScroll);
      top.value = scrollDom.offsetTop + "px";
    }
  };

  function listenerScroll(event: any) {
    const $el = event.target;
    if ($el) {
      const scrollTop = $el.scrollTop;
      const fixedDom = $el.getElementsByClassName("table-content");
      if (fixedDom.length) {
        const dom = fixedDom[0];
        const domTop = dom.offsetTop - titleHeight.value - 51;

        // 滚动高度大于设定高度时，置顶头部
        if (scrollTop > domTop) {
          isFixed.value = true;
        }
        if (scrollTop < domTop) {
          isFixed.value = false;
          width.value = dom.clientWidth + "px";
        }
      }
    }
  }

  return {
    top,
    width,
    isFixed,
    containerRef,
    initEvent,
  };
}
```

```vue
<template>
  <div ref="containerRef">
    <div :style="fixedHeaderStyle">
      <div class="table-title-content" v-if="$slots['w1-title'] || title">
        <span v-if="title">{{ title }}</span>
        <slot name="title" />
      </div>
      <div>
        <a-table :pagination="false" v-bind="$attrs" :data-source="[]">
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data" />
          </template>
        </a-table>
      </div>
    </div>
    <a-table
      class="table-content"
      v-bind="$attrs"
      :dataSource="dataSource"
      v-loading="loading"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data"> </slot>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { isFunction } from "/@/utils/is";
import useListenerScroll from "./hooks/useListenerScroll";

export default defineComponent({
  props: {
    dataSource: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
    title: {
      type: String,
    },
  },
  setup(props) {
    const {
      isFixed,
      containerRef,
      initEvent,
      width,
      top,
    } = useListenerScroll();
    const fixedHeaderStyle = computed(() => ({
      position: isFixed.value ? "fixed" : "relative",
      top: isFixed.value ? top.value : 0,
      zIndex: isFixed.value ? 19 : 0,
      width: width.value,
    }));

    onMounted(() => {
      initEvent();
    });

    return {
      isFixed,
      containerRef,
      fixedHeaderStyle,
    };
  },
});
</script>
```
