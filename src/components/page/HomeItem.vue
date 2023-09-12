<script setup lang="ts">
const homeBgUrlList = [
  "/images/travel/hunan/cs/cs_preview.jpg",
  "/images/travel/hunan/zjj/d2.jpg",
  "/images/travel/jilin/cbs_preview.jpg",
  "/images/travel/jiangxi/nc_preview.jpg",
  "/images/travel/shandong/ts_preview.jpg",
  "/images/travel/fujian/xiamen/preview.jpg",
  "/images/travel/fujian/xiamen/h_2.jpg",
  "/images/travel/shanghai/1/city3.jpg",
  "/images/travel/shanghai/1/me5.jpg",
];

const workIcons = [
  "i-vscode-icons-file-type-js-official",
  "i-vscode-icons:file-type-html",
  "i-vscode-icons:file-type-cssmap",
  "i-logos:typescript-icon",
  "i-logos-react",
  "i-logos-nodejs",
  "i-vscode-icons:file-type-vue",
  "i-vscode-icons:file-type-nuxt",
  "i-tabler:brand-threejs",
  "i-vscode-icons:file-type-unocss",
  "i-mdi:unity",
  "i-vscode-icons:file-type-csharp",
];
</script>

<template>
  <div class="home-item">
    <div class="content">
      <div class="desc">
        <p class="name">Work</p>
        <p class="subtitle">活到老，学到老</p>
        <a
          class="btn hvr-shutter-out-horizontal bg-#8884"
          href="/blog?type=blog"
        >
          查看更多
        </a>
      </div>
      <div class="icon_box left">
        <div v-for="icon in workIcons">
          <div :class="icon" class="hvr-pulse-grow"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="home-item">
    <div class="content bg-[var(--c-bg)]!">
      <div class="desc">
        <p class="name">Travel</p>
        <p class="subtitle">读万卷书，行万里路</p>
        <a class="btn hvr-shutter-out-horizontal bg-#8884" href="/travel">
          查看更多
        </a>
      </div>
      <div class="left img_box">
        <img
          class="w-full h-full"
          v-for="url in homeBgUrlList"
          :src="url"
          alt=""
        />
      </div>
    </div>
  </div>
  <div class="home-item">
    <div class="content">
      <div class="desc">
        <p class="name">Read</p>
        <p class="subtitle">腹有诗书气自华</p>
        <a
          class="btn hvr-shutter-out-horizontal bg-#8884"
          href="/blog?type=read"
        >
          查看更多
        </a>
      </div>
      <div class="left">
        <img
          class="m-a lt-sm:h-a lt-lg:h-400px lg:w-400px"
          src="/images/home/read_1.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
