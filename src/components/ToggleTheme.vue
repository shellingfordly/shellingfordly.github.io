<script setup lang="ts">
import { toggleDark } from "~/logics";
</script>

<template>
  <a class="select-none" title="Toggle Color Scheme" @click="toggleDark">
    <div class="i-carbon-sun dark:i-carbon-moon" />
  </a>
</template>
