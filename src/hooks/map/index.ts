import { CheckBrowserEnvironment } from "~/utils";
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

function CreateMap() {
  const { center, zoom, minZoom, maxZoom, extent } = MAP_DEFAULT_OPTIONS;
  const map = new Map({
    target: "map",
    layers: [],
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

  CheckBrowserEnvironment();

  function InitMap() {
    map.value = CreateMap();

    SetupBaseLayer(map.value);

    SetupProvinceLayer(map.value);

    SetupMarkerLayer(map.value);

    SetupEventListener(map.value);

    SetupLayerStyle();
  }

  return { map, InitMap };
}
