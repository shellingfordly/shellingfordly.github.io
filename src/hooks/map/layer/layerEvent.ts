import { transformExtent, intersects, Map } from "~/ol-imports";
import { PROVINCE_SCOPE } from "~/data/province";
import { EPSG4326 } from "../config";
import { LayerCacheMap } from ".";

export function SetupEventListener(map: Map) {
  ChangeResolutionListener(map);
}

export function ChangeResolutionListener(map: Map) {
  map.getView().on("change", function (event) {
    const mapView = event.target;
    const zoom = event.target.getZoom(); // 获取新的缩放级别

    if (zoom > 7) {
      const currentExtent = mapView.calculateExtent(map.getSize()); // 正确的方法

      const transformedExtent = transformExtent(
        currentExtent,
        mapView.getProjection(),
        EPSG4326
      );

      for (const key in PROVINCE_SCOPE) {
        const extent = PROVINCE_SCOPE[key];
        const isCityInView = intersects(extent, transformedExtent);
        const layerCache = LayerCacheMap.second[key];
        if (!layerCache || layerCache.layer) continue;

        const layer = layerCache.layer;
        if (isCityInView) {
          if (!layer.getVisible()) layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    } else {
      for (const key in PROVINCE_SCOPE) {
        const layerCache = LayerCacheMap.second[key];
        if (layerCache && layerCache.layer) layerCache.layer.setVisible(false);
      }
    }
  });
}
