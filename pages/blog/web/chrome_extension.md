---
title: github项目链接package包地址的chrome插件
date: 2022-07-29 10:54:00
tags:
  - chrome
---

# github 项目链接 package 包地址的 chrome 插件

## 地址

[插件 github 地址](https://github.com/shellingfordly/pkg-url)

## 描述

有时候逛 github 看别人项目的时候，想看看他们的 package 里面引用了什么包，不知道这些包是干什么的。复制再去搜索感觉有点麻烦，就想实现一个 chrome 插件点击包名的时候能跳转到对应的 github 地址、npm 地址或者 google 搜索。也许已经有插件实现了，懒得去找了，简单的实现一下并不难，也方便以后自己加功能。

## 实现

- 配置 manifest.json

content_scripts 的 matches 属性设置在遇到什么 url 的时候去执行 js 脚本，content-script.js 既是需要执行的脚本。

popup.html 是插件点击后的弹窗，配置一下插件名和描述，添加插件 icon。ok，其他的暂时不需要。

```json
{
  "name": "PKG-URL",
  "description": "Get url of the github project's package.",
  "version": "1.0",
  "manifest_version": 3,
  "content_scripts": [
    {
      "matches": ["https://github.com/*/*"],
      "js": ["content-script.js"]
    }
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "icons": {
    "16": "/imgs/logo.png",
    "32": "/imgs/logo.png",
    "48": "/imgs/logo.png",
    "128": "/imgs/logo.png"
  }
}
```

### 实现逻辑

按道理这些 class 应该不会变的，获取 package.json 里面的所有包名的 dom，给他们添加点击事件，点击时候弹窗显示 npm/github/google 选项，到对应的地址。

```js
const highlight = document.querySelector(".highlight");
const allBlobCode = highlight.querySelectorAll("tr td.blob-code");
const allPkg = handle([...allBlobCode]);
const ToolDom = createToolDom();
let searchKey = "";

allPkg.forEach((item) => {
  item.style.cursor = "pointer";
  item.title = "点击可跳转";
  item.addEventListener("click", () => {
    searchKey = item.innerText.replace(/\"/g, "");
    item.parentElement.appendChild(ToolDom);
  });
});
```

处理一下 dom，因为它 package.json 里面的每一行都是 tr td 包裹的。这里筛选一下，只对 `dependencies` 和 `devDependencies` 下面的 dom 添加点击事件，其它的暂时不管。

```js
function handle(allBlobCode) {
  function filterPkg(allPkg, key) {
    const index = allPkg.findIndex((item) => {
      const ent = item.querySelector("span.pl-ent");
      return ent && ent.innerText === key;
    });
    const pkgs = index !== -1 ? allPkg.slice(index + 1) : [];
    const end = pkgs.findIndex((v) => v.innerText.includes("}"));
    return end !== 1 ? pkgs.slice(0, end) : pkgs;
  }
  const depPkg = filterPkg(allBlobCode, '"dependencies"');
  const devPkg = filterPkg(allBlobCode, '"devDependencies"');
  return [...depPkg, ...devPkg].map(
    (el) => el.querySelector("span.pl-ent") || el
  );
}
```

createToolDom 函数就是去创建我们的弹窗 dom，不知道能不能写 html 和 css 的形式来引入，这里懒得去看文档了，以后再研究。先直接 js 创建了，反正代码也不多；都是一些设置 dom 样式的呆呆代码，就不贴了，具体可以去[github 地址](https://github.com/shellingfordly/pkg-url)看源码。

先直接去搜索吧，跳转的官方稍微麻烦了点。本来想直接去搜索结果第一个，但是第一个也不一定是官方，先这样了。也方便一些了，省得还要复制再开网页搜索。

```js
btn.addEventListener("click", () => {
  if (!searchKey) return;
  const url = {
    npm: `https://www.npmjs.com/search?q=${searchKey}`,
    github: `https://github.com/search?q=${searchKey}`,
    google: `https://www.google.com/search?q=${searchKey}`,
  };
  window.open(url[value]);
});
Ï;
```

## 效果

OK，这样就完成了，稍微在 popup.html 里面写点介绍。

![chrome_extension_1](/images/blog/chrome_extension_1.png)

移动到包名上面会提示可以点击，指针也会变成小手指，点击就会弹窗选择到对应的地址去。
![chrome_extension_2](/images/blog/chrome_extension_2.png)
![chrome_extension_3](/images/blog/chrome_extension_3.png)


## 总结

简单的做一些功能还是挺简单的（好像是句废话哈哈哈），发布插件好像要花钱，懒得搞了，本地用用算了。想用的小伙伴可以去[github 地址](https://github.com/shellingfordly/pkg-url)下载自行引入。
