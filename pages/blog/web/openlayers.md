---
title: 在vue3中使用openlayers制作旅行地图
date: 2023-09-13 10:16:00
tags:
  - openlayers
  - vue
---

# 在 vue3 中使用 openlayers 制作旅行地图

由于上半年经常跑出去，突然想做一个旅行地图的博客，想起之前接触过 openlayers 的项目，也懒得去调查别的库了，直接用 openlayers 开干。

[博客 github 地址](https://github.com/shellingfordly/shellingfordly.github.io)

[旅行地图预览地址](https://shellingfordly.github.io/travel)

## 安装

vue 的项目搭建就不说了，直接安装 **ol** 就可以开写了

```bash
npm i ol
```

## 创建地图

```ts
const { center, zoom, minZoom, maxZoom, extent } = MAP_DEFAULT_OPTIONS;
const map = new Map({
  target: "map",
  layers: [],
  controls: [],
});
map.setView(
  new View({
    center: fromLonLat(center),
    zoom,
    minZoom,
    maxZoom,
    constrainResolution: true,
    extent: transformExtent(extent, EPSG4326, map.getView().getProjection()),
  })
);
```

## 添加图层

创建图层，我这里用的是 geojson 的数据创建的，可以在网上找到你想要创建地图的 geojson 数据。

```ts
const layer = new Vector({
  source: new SourceVector({
    url,
    format: new GeoJSON(),
  }),
});

layer.setStyle(CreateLayerStyle);
```

创建多个图层添加到组内，比如亚洲图层，中国图层

```ts
const layerGroup = new Group({
  layers: [asiaLayer, chinaLayer],
});
map.addLayer(layerGroup);
```

## 实现放大现在省份图层

由于中国图层的 geojson 就只包含省份的边界线，我想要在放大的时候加载出城市的边界线，就得添加省份的 geojson 数据。

监听地图的 change 事件，判断缩放发生大于某个数的时候，添加对应的省份图层

- LayerCacheMap 省份图层
- currentExtent 当前视图范围
- isCityInView 判断省份是否在当前视图中
- layer.setVisible 设置图层显示隐藏

```ts
map.getView().on("change", function (event) {
  const mapView = event.target;
  // 获取新的缩放级别
  const zoom = event.target.getZoom();
  // 当前视图范围
  const currentExtent = mapView.calculateExtent(map.getSize());

  const transformedExtent = transformExtent(
    currentExtent,
    mapView.getProjection(),
    EPSG4326
  );

  if (zoom > index) {
    // 显示2级涂层
    for (const key in ALL_EXTENT) {
      const extent = ALL_EXTENT[key];

      // 判断省份是否在当前视图中
      const isCityInView = intersects(extent, transformedExtent);
      const layer = LayerCacheMap[key];
      if (!layer) continue;

      if (isCityInView) {
        layer.setVisible(true);
      } else {
        layer.setVisible(false);
      }
    }
  } else {
    // 移除2级涂层
    for (const key in ALL_EXTENT) {
      const layer = LayerCacheMap[key];
      if (layer) layer.setVisible(false);
    }
  }
});
```

- 效果

<img-item dark="/images/blog/ol_zoom_dark.gif" light="/images/blog/ol_zoom.gif" />

## 实现主题切换

监听 `isDark` 的变化，遍历所有图层，使用 layer.setStyle 改变图层的 style

```ts
const isDark = useDark();

watch(isDark, () => {
  for (const key in LayerCacheMap) {
    if (Object.prototype.hasOwnProperty.call(LayerCacheMap, key)) {
      const map = LayerCacheMap[(key as any) as LayerIndex];
      for (const key in map) {
        if (Object.prototype.hasOwnProperty.call(map, key)) {
          const layerMap = map[key];
          if (layerMap.layer) {
            // 设置主题
            layerMap.layer.setStyle(CreateLayerStyle);
          }
        }
      }
    }
  }
});
```

- 效果

<img-item src="/images/blog/ol_change_theme.gif"/>

## 添加标点

- 创建一个 marker layer 图层来收集所有的点
- 通过数据批量创建点要素，设置样式

```ts
const container = new Vector({
  source: new SourceVector(),
});

// 获取标点的数据
const markerList = CreateMapMarkerData();

markerList.forEach((item) => {
  // 创建点要素，添加到container layer中
  const pointFeature = CreatePointFeature(item);
  if (pointFeature) container.getSource()?.addFeature(pointFeature);
});
```

- 根据位置信息创建点要素

```ts
const pointFeature = new Feature({
  geometry: new Point(fromLonLat(item.coords)), // 设置点的坐标
  info: item,
});

// 创建一个图标样式
const iconStyle = new Style({
  image: new Icon({
    src: "/images/icons/marker.svg",
    color: "red",
    scale: 1,
    anchor: [0.15, 0.9], // 图标的锚点位置
  }),
});
pointFeature.setStyle(iconStyle);
```

- 效果

<img-item dark="/images/blog/ol_marker_dark.png" light="/images/blog/ol_marker.png" />

## 为标点添加事件

1. 移动到标点出显示标点信息

- 使用创建交互事件
- layer 交互图层为 marker container
- condition 交互条件为鼠标悬停 pointerMove

```ts
import { pointerMove } from "ol/events/condition";

const interaction = new Select({
  layers: [layer], // 指定可以触发交互的图层
  condition: pointerMove, // 鼠标触发条件
  style: null, // 禁用默认样式
});
```

2. 绑定交互事件触发的回调函数

- 获取标点 event.selected[0]
- 获取标点信息 selectedFeature.get("info")
- 在鼠标移入标点时触发相应的事件，比如修改指针
- 鼠标移出时触发相应的事件

```ts
let markerInfo: MarkInfo = {
  info: {},
  coords: [],
};

interaction.on("select", (event) => {
  // 悬停事件触发
  if (event.selected.length > 0) {
    const selectedFeature = event.selected[0];
    // 保存标点信息
    markerInfo.info = selectedFeature.get("info");

    const geometry = selectedFeature.getGeometry();
    if (geometry instanceof Point) {
      // 保存标点位置
      markerInfo.coords = geometry.getCoordinates();
    }

    // 设置 preview 的显示内存
    const element = document.getElementById("map_marker_preview");

    element.textContent = markerInfo.info.title;
    // ...

    // 设置鼠标指针为 pointer
    map.getTargetElement().style.cursor = "pointer";
  } else {
    // 鼠标移出触发
    // ...

    map.getTargetElement().style.cursor = "default";
  }
});
```

3. 添加点击事件

触发点击事件跳转到对应的链接

```ts
import { click } from "ol/events/condition";

const interaction = new Select({
  layers: [layer],
  condition: click,
  style: null,
});

interaction.on("select", (event) => {
  if (event.selected.length > 0) {
    const selectedFeature = event.selected[0];
    const info = selectedFeature.get("info");
    if (info?.route) router.push(info?.route);
  }
});
```

- 效果

<img-item dark="/images/blog/ol_marker_preview_dark.gif" light="/images/blog/ol_marker_preview.gif" />

## 航行路线

其实标点做完已经完成了我的目标和想要的效果了，不过最近比较清闲，就想加点花哨的东西，添加一个飞机飞过的航行络线。

1. 创建飞机、路线图层

```ts
const source = new SourceVector();
const layer = new Vector({ source });
map.addLayer(layer);
```

2. 创建一架飞机

- extent 目的地的坐标
- degrees 飞机初始的旋转角度
- countDegrees 通过起始坐标和终点坐标来计算 degrees

```ts
const extent = transform(event?.coords, EPSG3857, EPSG4326);
const degrees = countDegrees(START_POINT, extent);

const feature = new Feature({ geometry: new Point([]) });
const style = new Style({
  image: new Icon({
    src: "/images/icons/plane.svg",
    scale: 1,
    rotation: toRadians(45 + 360 - degrees),
  }),
});
feature.setStyle(style);
source.addFeature(feature);
```

3. 飞行路线

- 根据标点创建不同的路线
- 使用 LineString 创建线段要素
- interpolatePoints 根据起始点和终点插值(我的效果是使用贝塞尔曲线创建的)

```ts
const features: Record<string, Feature> = {};
const markers = CreateMapMarkerData();

markers
  .filter((m) => !!m.coords)
  .forEach((marker) => {
    // 插值
    const coords = interpolatePoints(START_POINT, marker.coords, 100);

    const feature = new Feature({
      geometry: new LineString(coords),
    });
    // 设置样式
    feature.setStyle(CreateLineStyle());
    features[marker.route] = feature;
  });
```

4. 飞行动画

根据线路的坐标在设置的时间内 Duration 不停的改变飞机的坐标位置

```ts
const line = lineFeature?.getGeometry();
const coordsList = line.getCoordinates();
let startTime = new Date().getTime();

function animate() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  const fraction = elapsedTime / Duration;
  const index = Math.round(coordsList.length * fraction);

  if (index < coordsList.length) {
    const geometry = feature.getGeometry();
    if (geometry instanceof Point) {
      geometry?.setCoordinates(coordsList[index]);
    }
    // TODO 飞机转向

    requestAnimationFrame(animate);
  } else {
    callback();
  }
}

animate();
```

- 效果

<img-item dark="/images/blog/ol_plane_dark.gif" light="/images/blog/ol_plane.gif" />

左上角是信息预览和路线预览的开关。

可以看到飞机的初始方向是对的，但飞行起来就不对了，因为我还没有做哈哈哈哈，需要在动画里每一帧根据坐标去计算飞机的角度，之后再更新吧。

### 飞机转向（更新）

其实也很简单，就是记录一下上一次的位置信息，计算一下偏移角度调用 **setRotation** 在动画的每一帧设置一下就可以了

```ts
if (lastCoords) {
  const degrees = toRadians(
    45 + 360 - countDegrees(lastCoords, coordsList[index])
  );
  (feature.getStyle() as Style)?.getImage()?.setRotation(degrees);
}
lastCoords = coordsList[index];
```

- 效果

<img-item dark="/images/blog/ol_plane_rotation_bark.gif" light="/images/blog/ol_plane_rotation.gif" />

## 总结

如果感兴趣的话可以关注我的[github](https://github.com/shellingfordly)

对我的博客项目感兴趣可以关注[my blog github](https://github.com/shellingfordly/shellingfordly.github.io)，我会不定期地持续地更新，欢迎大佬添加友链。

这里是[旅行地图预览地址](https://shellingfordly.github.io/travel)，由于挂在 github 上会有点卡，时不时还会因为 github actions 构建失败而 404<i class="i-twemoji-face-with-tears-of-joy"/>，所以可能有时候进不去，我正在想解决对策，vercel 打包出来会有[页面刷新 404 的问题](https://shellingfordly.github.io/blog/other/vite-plugin-pages)，貌似是因为**vite-plugin-pages**打包出来的路由问题，而且我发现[antfu.me](https://github.com/antfu/antfu.me)的打包本地直接 **live-server** 运行也会有这个问题，暂时没解决。

所有的展示图片来自录屏再通过[my tools](https://github.com/shellingfordly/my-tools)转换为 gif。
