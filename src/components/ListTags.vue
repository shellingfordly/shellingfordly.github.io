<script setup lang="ts">
import { PageTagList } from "~/utils";

const tags = computed(() =>
  [...PageTagList].sort((a, b) => a.length - b.length)
);

const random = () => Math.random() * 255;
const color = () => `rgba(${random()},${random()},${random()}, 0.3)`;

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

    <Transition>
      <div
        v-show="show"
        :class="`flex flex-wrap mt-5 tab_box ${show ? 'op100' : 'op0!'}`"
      >
        <span
          class="tag mb-3 mr-3 opacity-60 hover:opacity-100"
          v-for="tag in tags"
          :style="{ backgroundColor: color() }"
          @click="$router.push(`/blog?tag=${tag}`)"
        >
          {{ tag }}
        </span>
      </div>
    </Transition>
  </div>
</template>

<style lang="less" scoped>
.tab_box {
  transition: all 1s linear;
}

.tag {
  padding: 3px 5px;
  border-radius: 2px;
  cursor: pointer;
}
</style>
