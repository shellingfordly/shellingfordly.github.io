---
title: 封装React Hook函数useState实现更优雅的setValue
date: 2022-03-03 14:07:00
tags:
  - react
  - hooks
---


# 封装React Hook函数useState实现更优雅的setValue

react hooks 确实很好用，代码相比 class 组件也会简洁一些，但有时候也会觉得对 useState 的数据更新时有不太方便的地方，比如声明数组或者对象的时候，在设置的时候就得传一个函数回去，并且使用扩展运算符合并对象

```js
setValue((oldValue) => ({
  ...oldValue,
  ...newValue,
}));
```

感觉在组件里这样看着不是太美观，并且如果组件代码多一点的时候，更新一下数据需要占用三行，尤其在 if/for 或者回调里面使用的时候看着更是难受，于是决定对 useState 做一下简单的封装，让组件里更新数据时更优雅一些。

首先写几个工具函数 isArray、isObject、isNotObject

```js
function isArray(value) {
  return value instanceof Array;
}

function isObject(value) {
  return value instanceof Object && !(value instanceof Array);
}

function isNotObject(value) {
  return typeof value !== "object";
}
```

然后在我们的自定义 hook 函数 useSetState 中，用原声的 useState 声明变量，变量可以直接返回，只需对\_setValue 做一些操作返回一个新的 setValue。

在 setValue 中，如果 initValue 为数组，那新的 setValue 在传入单个值时进行 push，传入数组时进行合并；如果 initValue 为对象，传入对象合并，传入其他类型则抛出错误。

```js
import { useState } from "react";

export default function useSetState(initValue) {
  const [_value, _setValue] = useState(initValue);

  function setValue(newValue) {
    // 初始数据为 数组
    if (isArray(initValue)) {
      if (isArray(newValue)) {
        _setValue((oldValue) => [...oldValue, ...newValue]);
      } else {
        _setValue((oldValue) => [...oldValue, newValue]);
      }
    }
    // 初始数据为 对象
    else if (isObject(initValue)) {
      if (isObject(newValue)) {
        _setValue((oldValue) => ({
          ...oldValue,
          ...newValue,
        }));
      } else {
        throw new Error(`${JSON.stringify(newValue)} 与初始数据类型不符！`);
      }
    } else if (isNotObject(initValue)) {
      _setValue(newValue);
    }
  }
  return [_value, setValue];
}
```

实际使用效果

```js
const [obj, setObj] = useSetState({
  a: 1,
  b: 2,
});

const [arr, setArr] = useSetState([{ id: 1 }, { id: 2 }]);

setObj({ c: 3 }); // {a: 1, b: 2, c: 3}
setArr({ id: 3 }); // [{ id: 1 }, { id: 2 },{ id: 3 }]
```
