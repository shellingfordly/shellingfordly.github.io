import { Feature, Style, Text, Fill, Stroke } from "~/ol-imports";

export function CreateLayerStyle(feature: any) {
  const text = new Text({
    text: feature.get("name"),
    fill: new Fill({ color: "white" }),
    stroke: new Stroke({ color: "black", width: 1 }),
  });

  const stroke = new Stroke({
    color: feature.get("name") === "中国" ? "transparent" : "#ddd",
    width: 1,
  });

  return [
    new Style({
      text,
      stroke,
    }),
  ];
}
