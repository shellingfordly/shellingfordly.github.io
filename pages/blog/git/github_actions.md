---
title: 使用github actions自动同步服务器
date: 2023-9-28 17:50:26
tags:
  - github actions
  - 自动部署
---

# 使用 github actions 自动同步服务器

在 github 中设置 secrets，步骤 **Settings ==> Secrets and variables ==> Actions**

需要添加几个参数

- DEPLOY_KEY：SSH 私钥，id_rsa的内容
- SERVER_IP：服务器的host名
- USERNAME：服务器登录名
- SERVER_DESTINATION：部署到目标文件夹

```bash
name: note build
# 触发workflow的条件
on:
  push:
    # 只有master分支发生push事件时，才会触发workflow
    branches:
      - main
    paths-ignore: # 下列文件的变更不触发部署，可以自行添加
      - README.md
      - LICENSE
  pull_request:
    branches: [main]


# jobs表示执行的一项或多项任务
jobs:
  deploy: # 任务的job_id，具体名称自定义，这里build代表打包
    runs-on: ubuntu-latest # runs-on字段指定运行所需要的虚拟机环境。注意：这个是必填字段
    steps:
      # 切换分支
      # - name: Checkout
      #   uses: actions/checkout@main

      # git submodule
      - uses: actions/checkout@v2

      # node
      - name: use Node.js 16
        uses: actions/setup-node@v1
          node-version: 16

      # npm install
      - name: npm install and build
        run: |
          npm install
          npm run build
        env:
          CI: true

      - name: deploy to server
        uses: AEnterprise/rsync-deploy@v1.0.2
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}  # SSH 私钥
          ARGS: "-e -c -r --delete"
          SERVER_PORT: '22' # SSH端口
          FOLDER: "./dist" # 要推送的文件夹，路径相对于代码仓库的根目录
          SERVER_IP: ${{ secrets.SERVER_IP }}  # 服务器的host名
          USERNAME: ${{ secrets.USER_NAME }} # 服务器登录名
          SERVER_DESTINATION: ${{ secrets.SERVER_DESTINATION }} # 部署到目标文件夹
```
