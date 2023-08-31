<script setup lang="ts">
import { SetupMap } from "~/hooks/map";

const { InitMap } = SetupMap();

onMounted(InitMap);
</script>

<template>
  <div id="map" class="w-full h-full"></div>
  <div id="map_marker_preview">
    <img />
    <div class="info">
      <div class="title" />
      <div class="desc" />
      <div class="date" />
    </div>
  </div>
</template>
