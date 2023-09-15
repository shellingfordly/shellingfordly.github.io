<script setup lang="ts">
import { homeBgUrl } from "~/hooks/useHomeBg";

type ContentType = "icon" | "img-list" | "img";

interface HomeContent {
  title: string;
  subtitle: string;
  type: ContentType;
  list: string[];
}

defineProps<{ content: HomeContent[] }>();

const className = (type: ContentType) => {
  switch (type) {
    case "icon":
      return "icon_box";
    case "img-list":
      return "img_box";
    default:
      return "";
  }
};

function toBot() {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth",
  });
}
</script>
<template>
  <client-only>
    <div
      :class="`bg_box relative w-full flex justify-center h-[var(--v-height)] bg-fixed bg-no-repeat bg-cover`"
      v-lazy:background-image="{ src: homeBgUrl, error: '', loading: '' }"
    >
      <div
        class="relative top-35% h-16 hvr-wobble-horizontal hvr-underline-from-center"
        @click="$router.push('/blog')"
      >
        <h1 class="title sm:font-size-8 font-size-6">
          人生本就是一场孤独的旅行_
        </h1>
      </div>
      <div class="w-full z-100 absolute left-0 bottom-0">
        <wave-icon />
        <div
          class="w-full h-[10vh] bg-[var(--c-bg)] flex items-center justify-center"
        >
          <scroll-btn name="i-carbon-arrow-down" @click="toBot()" />
        </div>
      </div>
    </div>

    <!-- * content -->
    <div class="home-item" v-for="(item, i) in content">
      <div class="content" :class="i % 2 != 0 && 'bg-[var(--c-bg)]!'">
        <div class="desc">
          <p class="name">{{ item.title }}</p>
          <p class="subtitle">{{ item.subtitle }}</p>
          <a
            class="btn hvr-shutter-out-horizontal bg-#8884"
            href="/blog?type=blog"
          >
            查看更多
          </a>
        </div>
        <div class="left" :class="className(item.type)">
          <div v-if="item.type == 'icon'" v-for="icon in item.list">
            <div :class="icon" class="hvr-pulse-grow"></div>
          </div>

          <template v-if="item.type == 'img-list'">
            <img class="w-full h-full" v-for="url in item.list" v-lazy="url" />
          </template>
          <template v-if="item.type == 'img'">
            <img
              class="m-a lt-sm:h-a lt-lg:h-400px lg:w-400px"
              v-lazy="item.list[0]"
            />
          </template>
        </div>
      </div>
    </div>
  </client-only>
</template>

<style lang="less" scoped>
.bg_box[lazy="loading"],
.bg_box[lazy="error"] {
  background-size: 0;
}

.hvr-underline-from-center:before {
  background-color: #eee;
}
@keyframes typing {
  from {
    width: 1ch;
  }
  to {
    width: 21.5ch;
  }
}
.title {
  width: 1ch;
  height: 4rem;
  line-height: 4rem;
  font-weight: 300;
  color: #eee;
  overflow: hidden;
  animation: 1.5s typing ease-in-out forwards;
}

// home item

.home-item .icon_box {
  grid-template-columns: repeat(auto-fill, 25%);

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    height: 80px;
    font-size: 30px;

    @media (min-width: 1024px) {
      height: 160px;
    }
  }
}

.home-item .img_box {
  grid-template-columns: repeat(auto-fill, 33%);
  img {
    height: 120px;
    @media (min-width: 1024px) {
      height: 160px;
    }
  }
}

.home-item {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--c-scrollbar);

    .desc {
      text-align: center;

      .name {
        font-size: 36px;
        padding-top: 50px;
      }

      .subtitle {
        font-size: 18px;
        padding: 25px;
      }

      .btn {
        font-size: 12px;
        cursor: pointer;
        padding: 5px 20px;
      }
    }
    .left {
      display: grid;
      width: 80%;
      margin: 60px auto 0;
      padding: 0;
      overflow: hidden;
    }

    @media (min-width: 640px) {
      .desc {
        .name {
          font-size: 50px;
        }

        .subtitle {
          font-size: 20px;
          padding: 20px 0 50px;
        }

        .btn {
          font-size: 16px;
        }
      }

      .left {
        padding: 0 80px;
      }
    }

    @media (min-width: 1024px) {
      width: 75%;
      .desc {
        text-align: left;

        .name {
          font-size: 5rem;
          padding: 5rem;
          line-height: 5rem;
        }

        .subtitle {
          font-size: 2rem;
          padding: 5rem;
        }

        .btn {
          font-size: 1rem;
          margin-left: 5rem;
          padding: 1.25rem;
        }
      }

      .left {
        position: absolute;
        top: 50%;
        right: -240px;
        width: 480px;
        margin-top: -240px;
      }
    }
  }
}
</style>
