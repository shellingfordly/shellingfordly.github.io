<script lang="ts" setup>
const props = defineProps<{ srcList: string[] }>();

const left = computed(() => props.srcList.slice(0, props.srcList.length / 2));
const right = computed(() => props.srcList.slice(props.srcList.length / 2));
</script>

<template>
  <client-only>
    <div
      class="w-full pt-5 flex bg-[var(--c-container)] border-rd-5 text-center"
    >
      <div class="w-50%">
        <div v-for="src in left">
          <img class="max-w-full m-a mb-5! mt-0!" v-lazy="src" />
        </div>
      </div>
      <div class="w-50%">
        <div v-for="src in right">
          <img class="max-w-full m-a mb-5! mt-0!" v-lazy="src" />
        </div>
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
