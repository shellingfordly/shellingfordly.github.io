---
title: 解决axios获取的返回数据中数字的精度问题
date: 2021-05-11
tags:
  - js
  - json
---

由于前端能够显示的数字最大只有 53 位，有时候会遇到后端返回的数据中数字过大，超过了前端精度，但可能后端出于某些原因无法更改，要前端处理时。

其实本身接口返回的 Response 是个 json 字符串，由于 axios 默认使用 JSON.parse 导致精度丢失，我们可以使用第三方库修改 axios 默认的格式化方法，这里我使用的 json-bigint。

```js
import JSONBIG from "json-bigint";

axios.defaults.transformResponse = [
  function (data) {
    const json = JSONBIG({
      storeAsString: true,
    });
    const res = json.parse(data);
    return res;
  },
];
```

否则就会报错，设置格式化方法之后，返回值过大的数字就会被转为字符串。我使用的时候会有 bug，必须设置 storeAsString 属性为 true。

```
TypeError: BigNumber is not a constructor
```

除此之外，还有一个可能出现的隐藏 bug，因为我的项目中对返回值做了统一的处理，因此发现了 json-bigint 处理后的对象是没有原型链的，返回的对象上没有**proto**属性。导致使用 instanceof 是无法判断的，使用 typeof 是可以的，但 typeof 无法分辨 array 和 object，建议使用 toString.call 方法。

- 正常对象，有\_\_proto\_\_

![json_bigint_1](/images/blog/json_bigint_1.png)

- json-bigint 处理的对象，没有\_\_proto\_\_

![json_bigint_2](/images/blog/json_bigint_2.png)
