import { PROVINCE_SCOPE } from "~/data/province";
import { Vector, SourceVector, GeoJSON, Map } from "~/ol-imports";
import { CreateLayerStyle } from "../style";
import { CreateAddLayerCache } from ".";

export function SetupProvinceLayer(map: Map) {
  for (const key in PROVINCE_SCOPE) {
    const layer = new Vector({
      source: new SourceVector({
        url: `/src/geojson/china/${key}.json`,
        format: new GeoJSON(),
      }),
      renderBuffer: 100,
    });
    // 缓存
    CreateAddLayerCache("second", key, layer);
    layer.setVisible(false);
    layer.setStyle(CreateLayerStyle);

    if (!map.getLayers().getArray().includes(layer)) {
      map.addLayer(layer);
    }
  }
}
