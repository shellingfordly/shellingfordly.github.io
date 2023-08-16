import "./windows";
import { Map, View, fromLonLat } from "~/ol-imports";
import {
  SetupBaseLayer,
  SetupProvinceLayer,
  SetupEventListener,
} from "./layer";
import { SetupMarkerLayer } from "./marker";

const DefaultOptions = {
  center: [120.1552, 30.2741],
  zoom: 4,
  minZoom: 3,
  maxZoom: 15,
};

function CreateMap() {
  return new Map({
    target: "map",
    layers: [],
    view: new View({
      center: fromLonLat(DefaultOptions.center),
      zoom: DefaultOptions.zoom,
      minZoom: DefaultOptions.minZoom,
      maxZoom: DefaultOptions.maxZoom,
    }),
  });
}

export function SetupMap() {
  const map = ref<Map>();

  function InitMap() {
    map.value = CreateMap();

    SetupBaseLayer(map.value);

    SetupProvinceLayer(map.value);

    SetupMarkerLayer(map.value);

    SetupEventListener(map.value);
  }

  return { map, InitMap };
}
