---
title: 在nuxt3中连接mysql
date: 2023-03-22 10:00:00
tags:
  - nuxt
---

# 在 nuxt3 中连接 mysql

由于项目需要，根据前端的参数来连接不同的数据库获取数据，我本身是个前端，奈何没有人给我写接口，刚好最近也在看 nuxt3 的东西，就用 nuxt3 一把梭了。公司内部自用小项目，有问题慢慢改，顺便学习一下。

## 安装

- 安装 mysql2

```sh
pnpm i mysql2
```

## 代码

简单封装一下，根据 type 获取数据库连接字符串，创建连接池，用 map 缓存一下

```ts
import mysql from "mysql2/promise";

// 缓存连接池
const poolMap = new Map<string, mysql.Pool>();

export async function useMysql(type: string): Promise<mysql.Pool | undefined> {
  // 获取数据库连接字符串
  const uri = getServerMysqlUri(type);

  // 从缓存中获取连接池
  if (poolMap.has(type)) {
    const pool = poolMap.get(type);
    return pool;
  }

  try {
    const pool = await mysql.createPool(uri);

    // 缓存
    poolMap.set(type, pool);

    return pool;
  } catch (error) {
    console.error("[Error]: mysql connection error.");
    return;
  }
}
```

看了一下网上别人写的，发现他们有自己封装一下 query 原始查询的方法，我也仿写了一个

大致就是最了一些错误拦截，查询结束之后释放了连接

```ts
function query(pool: mysql.Pool, sql: string) {
  return new Promise(async (resolve, reject) => {
    try {
      // 获取连接
      const conn = await pool.getConnection();

      // 查询
      await conn
        .query(sql)
        .then((result) => {
          resolve(result);
          // 释放连接
          conn.release();
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
}
```

我也不知道 mysql2 具体怎么做的，需不需要释放连接，大概看了一下网上别人写的

监听了一下请求的事件，发现释放后的**conn.threadId**是同一个，不释放时**conn.threadId**不一样，大概是释放之后能够复用吧

```ts
db.on("acquire", function (connection) {
  console.log("Connection %d acquired", connection.threadId);
});

db.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});

// 在query方法里获取连接之后打印一下
const conn = await db.getConnection();
console.log("Connection %d connection", conn.threadId);
```

- 结果如图

![](/images/blog/nuxt3_join_mysql.png)
