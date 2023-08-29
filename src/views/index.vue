<script setup lang="ts">
function toBot() {
  window.scrollTo({
    left: 0,
    top: document.body.clientHeight,
    behavior: "smooth",
  });
}
</script>
<template>
  <div class="relative w-full h-[90vh] bg-[url(/bg.jpg)] bg-no-repeat bg-cover">
    <div class="w-full z-100 absolute left-0 bottom-0">
      <home-bottom />
      <div
        class="w-full h-20 bg-[var(--c-bg)] flex items-center justify-center"
      >
        <scroll-btn name="i-carbon-arrow-down" @click="toBot()" />
      </div>
    </div>
  </div>
  <div class="h-2000 p-20px">content</div>
</template>
