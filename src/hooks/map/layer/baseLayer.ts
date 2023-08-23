import { Map, GeoJSON, Vector, SourceVector, Group } from "~/ol-imports";
import { CreateLayerStyle } from "../style";
import { CreateAddLayerCache } from ".";

export function SetupBaseLayer(map: Map) {
  const worldLayer = CreateLayer("/src/geojson/world.json");
  const chinaLayer = CreateLayer("/src/geojson/china.json");
  const japanLayer = CreateLayer("/src/geojson/japan.json");

  CreateAddLayerCache("first", "china", chinaLayer);
  CreateAddLayerCache("second", "japan", chinaLayer);

  const layerGroup = new Group({
    layers: [worldLayer, chinaLayer, japanLayer],
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
