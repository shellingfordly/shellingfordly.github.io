import { CheckBrowserEnvironment } from "~/utils";
import { Map, View, fromLonLat } from "~/ol-imports";
import {
  SetupBaseLayer,
  SetupProvinceLayer,
  SetupEventListener,
} from "./layer";
import { SetupMarkerLayer } from "./marker";
import { MAP_DEFAULT_OPTIONS } from "./config";

function CreateMap() {
  const { center, zoom, minZoom, maxZoom } = MAP_DEFAULT_OPTIONS;

  return new Map({
    target: "map",
    layers: [],
    view: new View({
      center: fromLonLat(center),
      zoom,
      minZoom,
      maxZoom,
      constrainResolution: true,
    }),
  });
}

export function SetupMap() {
  const map = ref<Map>();

  CheckBrowserEnvironment();

  function InitMap() {
    map.value = CreateMap();

    SetupBaseLayer(map.value);

    SetupProvinceLayer(map.value);

    SetupMarkerLayer(map.value);

    SetupEventListener(map.value);
  }

  return { map, InitMap };
}
