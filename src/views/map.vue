<script setup lang="ts">
import { SetupMap } from "~/hooks/map";

const { InitMap } = SetupMap();

onMounted(InitMap);
</script>

<template>
  <div id="map" class="w-full h-full"></div>
  <div id="map_marker_preview">
    <img />
    <div>
      <span class="title" />
      <span class="desc" />
    </div>
  </div>
</template>
