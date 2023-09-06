---
title: vben自定义hook useForm实现思路详解，以及实现element版的useForm
date: 2022-03-11 10:57:00
tags:
  - vue
  - vben
---

# vben 自定义 hook useForm 实现思路详解，以及实现 element 版的 useForm

Vue3 已经发了一年多了，现在也是已经转正了，Antd 和 element 的 Vue3 版本也都是可以用了。Vue3 刚发布没多久的时候我就上车了，当时在 Github 找了一圈 Vue3 的 Admin 架子，最后发现了[vue-vben-admin](https://github.com/vbenjs/vue-vben-admin)这个项目，感觉这个作者写得很好，代码规范，封装啥的都很完善，当时 Vben 还只有 1k 多 star，现在已经 10.3k 了，虽然很多觉得它太臃肿了，但事实证明它确实是很好，估计后面还会慢慢增加。当时就想做一个 Vben 的 element 移植版，奈何过于懒惰，只搭起了架子，没有做后续，加上 Vben 确实复杂，它的自定义组件不是太好移植。搁置到了今年，最近捡起来，移植了 Form 组件包括 useForm 的用法。

## 项目

我的这个 element-puls 版的项目地址[vele-admin](https://github.com/shellingfordly/vele-admin)，目前移植了 Model，Dialog，Form 组件，用过 Vben 的应该知道，就是使用 useForm 的形式，template 模版里面的组件参数可以少传一些。

OK，开整，先说一下，Vben 里面的 Form 组件写得比较复杂，各种 util 函数封装的比较多，我这里写的时候进行了很多缩减，代码简化了很多，也更容易看懂。

## 分析

### useForm

Vben 的很多组件都是对 Antd 进行二次封装，使用 useFunc 的形式对数据进行处理，让我们在模版中不需要写过多的参数，也不用写大量重复的 Antd 组件。

上代码，useForm 接受 props 参数，props 就是 Form 组件的属性，Vben 里面加了更多自己的属性，拥有更多自定义的功能，我这里就不做那么多了，我的 props 类型基本上就是 element-plus 的 form 属性，除了`schemas`，基本上都是直接传给 el-form 的，schemas 是为了去自动添加 Form 的内容组件的，后面再详细说。

- schemas 表单配置属性
- model 表单数据，需要传入 ref 或 reactive 的响应式变量
- rules 表单验证规则

```ts
export interface FormProps {
  schemas?: FormSchema[];
  // 表单数据对象
  model?: Recordable;
  // 表单验证规则
  rules: any;
  // 	行内表单模式
  inline: boolean;
  // 表单域标签的位置， 如果值为 left 或者 right 时，则需要设置 label-width
  labelPosition: string;
  // 表单域标签的宽度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 支持 auto。
  labelWidth: string | number;
  // 表单域标签的后缀
  labelSuffix: string;
  // 是否显示必填字段的标签旁边的红色星号
  hideRequiredAsterisk: boolean;
  // 是否显示校验错误信息
  showMessage: boolean;
  // 是否以行内形式展示校验信息
  inlineMessage: boolean;
  // 是否在输入框中显示校验结果反馈图标
  statusIcon: boolean;
  // 是否在 rules 属性改变后立即触发一次验证
  validateOnRuleChange: boolean;
  // 用于控制该表单内组件的尺寸	strin
  size: string;
  // 是否禁用该表单内的所有组件。 若设置为 true，则表单内组件上的 disabled 属性不再生效
  disabled: boolean;
}
```

`useForm`函数主要的功能就是返回一个`register`和一些 Form 操作方法，这些方法与 element-plus 官方方法名一致，实际上也是直接去调用 el-form 的原生方法，Vben 也是直接去调用 antd 的方法。当然，它有一些自定义操作表单的方法。

- setProps 动态设置表单属性
- validate 对整个表单作验证
- resetFields 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
- clearValidate 清理指定字段的表单验证信息
- validateField 对部分表单字段进行校验的方法
- scrollToField 滚动到指定表单字段

Vben 里面这里返回的方法会更多，我这里没有全部做完，因为我的数据处理和 Vben 不太一样，有几个方法也不需要。比如`getFieldsValue`获取表单某个属性值和`setFieldsValue`设置表单属性值，因为我是直接去使用外面声明的响应式对象，所以外面直接使用/设置 formData 就可以了，这也和 element-plus 和 antd 不同有关系，后面再细说。

`useForm`其实没有什么特别的，返回的 register 函数需要在使用时传给`VeForm`，内部会把 VeForm 的组件实例传给 register，然后在 useForm 内就可以使用组件实例去调用 VeForm 内部的方法。

其实准确说来，我觉得 useForm 拿到的 instance 也不算是 VeForm 的组件实例，只是 VeForm 给 useForm 提供的一个包含内部方法属性的对象，因此我把这个变量改成了`formAction`，而不是 Vben 里面的`formRef`，不过这个倒是无所谓了，无伤大雅。

```ts
import { ref, onUnmounted, unref, watch, nextTick } from "vue";
import { FormActionType, FormProps } from "../types";
import { throwError } from "/@/utils/common/log";
import { isProdMode } from "/@/utils/env/env";

export default function useForm(props?: Partial<FormProps>) {
  const formAction = ref<Nullable<FormActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  function register(instance: FormActionType) {
    if (isProdMode()) {
      // 开发环境下，组件卸载后释放内存
      onUnmounted(() => {
        formAction.value = null;
        loadedRef.value = null;
      });
    }

    // form 组件实例 instance 已存在
    // 实际上 register 拿到的并不是 组件实例， 只是挂载了一些组件内部方法的 对象 formAction
    if (unref(loadedRef) && isProdMode() && instance === unref(formAction)) {
      return;
    }

    formAction.value = instance;
    loadedRef.value = true;

    // 监听 props， 若props改变了
    // 则使用 form 实例调用内部的 setProps 方法将新的props设置到form组件内部
    watch(
      () => props,
      () => {
        if (props) {
          instance.setProps(props);
        }
      },
      { immediate: true, deep: true }
    );
  }

  async function getForm() {
    const form = unref(formAction);
    if (!form) {
      throwError(
        "The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!"
      );
    }
    await nextTick();
    return form as FormActionType;
  }

  const methods: FormActionType = {
    async setProps(formProps: Partial<FormProps>) {
      const form = await getForm();
      form.setProps(formProps);
    },
    async validate(callback: (valid: any) => void) {
      const form = await getForm();
      form.validate(callback);
    },
    async validateField(
      props: string | string[],
      callback: (err: string) => void
    ) {
      const form = await getForm();
      form.validateField(props, callback);
    },
    async resetFields() {
      const form = await getForm();
      form.resetFields();
    },
    async clearValidate() {
      const form = await getForm();
      form.clearValidate();
    },
    async scrollToField(prop: string) {
      const form = await getForm();
      form.scrollToField(prop);
    },
  };

  return { register, methods };
}
```

### useFormEvents

这个 hook 函数提供`resetFields`、`clearValidate`、`validate`、`validateField`、`scrollToField`表单操作方法。

```ts
export interface FormActionType {
  // 设置表单属性
  setProps: (props: Partial<FormProps>) => void;
  // 对整个表单作验证
  validate: (callback: (valid: any) => void) => void;
  // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
  resetFields: () => void;
  // 清理指定字段的表单验证信息
  clearValidate: (props?: string | string[]) => void;
  // 对部分表单字段进行校验的方法
  validateField: (
    props: string | string[],
    callback: (err: string) => void
  ) => void;
  // 滚动到指定表单字段
  scrollToField: (prop: string) => void;
}
```

实际上只是在 VeForm 里调用的时候将`el-form`的实例`formElRef`直接传进来，然后直接去调用 el-from 提供的对应 api。 Vben 因为方法比较多所以抽出来了，其实直接写在 VeForm 里面也没关系。

我这里不同的`resetFields`方法和 Vben 不同，Vben 是手动去对储存了表单数据的变量`formModel`进行修改的，这里因为`el-form`的 resetFields 可以直接重置到初始值，我就把这段删掉了。

清除检验信息和对数据进行检验这两个方法就直接调 el-form 的 api，检验数据这里有一个大坑，当然如果注意到的人就没事，我当时没注意 prop 这个属性，导致一直无法触法检验，给我找了好久，最后调试的时候才发现 prop 是 undefined，气死我了。

```ts
import { nextTick, Ref, unref } from "vue";
import type { FormActionType, FormProps } from "../types";

export interface UseFormActionContext {
  propsRef: Ref<Partial<FormProps>>;
  formElRef: Ref<FormActionType>;
}

export function useFormEvents({ formElRef }: UseFormActionContext) {
  async function resetFields() {
    await unref(formElRef).resetFields();
    nextTick(() => clearValidate());
  }

  async function clearValidate(name?: string | string[]) {
    await unref(formElRef).clearValidate(name);
  }

  async function validate(callback: (valid: any) => void) {
    return await unref(formElRef).validate(callback);
  }

  async function validateField(
    prop: string | string[],
    callback: (err: string) => void
  ) {
    return await unref(formElRef).validateField(prop, callback);
  }

  async function scrollToField(prop: string) {
    return await unref(formElRef).scrollToField(prop);
  }

  return { resetFields, clearValidate, validate, validateField, scrollToField };
}
```

### VeForm

接下来就是最重要的组件 VeForm 了，获取 el-form 组件实例，再将这些表单操作方法对象在`onMounted`组件挂载之后通过外面使用 VeForm 订阅的`register事件`传递到 useForm 中，useForm 再将 formAction 对象的方法提供给外部组件。

- getBindValue 收集外部传入的所有参数，包括接收的，没接收的，useForm 里传的，VeForm 组件上直接传的，收集起来通通传给 el-form
- getSchema 表单配置对象
- formRef el-form 组件实例，传给 useFormEvents 去调用 el-form 的提供方法，Vben 里还传给了 useFormValues 去做表单数据的处理和其他 hook 函数，我这里没有做
- setFormModel 给 VeFormItem 提供的设置表单数据方法
- setProps 给外部提供动态设置表单属性的方法
- formAction 给外部提供的表单操作对象

```ts
<script lang="ts" setup>
import { computed, onMounted, ref, unref, useAttrs } from "vue";
import type { Ref } from "vue";
import type { FormActionType, FormProps } from "./types";
import VeFormItem from "./components/VeFormItem.vue";
import { useFormEvents } from "./hooks/useFormEvents";
import { useFormValues } from "./hooks/useFormValues";

const attrs = useAttrs();
const emit = defineEmits(["register"]);
const props = defineProps();
const propsRef = ref<Partial<FormProps>>({});
const formRef = ref<Nullable<FormActionType>>(null);
const defaultValueRef: Recordable = {};
// 合并接收的所有参数
const getBindValue = computed<Recordable>(() => ({
  ...attrs,
  ...props,
  ...propsRef.value,
}));

const getSchema = computed(() => {
  const { schemas } = unref(propsRef);
  return schemas || [];
});

const { validate, resetFields, clearValidate } = useFormEvents({
  propsRef,
  formElRef: formRef as Ref<FormActionType>,
  defaultValueRef,
});

const { initDefault } = useFormValues({
  defaultValueRef,
  getSchema,
  propsRef,
});

function setFormModel(key: string, value: any) {
  if (propsRef.value.model) {
    propsRef.value.model[key] = value;
  }
}

function setProps(formProps: Partial<FormProps>) {
  propsRef.value = { ...propsRef.value, ...formProps };
}

const formAction: Partial<FormActionType> = {
  setProps,
  validate,
  resetFields,
  clearValidate,
};

// 暴露给外面的组件实例使用
defineExpose(formAction);

onMounted(() => {
  emit("register", formAction);
  initDefault();
});
</script>

<template>
  <el-form ref="formRef" v-bind="getBindValue">
    <slot name="formHeader"></slot>
    <template v-for="schema in getSchema" :key="schema.field">
      <VeFormItem
        :schema="schema"
        :formProps="propsRef"
        :setFormModel="setFormModel"
      >
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </VeFormItem>
    </template>
    <slot name="formFooter"></slot>
  </el-form>
</template>

```

### VeFormItem

VeForm 中通过表单配置对象 getSchema 循环使用 VeFormItem，将`propsRef`，`setFormModel`以及对应的 schema 传入 VeFormItem 中。Vben 的 FormItem 是用 jsx 形式写的，我这里简化比较多，感觉没有必要用，就直接模版写了。

- schema

除了没有特别大必要用 jsx 之外，还有一个原因就是我 jsx 不怎么用，再写 label 插槽的时候用 jsx 我不知道怎么写，就用模版了。如果 schema 的 label 属性 VNode，就插刀 ElFormItem 的 label 插槽中；不是的话就传给 ElFormItem。

- renderComponent

`renderComponent`函数返回 schema 配置的组件，`componentMap`是一个预先写好的 Map，设置了表单常用组件，当用户配置了 render 时，就直接使用 render，render 必须是一个 VNode，没有则通过 component 属性去 componentMap 上取。

- getModelValue

`getModelValue`是动态设置的双向绑定数据，它是一个可设置的计算属性，读取时返回由 VeForm 传入的 formProps 上的 model 上对应的属性，设置的时候去调用 VeForm 传入的 setFormModel 方法，相当于直接去操作到了用户在使用 useForm 时传入的 model 对象，因此 model 对象必须是`reactive/ref`声明的可修改的双向绑定数据。

- formModel（formData）

数据这里的做法和 Vben 不是太一样，Vben 是在内部声明的 formModel 对象，通过 schema 去配置 defaultValue，给外部提供`setFieldsValue`和 getFieldsValue 的方法。也是因为 element-plus 的 form 是直接使用 v-model 去绑定 input 等其他实际的内容组件的，并且我也希望在外面自己声明 formData，然后 formData 也能实时更新，直接去使用 formData 给接口使用、传给子组件或是其他操作。因此所有表单数据对象从里到内一直用的是一个对象，就是外面声明并传入 useForm 的 model 属性的变量 formData。

- compAttr 将 schema 配置对象的 componentProps 属性传给实际的内容组件。

```ts
export interface FormSchema {
  // 字段属性名
  field: string;
  // 标签上显示的自定义内容
  label: string | VNode;
  component: ComponentType;
  // 子组件 属性
  componentProps?: object;
  // 子组件
  render?: VNode;
}
```

```ts
<script lang="ts" setup>
import { computed, ref, useAttrs } from "vue";
import { componentMap } from "../componentMap";
import { FormSchema } from "../types";
import { ElFormItem } from "element-plus";
import { isString } from "/@/utils/help/is";

const attrs = useAttrs();
const props = defineProps<{
  schema: FormSchema;
  formProps: Recordable;
  setFormModel: (k: string, v: any) => {};
}>();
const { component, field, label } = props.schema;

const labelIsVNode = computed(() => !isString(label));

const compAttr = computed(() => ({
  ...props.schema.componentProps,
}));

// 内容组件的双向绑定数据
const getModelValue = computed({
  get() {
    return props.formProps.model[field];
  },
  set(value) {
    props.setFormModel(field, value);
  },
});

const getBindValue = computed(() => {
  const value: Recordable = {
    ...attrs,
    prop: field,
  };
  if (isString(label)) {
    value.label = label;
  }
  return value;
});

function renderComponent() {
  if (props.schema.render) {
    return props.schema.render;
  }
  return componentMap.get(component);
}
</script>

<template>
  <ElFormItem v-bind="getBindValue">
    <template v-if="labelIsVNode" #label>
      <component :is="label" />
    </template>
    <component
      v-model="getModelValue"
      v-bind="compAttr"
      :is="renderComponent()"
    />
  </ElFormItem>
</template>
```

### 使用

声明表单配置对象 schemas，表单初始数据`formData`，表单验证规则`rules`，传入 useForm；将`register`给 VeForm 绑定上即可。

```ts
import type { FormSchema } from "/@/components/VeForm/types";
import { reactive } from "vue";

const schemas: FormSchema[] = [
  {
    field: "name",
    label: "姓名",
    component: "Input",
  },
  {
    field: "age",
    label: "年纪",
    component: "InputNumber",
  },
];
const rules = reactive({
  name: [
    {
      required: true,
      message: "Please input name",
      trigger: "blur",
    },
    {
      min: 3,
      max: 5,
      message: "Length should be 3 to 5",
      trigger: "blur",
    },
  ],
  age: [
    {
      required: true,
      message: "Please input age",
      trigger: "blur",
    },
  ],
});
```

如果把 schemas 和 rules 这种一单声明之后不会太做修改的数据抽出去，那组件就变得更简洁了，对于我这种喜欢极简的人来说，这组件看着太舒服了。

```ts
import VeForm, { useForm } from "/@/components/VeForm";
import { ref } from "vue";

const formData = reactive({
  name: "shellingfordly",
  age: 24,
});
const { register, methods } = useForm({
  model: formData,
  rules,
  schemas,
});
const submitForm = () => {
  methods.validate((valid: any) => {
    if (valid) {
      console.log("submit!", valid);
    } else {
      console.log("error submit!", valid);
      return false;
    }
  });
};
const resetForm = () => {
  methods.resetFields()
};
const clearValidate = () => {
  methods.clearValidate()
};

<template>
  <VeForm @register="register" />
  <ElButton @click="submitForm">submitForm</ElButton>
</template>
```

Vben 中可以动态设置 schema，我这里没有做。当然还有一些它自定义的方法我也没有写，我前两天移植的时候在表单校验那里卡住了，就因为当时没注意到`prop`这个属性，一直没有发现，找个半天的 bug，最后调试的时候才发现 prop 是 undefined，对比了一下直接使用 ElForm，里面是有值的，这才看到文档里面写着`在使用 validate、resetFields 方法的情况下，该属性是必填的`，这个故事告诉我们要好好看文档啊，文档里写得清清楚楚。这个 bug 给我整吐了，导致后面我不想写了哈哈哈哈，就没有加动态添加 schema，以及提交表单数据的 button。不过没关系，总体来说功能是实现了。有兴趣的小伙伴可以去帮我添加哈哈哈哈，当然也可以移植其他组件。项目地址[vele-admin](https://github.com/shellingfordly/vele-admin)。

![vben_1](/images/blog/vben_1.png)
![vben_2](/images/blog/vben_2.png)
