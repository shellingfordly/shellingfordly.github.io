---
title: 新时代的打包工具vite
date: 2023-03-07
tags:
  - vite
---

### vite 是怎么实现热更新的

在 Vite 中，热更新使用的是 WebSockets 技术。具体来说，在启动开发服务器时，Vite 会创建一个 WebSocket 服务器和一个 HTTP 服务器。浏览器和 Vite 之间通过 WebSocket 连接进行通信。 在调用 app.use(vite())时，Vite 会将相应的 WebSocket 客户端代码注入到 HTML 文件中，并启动自定义模块的热刷新逻辑。

当某个模块被修改时，Vite 会通知浏览器进行重新加载，但这并不会导致整个页面重新加载。相反，Vite 仅仅需要进行局部的更新，如替换已修改的模块的代码，从而实现快速的热更新。

### vite 为什么这么快

去除了繁琐的打包环节。在 Webpack 等其它工具中，每次文件变动时，都需要重新编译、解析和重新生成打包文件，在大型项目中会非常耗费时间。Vite 采用“按需编译”，仅当某个模块被访问时才会被编译，将打包粒度细化到了单个模块级别。
利用 ES6 的 import 语法。在现代浏览器中，ES6 import 已经成为默认使用方式，并且支持按需加载（也就是 lazy loading），这样可以加速应用程序的访问时间。
使用 Rollup 处理代码。Rollup 与 Webpack 一样也是一个 JavaScript 模块打包器，但是 Rollup 更专注于 JavaScript 库打包，对纯 Web 项目支持不如 Webpack 好，但对于组件库来说是比较合适的。Rollup 类似于 Vite，采用 ES6 模块作为输入格式，打包分析粒度相对精细。
内置了开发服务器，默认使用 HTTP/2 协议，多路复用而且能够压缩。另外还支持 server-push，即服务器主动推送资源，进一步提高载入性能。
总之，Vite 充分利用了现代浏览器的特性以及去除打包过程带来的损耗，简化了开发过程，同时能够让应用程序的启动更快，增强了开发者体验。

### vite 是怎么实现按需编译的

Vite 使用了基于浏览器特性的 ES modules 机制，在开发阶段采用 ESM 静态解析，并把引入的模块文件处理成一个个独立的 JS 文件，这样可以借助 HTTP/2 的多路复 lexing 特性，同时也能享受浏览器和 CDN 缓存带来的优势。
例如，当你修改 src/main.js 文件时，Vite 只会重启需要重启的相关资源，而并非像 Webpack 那样重新编译所有资源再重新加载整个页面，从而做到了更快的开发体验。

当我们使用 Vite 运行一个项目时，Vite 会为每个模块（module）创建一个服务器端点（server endpoint）。当浏览器请求这些模块时，Vite 只会编译所需的模块，并在客户端和服务器之间建立通道(dev server 和 the browser’s native ES modules handling mechanism)。在代码修改后，Vite 会实时编译改动的模块，并通过热更新（HMR）技术进行局部刷新。

在按需编译方面，Vite 利用了 ES6 的导入语法特性。由于 ES6 中的 import 是静态解析的，即编译时确定引入的具体模块，因此 Vite 可以在开发阶段更轻松地跟踪文件之间的依赖关系，在需要重新编译某个依赖项时，只需要把该依赖项对应的模块打包即可，从而不必重新构建整个应用程序。

此外，Vite 也支持在生产环境下使用预打包技术，而不像其他打包工具一样将所有模块都打包到一个文件中。这样可以进一步提高应用程序的性能和加载速度。

#### 简单的说说代码是怎么实现的

1. 启动服务

在浏览器中打开入口文件时，会触发 ./node_modules/@vite/cli/dist/cli.js 文件中的 spawnServer 函数。

```js
// cli.js
async function spawnServer(
  userConfigPath = path.resolve(process.cwd(), "vite.config.js")
) {
  const { createServer } = require("../server");
  const configEnv = await loadEnv(mode, process.cwd());
  const options = await resolveConfig(configEnv, userConfigPath);
  const server = await createServer(options);
  printServerInfo(server, options);
  await server.listen();
}
```

其中，createServer 函数会创建一个 ViteDevServer 实例，并将 configs、plugins、watcher 等信息作为参数传递给这个实例。ViteDevServer 的 watches 数组记录了每个页面所需要的资源。

但是，初始化时不会将所有页面都 add 进 watcher，而是调用 ViteDevServer.addPages() 来按需添加。该函数通过解析 HTML/CSS 代码来找出与当前页面相关的 JS 模块和 CSS 依赖。

```js
// server/index.js
async addPages(...pages) {
  for (const page of pages) {
    // parse html/css for link/script tags and module/script attrs
    const result = await this.resolvePage(page)
    if (!result) continue
    // ...
    this.watch(result.deps)
  }
}

```

2. 分析依赖

ViteDevServer 在处理来自浏览器的请求时，会先从缓存中查询资源。

如果没有缓存，就会去查看当前这个 URL 是不是某个 JS/CSS 文件（这里说的只是 Vue 类型的单文件组件），如果是，ViteDevServer 会通过 Rollup 或其他工具进行转换，然后返回给浏览器。在转换过程中，ViteDevServer 会对模版中用到的组件/模块路径进行替换，并根据路径进行索引，生成 modules 键值对。

```js
// server/middleware/index.js
async function serve({
  root = process.cwd(),
  appContext,
  server,
  https,
  watch,
  mockApiRoutes,
  allowCors,
}) {
  // ...
  async function handleRequest(req, res) {
    // ...
    const resolved = await server.resolve(rawUrl, undefined, undefined, req);
    // ...
    // serve vue component as module
    if (resolved.vue && resolved.contentType === "module") {
      send(req, res, resolved.content, 200, "js");
      return;
    }

    // transform request to modules
    if (resolved.isModuleRequest) {
      const cachedResult = compiler.moduleCache.get(resolved.id);
      if (
        !cachedResult ||
        (process.env.NODE_ENV !== "test" && !cachedResult.isFromCache)
      ) {
        const { content } = await compileModules(
          body || "",
          resolved.filePath,
          root,
          resolved.query
          // ...
        );
        // save the compiled module in cache
        // for subsequent requests to reuse
        compiler.moduleCache.set(resolved.id, {
          isFromCache: false,
          timestamp: Date.now(),
          source: content,
        });
        send(req, res, content, 200, "js");
      } else {
        send(req, res, cachedResult.source, 200, "js");
      }
      return;
    }
  }
}
```

3. 监视文件变化

监视文件变化的流程简单来说，就是监听项目目录下的所有文件，当有变动时触发回调函数，并找出被影响的文件，执行相应操作。

当 CSS/JS 文件变化时，即更新相关的 modules；
当 Vue 文件变化时，执行 spinner.run() 启动 Spinner，并收集相关组件的 template、script 和 style 代码；
并使用 .vue 文件中

### 如何指定 vite 插件 的执行顺序？

在 Vite 中，你可以使用 defineConfig 方法来指定插件的执行顺序。

假设我们有两个插件：plugin1 和 plugin2，现在我们想让 plugin1 比 plugin2 更早地执行。那么我们就需要这样编写 vite.config.js 文件：

```js
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "plugin1",
      // 插件 1 的配置项
    },
    {
      name: "plugin2",
      // 插件 2 的配置项
    },
  ],
  // 指定插件执行顺序
  enforce: "pre",
});
```

在上面的代码中，我们使用了 enforce 属性来指定了插件的执行顺序。enforce 属性支持以下值：

'pre'：表示当前插件会比其他插件更早地执行；
'post'：表示当前插件会比其他插件更晚地执行；
undefined 或不设置该属性：表示当前插件不关心执行顺序，默认情况下按照声明顺序执行。
如果你在定义插件时没有指定 name 属性，则可以利用 ES6 的解构语法进行快速命名：

```js
import { plugin1 } from "./plugins/plugin1";
import { plugin2 } from "./plugins/plugin2";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [plugin1, plugin2],
  // 指定插件执行顺序
  enforce: "pre",
});
```

### vite 插件 常见的 hook 有哪些？

Vite 是一个快速的 Web 构建工具，它支持 Vue、React 等前端框架。在 Vite 中，常见的插件 hook 主要包括以下几个：

- configureServer(server)：配置开发服务器。可以通过该 hook 自定义开发服务器的选项和行为。
- config(config, env)：配置 Vite 应用程序的选项。可以在此修改传递给 Vite 的选项（如构建目录、生成环境变量等）。
- resolveId(id, importer)：解析模块依赖关系中的模块 ID。可以将一些第三方模块映射到本地模块，从而提高打包性能。
  load(id)：加载模块。用于处理特定类型的文件，如 CSS、LESS、SASS 等。
- transform(code, id)：转换代码。可以使用 Babel， TypeScript，Rollup.js 和其他一些流行的工具来编译或转换代码。
- buildStart(options)：在构建开始时运行。可以执行某些任务，如清理输出目录、生成版本信息等。
- generateBundle(options, bundle, isWrite)：在生成 bundle 时运行。可以更新包含在 bundle 文件中的 version 信息、生成 sourcemap 文件等。
  这些都是常见的 Vite 插件 hook，通过它们可以在 Vite 构建过程中加入自己的相关逻辑功能。
