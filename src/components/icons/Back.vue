<script lang="ts" setup>
const route = useRoute();
const isArticlePage = computed(() => !!(route.meta.frontmatter as any)?.title);
</script>

<template>
  <div
    v-if="isArticlePage"
    class="pt-8 pb-8 lt-sm:p-30px md:w-80vw lg:w-60vw m-a"
  >
    <a href="#" class="button hvr-grow" @click="$router.back()">
      <div class="i-carbon-arrow-left mr-2"></div>
      <span>Back</span>
    </a>
  </div>
</template>
