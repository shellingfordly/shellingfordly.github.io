<script setup lang="ts">
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import { CreateBaseLayer, AddEventListener, SetupMarker } from "~/core";

const DefaultOptions = {
  center: [120.1552, 30.2741],
  zoom: 4,
  minZoom: 3,
  maxZoom: 15,
};

onMounted(() => {
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

  AddEventListener(map, "change:resolution");
});
</script>

<template>
  <div id="map"></div>
  <div id="preview-container" class="preview-container"></div>
</template>
