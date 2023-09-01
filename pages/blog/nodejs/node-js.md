---
title: node.js学习笔记
date: 2019-09-29 01:07:10
tags:
  - node.js
---

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。
Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。
</span>

<!-- more -->

## 了解node.js

> node.js使用了一个事件驱动、非阻塞式I/O的模型，使其轻量又高效。

- I/O密集
- CPU密集

> BS 浏览器和后端
> CS 客户端和后端

### 关于node

- node没有window、document
- global是顶层对象

### 安装nodejs

- 安装

```shell
# 复制回车就行
wget https://nodejs.org/dist/v10.8.0/node-v10.8.0-linux-x64.tar.xz
# 回车，等待安装成功
```

- 解压

```shell
tar xvf node-v10.7.0-linux-x64.tar.xz
```

- 移动

```shell
# mv命令移动并改名
mv node-v10.7.0-linux-x64 /usr/local/node
```

- 配置命令

```shell
vi ~/.bash_profile
# 在 ~/.bash_profile 回车打开的文件里按 i 编辑，然后在文件的export PATH前一行添加
PATH=$PATH:/usr/local/node/bin
# 然后退出保存文件 :wq
# 运行
source ~/.bash_profile

# node -v npm -v 查看node和npm命令是否配置成功
```

- 到此nodejs安装成功

### 引用require

- 缓存：在同一个模块中，第一次引入一个模块时，会有缓存；第二次引用时不会再去调用模块，而是直接使用第一次调用过的模块

### 输出exports

- 最终输出的是module.exports
- 而exports和module.exports是引用关系
- exports指向module.exports

> 导入模块输出的数据
> <1>. 添加属性时使用exports
> <2> 而直接赋值时使用module.exports

```js
exports.a = "ly";
exports = function () {};
//直接赋值则改变了exports指向，此时得不到exports的值
```

> 模块化编程：不污染全局变量

```js
//这是02.js
let n = "shellingfordly";
exports.n = n;
```

```js
//这是01.js文件
//require函数的返回值就是exports对象
let a = require("./02.js");
console.log(a);
//运行结果：{n:"shellingfordly"}
```

## 原生模块

### 模块引用

- 原生模块优先
- 不写路径时默认在node原生模块中找
- 默认找node_modules里的某个模块中的index.js运行

### path模块

（1）路径变量

- \_\_dirname 当前目录路径
- \_\_filename 当前文件路径

（2）路径拼接

- path.join()
  - 单纯的拼接
- path.resolve()
  - 从当前目录出发
  - 会解析"/"根目录

（3）path.relative

- 得到两个文件之间的相对路径

（4）path.parse

- 格式化路径

### url模块

- 解析url

> map数据类型：键 => 值
> 用get取值：map.get(键) = 值

### events模块

(1) EventEmitter类

```js
const EventEmitter = require("events").EventEmitter;
let x = new EventEmitter();
//绑定事件
x.on("fn", () => {});
//解绑事件
x.off("fn");
//触发事件
x.emit("fn");
```

(2) newListener事件

- 绑定后就会触发，不需要手动触发
- 新增监听器时触发

(3) removeListener

- 移除监听器时触发

### require()

导入模块

- 可以自己定义想要导出的变量
- 每个模块的变量不对外公开

#### 导入本地文件

- 必须加“./”
- .js可以省略

```js
const obj = require("./2.js");
// .js可以省略，一样
const obj = require("./2");
```

```js
// 运行index.js文件
node index
```

### nodejs执行顺序

> 执行过程：执行script(全部代码)，清空micro-task队列；执行setInterval，清空micro-task队列；执行setTimeout，清空micro-task队列；执行setImmediate，清空micro-task队列；

- 有优先级
  process.nextTick > Promise().then > setTimeout/setInterval > setImmediate
- macro-task
  - script(全部代码)
  - setInterval
  - setTimeout
  - setImmediate
- setTimeout和setInterval优先级一样，谁先注册先执行谁
- micro-task
  - process.nextTick
  - Promise().then

# npm

> node的包管理器

## 命令

- 初始化
  - npm init 初始化
  - npm init -y 默认初始化，全部默认设置，不需要设置，不需要写项目名字等等
- 删除包
- 注册
  - npm login 登录
  - npm adduser 注册
  - npm publish 上传至npm官网
  - npm unpublish --force 删除
- 安装
  - npm install 安装
  - npm install -g 全局安装
  - npm i koa --save 上线需要用的
  - npm i koa\@7.0.1 -S 指定具体的版本，默认最高版本
  - npm i koa-router --save-dev

## koa 搭建web服务的框架

```js
const Koa = require("koa");
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "这是后台数据";
});
app.listen(3000);
```

- dependencies 项目上线所使用的依赖(某些模块)
- devDependencies 开发环境所使用的

## events

> 事件模块

### EventEmitter

- emitter.on() 绑定事件
- emitter.off() 注销事件
- emitter.once() 绑定一次性事件
- emitter.getMaxListeners() 返回最大监听值
- emitter.listeners() 监听了多少个函数

```js
const EventEmitter = require("event").EventEmitter;
const myEmitter = new EventEmitter();
setTimeout(() => {
  // 异步结果
  // 异步函数
  // 触发someEvents事件
  myEmitter.emit("someEvents");
});
// 监听someEvents事件，返回一个回调函数，处理异步的结果，再异步结束后执行
myEmitter.on("someEvents", fn);
```

### path

- \_\_dirname 当前运行文件所在文件夹的路径
- \_\_filename 当前运行文件所在的路径，带文件名
- path.join() 连接路径，相对路径
- path.resolve() 返回绝对路径
- path.parse() 解析路径，格式化

## URL 解析URl

```js
const { URL } = require("url");
const myUrl = new URL("http://......");
```

## 取查询字符串的键值对

### querystring

```js
// querystring 查询字符串
const qs = require("querystring");
// 不会去掉"?"
// 用slice切割掉"?"
// queryObj 查询信息对象
const queryObj = qs.parse(myUrl.search.slice(1));
console.log(queryObj.wd);
```

### 断言

```js
const assert = require("assert");
assert("true", "如果第一个参数的布尔值不是true，则这个字符串就是报错信");
```

### 加密

```js
const crypto = require("crypto");
const KEY = "liuyao";
const obj = crypto.createHash("md5");
obj.update(KEY);
const password = obj.digest("hex");
console.log(password);
```

## 文件操作

> I/O操作

### fs.readFile 读取文件

- fs.readFile (异步)读取文件
- fs.readFileSync (同步)读取文件

```js
const fs = require("fs");
// 将输出格式改为utf8
fs.readFile("./1.txt", "utf8", (err, data) => {
  // err: json的错误对象
  // 不出错时err === null
  // data为2进制编码
});
```

### fs.writeFile 写文件

```js
const fs = require("fs");
const data = "liuyao";

fs.writeFile("./2.txt", data, (err) => {
  if (err) throw err;
  console.log("写入成功");
});
```

### fs.existsSync()

> 判断文件/或者路径是否存在，存在返回true，不存在返回false

### fs.mkdir()

> 创建文件夹

```js
fs.mkdir("./test", (err) => {});
```

### fs.readdir()

> 读文件夹

```js
fs.readdir("./node", (err, data) => {
  console.log(data);
});
```

### fs.statSync()

- stat.isDirectory 判断是否是文件夹
- stat.isFile 判断是否是文件

```js
const stat = fs.statSync("./node");
console.log(stat.isDirectory());
```

## 流模块

```js
// 读取流
const read = fs.createReadStream("1.txt");
/*
// 释放，无法操作文件数据
read.resume()
*/
// 设置编码格式
read.setEncoding("utf-8");

// 读取数据
read.on("data", (data) => {
  // 读取到的数据
  console.log(data);
});
// 读取结束后执行"死亡事件"
read.on("end", () => {
  console.log("读取结束");
});
```

## 文件的复制

- read.pipe() 连接读取流和写入流的管道

```js
const read = fs.createReadStream(1.txt)
const write = fs.createWriteStream(2.txt)
// 将1.txt的文件复制到了2.txt中
read.pipe(write)
```

# http

- req.url 路径：根目录 /
- req.method 请求方式GET
- req.headers 请求头
- text/plain 纯文本
- text/html 解析标签

## req 请求体对象

> 从浏览器器输入的网址，把请求发送到对应后台时，所有的请求信息都被node封装在req对象里面

- req.url 返回当前网页的路径（根目录 /）
- req.method 请求方式GET
- req.headers 请求头信息

## res 对应的相应

> 返回数据等

- res.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"})
  - 请求头，设置编码格式
  - 200 状态码
  - text/plain 数据的格式，纯文本
  - text/html 网页
  - utf-8 编码格式
- res.write() 想客户端返回数据
  - write可以无数次写入
- res.end() 响应结束，客户端才能拿到数据
  - **只能调用一次**
  - end传入的数据必须是字符串或者buffer二进制数据
  - end内的数据最后输出

```js
const http = require("http");
const server = http.createServer((req, res) => {
  // 请求头
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  // write写入数据
  res.write("后台返回的数据");
  // 拿到数据后结束
  res.end("。");
});
server.listen(3000);
```

## koa-views

- 把koa和视图框架链接起来

# koa-router

```js
var Koa = require("koa");
var Router = require("koa-router");

var app = new Koa();
var router = new Router();

router.get("/", (ctx, next) => {
  // ctx.router available
});

app.use(router.routes()).use(router.allowedMethods());
```

# mongodb

- mongod --dbpath ./db
  启动服务端

- mongod --dbpath ./db --port 3001
  指定监听端口

- mongod --dbpath ./db --logpath ./log
  指定目录存放日志文件

- mongo
  连接

- show dbs
  查看当前数据库的集合

- use 数据库名字
  创建数据库

## mongoose

node管理mongodb的库

### mongoose.createConnection

```js
// 连接数据库
mongoose.createConnection("mongodb://localhost:27017/xxx", {
  useNewUrlParser: true,
});
```
