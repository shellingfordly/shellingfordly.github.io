---
title: react-native学习实践，仿写qq音乐播放
date: 2022-01-04 14:16:00
tags:
  - react
---

# react-native学习实践，仿写qq音乐播放

最近在学习react-native，就想说做个项目实践一下，于是决定仿写一下QQ音乐，接口是在github上找的一个项目，地址[QQMusicApi](https://github.com/jsososo/QQMusicApi)。项目是expo创建的，因为它可以直接运行web页面，比较方便，本项目仅供学习参考。

## 地址

[qq-music](https://github.com/shellingfordly/qq-music)

## 效果预览

[预览地址](http://106.54.183.217:3300/)

没有特别的去还原qq音乐，只是大致的仿照了一下

### 首页

- 搜索
- 获取了海报，因为接口里面没有找到海报对应的歌单，所以没有点击事件
- 歌手页面
- 排行页面
- 分类页面
- 电台页面
- 官方歌单和达人歌单

![](/images/blog/react_nactive_1.png)

#### 搜索

- 获取了搜索热词

![](/images/blog/react_nactive_2.png)

- 搜索结果

![](/images/blog/react_nactive_3.png)

### 歌手页面

可以根据不同的分类进行筛选歌手。歌手顺序是接口默认返回的，应该是按照热度来的

![](/images/blog/react_nactive_4.png)

### 排行页面

获取了排行榜接口，展示歌单

![](/images/blog/react_nactive_5.png)

### 分类页面

一些歌单的分类，点击到对应歌单

![](/images/blog/react_nactive_6.png)

### 电台页面

获取了电台接口，展示了电台分类列表，暂时没有做事件

![](/images/blog/react_nactive_7.png)

### 歌单页面

首页的歌单，分类的歌单，排行榜的歌单都是到这个歌单页面，展示歌单的所有歌曲，点击播放按键可以到播放页面，播放列表里有会歌单的所有歌曲，点击单首歌曲也会到播放页面，只会将此歌曲添加到播放列表

![](/images/blog/react_nactive_8.png)

### 播放页面

暂时只做了播放暂停，音量控制，播放列表

![](/images/blog/react_nactive_9.png)

### 账号页面

获取了个人创建的歌单和收藏的歌单，当然需要设置账号获取cookie，设置账号只能获取账号开放的歌单，没有开放的歌单是获取不到的，设置cookie可以获取到。cookie可以到qq音乐中自行获取，必须设置cookie才能获取到歌曲的播放链接。

![](/images/blog/react_nactive_10.png)
![](/images/blog/react_nactive_11.png)
