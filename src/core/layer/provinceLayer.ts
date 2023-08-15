import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Text, Fill, Stroke } from "ol/style";
import { ProvinceScope } from "~/data/province";
import ol from "ol";

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

const cityLayer: Record<string, Vector<any>> = {};

for (const key in ProvinceScope) {
  cityLayer[key] = new Vector({
    source: new SourceVector({
      url: `/src/geojson/${key}.json`,
      format: new GeoJSON(),
    }),
  });
}

const defaultStyle = new Style({
  stroke: new Stroke({
    color: "#ddd",
    width: 1,
  }),
});

export function AddLayer(map: ol.Map, city: string) {
  const layer = cityLayer[city];
  if (!layer) return;

  if (!map.getLayers().getArray().includes(layer)) {
    layer.setStyle((f: any) => [textStyle(f), defaultStyle]);

    map.addLayer(layer);
  } else {
    layer.setVisible(true);
  }
}

export function RemoveLayer(map: ol.Map, city: string) {
  const layer = cityLayer[city];
  if (!layer) return;

  if (map.getLayers().getArray().includes(layer)) {
    layer.setVisible(false);
  }
}
