<script setup lang="ts">
import { SetupMap } from "~/core";

const { InitMap } = SetupMap();

onMounted(InitMap);
</script>

<template>
  <div id="map"></div>
  <div id="preview-container" class="preview-container"></div>
</template>
