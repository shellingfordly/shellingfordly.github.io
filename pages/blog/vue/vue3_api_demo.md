---
title: vue3新特性的实际应用demo
date: 2021-11-30
tags:
  - vue
---

# vue3新特性的实际应用

## hook 形式使用弹窗组件

vue3 新增了 composition api 之后，组件功能的拆分更加方便了，下面使用这种方式来编写弹窗组件，抽屉同理。

### MyDrawer.vue

首先，自定义一个 dialog 组件。此组件内部暴露控制弹窗显隐的方法、和设置属性的方法，getCurrentInstance 是 vue 提供的获取组件实例的方法，具体代码如下———

```js
<template>
  <el-dialog
    :before-close="()=>{ actionDialog(false) }"
    v-model="visible"
    v-bind="getProps"
  >
    <template #[item]="data" v-for="item in Object.keys($slots, 'default')">
      <slot :name="item" v-bind="data"></slot>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
} from "vue";

export default defineComponent({
  name: "",
  setup(props, { emit }) {
    const visible = ref(false);
    const propsRef = reactive({
      visible: false,
      title: undefined,
    });
    const getProps = computed(() => {
      return Object.assign(propsRef, props);
    });

    const dialogInstance = {
      actionDialog,
      setProps,
    };

    const instance = getCurrentInstance();

    if (instance) {
      emit("register", dialogInstance);
    }

    function actionDialog(isShow: boolean) {
      visible.value = isShow;
    }

    function setProps(propsValue: any) {
      Object.assign(propsRef || {}, propsValue);
    }

    return {
      visible,
      getProps,
      actionDialog,
    };
  },
});
</script>
```

### useDialog.ts

除了自定义组件内部需要做一些处理之外，还需要提供一个暴露一些操作弹窗方法的 useDialog 方法，这就是常说的 hook 函数吧。此处暴露一个 register 方法，在使用时该方法需要绑定在自定义 dialog 组件上。当创建了 dialog 组件后，就会触发 register 方法，将 dialog 实例和内部提供的方法传递出来，然后在父组件中使用。

```js
import { ref, unref } from "@vue/reactivity";
import { isInSetup } from "/@/utils/help/vue";
import { DialogPropsModel, ResultModel, MethodsModel } from "./types";

export function useDialog(props?: DialogPropsModel): ResultModel {
  // 监测是否在setup里面调用
  isInSetup();

  const instanceRef = ref();
  const uuidRef = ref();

  function register(dialogInstance: any, uuid: string) {
    instanceRef.value = dialogInstance;
    uuidRef.value = uuid;

    props && methods.setProps(props);
  }

  const getInstance = () => {
    const instance = unref(instanceRef);
    if (!instance) {
      console.error("useModal instance is undefined!");
    }
    return instance;
  };

  const methods: MethodsModel = {
    actionDialog(open = true) {
      getInstance()?.actionDialog(open);
    },
    setProps(props: any) {
      getInstance()?.setProps(props);
    },
  };

  return [register, methods];
}
```

### home.vue

具体使用时，在父组件中调用对应的 TestDialog 组件，然后使用 useDialog 函数暴露出 register 注册函数和 actionDialog 操作显隐的函数，将 register 绑定到 TestDialog 上，这样当组件被创建时，就会触发 emit 暴露方法再通过 useDialog 返回出来，也就是 actionDialog 函数，绑定对应的触发 Dom 上就 OK 了。

```js
<template>
  <div>
    <el-button @click="actionDialog()">open dialog</el-button>
    <TestDialog @register="register" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { userStore } from "/@/store/modules/user";
import TestDialog from "/@/components/TestDialog.vue";
import { useDialog } from "/@/components/dialog/useDialog";

export default defineComponent({
  components: { MyDrawer },
  setup() {
    const [register, { actionDialog }] = useDialog({ title: "Dialog" });
    return {
      register,
      actionDialog,
    };
  },
});
</script>
```

### TestDialog.vue

TestDialog 组件中只需要调用 MyDialog 并使用 v-bind="$attrs"将所有的属性和事件传递给 MyDialog 就可以了。然后就可以在 MyDialog 中编写弹窗内显示的内容。弹窗的属性可以通过 useDialog 传递，也可以直接在 TestDialog 中编写。

```js
<template>
  <MyDialog v-bind="$attrs">
    这是弹窗内部的内容！
  </MyDialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MyDialog from "/@/components/dialog/MyDialog.vue";

export default defineComponent({
  name: "TestDrawer",
  components: { MyDialog },
  setup() {
    return {};
  },
});
</script>
```

弹窗代码的拆解，hook 形式的代码就完成了。实现了设置 dialog 属性和设置显示隐藏的简单功能。这样拆解之后，减少了 Home 组件内部弹窗的 template 代码，可以随意的将属性在 js 中或者子组件中进行设置。虽然功能不复杂，但编写起来舒服了很多，否则 Home 组件中调用 element 原生的 dialog 组件的话，需要在 template 传递很多属性。如果直接抽离的话又需要在子组件中监听显隐变量，父组件监听显隐事件，写了很多与数据不相关的代码，代码看起来也不那么请爽。
