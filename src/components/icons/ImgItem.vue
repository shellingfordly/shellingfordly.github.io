<script setup lang="ts">
defineProps<{ src: string }>();
</script>

<template>
  <div class="flex-center border-rd-5 bg-[var(--c-container)]">
    <img class="margin-auto ma sm:max-w-500px max-h-400px" :src="src" />
  </div>
</template>
