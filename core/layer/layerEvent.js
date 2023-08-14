import { transformExtent } from "ol/proj";
import { AddLayer, RemoveLayer } from "./provinceLayer";
import { intersects } from "ol/extent";
import { ProvinceScope } from "/data/province";

export function addEventListener(map, event) {
  map.getView().on(event, function (event) {
    const mapView = event.target;
    const zoom = event.target.getZoom(); // 获取新的缩放级别

    if (zoom > 7) {
      const currentExtent = mapView.calculateExtent(map.getSize()); // 正确的方法

      const transformedExtent = transformExtent(
        currentExtent,
        mapView.getProjection(),
        "EPSG:4326"
      );

      for (const key in ProvinceScope) {
        const city = ProvinceScope[key];
        const isCityInView = intersects(city, transformedExtent);
        if (isCityInView) {
          AddLayer(map, key);
        } else {
          RemoveLayer(map, key);
        }
      }
    } else {
      for (const key in ProvinceScope) {
        RemoveLayer(map, key);
      }
    }
  });
}
