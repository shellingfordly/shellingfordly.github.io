<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import { homeBgUrlList } from "~/hooks/useHomeBg";
import "swiper/css";

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

  const dom = document.getElementById("home-content")
  if (dom)
    dom.scrollIntoView({ behavior: 'smooth'})
}
</script>
<template>
  <client-only>
    <div class="fixed top-0 left-0 w-full h-[100vh] box-border flex justify-center">
      <swiper :autoplay="{}" :modules="[Autoplay]" style="width: 100%; height: 100%;">
        <swiper-slide class="bg_box w-full h-full bg-fixed bg-no-repeat bg-cover" v-for="url in homeBgUrlList"
          v-lazy:background-image="{ src: url, error: '', loading: '' }">
        </swiper-slide>
      </swiper>
      <div class="absolute top-[35%] h-16 z-100 cursor-pointer hvr-wobble-horizontal hvr-underline-from-center"
        @click="$router.push('/blog')">
        <h1 class="title sm:font-size-8 font-size-6">
          人生本就是一场孤独的旅行_
        </h1>
      </div>
    </div>
    <div class="relative h-[var(--v-height)] w-full">
      <div class="w-full z-100 absolute left-0 bottom-0">
        <wave-icon />
        <div class="w-full h-[10vh] bg-[var(--c-bg)] flex items-center justify-center">
          <scroll-btn name="i-carbon-arrow-down" @click="toBot()" />
        </div>
      </div>
    </div>

    <!-- * content -->
    <div id="home-content">
      <div class="home-item" v-for="(item, i) in content">
        <div class="content" :class="i % 2 != 0 && 'bg-[var(--c-scrollbar)]!'">
          <div class="desc">
            <p class="name">{{ item.title }}</p>
            <p class="subtitle">{{ item.subtitle }}</p>
            <a class="btn hvr-shutter-out-horizontal bg-[#8884]" href="/blog?type=blog">
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
              <img class="m-a lt-sm:h-a lt-lg:h-[400px] lg:w-[400px]" v-lazy="item.list[0]" />
            </template>
          </div>
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

.hvr-shutter-out-horizontal::before {
  background-color: #8884;
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

.home-item {
  position: relative;
  width: 100vw;
  height: auto;
  overflow: hidden;
  background-color: var(--c-bg);

  @media (min-width: 640px) {
    height: 100vh;
  }

  .icon_box {
    grid-template-columns: repeat(auto-fill, 25%);

    >div {
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

  .img_box {
    grid-template-columns: repeat(auto-fill, 33%);

    img {
      height: 120px;

      @media (min-width: 1024px) {
        height: 160px;
      }
    }
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--c-bg);

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
      margin: 60px auto;
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
