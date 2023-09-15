<script setup lang="ts">
import { isDark } from "~/utils";

const props = defineProps<{ src: string; dark: string; light: string }>();

const url = computed(
  () => props.src || (isDark.value ? props.dark : props.light)
);
</script>
<template>
  <client-only>
    <div class="p-3 min-h-10 border-rd-5 bg-[var(--c-container)]">
      <img
        class="ma! mt-0! mb-0! sm:max-w-500px max-h-300px w-auto!"
        v-lazy="url"
      />
    </div>
  </client-only>
</template>
