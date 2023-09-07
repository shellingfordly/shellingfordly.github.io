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

const random = () => Math.random() * 255;
const colors = computed(() =>
  tags.value.map((_) => `rgba(${random()},${random()},${random()}, 0.4)`)
);

const show = ref(false);
</script>

<template>
  <div class="relative lg:pt-10 pt-5 pb-5 flex lt-lg:hidden">
    <div class="item mr-3" v-for="item in typeList" @click="$router.push(item.path)">
      {{ item.name }}
    </div>
  </div>

  <div class="lg:absolute lg:w-20vw lg:p-5 lg:right-0 lg:top-10 overflow-hidden">
    <div class="relative lg:pt-10 pt-5 pb-5 flex items-center">
      <div class="i-carbon-tag cursor-pointer mr-5 opacity-60 hover:opacity-100 z-100" @click="show = !show" />
      <div class="item mr-3 lg:hidden" v-for="item in typeList" @click="$router.push(item.path)">
        {{ item.name }}
      </div>
    </div>

    <div :class="`flex flex-wrap tab_box 
      ${show ? 'op100' : 'op0!'}`">
      <span v-show="show" class="tag mb-3 mr-3 opacity-60 hover:opacity-100" v-for="(tag, i) in tags"
        :style="{ backgroundColor: colors[i] }" @click="$router.push(`/blog?type=${$route.query?.type}&tag=${tag}`)">
        {{ tag }}
      </span>
    </div>
  </div>
  <blockquote class="m-0!">
    <span v-if="notice">{{ notice }}</span>
    <span v-else>博客迁移中，部分内存未完成...</span>
  </blockquote>
</template>

<style lang="less" scoped>
.item {
  font-size: 18px;
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
</style>
