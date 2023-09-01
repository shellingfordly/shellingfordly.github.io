---
title: nodejs实现rm、cp、mv命令
date: 2022-03-04 15:29
tags:
  - nodejs
---

# nodejs 学习之使用 nodejs 实现 rm/cp/mv 命令

本着学习 nodejs 的心态写点小东西，使用 nodejs 的 api 实现 rm、cp 和 mv 简单的删除/复制/移动文件/文件夹。

## rm 删除文件

其实也很简单，如果是文件就直接用 fs.unlinkSync 删除，如果是文件夹就递归一个个删除。

```js
const fs = require("fs");
const { join } = require("path");

module.exports = async function deleteFiles(path) {
  // 判断一下路径是否真实存在
  if (!fs.existsSync(path)) {
    console.warn(new Error("路径不存在。"));
    return;
  }

  const file = fs.lstatSync(path);

  // 是文件，直接删除
  if (file.isFile()) {
    fs.unlinkSync(path);
    return;
  }

  // 是文件夹，遍历下面的所有文件
  if (file.isDirectory()) {
    const files = await fs.readdirSync(path);
    if (files && files.length) {
      for (const fileName of files) {
        // 因为我之前项目使用的时候不想删除隐藏文件，所以在此过滤了.开头的文件
        if (fileName.startsWith(".")) {
          continue;
        }
        const p = join(path, fileName);
        const f = fs.lstatSync(p);
        // 是文件，直接删除
        if (f.isFile()) {
          fs.unlinkSync(p);
        }
        // 是文件夹，递归调用 deleteFiles
        if (f.isDirectory()) {
          await deleteFiles(p);
          // 文件夹内部文件删除完成之后，删除文件夹
          fs.rmdirSync(p);
        }
      }
    }
    return;
  }
};
Ï;
```

## cp 复制文件

复制文件稍微比删除复制一点，需要判断 oldPath 是文件还是文件夹，newPath 是文件还是文件夹，再对不同的情况来生成可用的路径。

```js
const fs = require("fs");
const { join, dirname, basename } = require("path");

module.exports = async function copyFiles(oldPath, newPath) {
  // 判断路径是否存在，有一个不存在则抛出错误
  if (!fs.existsSync(oldPath) || !fs.existsSync(newPath)) {
    console.warn(new Error("路径不存在。"));
    return;
  }
  const oldFile = fs.lstatSync(oldPath);
  const newFile = fs.lstatSync(newPath);

  // 如果 oldPath 是文件，则直接复制 oldPath
  if (oldFile.isFile()) {
    // 需要考虑 newPath 是文件还是目录
    // 如果是文件路径，则可以直接使用进行复制
    // 如果是目录路径，则需要拼接上 oldPath 的文件名
    if (newFile.isDirectory()) {
      newPath = join(newPath, basename(oldPath));
    }
    fs.copyFileSync(oldPath, newPath);
    return;
  }

  // 如果 oldPath 是目录，则 newPath 应该也使目录
  // 若 newPath 目标路径是文件，则默认复制到文件的目录下
  if (newFile.isFile()) {
    console.warn(new Error("参数2应为路径。"));
    newPath = dirname(newPath);
  }

  if (oldFile.isDirectory()) {
    const files = await fs.readdirSync(oldPath);
    if (files && files.length) {
      // 遍历目录下的所有文件，并将 fileName 拼接上目录路径
      files.forEach(async (fileName) => {
        const oPath = join(oldPath, fileName);
        const oFile = fs.lstatSync(oPath);
        // 如果拼接后的路径为文件，则直接复制
        if (oFile.isFile()) {
          // 当然，新文件也需要拼接上 fileName
          const newFile = join(newPath, fileName);
          fs.copyFileSync(oPath, newFile);
        }
        // 如果是目录，则递归调用 moveFiles
        if (oFile.isDirectory()) {
          const oldDir = join(oldPath, fileName);
          const newDir = join(newPath, fileName);
          // 需要判断拼接后的 newDir 是否存在此目录，如果不存在则创建
          if (!fs.existsSync(newDir)) {
            await fs.mkdirSync(newDir);
          }
          moveFiles(oldDir, newDir);
        }
      });
    }
    return;
  }
};
```

## mv 移动文件

移动文件可以偷个懒，先调用 copyFiles 函数复制文件，再调用 deleteFiles 删除文件就是移动了哈哈哈哈。

```js
const copyFiles = require("./copy");
const deleteFiles = require("./delete");

module.exports = async function moveFiles(oldPath, newPath) {
  copyFiles(oldPath, newPath).then((res) => {
    deleteFiles(oldPath);
  });
};
```

## 使用 yarn 命令调用

当然，为了更逼真一些，可以再 package.json 里面配置一下 rm/mv/cp，这样就更像了。

```json
"scripts": {
  "rm": "node ./rm.js",
  "mv": "node ./mv.js",
  "cp": "node ./cp.js"
}
```

直接这样配置肯定是不行的，我们还需要读取一下命令时的输入，使用 node 自带的 process 读取命令传的参数

```js
// cp.js
const copyFiles = require("./copy");
copyFiles(process.argv[2], process.argv[3]);

// mv.js
const moveFiles = require("./move");
moveFiles(process.argv[2], process.argv[3]);

// rm.js
const deleteFiles = require("./delete");
deleteFiles(process.argv[2]);
```

最后就可以使用`yarn rm/cp/mv xxx xxx`的形式像模像样的使用啦。

```sh
# 删除文件
yarn rm ./a.js
# 删除目录
yarn rm ./a

# 移动单个文件
yarn mv ./a.js ./b.js
# 第二个参数为目录时自动取a.js文件名
yarn mv ./a.js ./b
# 移动目录所有文件
yarn mv ./a ./b

# 复制文件
yarn cp ./a/a.js ./b/b.js
# 第二个参数为目录时自动取a.js文件名
yarn cp ./a/a.js ./b
# 复制目录所有文件
yarn cp ./a ./b
```
