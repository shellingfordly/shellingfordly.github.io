export * from "./baseLayer";
export * from "./layerEvent";
export * from "./provinceLayer";
import { Vector } from "~/ol-imports";

export enum LayerIndex {
  Zero = 0,
  First = 5,
  Second = 6,
}

export const LayerCacheMap: Record<LayerIndex, Record<string, LayerMapItem>> = {
  [LayerIndex.Zero]: {},
  [LayerIndex.First]: {},
  [LayerIndex.Second]: {},
};

export function CreateAddLayerCache(
  type: LayerIndex,
  name: string,
  layer: Vector<any>
) {
  if (type > LayerIndex.First) {
    layer.setVisible(false);
  }

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
