---
title: CSS @layer 规则
date: 2024-4-24 14:17:06
tags:
  - css
---

# CSS @layer 规则

> 可以让 CSS 声明的优先级下降一整个级联级别

比如下面的例子，外面的 css 优先级高于 `@layer` 内部的 css，即使它写在下面。

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

<template #html>

  <div class="container bg-red w-50px h-50px"></div>
</template>
</playground>

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

## @layer 规则的语法

```css
@layer layer-name {rules};
@layer layer-name;
@layer layer-name, layer-name, layer-name;
@layer {rules};
```

## 级联分层

@layer 指定级联层的名称，适合多个级联分层的场景，方便维护与管理。

多个层的优先级是一样的，谁在后面谁的优先级高。

```css
@layer container1 {
  .container {
    background-color: blue;
  }
}

@layer container2 {
  .container {
    background-color: green;
  }
}
```

可以指定优先级，此时 `container1` 内的 css 优先级更高，背景设置为 `blue`

```css
@layer container2, container1;
```

也可以这样设置，将 `container2` 前置，此时 `container1` 的优先级比 `container2` 高

```css
@layer container2;

@layer container1 {
  .container {
    background-color: blue;
  }
}

@layer container2 {
  .container {
    background-color: green;
  }
}
```

## 外链 css

`@import` 引入 css

```css
// 匿名引入
@import "./style.css" layer;
@import "./style.css" layer(style);

@layer container1 {
}
```

`link` 元素引用 css

```html
<!-- style.css的样式属于名为 style 的级联层 -->
<link rel="stylesheet" href="style.css" layer="style" />

<!-- 样式引入到一个匿名级联层中 -->
<link rel="stylesheet" href="style.css" layer />
```

## @layer 嵌套

外层 `parent` 的优先级高于内层 `child` 的 css

```css
@layer parent {
  .container {
    background-color: blue;
  }

  @layer child {
    .container {
      background-color: red;
    }
  }
}
```

当出现多层嵌套时，内部的 @layer 的优先级由外部的 @layer 规则决定

此处为 `parent2 > child2 > parent1 > child1`

```css
@layer parent1 {
  .container {
    background-color: blue;
  }

  @layer child1 {
    .container {
      background-color: red;
    }
  }
}

@layer parent2 {
  .container {
    background-color: yellow;
  }

  @layer child2 {
    .container {
      background-color: skyblue;
    }
  }
}
```

## 浏览器兼容性

|     | 💻      | @layer | 📱                  | @layer  |
| --- | ------- | ------ | ------------------- | ------- |
|     | Chrome  | ☑️ 99  | Chrome Android      | ☑️ 99   |
|     | Edge    | ☑️ 99  | Firefox for Android | ☑️ 97   |
|     | Firefox | ☑️ 97  | Opera for Android   | ☑️ 68   |
|     | Opera   | ☑️ 85  | Safari on IOS       | ☑️ 15.4 |
|     | Safari  | ☑️ 15  | Samsung Internet    | ☑️ 18   |
|     |         |        | WebView Android     | ☑️ 99   |
