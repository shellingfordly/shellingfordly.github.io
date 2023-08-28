import { transformExtent, intersects, Map } from "~/ol-imports";
import { ALL_EXTENT } from "~/data/province";
import { EPSG4326 } from "../config";
import { LayerCacheMap, LayerIndex } from ".";

export function SetupEventListener(map: Map) {
  ChangeResolutionListener(map);
}

export function ChangeResolutionListener(map: Map) {
  map.getView().on("change", function (event) {
    const mapView = event.target;
    const zoom = event.target.getZoom(); // 获取新的缩放级别
    const currentExtent = mapView.calculateExtent(map.getSize()); // 正确的方法

    const transformedExtent = transformExtent(
      currentExtent,
      mapView.getProjection(),
      EPSG4326
    );

    for (const _index in LayerCacheMap) {
      const index = _index as Any as LayerIndex;
      if (index <= LayerIndex.First) continue;
      
      if (zoom > index) {
        // 显示2级涂层
        for (const key in ALL_EXTENT) {
          const extent = ALL_EXTENT[key];
          const isCityInView = intersects(extent, transformedExtent);
          const layerCache = LayerCacheMap[index][key];
          if (!layerCache || !layerCache.layer) continue;

          const layer = layerCache.layer;
          if (isCityInView) {
            if (!layer.getVisible()) layer.setVisible(true);
          } else {
            layer.setVisible(false);
          }
        }
      } else {
        // 移除2级涂层
        for (const key in ALL_EXTENT) {
          const layerCache = LayerCacheMap[index][key];
          if (layerCache && layerCache.layer)
            layerCache.layer.setVisible(false);
        }
      }
    }
  });
}
