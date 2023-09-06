<script lang="ts" setup>
import moment from "moment";

const route = useRoute();
const filterList = ["/", "/blog", "/travel", "/projects"];
const isArticlePage = computed(() => !filterList.includes(route.path));

const date = computed(() => (route.meta.frontmatter as any)?.date);
</script>

<template>
  <div
    v-if="isArticlePage"
    class="flex justify-between pt-8 pb-8 lt-sm:p-30px md:w-80vw lg:w-60vw m-a"
  >
    <a href="#" class="button hvr-grow" @click="$router.back()">
      <div class="i-carbon-arrow-left mr-2"></div>
      <span>Back</span>
    </a>
    <div class="font-size-12px op-60">
      <span class="mr-1">
        {{ moment(date).format("YYYY/MM/DD") }}
      </span>
      <div class="i-carbon-view mr-1"></div>
      <span id="busuanzi_value_page_pv">0</span>
    </div>
  </div>
</template>
