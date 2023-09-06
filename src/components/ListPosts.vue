<script setup lang="ts">
import moment from "moment";
import { CreateArticleData } from "~/utils";

const route = useRoute();
const props = defineProps<{ type?: string; tag?: string }>();
const tag = computed(
  () => route.query?.tag?.toString().toLowerCase() || props.tag
);
const type = computed(
  () => route.query?.type?.toString().toLowerCase() || props.type
);
const data = ref();
watch(
  [tag, type],
  () => {
    data.value = CreateArticleData({ tag: tag.value, type: type.value });
  },
  { immediate: true }
);
</script>

<template>
  <div class="w-full">
    <div class="w-full posts-collapse">
      <template v-for="item in data">
        <div class="collection-title">
          <h1 class="year">{{ item.year }}</h1>
        </div>
        <div
          class="post-header w-full"
          v-for="article in item.list"
          @click="$router.push(article.route)"
        >
          <span class="mr-5">
            {{ moment(article.date).format("YY-MM-DD") }}
          </span>
          <span class="mr-5">{{ article.title }}</span>
          <span class="tag mr-1" v-for="tag in article.tags">{{ tag }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.posts-collapse {
  --collapse-bg: #f5f5f5;
  --before-bg: #bbb;
  --before-bg-hover: #222;
  --header-border: #ccc;
  --tag-bg: #eee;
}

html.dark {
  .posts-collapse {
    --collapse-bg: #8884;
    --before-bg: #666;
    --before-bg-hover: #999;
    --header-border: #333;
    --tag-bg: #222;
  }
}

.posts-collapse {
  position: relative;

  &::after {
    content: " ";
    position: absolute;
    top: 20px;
    left: 0;
    margin-left: -2px;
    width: 4px;
    height: 100%;
    background: var(--collapse-bg);
    z-index: -1;
  }

  // 标题
  .collection-title {
    position: relative;
    padding: 3rem 2rem;

    .year {
      margin: 0;
      padding: 0;
      color: inherit;
    }

    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%;
      margin-left: -4px;
      margin-top: -4px;
      width: 8px;
      height: 8px;
      background: var(--before-bg);
      border-radius: 50%;
    }
  }

  // 文章
  .post-header {
    position: relative;
    padding: 1rem;
    padding-left: 2rem;
    border-bottom: 1px dashed var(--header-border);
    cursor: pointer;

    .tag {
      color: var(--before-bg);
      font-size: 12px;
      background-color: var(--tag-bg);
      padding: 2px 3px;
      border-radius: 2px;
    }

    &:hover {
      border-bottom-color: var(--before-bg-hover);
      color: var(--c-bg-r);
    }

    &:hover::before {
      background: var(--before-bg-hover);
      scale: 1.2;
    }

    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%;
      width: 6px;
      height: 6px;
      margin-left: -3px;
      background: var(--before-bg);
      border-radius: 50%;
      border: 1px solid var(--c-bg);
      transition: all 0.2s ease-in-out;
    }
  }
}
</style>
