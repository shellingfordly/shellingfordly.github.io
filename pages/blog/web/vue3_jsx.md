---
title: 在vue3中使用jsx的配置以及一些小问题
date: 2022-03-10 18:11:00
tags:
  - vue
  - jsx
---

# 在 vue3 中使用 jsx 的配置以及一些小问题

## 配置

在 vue3 中使用 jsx 十分方便，只需要安装官方的`@vitejs/plugin-vue-jsx`插件，在`vite.config.ts`中配置

```js
// vite.config.ts
import vueJsx from "@vitejs/plugin-vue-jsx";

export default {
  plugins: [vueJsx()],
};
```

配置了`vite.config.ts`后虽然已经可以使用 jsx，页面也正常渲染了，但是还是会提示无法使用 jsx，此时还需要在`tsconfig.ts`中配置`"jsx": "preserve"`属性，就可以愉快的使用 jsx 形式来写 vue 了。

![vue3_jsx_1](/images/blog/vue3_jsx_1.png)

```json
// tsconfig.ts
{
  "jsx": "preserve"
}
```

## 模版语法

使用 jsx 时 setup 需要返回一个函数，函数返回 jsx 形式。不过使用 jsx 形式也有不好的地方，在使用数据就比较烦，不能像模版中一样直接使用，需要加上`.value`，虽然新的 volar 插件已经会自动添加.value 了，但还是很难受，一不小心就会忘记写。

```html
<script lang="tsx">
  import { defineComponent, ref } from "vue";

  export default defineComponent({
    setup() {
      const msg = ref("tsx component");
      return () => {
        return <div>{msg.value}</div>;
      };
    },
  });
</script>
```

### v-if/v-show

还有不太方便的一个点就是 v-if 无法使用，jsx 中得使用三元表达式，但是三元感觉看起来不是很舒服

```ts
export default defineComponent({
  setup() {
    const msg = ref("tsx component");
    const isShow = ref(false);

    function onClick() {
      isShow.value = !isShow.value;
    }

    return () => {
      return (
        <div>
          <div>{msg.value}</div>
          {isShow.value && <div>{isShow.value ? "show" : "hide"}</div>}
          <el-button onClick={onClick}>onClick</el-button>
        </div>
      );
    };
  },
});
```

如果直接使用 v-if 就会报错`无法读取未定义的属性`

![vue3_jsx_2](/images/blog/vue3_jsx_2.png)

但是`v-show`是可以使用的，但`v-if`不行，不知道为什么，可能是直接 jsx 默认推荐使用`isShow && <div/>`或者三元的形式吧

```jsx
<div>
  <div>{msg.value}</div>
  {isShow.value && <div>{isShow.value ? "show" : "hide"}</div>}
  <div v-show={isShow.value}>{isShow.value ? "show" : "hide"}</div>
  <el-button onClick={onClick}>onClick</el-button>
</div>
```

v-show 正确显示出了 show div，dom 中也是通过 display 做的显影，三元则是创建和销毁的 dom

![vue3_jsx_3](/images/blog/vue3_jsx_3.png)


`v-for`就更不用想了，就用 map 吧，map 也挺好用的，不过`v-model`还是可以使用的，显示也正常

```ts
export default defineComponent({
  setup() {
    const msg = ref("tsx component");
    return () => {
      return (
        <div>
          <div>{msg.value}</div>
          <el-input v-model={msg.value} />
        </div>
      );
    };
  },
});
```
