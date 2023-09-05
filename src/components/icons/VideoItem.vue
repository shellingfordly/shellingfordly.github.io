<script setup lang="ts">
defineProps<{ src: string }>();
</script>

<template>
  <div class="flex-center border-rd-5 bg-[var(--c-container)]">
    <video class="margin-auto ma sm:max-w-500px max-h-400px" controls>
      <source :src="src" type="video/mp4" />
      你的浏览器不支持浏览此视频.
    </video>
  </div>
</template>
