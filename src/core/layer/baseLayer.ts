import { GeoJSON } from "ol/format";
import { Style, Text, Fill, Stroke } from "ol/style";
import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import ol from "ol";

export function CreateBaseLayer(map: ol.Map) {
  const vectorLayer = new Vector({
    source: new SourceVector({
      url: "/src/geojson/all.json",
      format: new GeoJSON(),
    }),
  });
  map.addLayer(vectorLayer);

  // * 样式
  const textStyle = function (feature: ol.Feature) {
    return new Style({
      text: new Text({
        text: feature.get("name"), // 假设GeoJSON属性中有名为 'name' 的属性来表示城市名称
        font: "12px Arial",
        fill: new Fill({ color: "black" }),
        stroke: new Stroke({ color: "white", width: 2 }),
      }),
    });
  };
  const defaultStyle = new Style({
    stroke: new Stroke({
      color: "#ddd",
      width: 1,
    }),
  });
  vectorLayer.setStyle((feature: any) => [textStyle(feature), defaultStyle]);
}
