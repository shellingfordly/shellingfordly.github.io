import { ALL_EXTENT } from "~/data/province";
import { Vector, SourceVector, GeoJSON, Map } from "~/ol-imports";
import { CreateLayerStyle } from "../style";
import { CreateAddLayerCache, LayerIndex } from ".";

export function SetupProvinceLayer(map: Map) {
  for (const key in ALL_EXTENT) {
    const layer = new Vector({
      source: new SourceVector({
        url: `/geojson/china/${key}.json`,
        format: new GeoJSON(),
      }),
      renderBuffer: 100,
    });
    // 缓存
    CreateAddLayerCache(LayerIndex.Second, key, layer);
    layer.setStyle(CreateLayerStyle);

    if (!map.getLayers().getArray().includes(layer)) {
      map.addLayer(layer);
    }
  }
}
