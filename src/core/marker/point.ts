import {
  Feature,
  Vector,
  SourceVector,
  fromLonLat,
  Style,
  Icon,
  Point,
} from "~/ol-imports";
import { CreateMarkerData } from "../utils";

/**
 * @abstract 创建标点图层
 */
export function CreateMarkerLayer() {
  const container = new Vector({
    source: new SourceVector(),
  });

  const markerList = CreateMarkerData();
  markerList.forEach((item) => {
    const pointFeature = CreatePointFeature(item);
    if (pointFeature) container.getSource()?.addFeature(pointFeature);
  });

  return container;
}

/**
 * @abstract 创建点要素
 */
export function CreatePointFeature(item: MarkerItem) {
  if (!item?.coords) return;

  // 创建一个点要素
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat(item.coords)), // 设置点的坐标
    info: item,
  });

  // 创建一个图标样式
  const iconStyle = new Style({
    image: new Icon({
      src: "/marker.svg",
      scale: 1,
      anchor: [0.5, 1], // 图标的锚点位置，[0.5, 1] 表示图标底部中心
    }),
  });
  pointFeature.setStyle(iconStyle);

  return pointFeature;
}
