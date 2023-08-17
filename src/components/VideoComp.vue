<script setup lang="ts">
defineProps<{ src: string }>();
</script>

<template>
  <div>
    <video controls autoplay loop>
      <source :src="src" type="video/mp4" />
      你的浏览器不支持浏览此视频.
    </video>
  </div>
</template>

<style lang="less" scoped>
div {
  display: flex;
  align-content: center;
  background-color: black;
  border-radius: 20px;

  video {
    max-width: 500px;
    margin: auto;
    height: 300px;
  }
}
</style>
