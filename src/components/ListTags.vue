<script setup lang="ts">
import { PageTagList } from "~/utils";

const typeList = [
  {
    name: "Work",
    path: "/blog?type=blog",
  },
  {
    name: "Leetcode",
    path: "/blog?type=leetcode",
  },
  {
    name: "Travel",
    path: "/blog?type=travel",
  },
  {
    name: "Daily",
    path: "/blog?type=daily",
  },
  {
    name: "Read",
    path: "/blog?type=read",
  },
];

const tags = computed(() =>
  [...PageTagList].sort((a, b) => a.length - b.length)
);

const route = useRoute();
const type = computed(() => route.query.type?.toString() || "");
const notice = computed(
  () => (route.meta.frontmatter as Any)?.notice[type.value]
);
const selectedTag = computed(() => route.query.tag?.toString() || "");

const random = () => Math.random() * 255;
const colors = ref<string[]>([]);

watch(
  tags,
  () => {
    if (colors.value.length != tags.value.length) {
      colors.value = tags.value.map(
        (_) => `rgba(${random()},${random()},${random()}, 0.3)`
      );
    }
  },
  { immediate: true, deep: true }
);

const show = ref(false);
</script>

<template>
  <div class="relative flex pt-5 pb-5 lg:pt-10 lt-lg:hidden">
    <div
      class="mr-3 item"
      v-for="item in typeList"
      @click="$router.push(item.path)"
    >
      {{ item.name }}
    </div>
  </div>

  <div class="lg:absolute lg:z-2 lg:w-20vw lg:p-5 lg:right-0 lg:top-0">
    <div class="relative flex items-center pt-5 pb-5 lg:pt-10">
      <div
        class="mr-5 cursor-pointer i-carbon-tag opacity-60 hover:opacity-100 z-100"
        @click="show = !show"
      />
      <div
        class="mr-3 item lg:hidden"
        v-for="item in typeList"
        @click="$router.push(item.path)"
      >
        {{ item.name }}
      </div>
    </div>

    <div
      v-show="show"
      :class="`flex flex-wrap tab_box
      ${show ? 'op100' : 'op0!'}`"
    >
      <span
        :class="`tag mb-3 mr-3 opacity-60 hover:opacity-100 
          ${selectedTag == tag && 'selected'}`"
        v-for="(tag, i) in tags"
        :style="{ backgroundColor: colors[i] }"
        @click="$router.push(`/blog?type=${$route.query?.type}&tag=${tag}`)"
      >
        {{ tag }}
      </span>
    </div>
  </div>
  <blockquote class="m-0!">
    <span v-if="notice">{{ notice }}</span>
    <span v-else>博客不定期更新中...</span>
  </blockquote>
</template>

<style lang="less" scoped>
.item {
  font-size: 16px;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
}

.tab_box {
  transition: all 0.3s ease-in;
}

.tag {
  padding: 3px 5px;
  border-radius: 2px;
  cursor: pointer;
}

.tag.selected {
  opacity: 1;
}
</style>
