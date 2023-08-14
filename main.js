import "./style.css";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import { CreateBaseLayer, addEventListener, SetupMarker } from "./core";
import "./core/windows";

const DefaultOptions = {
  center: [120.1552, 30.2741],
  zoom: 4,
  minZoom: 3,
  maxZoom: 15,
};

const map = new Map({
  target: "map",
  layers: [],
  view: new View({
    center: fromLonLat(DefaultOptions.center),
    zoom: DefaultOptions.zoom,
    minZoom: DefaultOptions.minZoom,
    maxZoom: DefaultOptions.maxZoom,
  }),
});

CreateBaseLayer(map);

SetupMarker(map);

addEventListener(map, "change:resolution");
