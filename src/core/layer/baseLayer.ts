import {
  Map,
  Feature,
  GeoJSON,
  Style,
  Text,
  Fill,
  Stroke,
  Vector,
  SourceVector,
} from "~/ol-imports";

export function SetupBaseLayer(map: Map) {
  const baseLayer = new Vector({
    source: new SourceVector({
      url: "/src/geojson/all.json",
      format: new GeoJSON(),
    }),
  });
  map.addLayer(baseLayer);

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

  baseLayer.setStyle((feature: any) => {
    return [textStyle(feature), defaultStyle];
  });
}
