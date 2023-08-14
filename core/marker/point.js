import { Feature } from "ol";
import { Point } from "ol/geom";
import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";
import { MARKER_MAP } from "/data/datas";

/**
 * @abstract 标记点
 */
export function MarkPoint(map) {
  const container = new Vector({
    source: new SourceVector(),
  });

  map.addLayer(container);

  //添加点
  AddPoints(container, MARKER_MAP);

  // 地图缩放时，刷新
  map.getView().on("change:resolution", container.changed);

  return container;
}

/**
 * @abstract 添加点
 */
export function AddPoints(container, markerMap) {
  for (const name in markerMap) {
    const item = markerMap[name];
    if (item.coords) {
      const pointFeature = CreatePointFeature(name, item.coords);
      container.getSource().addFeature(pointFeature);
    }
    if (item.children) {
      AddPoints(container, item.children);
    }
  }
}

/**
 * @abstract 创建点
 */
export function CreatePointFeature(name, coords) {
  // 创建一个点要素
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat(coords)), // 设置点的坐标
    name, // 设置点的属性，可以根据需求设置其他属性
  });

  // 创建一个图标样式
  const iconStyle = new Style({
    image: new Icon({
      src: "/marker.svg", // 图标的路径
      scale: 1,
      anchor: [0.5, 1], // 图标的锚点位置，[0.5, 1] 表示图标底部中心
    }),
  });
  pointFeature.setStyle(iconStyle); // 设置点要素的样式

  return pointFeature;
}
