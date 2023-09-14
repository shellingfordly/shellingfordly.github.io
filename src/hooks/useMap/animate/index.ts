import { SourceVector, Vector, Feature, Map } from "~/ol-imports";
import { MarkerPreview } from "../marker/preview";
import { InteractionEvent } from "../marker/interaction";
import { AddPlaneFeature } from "./plane";
import { CreateLineFeatures } from "./line";
import { lineOpen } from "../control";

export function SetupLineLayer(map: Map, preview: MarkerPreview) {
  const features = CreateLineFeatures();

  const source = new SourceVector();
  const layer = new Vector({ source });
  map.addLayer(layer);

  const eventFunc = (event: InteractionEvent) => {
    addEvent(event, preview, source, features);
  };

  watch(
    lineOpen,
    (open) => {
      if (open) preview.addEvent(eventFunc);
      else preview.removeEvent(eventFunc);
    },
    { immediate: true }
  );
}

let lastLineFeature: Feature;

function addEvent(
  event: InteractionEvent,
  preview: MarkerPreview,
  source: SourceVector,
  features: Record<string, Feature>
) {
  const key = preview?.information?.route;
  if (!key) {
    lastLineFeature && source.removeFeature(lastLineFeature);
    return;
  }
  let feature = features[key];
  lastLineFeature = feature;

  if (event.hit) {
    AddPlaneFeature(event, source, feature);
    feature && source.addFeature(feature);
  }
}
