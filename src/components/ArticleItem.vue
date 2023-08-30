<script setup lang="ts">
defineProps<{ info: { title: string; desc: string; img: string } }>();
</script>

<template>
  <div class="article_item md:w-[48%] lg:w-[32%] pb-20 mb-8">
    <div class="">
      <img class="w-100%" :src="info.img" />
    </div>
    <div class="p-2">
      <p class="">{{ info.title }}</p>
      <p class="">{{ info.desc }}</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.article_item {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  padding: 6px;

  &:hover::before {
    background-image: conic-gradient(
      transparent,
      var(--c-bg-r),
      transparent 30%
    );
    animation: rotate 1s linear infinite;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -2;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-color: #8884;
    background-repeat: no-repeat;
    background-position: 0 0;
  }

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    left: 2px;
    top: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    background: var(--c-bg);
    border-radius: 2px;
  }

  img {
    border-radius: 5px;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}
</style>
