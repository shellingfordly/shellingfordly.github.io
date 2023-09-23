<script setup lang="ts">
defineProps<{
  list: ProjectInfoItem[];
}>();
</script>

<template>
  <div class="sm:w-[90%] p-5 pt-10 flex flex-wrap justify-between m-a">
    <template v-for="info in list" :info="item">
      <div class="article_item md:w-[48%] lg:w-[32%] w-full pb-20 mb-8">
        <a class="cursor-pointer" :href="info.path" target="_blank">
          <client-only>
            <img class="w-100% h-30vh" v-lazy="info.img" />
          </client-only>
        </a>
        <div class="">
          <p class="p-5 font-size-6 op90 hover:op100">
            <a class="hvr-underline-reveal" :href="info.path" target="_blank">
              {{ info.title }}
            </a>
          </p>
          <p class="p-3 pt-0 op70">{{ info.desc }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.hvr-underline-reveal::before {
  background: var(--c-bg-r);
  opacity: 0.6;
  height: 2px;
}
.article_item {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  padding: 6px;

  &:hover::before {
    background-image: conic-gradient(
      transparent,
      var(--c-bg-r),
      transparent 30%
    );
    animation: rotate 1s linear infinite;
  }

  &::before {
    content: "";
    position: absolute;
    z-index: -2;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-color: #8884;
    background-repeat: no-repeat;
    background-position: 0 0;
  }

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    left: 2px;
    top: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    background: var(--c-bg);
    border-radius: 2px;
  }

  img {
    border-radius: 5px;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(1turn);
  }
}
</style>
