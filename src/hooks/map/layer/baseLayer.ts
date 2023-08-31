import { Map, GeoJSON, Vector, SourceVector, Group } from "~/ol-imports";
import { CreateLayerStyle } from "../style";
import { CreateAddLayerCache, LayerIndex } from ".";

export function SetupBaseLayer(map: Map) {
  const asiaLayer = CreateLayer("/geojson/asia.json");
  const chinaLayer = CreateLayer("/geojson/china.json");
  const japanLayer = CreateLayer("/geojson/japan.json");

  CreateAddLayerCache(LayerIndex.Zero, "asia", asiaLayer);
  CreateAddLayerCache(LayerIndex.First, "china", chinaLayer);
  CreateAddLayerCache(LayerIndex.Second, "japan", japanLayer);

  const layerGroup = new Group({
    layers: [asiaLayer, chinaLayer, japanLayer],
  });
  map.addLayer(layerGroup);
}

function CreateLayer(url: string) {
  const layer = new Vector({
    source: new SourceVector({
      url,
      format: new GeoJSON(),
    }),
  });

  layer.setStyle(CreateLayerStyle);

  return layer;
}
