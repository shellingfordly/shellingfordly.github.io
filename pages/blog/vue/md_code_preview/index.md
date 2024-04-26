---
title: 给博客中的Markdown添加演示功能
date: 2024-4-26 10:43:48
tags:
  - vue
  - vue3
  - markdown
---

# 给博客中的 Markdown 添加演示功能

## 需求

给 code 部分加一个 preview 按键，点击查看代码演示，如下:

<playground :show-default="true">

```css
.container {
  width: 50px;
  height: 50px;
  background-color: red;
}
```

<template #html>

  <div class="container bg-red w-50px h-50px"></div>
</template>
</playground>

在我的博客项目中实现这个操作还算比较简单，因为我的博客是用 vue 写的。使用这个 `unplugin-vue-markdown` 插件就可以直接用 md 文件当 vue 组件，并且也能直接使用 vue 组件。

首先，定义一个 `playground` 的 vue 组件，一个默认的插槽接收我们的 md 内容，一个具名插槽接收演示代码

```vue
<script setup lang="ts">
const show = ref(false);
</script>

<template>
  <div>
    <div inline-block cursor-pointer @click="show = !show" title="查看演示">
      <div i-material-symbols-light:preview />
      <span text-sm select-none>Preview</span>
    </div>
    <div class="grid gap-2" :class="[show ? 'grid-cols-2' : 'grid-cols-1']">
      <div>
        <slot />
      </div>
      <div v-show="show" class="my2 p5 rounded bg-[#fafafa] dark:bg-[#0e0e0e]">
        <slot name="preview" />
      </div>
    </div>
  </div>
</template>
```

然后我们在 md 文件中直接使用即可：

这里我们不用担心 `md内容` 的样式问题，由于 `unplugin-vue-markdown` 插件对 md 文件的解析是在 vue 组件之前的，是先去解析了 md 文件再解析内部的 vue 组件。所以 css 这部分代码在传入 `playground` 组件时已经变成了 `html` 代码，然后再传入了默认插槽中。

然后我们的 `preview` 直接写 html 就好了。还有一个问题，就是在这里我们的内容代码时 css 样式，如何把这个 css 样式注入实际的页面中呢。

嗯...这里我直接写在 `preview` 的 html 里了。由于我用了 `unocss`，这样最简单哈哈哈哈。

````md
<playground>

```css
.container {
  width: 200px;
  height: 200px;
  background-color: red;
}

@layer {
  .container {
    background-color: blue;
  }
}
```

<template #preview>

  <div class="container bg-red w-50px h-50px"></div>
</template>
</playground>
````

其实我也尝试过在解析 md 时注入 css 样式，`unplugin-vue-markdown` 提供了一个属性 `transforms`，可以拿到解析前后的 md 内容。

我想有两种方式，一是在 `transforms.before` 里拿到 css 解析为 `unocss` 的 class 注入 `div.container`；二是直接将 css 放在 style 标签里注入 html。

可能写在 markdownItSetup 里会更好，因为这个属性是专门用来设置插件的，不过我在尝试的时候是直接在 transforms.before 里拿到 md 文件的全部内容进行解析注入的，确实是可行的。但感觉不是太好，会影响全局样式；其实好像也能解决，给 class 添加一个特殊的 id 应该就好了，尝试了一下太麻烦了，最后还是放弃了。

解析为 unocss 的 class 我没有尝试（也是我不知道 unocss 有没有提供 native-css 转 unocss 的接口），感觉上这样应该更好一点，肯定不会影响全局样式了，最终都会被 unocss 解析。

```ts
import Markdown from "unplugin-vue-markdown/vite";

export default defineConfig({
  plugins: [
    Markdown({
      transforms: {
        before(code) {
          // code 解析前的 md 内容
          return code;
        },
        after(code) {
          // code 解析前的 md 内容，即 html
          return code;
        },
      },
    }),
  ],
});
```

当然，我这里只是 css 的演示，如果想做 js 的演示呢，要注入 js 吗，想了想，我现在的环境不就可以直接在 md 文件里写 js 吗，哈哈哈哈。直接把 md 文件当 vue 组件写就行了，把 code 传给默认插槽，演示代码传给 preview 插槽。如下：

<script setup>
import {ref} from "vue"
const count = ref(0);
</script>

<playground :show-default="true">

```vue
<script setup>
const count = ref(0);
</script>

<template>
  <div>{{ count }}</div>
  <button @click="count++">add</button>
</template>
```

<template #html>

  <div>count: {{ count }}</div>
  <button class="bg-gray-200 rounded px2 hover:bg-gray-400" @click="count++">add</button>
</template>
</playground>

当然，我这里只是简单的演示，想实现更复杂的功能的话肯定不行，不过展示对我来说够用了。
