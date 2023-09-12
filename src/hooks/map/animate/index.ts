import { SourceVector, Vector, Feature, Map } from "~/ol-imports";
import { MarkerPreview } from "../marker/preview";
import { InteractionEvent } from "../marker/interaction";
import { PlayIconAnimate } from "./animate";
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

function addEvent(
  event: InteractionEvent,
  preview: MarkerPreview,
  source: SourceVector,
  features: Record<string, Feature>
) {
  let feature = features?.[preview?.information?.route as string];
  if (!feature) return;

  if (event.hit) {
    PlayIconAnimate(event, source, feature);
    feature && source.addFeature(feature);
  } else {
    feature && source.removeFeature(feature);
  }
}
