---
title: git 指令
date: 2019-10-10 11:49:00
tags:
  - git
---

# git 指令

- 在项目中安装 git

```
git init
```

- 提交 index.html 文件

```
git add index.html
```

- 提交所有(".")文件夹内的所有文件

```
git add .
```

- 配置

```
git config --global user.email "you@example.com"
git config --global user.name "yourname"
```

- 提交放在分支中

```
git commit -m "新增了一个XXX文件"
```

- 推送到远程仓库之前，先关联本地和远程仓库，xxx 建议使用 ssh 路径，http 路径需要登录

```
git remote add origin xxx
```

- 推送到远程仓库---> yes，需要权限--->获取权限

```
git push origin master
```

- 一路回车获取密钥

```
ssh-keygen -t rsa -C "you@example.com"
```

- 打开 id_rsa.pub

  - 回到 github--->setting--->SSH--->new SSH key
  - 将 id_rsa.pub 里的密钥复制到 key 中

- git pull origin master

  - 当 github 中的仓库中被操作过时，先\$ git pull 将仓库中的所有分子拉取下来
  - \$ git pull origin master 将 master 分子 pull 下来
  - 此操作的目的是为了将被修改过的远程仓库 pull 拉取到本地仓库来，让本地仓库完全等于远程仓库
  - pull 拉取时出现一个奇怪的界面时操作 i--esc--:wq 退出

- pull 结束后再 push 到 github 上去

- 将整各仓库的项目克隆下来

```
git clone ssh路径
```

- master 是主分支
  当一个项目在开发时，放在分支中

- 创建 xxx 分支

```
git branch xxx
```

- 查看分支

```
git branch
```

- 切换到 xxx 分支

```
git checkout xxx
```

- 将 xxx 分支整合到 master 分支上

```
git merge xxx
```

- 删除 xxx 分支

```
git branch -d xxx
```

- 可以看到提交的 commit 信息

```
git log
```

- 回退到 commit 的某一个版本

```
git reset --hard "commitID"
```

- 上传到 github 仓库

```
git init
git remote add origin https://github.com/xxx/xxx.github.io.git
git add -A
git commit -m "first commit"
git push -u origin master
```
