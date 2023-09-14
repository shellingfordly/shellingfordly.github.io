<script setup lang="ts">
defineProps<{ src: string }>();
</script>

<template>
  <div class="p-3 min-h-10 border-rd-5 bg-[var(--c-container)]">
    <img
      class="ma! mt-0! mb-0! sm:max-w-500px max-h-300px w-auto!"
      v-lazy="src"
    />
  </div>
</template>
