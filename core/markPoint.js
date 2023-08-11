import { Feature } from "ol";
import { Point } from "ol/geom";
import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { fromLonLat, transform } from "ol/proj";
import { Style, Icon } from "ol/style";
import { MARKER_MAP } from "../data/datas";

export function MarkPoint(map) {
  const layers = [];

  const markPoints = (markerMap) => {
    for (const name in markerMap) {
      const item = markerMap[name];
      if (item.coords) {
        const vectorLayer = CreateMarker(name, item.coords);
        layers.push(vectorLayer);
        map.addLayer(vectorLayer);
      }
      if (item.children) {
        markPoints(item.children);
      }
    }
  };

  markPoints(MARKER_MAP);

  map.getView().on("change:resolution", function () {
    layers.forEach((layer) => {
      layer.changed();
    });
  });

  // 将矢量图层添加到地图中
}

function CreateMarker(name, coords) {
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

  // 创建一个矢量图层，并将点要素添加到图层中
  const vectorLayer = new Vector({
    source: new SourceVector({
      features: [pointFeature],
    }),
  });

  return vectorLayer;
}
