---
title: 新手motos30pro刷机pe教程
date: 2023-08-31 15:05:00
tags:
  - tutorial
  - 刷机
---

# 新手Moto S30pro刷机教程

[古塵大佬原教程链接](https://www.coolapk.com/feed/48426470?shareKey=NWQ3MGZiOTFhZDg3NjRmMDNjMDU~&shareUid=2618747&shareFrom=com.coolapk.market_13.3.3)

由于moto原来的系统没法使用google服务，用安装器安装了还是没法登录，于是刷个机。之前逛酷安看到古塵大佬做的PixelExperience 13[tundra]moto S30pro版本，最近还实现了系统内部OTA更新，非常的牛逼。上个月就想刷的吗，由于一些操作原因没刷上，这次重新再刷一次。

其实[dubai机型参考方法](https://wiki.lineageos.org/devices/dubai/install)里面已经很详细了，照着刷就可以，不过是英文的，其实我也是个刷机小白，介于前两天有人问我刷pe的教程，我这里写一个非常非常新手向的教程。我这里只针对windows，mac的自行看文档吧，出了安装程序都差不多的。

## 基本要求


1. 确保你的电脑装了adbfastboot

如果你是windows，那么下载[Windows zip](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)，可以不添加环境变量，直接解压之后进入文件夹，在路径栏出直接输入cmd即可打开命令行，你也可以直接打开cmd之后到这个文件夹下。

![Alt text](/images/tutorial/202308/image.png)

在cmd中输入`adb --version`就可以看到版本号，确保adb可以使用就可以开始下一步了。

![Alt text](/images/tutorial/202308/image-1.png)

2. 装moto官方的usb驱动

我试过装了dubai参考教程里的usb驱动是不行的，最后再古塵大佬的帖子下叫我装官方的才可以

[moto usb驱动](https://en-us.support.motorola.com/app/usb-drivers)

装好之后你可以到设备管理器中看到便携设备下有你的moto机型，因为我已经刷过了pe，机型就变成了`XT2243-2`

![Alt text](/images/tutorial/202308/image-2.png)

3. 解锁bl

解bl锁我是在酷安里翻到一个老哥分享的别人做的程序，我忘记收藏帖子，翻了半天找不到了。

值得注意的是moto的解锁需要解锁码，要去官方网站认证。

完成这三步就可以开始刷机了

## 刷机

### 引导程序

你可以使用这个命令进入手机的fastboot mode，也可以音量键加关机键进入，都是可以的。

```bash
adb reboot bootloader
```

使用这个命令检查一下是否能成功找到设备，我这里也检测不到了，由于我现在演示的电脑不是我刷机的那台，我暂时也不知道啥问题，正常情况下会输出`XT2243-2`机型。

如果能输出机型就可以继续，不行的话就没法继续刷机，得重新检查一下usb驱动是否装好，或者手机是否解锁bl

```bash
fastboot devices
```

![Alt text](/images/tutorial/202308/image-4.png)

### 刷新分区

所需要的文件在[古塵大佬的教程](https://www.coolapk.com/feed/48426470?shareKey=NWQ3MGZiOTFhZDg3NjRmMDNjMDU~&shareUid=2618747&shareFrom=com.coolapk.market_13.3.3)里都有下载地址。所有需要刷入的文件你都可以直接放在adbfastboot安装目录下，这样就照着教程敲命令就行，不然你得去找一下文件。

在bootloader mode下刷入dtbo.img，vendor_boot.img，boot三个文件，这三个命令就一个个按顺序敲，然后等待手机显示成功就可以。

```bash
fastboot flash dtbo dtbo.img
# 其他目录
fastboot flash dtbo ./xxx/dtbo.img
fastboot flash vendor_boot vendor_boot.img
fastboot flash boot boot.img
```

### 刷入固件分区

在`Recovery`模式下，选择`Apply Update`，`Apply from ADB`，然后敲命令刷入copy-partitions-20220613-signed.zip

```bash
adb sideload copy-partitions-20220613-signed.zip
```

### 刷入系统

同样在recovery模式下

恢复出厂设置，选择`Factory Reset`，然后`Format data / factory reset`，注意提前备份自己的数据。

刷入系统包，选择`Apply Update`，然后`Apply from ADB`，然后执行命令

```bash
adb sideload 系统包.zip
```

然后等待系统刷入成功即可，刷完系统后如果要刷面具之类的就不要先开机，在这里刷入对应的包

最后返回选择`Reboot system now`就可以了
