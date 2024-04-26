---
title: vue3.4新特性
date: 2024-1-2 13:54:32
tags:
  - vue
---

## vue3.4 新特性来袭

### defineModel

这个语法声明一个双向绑定属性，对应父组件 `v-model` 绑定的属性。

这个真的很有用，如果我只是简单的将 `v-model` 传递给子组件。

当子组件顶部只有一个元素时，vue3 可以直接传递到该元素，也就是说 v-model 是可以直接传递到 input 的

```vue
// 父组件
<template>
  <MyInput v-model="value"> </MyInput>
</template>

// 子组件
<template>
  <input />
</template>
```

即使不是单元素，也可以用 `v-bind="$attrs"` 可以传递

```vue
// 子组件
<template>
  <input v-bind="$attrs" />
</template>
```

但是，有时候需要对 value 进行一些处理时，我就不得不用 props 接收，并且写对应的更新事件 `update:modelValue`，这是一件很难受的事情。

```vue
// 子组件
<script>
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(["update:modelValue"]);

function onChange(event: Event){
  const value = Number(event.target.value)
  emit("update:modelValue", value);
}
</script>

<template>
  <input :value="modelValue" @input="onChange" />
</template>
```

而 `defineModel` 能够直接声明一个双向绑定属性，在子组件中也能自由使用，不会因为 `props` 只读而导致修改必须 emit 事件。

```vue
// 子组件
<script>
const modelValue = defineModel<string>()
</script>

<template>
  <input v-model="modelValue" />
</template>
```

而且官方也提供了修饰符和转换器，这样在子组件中就变得优雅了许多。

```vue
// 子组件
<script>
const modelValue = defineModel({
  set(value) {
    return isNaN(Number(value)) ? 0 : value;
  },
});
</script>

<template>
  <input v-model="modelValue" />
</template>
```

### v-bind 同名简写

```vue
<img :id="id" :src="src" :alt="alt" />
// 简写
<img :id :src :alt />
```

### 错误代码

vue 在生产构建中删除了长错误消息，取而代之的是简短的错误代码。

官方错误代码参考：[Production Error Code Reference](https://vuejs.org/error-reference/)

### 全局 JSX 命名空间

从 3.4 开始，Vue 不再默认注册全局命名空间

<!-- TODO translate -->

If you are using TSX, there are two options:

1. Explicitly set jsxImportSource to in before upgrading to 3.4. You can also opt-in per file by adding a comment at the top of the file.`'vue'` `tsconfig.json` `/_ @jsxImportSource vue _/`

2. If you have code that depends on the presence of the global namespace, e.g. usage of types like etc., you can retain the exact pre-3.4 global behavior by explicitly referencing , which registers the global namespace.`JSX` `JSX.Element` `vue/jsx` `JSX`
