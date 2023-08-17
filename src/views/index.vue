<script setup lang="ts">
import { SetupMap } from "~/core";

const { InitMap } = SetupMap();

onMounted(InitMap);
</script>

<template>
  <nav-bar />
  <div id="map"></div>
  <div id="map_marker_preview">
    <img />
    <div>
      <span class="title" />
      <span class="desc" />
    </div>
  </div>
</template>
