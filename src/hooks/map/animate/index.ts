import {
  LineString,
  SourceVector,
  Vector,
  Feature,
  Map,
  Style,
  Stroke,
} from "~/ol-imports";
import { interpolatePoints } from "./points";
import { CreateMapMarkerData } from "~/utils";
import type { Coordinate } from "ol/coordinate";
import { START_POINT } from "../config";
import { MarkerPreview } from "../marker/preview";

export function SetupLineLayer(map: Map, preview: MarkerPreview) {
  const linesCoords = CreateLinesCoords();
  const vectorLayer = CreateLineLayer(linesCoords, preview);

  map.addLayer(vectorLayer);
}

function CreateLinesCoords() {
  const markers = CreateMapMarkerData();

  return markers
    .filter((m) => !!m.coords)
    .map((marker) => interpolatePoints(START_POINT, marker.coords, 100));
}

function CreateLineLayer(linesCoords: Coordinate[][], preview: MarkerPreview) {
  const features: Feature[] = [];

  linesCoords.forEach((coords) => {
    const feature = new Feature({
      geometry: new LineString(coords),
    });

    feature.setStyle(
      new Style({
        stroke: new Stroke({
          color: CreateRandomColor(),
          width: 4,
          lineDash: [5, 10],
        }),
      })
    );

    features.push(feature);
  });

  preview.addEvent(() => {});

  const vectorSource = new SourceVector({ features });
  const vectorLayer = new Vector({ source: vectorSource });

  return vectorLayer;
}

function CreateRandomColor() {
  // 创建随机颜色
  const random = () => Math.floor(Math.random() * 100) + 150;
  return `rgb(${random()},${random()},${random()})`;
}
