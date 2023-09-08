---
title: 基于ffmpeg制作的Web视频处理工具
date: 2022-07-13 16:31:00
tags:
  - vue
  - ffmpeg
---

# 基于ffmpeg制作的Web视频处理工具

## 前言

由于最近写东西的时候想把视频转成gif，网上随便搜了一下在线转换的网站，结果不仅要登微信，上传完之后还不给下载，很烦，于是决定自己写一个。虽然说肯定有免费的网站可以用，但是本着学习的心态，加上自己做的话也自由，想要什么加什么，不用受约束，而且这些在线转换大多要微信关注公众号，这一点我很烦，免费就免费，收费就收费，非让我专注公众号，我十分接受不了。

于是去github上搜一下，发现[ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm)这个库，功能很强大，可以做视频和音频的处理，目前我只需要做格式转换，不过也就是说后面可以基于他做更多的功能，比如简单的剪辑。暂时不谈，先从简单做起，考虑的太多就不想搞了，先满足目前的需求。

## 介绍

我是用vue写的，因为vue真的很方便很快，我看到也有人用react写的，可以去看这个项目[video-to-gif](https://github.com/mryhryki/video-to-gif)

- [项目地址](https://github.com/shellingfordly/my-tools)
- 效果展示

![](/images/blog/ffmpeg_video_tool.webp)

这个gif展示图就是这个项目生成的，看着很卡是因为为了缩小上传的大小，我只给了3帧，所以看着十分卡。

## 注意

有一个地方需要注意，需要在vite里面配置这个东西，好像是和跨域有关，有兴趣的自己去搜，我也不是很明白，反正要是不写就会给你一个错误

```ts
export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    }
  }
}
```

```
Error: SharedArrayBuffer could not be used.
```

也是由于要设置headers，将打包后的静态页面直接用作github pages时就会得到这个错误，需要启动服务去设置headers，所以想要体验的话暂时需要clone项目到本地跑，后面我会部署在服务器上，想要体验的话可以关注[本项目](https://github.com/shellingfordly/my-tools)。

```
git clone https://github.com/shellingfordly/my-tools.git
cd my-tools
pnpm i
pnpm run dev
open http://localhost:3080/
```

## 代码

转换的核心代码就是调用ffmpeg提供的api，将文件传给它，配置输出的各种参数。

页面上就做一个文件上传，和一个配置的input就行，其实还是挺简单的，启动服务就可以直接在网页上用了

```ts
export async function useFFmpeg(
  file: File,
  config: ConfigType,
  progressFn: ProgressCallback = () => {}
) {
  const ffmpeg = await loadFFmpeg();
  const { fetchFile } = getFFmpeg();

  ffmpeg.setProgress(progressFn);

  const {
    width: defaultWidth,
    height: defaultHeight,
    duration,
  } = await getVideoSize(file);
  const {
    frameRate = 25,
    width = defaultWidth,
    height = defaultHeight,
    rangeStart = 0,
    rangeEnd = duration,
    fileType,
  } = config;

  ffmpeg.FS("writeFile", file.name, await fetchFile(file));

  await ffmpeg.run(
    "-i",
    file.name,
    "-r",
    `${frameRate}`,
    "-ss",
    `${rangeStart}`,
    "-to",
    `${rangeEnd}`,
    "-vf",
    `scale=${width}:${height},fade=t=in:st=${rangeStart}:d=0.05`,
    `output.${fileType}`
  );

  return ffmpeg.FS("readFile", `output.${fileType}`).buffer;
}
```
