---
title: 将 github pages 绑定到自己的域名
date: 2024-11-12 17:37:59
tags:
  - github
  - dns
---

# 将 github pages 绑定到自己的域名

## **在 GitHub 仓库中设置**：

```
Settings -> Pages -> Custom domain -> 输入你的域名（例如：example.com）
```

## **在域名提供商处添加 DNS 记录**：

如果你想使用 apex 域名（例如：example.com），需要添加 A 记录：

```
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
```

如果你想使用子域名（例如：www.example.com），需要添加 CNAME 记录：

```
CNAME www example.com
```

### 域名解析的方法

1. 登录腾讯云控制台

2. 找到域名解析的方法（以下几种方式）：

- 方式1：直接访问 [DNS 解析 DNSPod](https://console.dnspod.cn/)
- 方式2：在腾讯云控制台首页搜索 "域名解析"
- 方式3：控制台左侧菜单 -> "域名与网站" -> "DNS 解析 DNSPod"

3. 在域名列表中找到你的域名

4. 点击域名右侧的 "解析" 按钮

### 子域名负载均衡数量超出限制

1. **首先删除已经添加的解析记录**

2. **使用线路类型来区分不同的 A 记录**：

为 `@` 添加 4 条 A 记录，每条使用不同的线路类型：

```
记录类型: A
主机记录: @
线路类型: 默认
记录值: 185.199.108.153
TTL: 600

记录类型: A
主机记录: @
线路类型: 电信
记录值: 185.199.109.153
TTL: 600

记录类型: A
主机记录: @
线路类型: 联通
记录值: 185.199.110.153
TTL: 600

记录类型: A
主机记录: @
线路类型: 移动
记录值: 185.199.111.153
TTL: 600
```

然后添加 CNAME 记录：

```
记录类型: CNAME
主机记录: www
线路类型: 默认
记录值: your-username.github.io
TTL: 600
```

## 在项目根目录添加 CNAME 文件

```bash
# 在项目根目录下创建 CNAME 文件（注意必须是大写）
echo "example.com" > CNAME
```

## **验证设置**：

1. 等待 DNS 解析生效（通常需要几分钟到几小时）
2. 访问你的域名，确认网站是否正常显示
3. 在 GitHub 仓库的 Settings -> Pages 中查看是否显示 "Your site is published at https://example.com"

## **常见问题**：

- 如果出现 404 错误，请检查 DNS 记录是否正确配置
- 确保 CNAME 文件中只包含域名，不要包含 http:// 或 https:// 前缀
- 如果使用了 CDN，可能需要额外的配置步骤

## 使用子域名

1. **在新项目中创建 CNAME 文件**：

```bash
# 在项目根目录创建 CNAME 文件
echo "blog.shellingfordly.top" > CNAME
```

2. **在 DNS 设置中添加子域名记录**：

在你的域名服务商（比如阿里云、Cloudflare 等）添加以下 DNS 记录：

```
类型: CNAME
主机记录: blog  (子域名前缀)
记录值: <你的用户名>.github.io
TTL: 600
```

3. **在 GitHub 仓库设置中确认**：

- 进入仓库的 Settings -> Pages
- 确保 Custom domain 设置为 blog.shellingfordly.top
- 等待 DNS 检查通过（可能需要几分钟到几小时）

注意事项：

- 每个 GitHub 仓库可以使用不同的子域名
- 主域名和子域名可以同时使用
- DNS 生效需要一定时间，请耐心等待
