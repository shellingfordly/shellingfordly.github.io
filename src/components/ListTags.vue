<script setup lang="ts">
import { PageTagList, isDark } from "~/utils";

const tags = computed(() =>
  [...PageTagList].sort((a, b) => a.length - b.length)
);

const random = () => Math.random() * 255;
const colors = computed(() =>
  tags.value.map((_) => `rgba(${random()},${random()},${random()}, 0.4)`)
);

const show = ref(false);
</script>

<template>
  <div
    class="lg:absolute lg:w-20vw lg:p-5 lg:right-0 lg:top-30 overflow-hidden"
  >
    <div
      class="i-carbon-tag cursor-pointer opacity-60 hover:opacity-100 z-100"
      @click="show = !show"
    ></div>

    <div
      :class="`lt-lg:display-none flex flex-wrap mt-5 tab_box 
      ${show ? 'op100 display-flex!' : 'op0!'}`"
    >
      <span
        class="tag mb-3 mr-3 opacity-60 hover:opacity-100"
        v-for="(tag, i) in tags"
        :style="{ backgroundColor: colors[i] }"
        @click="$router.push(`/blog?tag=${tag}`)"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab_box {
  transition: all 0.3s ease-in;
}

.tag {
  padding: 3px 5px;
  border-radius: 2px;
  cursor: pointer;
}
</style>
