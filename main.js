import "./style.css";
import { Map, View } from "ol";
import { fromLonLat, transformExtent } from "ol/proj";
import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Style, Text, Fill, Stroke } from "ol/style";
import { AddLayer } from "./core/cityLayer";
import { createEmpty, extend, intersects } from "ol/extent";
import { ProvinceScope } from "./data/province";

const map = new Map({
  target: "map",
  layers: [],
  view: new View({
    center: fromLonLat([120.1552, 30.2741]),
    zoom: 4,
    minZoom: 3,
    maxZoom: 10,
  }),
});

// * 底图层

const vectorLayer = new Vector({
  source: new SourceVector({
    url: "./geojson/all.json",
    format: new GeoJSON(),
  }),
});

map.addLayer(vectorLayer);

const textStyle = function (feature) {
  return new Style({
    text: new Text({
      text: feature.get("name"), // 假设GeoJSON属性中有名为 'name' 的属性来表示城市名称
      font: "12px Arial",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  });
};

const defaultStyle = new Style({
  stroke: new Stroke({
    color: "#ddd",
    width: 1,
  }),
});

vectorLayer.setStyle(function (feature, resolution) {
  return [textStyle(feature), defaultStyle];
});


map.getView().on("change", function (event) {
  const mapView = event.target;
  const zoom = event.target.getZoom(); // 获取新的缩放级别
  if (zoom < 7) return;

  const currentExtent = mapView.calculateExtent(map.getSize()); // 正确的方法

  const transformedExtent = transformExtent(
    currentExtent,
    mapView.getProjection(),
    "EPSG:4326"
  );

  const cityList = [];
  for (const key in ProvinceScope) {
    const city = ProvinceScope[key];
    const isCityInView = intersects(city, transformedExtent);
    if (isCityInView) {
      console.log(key);
      cityList.push(key);
    }
  }
});
