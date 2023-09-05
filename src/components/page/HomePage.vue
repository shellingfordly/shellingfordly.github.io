<script setup lang="ts">
import { homeBgUrl } from "~/hooks/useHomeBg";

function toBot() {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth",
  });
}
</script>
<template>
  <div
    :class="`relative w-full flex justify-center h-[var(--v-height)] bg-fixed bg-no-repeat bg-cover`"
    :style="{ backgroundImage: homeBgUrl }"
  >
    <div
      class="relative top-35% h-16 hvr-wobble-horizontal hvr-underline-from-center"
      @click="$router.push('/blog')"
    >
      <h1 class="title sm:font-size-8 font-size-6">
        人生本就是一场孤独的旅行_
      </h1>
    </div>
    <div class="w-full z-100 absolute left-0 bottom-0">
      <wave-icon />
      <div
        class="w-full h-[10vh] bg-[var(--c-bg)] flex items-center justify-center"
      >
        <scroll-btn name="i-carbon-arrow-down" @click="toBot()" />
      </div>
    </div>
  </div>
  <home-item />
</template>

<style lang="less" scoped>
.hvr-underline-from-center:before {
  background-color: #eee;
}
@keyframes typing {
  from {
    width: 1ch;
  }
  to {
    width: 21.5ch;
  }
}
.title {
  width: 1ch;
  height: 4rem;
  line-height: 4rem;
  font-weight: 300;
  color: #eee;
  overflow: hidden;
  animation: 1.5s typing ease-in-out forwards;
}
</style>
