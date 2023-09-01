---
title: Vue3新特性学习记录
date: 2021-11-25
tags:
  - vue
---

# Vue3新特性学习记录

## 新特性

- 更快
  - 虚拟 DOM 重写
  - 优化 slots 的生成
  - 静态树提升
  - 静态属性提升
  - 基于 proxy 响应式
- 更小
  - 通过摇树优化核心库体积
- 更容易维护
  - ts + 模块化
- 更友好
  - 跨平台： 编译器和运行时核心与平台无关，使 vue 更容易与任何平台（Web、Android、Ios）一起使用
- 更容易使用
  - ts
  - 更好的调试支持
  - 独立的响应式模块
  - Composition API
    - 逻辑复用

### 虚拟 DOM 重写

### 插槽

1. 默认内容和扩展点

- vue 中的插槽可以有默认的内容

```html
<button class="button" @click="$emit('click')">
  <slot>
    <!-- Used if no slot is provided -->
    Click me
  </slot>
</button>
```

2. 单个作用域的插槽不需要 template 标签

```html
<DataTable>
  <template #header="tableAttributes">
    <TableHeader v-bind="tableAttributes" />
  </template>
</DataTable>

<!-- 简写 -->
<DataTable #header="tableAttributes">
  <TableHeader v-bind="tableAttributes" />
</DataTable>
```

3. 监听插槽的变化

> MutationObserver 接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。

```ts
export default {
  mounted() {
    // 当有变化时调用`update`
    const observer = new MutationObserver(this.update);

    // 监听此组件的变化
    observer.observe(this.$el, {
      childList: true,
      subtree: true,
    });
  },
};
```

#### 父组件

- v-slot 简写 #
- 在 slot 上传递的属性可以被 v-slot 接收
  -  可以使用:修改命名
  - 可以使用扩展运算符取值

```vue
<template>
  <div>
    <Son>
      <template #less="data">
        {{ data.data }}
      </template>
      <template #more="{ data, other: otherMsg }">
        {{ data }} --- {{ otherMsg }}
      </template>
    </Son>
  </div>
</template>
<script>
import Son from "./Son.vue";
export default {
  name: "Parent",
  components: {
    Son,
  },
};
</script>
```

#### 自组件

- 传递多属性时可以使用 v-bind

```vue
<template>
  <div class="son">
    <slot name="less" :data="data">
      {{ msg }}
    </slot>
    <slot name="more" v-bind="{ ...state }">
      {{ msg }}
    </slot>
  </div>
</template>
<script>
export default {
  name: "Son",
  data() {
    return {
      state: {
        data: "我是子组件的数据",
        other: "其他数据",
        test: "测试数据",
      },
      msg: "我是子组件的默认数据",
    };
  },
};
</script>
```

### 使用自组件的 props 类型

```js
import Icon from "./Icon";
export default {
  components: { Icon },
  props: {
    ...Icon.props,
  },
};
```

```js
import Icon from "./Icon";

const iconProps = {};

Object.entries(Icon.props).forEach((key, val) => {
  iconProps[`icon${key.toUpperCase()}`] = val;
});

export default {
  components: { Icon },
  props: {
    ...iconProps,
    heading: {
      type: String,
      required: true,
    },
  },
};
```

### 检测元素在外部/内部点击

```js
window.addEventListener("mousedown", (e) => {
  // 获取被点击的元素
  const clickedEl = e.target;

  if (el.contains(clickedEl)) {
    //在 "el "里面点击了
  } else {
    //在 "el "外点击了
  }
});
```

### 递归插槽

```vue
<!-- VFor.vue -->
<template>
  <div>
    <!--  渲染第一项 -->
    {{ list[0] }}
    <!-- 如果我们有更多的项目，继续!但是不要使用我们刚刚渲染的项 -->
    <v-for v-if="list.length > 1" :list="list.slice(1)" />
  </div>
</template>
```

- 使用插槽，设置默认内容
- 方便对特殊的子项进行更改

```vue
<template>
  <div>
    <!-- Pass the item into the slot to be rendered -->
    <slot v-bind:item="list[0]">
      <!-- Default -->
      {{ list[0] }}
    </slot>

    <v-for v-if="list.length > 1" :list="list.slice(1)">
      <!-- Recursively pass down scoped slot -->
      <template v-slot="{ item }">
        <slot v-bind:item="item" />
      </template>
    </v-for>
  </div>
</template>
```

- 使用

```vue
<template>
  <div>
    <!-- 常规列表 -->
    <v-for :list="list" />

    <!-- 加粗的项目列表 -->
    <v-for :list="list">
      <template v-slot="{ item }">
        <strong>{{ item }}</strong>
      </template>
    </v-for>
  </div>
</template>
```

## setup

- setup 加上 async 时组件无法渲染出来
- 要给 setup 添加 async 就需要使用 Suspense 包裹此组件

```html
<Suspense>
  <template #default>
    <kol-table />
  </template>
  <template #fallback> 数据加载中 ... </template>
</Suspense>
```

### Suspense

- Suspense 的 template 下只能一个子元素 DOM，多了显示不出来
- 不过 antd 给的提示说 api 可能会变

```html
<!-- 错误写法 -->
<!-- <Suspense> is an experimental feature and its API will likely change. -->
<Suspense>
  <template #default>
    <div></div>
    <div></div>
  </template>
</Suspense>
```

```html
<!-- 正确写法 -->
<Suspense>
  <template #default>
    <div>
      <div></div>
      <div></div>
    </div>
  </template>
</Suspense>
```

### props

- setup 的 props 参数需要在 props 属性接收了才有

```ts
export default defineComponent({
  // 接收
  props: ["data"],
  async setup(props) {
    console.log(props.data);
    return {};
  },
});
```

## data

### ref

- ref 返回一个 Ref 类型的数据
- 取值的时候需要加 value

```ts
let headData: Ref<DataType[]> = ref([]);
let data = ref({});
headData.value = [
  {
    data: "121w",
    note: "总播放量",
  },
];
data.value = { a: 2 };
return { headData, data };
```

### 直接赋值问题

#### 数组

- 使用 ref 创建的数据直接进行=赋值是可以响应视图的
- 而使用 reactive 不可以
- 数组不设定类型的话，添加数据会报类型错误
  - 并且要是一个 Ref 类型

#### 对象

- 对象使用 data.value 赋值时 ts 不会报类型错误
- 直接对 data 使用=赋值则会报类型错误

### 与 reactive 的区别

- 使用 ref 创建对象无法被 watch 监控到
- 想要被 watch 监控需要获取 value
- 想要监控到具体的值时需要使用函数返回值

```ts
const objRef = ref({ id: 0 });
const objReactive = reactive({ id: 0 });

// 无法监控到
watch(objRef, (newVal) => {
  console.log(newVal);
});
// 可以监控到
watch(objRef.value, (newVal) => {
  console.log(newVal);
});
// 可以监控到
watch(objReactive, (newVal) => {
  console.log(newVal);
});
// 监控具体到值
watch(
  () => objReactive.id,
  (newVal) => {
    console.log(newVal);
  }
);
```

## 配置

- 无法配置多级默认路由

```c
'/api':'https://w1.cosmeapp.com/api/xxx'
```

## 插槽

```vue
<!-- Son.vue -->
<template>
  <slot name="left"></slot>
</template>

<!-- Parent.vue -->
<template>
  <Son>
    <template #left> </template>
  </Son>
</template>
```

## 自定义组件

- ~~不需要对自组件进行绑定也可以触发事件~~
- ~~给 Select 组件绑定的 v-model:value 和@change 都不要代理~~
- 当 Select 组件的根组件直接是 a-select 时，可以不需要代理，属性将默认传入 a-select 组件

```vue
<!-- Parent.vue -->
<template>
  <Select
    v-model:value="state.value"
    :options="state.options"
    @change="changeValue"
  ></Select>
</template>

<!-- Select.vue -->
<template>
  <a-select ref="select">
    <a-select-option v-for="(item, i) in options" :key="i" :value="item.value">
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>
```

## v-model

- 可以指定接受的变量名
- 可以绑定多个 v-model

```vue
<!-- Son.vue -->
<template>
  <!-- 接受对应的变量 -->
  <input type="text" :value="value" />
  <input type="text" :value="msg" />
</template>

<!-- Parent.vue -->
<template>
  <Son v-model:value="value" v-model:msg="msg" />
</template>
```

- 自组件给父组件传值

```js
setup(props, ctx){
  ctx.emit('update:msg',e.target.value)
  ctx.emit('update:value',e.target.value)
}
```

## 踩坑

### input

- 给 input 绑定的值必须是 reactive 创建响应式对象的属性，ref 创建字符串将无法输入

### 双向数据绑定

- 对象直接重新赋值页面不响应

```js
const data = reactive({
  a: 1,
});
data = {
  b: 2,
};
```

### img src

- protocol should added in img src, otherwise an error occurred, maybe it's a bug of vite

```html
<!-- correct -->
<img src="http://xxx" />
<!-- An error occurred while img src without protocol (http or https)  -->
<img src="//xxx" />
```

## TS

### 类型推导

- 获取某个变量的推导类型

```ts
const obj = {
  a: 1,
  b: 2,
};
const obj1: typeof obj = {}; // 类型检测会报错
```

- 获取没个函数返回的类型

```ts
function fn() {
  return {
    a: 1,
  };
}
const obj: ReturnType<typeof fn> = {
  a: 1,
  b: 2, // 类型检测会报错
};
```

- Object 通过变量获取

```ts
interface {
  [key: string]: any
}
```

### 全局类型

```ts
declare namesepace API {
  interface Common {
    [key: string]: any
  }
}
```

## key

- 用于强制替换元素/组件而不是重复使用它
  - 完整地触发组件的生命周期钩子
  - 触发过渡
- 当 text 发生改变时，\<span> 总是会被替换而不是被修改，因此会触发过渡

```html
<transition>
  <span :key="text">{{ text }}</span>
</transition>
```

## 一些特性

### Attribute 继承

props 和 emits property 中未包含的所有属性将会自动绑定到自组件的根节点上

- 可以使用 inheritAttrs: false 禁用
- 多个根节点组件不会自动绑定，将会发出警告，使用 v-bind 绑定后则清楚警告

### teleport

将一个 DOM 挂载到另一个 DOM 上，多个 \<teleport\> 组件可以将其内容挂载到同一个目标元素

```html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>
<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## 一些问题

### getCurrentInstance

> 获取当前组件实例

```js
import { getCurrentInstance } from "vue";
const instance = getCurrentInstance();
```

### ctx

> 当前组件的上下文，只能在开发环境下使用，生产环境下的 ctx 将访问不到，ctx 中包含了组件中由 ref 和 reactive 创建的响应式数据对象，以及 proxy 下的属性

```js
const { ctx } = getCurrentInstance();
```

- 注意：在 setup 中不可以调用 getCurrentInstance().ctx 来获取组件内部数据，因为在 prod 模式会被干掉

- 原因：
  - ctx 只是为了便于在开发模式下通过控制台检查
  - 在 prod 模式是一个空对象

![](/images/blog/vue3_note_1.png)
图片来源[掘金 春去春又来](https://juejin.cn/post/6899432348266283022)

### proxy

> 在开发环境以及生产环境下都能放到组件上下文对象（推荐）

包含属性$attrs,$data,$el,$emit,$forceUpdate,$nextTick,$options,$parent,$props,$refs,$root,$slots,$watch

```js
const { proxy } = getCurrentInstance();
```

### 数据响应

#### 某些特殊情况下，非响应式数据改变也能被页面响应

非响应式变量改变时页面是无法重新渲染的，如果在响应式数据改变的时候，改变了非响应式的变量，此时页面会同时重新渲染新数据。但是只限于数组和对象的改变，普通字符串不渲染。

#### 数组

- 数组的 push/pop 或者是直接[index]赋值的方式都是会触发的

template 代码

```html
<div>
  <button @click="push">Push</button>
  <ul>
    <li v-for="item in list1" :key="item">{{ item }}</li>
  </ul>
  <ul>
    <li v-for="item in list2" :key="item">{{ item }}</li>
  </ul>
</div>
```

ts 代码

```ts
setup(){
 const list1 = ref<string[]>(["aaa", "bbb", "ccc"]);
  const list2 = ["AAA", "BBB", "CCC"];

  function push() {
    list1.value.push("ddd");
    list2.push("DDD");
  }

  return { list1, list2, push }
}
```

点击 Push，页面同时渲染了 list1 和 list2

#### 对象

- 对象的属性修改/新增也是会触发页面渲染的

template 代码

```html
<button @click="modify">modify</button>
<div>{{ obj1 }}</div>
<div>{{ obj2 }}</div>
```

- ts 代码

```ts
setup(){
  const obj1 = reactive({
    key: "obj1 key",
  });
  const obj2 = {
    key: "obj2 key",
  };

  function modify() {
    obj1.key = "modify obj1 key";
    obj2.key = "modify obj2 key";
  }

  return { obj1, obj2, modify };
}
```

点击修改 obj1 和 obj2 的 key 后，页面都渲染了

#### 字符串

- 修改普通字符串后，页面没有渲染
- 数字/Boolean 和字符串的效果一样

template 代码

```html
<button @click="modify">modify</button>
<div>value1 ====== {{ value1 }}</div>
<div>value2 ====== {{ value2 }}</div>
```

js 代码

```ts
setup() {
  const value1 = ref("使用ref声明的value1");
  let value2 = "普通字符串value2";

  function modify() {
    value1.value = "修改value1";
    value2 = "修改value2";
  }

  return { value1, value2, modify };
},

```

点击修改后页面只有 ref 声明的变量重新渲染了，普通声明的变量并没有重新渲染

### 组件循环

- 当在给某组件循环需要在外层套 div/template ，但同时 div/template 会影响结构时，可以直接循环组件

```html
<Parent>
  <Son v-for="item in list" :data="item" />
</Parent>
```
