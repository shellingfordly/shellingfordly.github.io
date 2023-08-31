<script setup lang="ts">
import { homeBgUrl } from "~/hooks/useHomeBg";
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
    :class="`relative w-full flex justify-center h-[calc(100vh-70px)] bg-fixed bg-no-repeat bg-cover`"
    :style="{ backgroundImage: homeBgUrl }"
  >
    <div
      class="relative top-35% h-16 hvr-wobble-horizontal hvr-underline-from-center"
      @click="$router.push('/blog')"
    >
      <h1 class="title sm:font-size-8 font-size-6">人生本就是一场孤独的旅行_</h1>
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
  <div class="h-2000 p-4 pt-10">
    <div class="sm:w-[90%] flex flex-wrap justify-between m-a">
      <article-item
        v-for="item in HomeContentList"
        :info="item"
        @click="$router.push(item.path)"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.hvr-underline-from-center:before {
  background-color: #eee;
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

@keyframes typing {
  form {
    width: 1ch;
  }
  to {
    width: 21.5ch;
  }
}
</style>
