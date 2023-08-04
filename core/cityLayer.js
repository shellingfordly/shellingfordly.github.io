import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Text, Fill, Stroke } from "ol/style";
import { transformExtent } from "ol/proj";
import { createEmpty, extend, intersects } from "ol/extent";

const cityList = [
  "安徽",
  "福建",
  "广西",
  "贵州",
  "河北",
  "黑龙江",
  "河南",
  "湖北",
  "江苏",
  "江西",
  "吉林",
  "辽宁",
  "青海",
  "山东",
  "山西",
  "四川",
  "新疆",
  "西藏",
  "云南",
  "浙江",
];

const textStyle = function (feature) {
  return new Style({
    text: new Text({
      text: feature.get("name"), // 假设GeoJSON属性中有名为 'name' 的属性来表示城市名称
      font: "12px Arial",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  });
};

const layerList = cityList.map(
  (city) =>
    new Vector({
      source: new SourceVector({
        url: `./geojson/${city}.json`,
        format: new GeoJSON(),
      }),
    })
);

const defaultStyle = new Style({
  stroke: new Stroke({
    color: "#ddd",
    width: 1,
  }),
});

// transformedExtent
// 0 表示边界框的左下角的经度（Longitude）。
// 1 表示边界框的左下角的纬度（Latitude）。
// 2 表示边界框的右上角的经度（Longitude）。
// 3 表示边界框的右上角的纬度（Latitude）。

export function AddLayer(map, transformed) {
  // layerList.forEach((layer) => {
  //   var layerExtent = GetLayerExtent(layer);
  //   // const layerTransformed = transformExtent(
  //   //   layerExtent,
  //   //   map.getView().getProjection(),
  //   //   "EPSG:4326"
  //   // );
  //   console.log("layerExtent: ", layerExtent);
  //   if (!map.getLayers().getArray().includes(layer)) {
  //     // map.addLayer(layer);
  //   }
  // });
  // layerList.forEach((layer) => {
  //   layer.setStyle(function (feature, resolution) {
  //     return [textStyle(feature), defaultStyle];
  //   });
  // });
}

export function GetLayerExtent(layer) {
  const layerSource = layer.getSource();

  // 获取图层的全部要素
  const features = layerSource.getFeatures();

  // 计算图层的显示范围
  const layerExtent = createEmpty(); // 创建一个空的范围
  features.forEach((feature) => {
    extend(layerExtent, feature.getGeometry().getExtent());
  });

  // 转换范围为 EPSG:4326 坐标系（WGS84）
  return layerExtent;
}
