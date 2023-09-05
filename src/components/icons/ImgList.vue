<script setup lang="ts">
const props = defineProps<{
  col: number; // 列
}>();

const homeBgUrlList = [
  "/images/home/bg_1.png",
  "/images/home/bg_2.png",
  "/images/home/bg_3.png",
  "/images/home/bg_4.png",
  "/images/home/bg_5.png",
  "/images/home/bg_6.png",
  "/images/home/bg_7.png",
  "/images/home/bg_8.png",
];

const containerStyle = computed(() => ({
  "grid-template-columns": `repeat(auto-fill, ${100 / props.col}%)`,
}));
</script>

<template>
  <div class="container" :style="containerStyle">
    <img class="w-full h-full" v-for="url in homeBgUrlList" :src="url" alt="" />
  </div>
</template>

<style lang="less" scoped>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 33.33%);
}
</style>
