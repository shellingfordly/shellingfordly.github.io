<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <button
    title="Scroll to top"
    class="w-10 h-10 op30 hover:op100 rounded-full hover-bg-hex-8883 transition duration-300 z-100 print:hidden"
  >
    <div :class="name" />
  </button>
</template>
