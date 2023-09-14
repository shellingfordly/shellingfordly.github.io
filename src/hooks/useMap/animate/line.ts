import { LineString, Feature, Style, Stroke } from "~/ol-imports";
import { interpolatePoints } from "./points";
import { CreateMapMarkerData } from "~/utils";
import { START_POINT } from "../config";

export function CreateLineFeatures() {
  const features: Record<string, Feature> = {};
  const markers = CreateMapMarkerData();

  markers
    .filter((m) => !!m.coords)
    .forEach((marker) => {
      const coords = interpolatePoints(START_POINT, marker.coords, 100);

      const feature = new Feature({
        geometry: new LineString(coords),
      });
      feature.setStyle(CreateLineStyle());
      features[marker.route] = feature;
    });

  return features;
}

function CreateLineStyle() {
  // 创建随机颜色
  const random = () => Math.floor(Math.random() * 100) + 150;
  const color = `rgb(${random()},${random()},${random()})`;

  return new Style({
    stroke: new Stroke({
      color,
      width: 4,
      lineDash: [5, 10],
    }),
  });
}
