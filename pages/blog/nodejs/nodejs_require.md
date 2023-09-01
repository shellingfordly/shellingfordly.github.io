---
title: 手写nodejs原生require方法
date: 2022-02-17 16:47:00
tags:
  - nodejs
---

# 手写 nodejs 原生 require 方法

## 前言

这两天在学习 nodejs 相关的东西，在 b 站上看到一个 up 主分享的视频还挺不错的，于是跟着敲了一下。

## 实现

第一步：定义 myRequire 方法

```js
function myRequire(filename) {
  // 获取绝对路径
  const mPath = Module._resolveFilename(filename);

  // 缓存优先
  const cacheModule = Module._cache[mPath];
  if (cacheModule) return cacheModule.exports;

  // 创建空对象加载目标模块
  const module = new Module(mPath);

  // 缓存已加载模块
  Module._cache[mPath] = module;

  // 执行加载
  module.load();

  return module.exports;
}
```

第二步：定义 Module 类方法

```js
function Module(id) {
  // 模块id实际就是绝对路径
  this.id = id;
  this.exports = {};
}
```

第三步：实现 Module.\_resolveFilename 获取文件绝对路径的方法，只对当前的目录做了简单的查找、判断，实际会向上一层层查找模块，此处省略。当找不到时会尝试对文件名拼接文件后缀，此处只提供了 js 和 json 的方法，如果还是找不到便抛出错误。

```js
Module._resolveFilename = function (filename) {
  // 拼接当前目录和文件名
  const mPath = path.join(__dirname, filename);
  // 判断此文件是否存在，存在之后返回
  if (fs.existsSync(mPath)) {
    return mPath;
  }
  // 如果不存在，尝试拼接后缀
  const suffixs = Object.keys(Module._extensions);
  for (let i = 0; i < suffixs.length; i++) {
    const _mPath = mPath + suffixs[i];
    if (fs.existsSync(_mPath)) {
      return _mPath;
    }
  }
  // 找不到抛错
  console.log(new Error(`${filename} is no exits`));
};
```

第四步：当获取到文件的绝对路径后，先去缓存中查找模块，如果有直接返回。反之创建模块对象，并向缓存中添加此模块，最后执行模块加载，也是核心的编译执行模块。

模块加载根据不同的文件类型去执行对应的编译方法，此处只做了 js 和 json 的编译方法。

js 文件读取内容之后，将 js 字符串封装成一个方法，并向其提供对应的模块可使用默认变量，最后使用 vm.runInThisContext 方法去运行 js 代码。

json 文件就更简单了，直接读取文件使用 JSON.parse 格式化之后赋值给 module.exports 即可

```js
Module._wrapeer = [
  "(function(exports, module, require, __dirname, __filename){",
  "})",
];

Module._extensions = {
  ".js"(_module) {
    // 读取文件内容
    const content = fs.readFileSync(this.id, "utf-8");
    // 将内容字符串封装成一个函数，并传入exports、module、require、__dirname、__filename默认可以使用的变量
    const contentFn = Module._wrapeer[0] + content + Module._wrapeer[1];
    // 调用node.js自带的vm.runInThisContext方法运行字符串的js代码
    const fn = vm.runInThisContext(contentFn);
    // 创建模块需要的默认变量
    const exports = this.exports;
    const module = this;
    const dirname = path.dirname(this.id);
    const filename = this.id;
    // 执行模块
    fn.call(exports, exports, module, myRequire, dirname, filename);
  },
  ".json"(_module) {
    // JSON.parse格式化读取内容并设置给_module.exports即可
    const content = JSON.parse(fs.readFileSync(_module.id, "utf-8"));
    _module.exports = content;
  },
};

Module.prototype.load = function () {
  // 根据文件类型去执行对应的编译方法
  const extname = path.extname(this.id);
  Module._extensions[extname](this);
};
```

最后，返回 module.exports 即是导出的内容。up 主叫[five 爱前端](https://space.bilibili.com/1363644344)，感兴趣的自己去搜吧。
