<script setup lang="ts">
import { SetupMap } from "~/hooks/useMap";

const { InitMap, control } = SetupMap();

onMounted(InitMap);
</script>

<template>
  <div id="map" class="relative w-full h-full">
    <div
      class="flex flex-col b-b-0 absolute z-100 top-2 left-2 bg-[var(--c-bg)]"
    >
      <div
        class="p-2 b-1 mt-1 cursor-pointer font-size-12px hover:bg-[var(--c-container)] hover:op-100!"
        :class="item.active ? 'op-100! bg-[var(--c-container)]' : 'op-80'"
        v-for="item in control"
        @click="item.active = !item.active"
      >
        <div :class="item.icon"></div>
      </div>
    </div>
  </div>
  <div id="map_marker_preview">
    <div class="img_box">
      <img />
    </div>
    <div class="info">
      <div class="title" />
      <div class="desc" />
      <div class="date" />
    </div>
  </div>
</template>
