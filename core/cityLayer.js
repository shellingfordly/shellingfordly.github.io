import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Text, Fill, Stroke } from "ol/style";
import { transformExtent } from "ol/proj";
import { createEmpty, extend, intersects } from "ol/extent";

const cityNames = [
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

const cityLayer = {};
cityNames.forEach((name) => {
  cityLayer[name] = new Vector({
    source: new SourceVector({
      url: `./geojson/${name}.json`,
      format: new GeoJSON(),
    }),
  });
});

const defaultStyle = new Style({
  stroke: new Stroke({
    color: "#ddd",
    width: 1,
  }),
});

export function AddLayer(map, city) {
  const layer = cityLayer[city];
  if (!layer) return;

  if (!map.getLayers().getArray().includes(layer)) {
    map.addLayer(layer);
    layer.setStyle(function (feature) {
      return [textStyle(feature), defaultStyle];
    });
  } else {
    layer.setVisible(true);
  }
}

export function RemoveLayer(map, city) {
  const layer = cityLayer[city];
  if (!layer) return;

  if (map.getLayers().getArray().includes(layer)) {
    layer.setVisible(false);
  }
}
