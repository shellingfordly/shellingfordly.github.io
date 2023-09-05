<script setup lang="ts">
const homeBgUrlList = [
  "/images/home/bg_1.png",
  "/images/home/bg_2.png",
  "/images/home/bg_3.png",
  "/images/home/bg_4.png",
  "/images/home/bg_5.png",
  "/images/home/bg_6.png",
  "/images/home/bg_7.png",
  "/images/home/bg_8.png",
  "/images/home/bg_9.png",
];

const workIcons = [
  "i-vscode-icons-file-type-js-official",
  "i-vscode-icons:file-type-html",
  "i-vscode-icons:file-type-cssmap",
  "i-logos:typescript-icon",
  "i-logos-react",
  "i-logos-nodejs",
  "i-vscode-icons:file-type-vue",
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
        <a class="btn hvr-shutter-out-horizontal bg-#8884" href="/blog?tag=work">
          查看更多
        </a>
      </div>
      <div class="icon_box left">
        <div v-for="icon in workIcons">
          <div :class="icon"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="home-item">
    <div class="content bg-[var(--c-bg)]!">
      <div class="desc">
        <p class="name">旅行</p>
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
        <a class="btn hvr-shutter-out-horizontal bg-#8884" href="/blog?tag=read">
          查看更多
        </a>
      </div>
      <div class="left">
        <img
          class="w-full h-full"
          src="/images/home/read_1.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-item .icon_box {
  grid-template-columns: repeat(auto-fill, 33%);

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    font-size: 30px;
  }
}

.home-item .img_box {
  grid-template-columns: repeat(auto-fill, 50%);

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, 33%);
  }

  @media (min-width: 980px) {
    grid-template-columns: repeat(auto-fill, 50%);
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
    background-color: var(--c-container);

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
      height: 337.5px;
      margin: 60px auto;
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
    }

    @media (min-width: 980px) {
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
        margin-top: -270px;
        width: 480px;
        height: 540px;
      }
    }
  }
}
</style>
