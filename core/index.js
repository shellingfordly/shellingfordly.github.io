import { transformExtent } from "ol/proj";
import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Text, Fill, Stroke } from "ol/style";
import { AddLayer, RemoveLayer } from "./provinceLayer";
import { intersects } from "ol/extent";
import { ProvinceScope } from "../data/province";
export * from "./markPoint";

export function CreateBaseLayer(map) {
  const vectorLayer = new Vector({
    source: new SourceVector({
      url: "./geojson/all.json",
      format: new GeoJSON(),
    }),
  });
  map.addLayer(vectorLayer);

  // * 样式
  const textStyle = function (feature) {
    return new Style({
      text: new Text({
        text: feature.get("name"), // 假设GeoJSON属性中有名为 'name' 的属性来表示城市名称
        font: "12px Arial",
        fill: new Fill({ color: "black" }),
        stroke: new Stroke({ color: "white", width: 2 }),
      }),
    });
  };
  const defaultStyle = new Style({
    stroke: new Stroke({
      color: "#ddd",
      width: 1,
    }),
  });
  vectorLayer.setStyle(function (feature, resolution) {
    return [textStyle(feature), defaultStyle];
  });
}

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
