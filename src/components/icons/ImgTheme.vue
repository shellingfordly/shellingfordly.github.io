<script setup lang="ts">
import { isDark } from "~/utils";

const props = defineProps<{ dark: string; light: string }>();

const url = computed(() => (isDark.value ? props.dark : props.light));
</script>
<template>
  <client-only>
    <img class="ma" v-lazy="url" />
  </client-only>
</template>
