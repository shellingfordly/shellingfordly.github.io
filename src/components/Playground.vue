<script setup lang="ts">
const show = ref(false);
</script>

<template>
  <div>
    <div inline-block cursor-pointer @click="show = !show" title="查看演示">
      <div i-material-symbols-light:preview />
      <span text-sm select-none>Preview</span>
    </div>
    <div class="grid gap-2" :class="[show ? 'grid-cols-2' : 'grid-cols-1']">
      <div>
        <slot />
      </div>
      <div v-show="show" class="my2 p5 rounded bg-[#fafafa] dark:bg-[#0e0e0e]">
        <slot name="html" />
      </div>
    </div>
  </div>
</template>
