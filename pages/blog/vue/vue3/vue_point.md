---
title: The Vue Point
date: 2024-1-2 13:54:32
tags:
  - vue
---

[The Vue Point](https://blog.vuejs.org/)
Updates, tips & opinions from the maintainers of Vue.js.


## Vue 3.3 released

### Imported & Complex Types Support in SFC Macros*

```vue
<script setup lang="ts">
import type { Props } from "./types"

// imported + intersection type
defineProps<Props & { extraProp?: string}>()
</script>
```

### Generic Components

```vue
<script setup lang="ts" generic="T">
defineProps<{ 
  items: T[]
  selected: T
}>()
</script>
```

```vue
<script 
  setup 
  lang="ts" 
  generic="T extends string | number, U extends Item"
>
defineProps<{ 
  id: T
  list: U[]
}>()
</script>
```

### More Ergonomic defineEmits

```ts
// before
const emit = defineEmits<{
  (e: 'foo', id: number): void
  (e: 'bar', name: string, ...rest: any[]): void
}>()

// after
const emit = defineEmits<{
  foo: [id: number]
  bar: [name: string, ...rest: any[]]
}>()
```


### Typed Slots with defineSlots



```vue
<script setup lang="ts">
defineSlots<{
  default?: (props: { msg: string }) => any
  item?: (props: {id: number }) => any
}>()
</script>
```

### Reactive Props Destructure

```ts
const props = withDefaults(
  defineProps<{ foo: number }>(),
  { foo: 1 }
)
```

```ts
const {
  foo = 1
} = defineProps<{ foo: number }>()

foo // stays reactive
```


```vue
<script setup lang="ts">
import { watchEffect } from "vue"

const { msg = "hello" } = defineProps(["msg"])

watchEffect(() => {

  // accessing `msg` in watchers and computed getters
  // tracks it as a dependency, just like accessing `props.msg`
  console.log(`msg is: ${msg}`)
})
</script>

<template>{{ msg }}</template>
```


### defineModel



```vue
<!-- before -->
<script setup lang="ts">
const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

console.log(props.modelValue)

function onInput(e) {
  emit("update:modelValue", e.target.value)
}
</script>

<template>
  <input :value="modelValue" @input="onInput">
</template>
```

```vue
<!-- after -->
<script setup lang="ts">
const modelValue = defineModel()

console.log(modelValue.value)
</script>

<template>
  <input v-model="modelValue" />
</template>
```

### defineOptions


```vue
<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
  // Composition API code
</script>
```


```vue
<script setup>
defineOptions({
  inheritAttrs: false

})
// Composition API code
</script>
```



### Getter support via toRef & toValue

The Problem: passing non-ref reactive state into composables
问题:将非反应状态传递给可组合物

```ts
import { toRef } from "vue";

const props = defineProps(/* ... */);

// does not track foo presence 不跟踪foo的存在
useFeature(toRef(props.foo, 'bar'));

// unnecessary computed tracking 不必要的计算机跟踪
useFeature(computed(()=> props.foo?.bar));

// efficient and succinct  高效而简洁
useFeature(()=> props.foo?.bar);
```

Composables that support getters with toValue()
使用toValue()支持getter的可组合对象

```ts
function useFeature(foo: MaybeRefOrGetter<number>){
  watch(()=> toValue(foo), fooValue => {
    // react to foo changes
  })
}
```

> 有一个疑问，toValue是将拿到value值，那watch还能监听得到吗


### Plans for upcoming 3.x minors 


- Stabilize Suspense 
- Built-in safe Teleport 
- More efficient computed invalidation
- SSR improvements
  - Lazy Hydration
  - Validation for common causes for hydration mismatch

Smaller scope, faster release cycle


## Vapor Mode

### Vapor Mode in a Nutshell

- New compilation strategy
- Same template, more performant output
- Template clone + precise bindings, no VDOM

### Vapor Mode Stages

1. Runtime for core features 
2. Compiler for core features
3. Integration
4. Feature parity


#### Stage 1: Runtime for core features 

- Support core directives & component tree 
- Verify performance assumptions
- Hydration compatibility with existing SSR output

#### Stage 1: Compiler for core features

- Shared codegen IR(Intermediate Representation)
- JSX AST / Template AST -> IR -> Vapor Mode code

#### Stage 1: Integration

- Tooling support for standalone Vapor apps
- Ruining Vapor components inside existing apps
- Running vdom components inside Vapor


#### Stage 1: Feature parity


- Full feature parity with VDOM runtime
  - Transition
  - KeepAlive
  - Teleport
  - Suspense



## Future Standards to Track


### Native Scoped CSS via @scope

- W3C Working Draft

Part of CSS Cascading and Inheritance Level 6

- Once landed, can greatly simplify scoped

CSS implementation


### Current Vue Scoped Style Implementation

HTML
- Scope attributes added to every element via runtime
- Also generated by compiler for SSR output

```html
<section data-v-parent-id>
  <p data-v-parent-id>...<p>

  <!-- sub-component root is in both scopes -->
  <section data-v-parent-id data-v-child-id>
    <!-- children are only in the inner scope -->
    <p data-v-child-id>...<p>
  <section>
<section>
```

CSS
- Attributes selectors added to every rule via PostCSS transform

```css
p[data-v-parent-id] {
  color: red;
}

p[data-v-child-id] {
  color: blue;
}
```


### with Native @scope

HTML: Scope attributes only needed at component root

```html
<section data-v-scope="parent">
  <p>...<p>

  <!-- sub-component root is in both scopes -->
  <section data-v-scope="child">
    <!-- children are only in the inner scope -->
    <p>...<p>
  <section>
<section>
```

CSS: just need to wrap CSS inside @scope block

```css
@scope ([data-v-scope='parent']) to ([data-v-scope] > *)
{
  p { color: red; }
  /* more parent component rules */
}

@scope ([data-v-scope='child']) to ([data-v-scope] > *)
{
  p { color: blue; }
  /* more child component rules */
}
```

### AsyncContext

- Stage 2 ES proposal
- Potential benefits
  - Simplify current instance context tracking in async setup()
  - Improve async actions tracing in devtools

```ts
const context = new AsyncContext()

context.run(currentInstance, async function setup() {
  context.get() // currentInstance

  await fetch("/some-data")

  context.get() // currentInstance
})
```

### DOM Parts

- Early stage DOM proposal from Google
- "processing instructions" to serve as placeholders for dynamic parts in a template
- Highly relevant for Vapor Mode codegen


```html
<html>
  <section>
    <h1 id="name"><?child-node-part?><?/child-node-part?></h1>
    <?node-part metadata?><a id="link"></a>
  </section>
</html>
```


## vue3.4 新特性来袭


[Announcing Vue 3.4](https://blog.vuejs.org/posts/vue-3-4)


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
</>

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
