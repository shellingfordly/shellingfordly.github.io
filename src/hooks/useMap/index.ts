import { Map, View, fromLonLat, transformExtent } from "~/ol-imports";
import {
  SetupBaseLayer,
  SetupProvinceLayer,
  SetupEventListener,
} from "./layer";
import { SetupMarkerLayer } from "./marker";
import { MAP_DEFAULT_OPTIONS } from "./config";
import { EPSG4326 } from "./config";
import { SetupLayerStyle } from "./style";
import { setupWindowEventListener } from "~/utils/window";
import { SetupLineLayer } from "./animate";

function CreateMap() {
  const { center, zoom, minZoom, maxZoom, extent } = MAP_DEFAULT_OPTIONS;
  const map = new Map({
    target: "map",
    layers: [],
    controls: [],
  });
  map.setView(
    new View({
      center: fromLonLat(center),
      zoom,
      minZoom,
      maxZoom,
      constrainResolution: true,
      extent: transformExtent(extent, EPSG4326, map.getView().getProjection()),
    })
  );
  return map;
}

export function SetupMap() {
  const map = ref<Map>();

  const { listen, watchWindowChange } = setupWindowEventListener();

  function InitMap() {
    map.value = CreateMap();

    // layer
    SetupBaseLayer(map.value);
    SetupProvinceLayer(map.value);

    // marker
    const { preview } = SetupMarkerLayer(map.value, watchWindowChange);
    SetupLineLayer(map.value, preview);

    // map
    SetupEventListener(map.value);
    SetupLayerStyle();

    listen();
  }

  return { map, InitMap };
}
