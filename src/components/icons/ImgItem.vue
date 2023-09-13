<script setup lang="ts">
defineProps<{ src: string }>();
</script>

<template>
  <div class="flex-center border-rd-5 bg-[var(--c-container)]">
    <img
      class="ma! mt-0! mb-0! sm:max-w-500px max-h-400px w-auto!"
      :src="src"
    />
  </div>
</template>
