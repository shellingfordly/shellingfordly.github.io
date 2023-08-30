<script setup lang="ts">
import { HomeContentList } from "~/utils/config";

function toBot() {
  window.scrollTo({
    left: 0,
    top: document.body.clientHeight,
    behavior: "smooth",
  });
}
</script>
<template>
  <div
    class="relative w-full h-[calc(100vh-70px)] bg-[url(/home/bg/bg.jpg)] bg-no-repeat bg-cover"
  >
    <div class="w-full z-100 absolute left-0 bottom-0">
      <wave-icon />
      <div
        class="w-full h-[10vh] bg-[var(--c-bg)] flex items-center justify-center"
      >
        <scroll-btn name="i-carbon-arrow-down" @click="toBot()" />
      </div>
    </div>
  </div>
  <div class="h-2000 p-4 pt-10">
    <div class="sm:w-[90%] flex flex-wrap justify-between m-a">
      <article-item v-for="item in HomeContentList" :info="item" />
    </div>
  </div>
</template>
