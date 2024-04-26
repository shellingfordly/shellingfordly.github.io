<script lang="ts" setup>
defineProps<{ srcList: string[] }>();
</script>

<template>
  <client-only>
    <div
      class="w-full py-5 px5 grid grid-cols-2 lt-sm:grid-cols-1 gap-5 bg-[var(--c-container)] border-rd-5"
    >
      <div v-for="src in srcList">
        <img class="max-w-full m-a mb-0! mt-0!" v-lazy="src" />
      </div>
    </div>
  </client-only>
</template>

<style lang="less" scoped>
img[lazy="loading"] {
  width: 24px;
  height: 24px;
}
img[lazy="error"] {
  width: auto;
  height: 50px;
}
</style>
