import { PROVINCE_SCOPE } from "~/data/province";
import {
  Vector,
  SourceVector,
  GeoJSON,
  Style,
  Text,
  Fill,
  Stroke,
  Feature,
  Map,
} from "~/ol-imports";

export const ProvinceLayerMap: Record<string, Vector<any>> = {};

export function SetupProvinceLayer(map: Map) {
  const textStyle = function (feature: Feature) {
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

  for (const key in PROVINCE_SCOPE) {
    const layer = new Vector({
      source: new SourceVector({
        url: `/src/geojson/${key}.json`,
        format: new GeoJSON(),
      }),
      renderBuffer: 100,
    });
    // 缓存
    ProvinceLayerMap[key] = layer;
    layer.setVisible(false);
    layer.setStyle((f: any) => [textStyle(f), defaultStyle]);

    if (!map.getLayers().getArray().includes(layer)) {
      map.addLayer(layer);
    }
  }
}
