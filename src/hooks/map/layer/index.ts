export * from "./baseLayer";
export * from "./layerEvent";
export * from "./provinceLayer";
import { Vector } from "~/ol-imports";

export const LayerCacheMap: Record<
  "first" | "second",
  Record<string, LayerMapItem>
> = {
  first: {},
  second: {},
};

export function CreateAddLayerCache(
  type: "first" | "second",
  name: string,
  layer: Vector<any>
) {
  if (!LayerCacheMap[type]) {
    LayerCacheMap[type] = {};
  }
  
  if (!LayerCacheMap[type][name]) {
    LayerCacheMap[type][name] = {
      name,
      layer,
    };
  }
}
