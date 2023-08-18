import { ProvinceLayerMap } from "./provinceLayer";
import { transformExtent, intersects, Map } from "~/ol-imports";
import { PROVINCE_SCOPE } from "~/data/province";
import { EPSG } from "~/constants";

export function SetupEventListener(map: Map) {
  ChangeResolutionListener(map);
}

export function ChangeResolutionListener(map: Map) {
  map.getView().on("change:resolution", function (event) {
    const mapView = event.target;
    const zoom = event.target.getZoom(); // 获取新的缩放级别

    if (zoom > 7) {
      const currentExtent = mapView.calculateExtent(map.getSize()); // 正确的方法

      const transformedExtent = transformExtent(
        currentExtent,
        mapView.getProjection(),
        EPSG
      );

      for (const key in PROVINCE_SCOPE) {
        const extent = PROVINCE_SCOPE[key];
        const isCityInView = intersects(extent, transformedExtent);
        const layer = ProvinceLayerMap[key];
        if (!layer) continue;

        if (isCityInView) {
          if (!layer.getVisible()) layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    } else {
      for (const key in PROVINCE_SCOPE) {
        const layer = ProvinceLayerMap[key];
        if (layer) layer.setVisible(false);
      }
    }
  });
}
