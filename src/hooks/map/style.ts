import { Style, Text, Fill, Stroke } from "~/ol-imports";
import { LayerCacheMap, LayerIndex } from "./layer";
import { isDark } from "~/utils";

export function CreateLayerStyle(feature: any) {
  const text = new Text({
    text: feature.get("name_zh") || feature.get("name"),
    fill: new Fill({ color: isDark.value ? "white" : "black" }),
    stroke: new Stroke({ color: isDark.value ? "black" : "white", width: 1 }),
  });

  const stroke = new Stroke({
    color: feature.get("name") === "China" ? "transparent" : "#ddd",
    width: 1,
  });

  return [
    new Style({
      text,
      stroke,
    }),
  ];
}

export function SetupLayerStyle() {
  watch(isDark, () => {
    for (const key in LayerCacheMap) {
      if (Object.prototype.hasOwnProperty.call(LayerCacheMap, key)) {
        const map = LayerCacheMap[key as any as LayerIndex];
        for (const key in map) {
          if (Object.prototype.hasOwnProperty.call(map, key)) {
            const layerMap = map[key];
            if (layerMap.layer) {
              layerMap.layer.setStyle(CreateLayerStyle);
            }
          }
        }
      }
    }
  });
}
