---
title: Nuxt3创建项目相关配置以及遇到的一些问题
date: 2023-02-21
tags:
  - nuxt
---

# Nuxt3 创建项目相关配置以及遇到的一些问题

这个[项目](https://github.com/shellingfordly/arco-nuxt3-admin)是使用 nuxt3 和 Arco Design 创建的简单项目模版，下面是一些创建项目的相关配置，以及遇到的一些问题

## 初始化

### 创建

这里我使用 pnpm 创建，详情查看[Nuxt3 Installation](https://nuxt.com/docs/getting-started/installation)

```
pnpm dlx nuxi init arco-nuxt3-admin

cd arco-nuxt3-admin

pnpm install
```

### 运行

启动 http://localhost:3001/

```
pnpm run dev
```

默认 3000 端口，可以在 **nuxt.config.ts** 中更改

```ts
export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
});
```

### 打包

打包后的项目在 **.output** 目录下

```
pnpm run build
```

## 安装库

### arco-design

1. 安装

```
pnpm install @arco-design/web-vue
```

2. 配置

创建 **plugins/arco-design.ts** 文件；

```ts
import ArcoVue from "@arco-design/web-vue";
// 此处引入css则不需要在nuxt.config.ts配置
import "@arco-design/web-vue/dist/arco.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ArcoVue);
});
```

在 **nuxt.config.ts** 配置 plugins；

css 在一个地方引入即可

```ts
//nuxt.config.ts
export default defineNuxtConfig({
  // 引入arco-design样式
  css: ["@arco-design/web-vue/dist/arco.css"],
  // 插件方式引入arco-design组件
  plugins: ["@/plugins/arco-design"],
});
```

### 引入 js 库

1. 判断客户端加载

在引入某些第三方 js 库时，会报错"window is undefined"，可以判断是否在客户端，使用到时再加载；

```ts
let library;
if (process.client) {
  const pack = await import("library");
  library = pack.default || pack;
}
```

2. 不启用 ssr

```ts
export default defineNuxtConfig({
  ssr: false,
});
```

### windicss

1. 安装 **nuxt**, **nuxt-windicss**

```
pnpm install nuxt nuxt-windicss -D
```

2. 配置 **nuxt.config.ts**

没有 windicss 参数不生效，官方配置说明没有写，但我不写不生效，在官方 [Nuxt v3 + WindiCSS Demo](https://stackblitz.com/edit/nuxt-3-windicss?file=app.vue) 里看到配置了

在 css 中引入 **windi.css** 无法生效，不知道为什么，可能还需要配置其他，直接配置 windicss 就可以生效，不需要在引入 windi.css

```ts
export default defineNuxtConfig({
  windicss: {
    config: {
      attributify: true,
    },
  },
  // 只引入windi.css不能生效
  // css: ["virtual:windi.css"],
  modules: ["nuxt-windicss"],
});
```

3. 配置 **windi.config.ts**

```ts
import { defineConfig } from "windicss/helpers";

export default defineConfig({
  preflight: false,
  extract: {
    include: ["src/**/*.{vue,html,jsx,tsx}"],
    exclude: ["node_modules", ".git"],
  },
  darkMode: "class",
  attributify: true,
  theme: {
    extend: {
      backgroundColor: {
        // 暗黑背景色
        "v-dark": "var(--dark-bg-color)",
      },
    },
  },
});
```

### 引入 pinia

更多配置查看[pinia nuxt3 installation](https://pinia.vuejs.org/ssr/nuxt.html#installation)

1. 安装 pinia

```
pnpm install pinia @pinia/nuxt
```

2. 配置 **nuxt.config.ts**

```ts
export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
});
```

3. 创建

新版的 pinia 支持函数的写法，可以直接在函数内部声明 ref 对象

```ts
import { defineStore } from "pinia";
import { IS_DARK } from "~~/constants";

export const useAppStore = defineStore("app", () => {
  const isDark = ref(false);

  function setIsDark(bool: boolean) {
    var str = bool ? "dark" : "";
    isDark.value = bool;
    document.body.setAttribute("arco-theme", str);
  }

  return {
    isDark,
    setIsDark,
  };
});
```

4. 使用

```ts
import { useAppStore } from "~/store/user";

const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

function onChange(bool: boolean) {
  appStore.setIsDark(bool);
}
```

## 项目

### layouts

**layouts** 中提供页面的布局模版，默认使用 **default.vue**

切换其他模版在具体页面中使用 **definePageMeta** 进行配置, 比如登录页

```vue
<script setup>
definePageMeta({
  title: "登录",
  layout: "login",
});
</script>
```

### components

**components** 提供通用组件，在页面中使用时不需要自行引入

### composables

**composables** 提供通用 hook，在页面时使用时也不需要自行引入

### server

更多 server 相关查看官方文档[Nuxt3 Guide (Server)](https://nuxt.com/docs/guide/directory-structure/server)

在 server/api 下的文件会自动生成文件名对应的 api，比如 **server/api/Login.ts**

- 具体代码查看[Login.ts](https://github.com/shellingfordly/arco-nuxt3-admin/blob/main/server/api/Login.ts)

```ts
export default defineEventHandler(async (event) => {
  // 获取用户参数
  const query = getQuery(event);
  return {
    code: ErrorCode.OK,
    data: {
      user,
      token,
    },
  };
});
```

在前端只需要调用 **/api/Login** 接口即可得到返回数据

```ts
const res = await $fetch("/api/Login", {
  params: {
    username: "admin",
    password: "123456",
  },
});
```

这样获取到的数据是写死的，怎样使 api 返回的数据是动态的呢？

nuxt3 提供了一个内置的存储层，可以抽象文件系统或数据库或任何其他数据源；

这里使用本地 json 保存的方式。

- 配置 storage

```ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      db: {
        driver: "fs",
        base: "./db",
      },
    },
    devStorage: {
      db: {
        driver: "fs",
        base: "./db",
      },
    },
  },
});
```

- 在 api 中使用

创建一个 **GetUser.ts** 文件，使用 **useStorage** 读取 **user.json** 内的数据将其返回，前端在访问 **api/GetUser** 时就能得到数据

- 具体代码查看[GetUser.ts](https://github.com/shellingfordly/arco-nuxt3-admin/blob/main/server/api/GetUser.ts)

```ts
export default defineEventHandler(async () => {
  let data = await useStorage().getItem("db:user.json");

  return {
    code: ErrorCode.OK,
    data: data,
  };
});
```

- 具体代码查看[CreateUser.ts](https://github.com/shellingfordly/arco-nuxt3-admin/blob/main/server/api/CreateUser.ts)

```ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  let data = await useStorage().getItem("db:user.json");

  data.push(query);

  await useStorage().setItem("db:user.json", data);

  return {
    code: ErrorCode.OK,
    data: data,
  };
});
```
