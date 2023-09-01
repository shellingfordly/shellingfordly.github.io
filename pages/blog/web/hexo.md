---
title: Hexo搭建个人静态博客
date: 2019-10-09
tags:
  - hexo
---

# Hexo搭建个人静态博客

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
本站是基于Hexo, 使用NexT主题, Valine评论系统, 不蒜子站点统计 部署在码云上的博客
</span>

<!-- more -->

## 准备

本站原本是部署在github上, [github源码](https://github.com/shellingfordly/hexo-blog), 由于访问较慢, 迁移到了码云上, [码云源码](https://gitee.com/shellingfordly/shellingfordly)

### node安装

下载安装[node.js官网](https://nodejs.org/en/download/)

### github账号

[github官网](https://github.com/)
注册并新建一个名为username.github.io的仓库

### 码云账号

[码云官网](https://gitee.com/)
注册并新建一个名为username的仓库
国内的github, 部署在这上面访问会快一些

## hexo

[hexo官网](https://hexo.io/)
hexo使用可参考我记录的[使用文档](/2019/09/29/hexo%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3/)
细节可参考[官方文档](https://hexo.io/zh-cn/docs/)

### 安装

```
npm install hexo-cli -g
```

### 开始搭建

网站搭建细节可参考[最晚的开始](https://123sunxiaolin.github.io/2016/08/27/%E5%BE%92%E6%89%8B%E6%95%99%E4%BD%A0%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8D%9A%E5%AE%A2/)

#### 执行命令

```js
// 新建一个hexo项目
hexo init 项目名称
cd 项目名称
// 运行在本地
hexo s
// 访问http://localhost:4000/
```

#### 安装主题

```
git clone https://github.com/iissnan/hexo-theme-next   themes/next
```

### 部署

```js
// 清除缓存
hexo  clean
// 生成页面并部署到github
hexo  g -d
// 可能需要登录github
```

## NexT

> hexo主题

[NexT主题安装](https://github.com/iissnan/hexo-theme-next)
NexT使用细节可参考[NexT使用文档](http://theme-next.iissnan.com/getting-started.html)
一些自定义细节修改可参考[Moorez的文章](https://segmentfault.com/a/1190000009544924#articleHeader10)

### 修改鼠标样式

打开themes/next/source/css/\_custom/custom.styl
在里面添加代码, icon图片就存在source/images中, 也可以使用外链
必须事ico图片

```css
* {
  cursor: url("/images/mouse.ico"), auto !important;
}
:active {
  cursor: url("/images/mouse.ico"), auto !important;
}
```

### 关闭打赏字体闪动

打开 next/source/css/\_common/components/post/post-reward.styl 将函数wechat:hover和alipay:hover注释或者删掉即可

### 添加字数统计

下载插件

```
npm install hexo-wordcount --save
```

在/themes/next/layout/\_partials/footer.swig中添加代码

```html
<div class="theme-info">
  <div class="powered-by"></div>
  <span class="post-count">全站共{{ totalcount(site) }}字</span>
</div>
```

## 来必力

> 评论系统 [来必力官网](https://www.livere.com/)

细节可参考[字节流的博客](https://blog.smoker.cc/web/add-comments-livere-for-hexo-theme-next.html)

注册安装之后在管理页面--代码管理中查看你的data-uid, 然后在主题配置文件themes/next/\_config.yml中设置就可以了

```
livere_uid:
```

## Valine

> 评论系统 [官方文档](https://valine.js.org/)

之前使用的是来必力, 需要登录评论, 考虑到有些朋友不喜欢登录, 换成了Valine, 不过就没有了点赞和踩, 举报, 查看自己评论的这些功能了, 头像也是固定的, 虽然可以使用Gravatar账号, 但更加麻烦了
首先注册[LeanCloud](https://leancloud.cn/), 创建应用--设置--应用Key中找到APP ID和APP Key,
开启valine并填入appid和appkey即可, 其他可默认, 详细操作可查看官方文档

```js
valine:
  enable: true
  appid:
  appkey:
  notify: false # 邮箱提醒
  verify: false # 验证码服务
  placeholder: 说点什么呢... # 占位提示符
  avatar:   # 设置默认头像
  guest_info: nick,mail,link
  pageSize: 10 # 评论列表分页

```

## 不蒜子

> 站点统计工具

详情参数[不蒜子官网](http://ibruce.info/2015/04/04/busuanzi/)

在主题配置文件themes/next/\_config.yml中设置**busuanzi_count**的配置项

```js
busuanzi_count:
	# 是否开启
  enable: true
	# 访客数
	site_uv: true
	site_uv_header:
	site_uv_footer:
	# 访问量
	site_pv: true
	site_pv_header:
	site_pv_footer:
	# 阅读量
	page_pv: true
	page_pv_header:
	page_pv_footer:
```

**注意** 由于不蒜子的脚本获取网址改变了, 所以如果直接下载了next主题并添加 busuanzi_count 配置项之后可能还是统计不到数据, 需要修改 /themes/next/layout/\_third-party/analytics/busuanzi-counter.swig 文件, 将其src改成 busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js 即可

```html
<script
  async
  src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
></script>
```
