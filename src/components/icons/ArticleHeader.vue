<script lang="ts" setup>
import moment from "moment";

const route = useRoute();
const date = computed(() => (route.meta.frontmatter as any)?.date);
</script>

<template>
  <div
    class="flex justify-between pt-8 pb-8 lt-sm:p-30px md:w-80vw lg:w-60vw m-a"
  >
    <a href="#" class="button hvr-grow" @click="$router.back()">
      <div class="i-carbon-arrow-left mr-2"></div>
      <span>Back</span>
    </a>
    <div class="font-size-1 op-60">
      <span class="mr-1">
        {{ moment(date).format("YYYY/MM/DD") }}
      </span>
      <div class="i-carbon-view font-size-3 mr-1"></div>
      <span id="busuanzi_value_page_pv">0</span>
    </div>
  </div>
</template>
