<script setup lang="ts">
import { toggleBgIndex } from "~/hooks/useHomeBg";
import { toggleDark } from "~/utils";

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
const { y: scroll } = useWindowScroll();
</script>

<template>
  <header class="header flex z-40 w-full top-0 left-0 relative h-70px">
    <scroll-btn
      name="i-ri-arrow-up-line"
      class="fixed right-3 bottom-3"
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    />

    <logo />

    <nav class="nav">
      <div class="spacer" />

      <div class="right print:op0">
        <RouterLink
          to="/blog?type=blog"
          :class="$route.name == 'blog' && 'op100!'"
        >
          <span class="lt-md:hidden">Blog</span>
          <div class="i-carbon-book md:hidden"></div>
        </RouterLink>
        <RouterLink to="/travel" :class="$route.name == 'travel' && 'op100!'">
          <span class="lt-md:hidden">Travel</span>
          <div class="i-carbon-map md:hidden"></div>
        </RouterLink>
        <RouterLink
          to="/projects"
          :class="$route.name == 'projects' && 'op100!'"
        >
          <span class="lt-md:hidden">Projects</span>
          <div
            class="i-ant-design-fund-projection-screen-outlined md:hidden"
          ></div>
        </RouterLink>

        <a
          href="https://github.com/shellingfordly"
          target="_blank"
          title="GitHub"
        >
          <div class="i-uil-github-alt" />
        </a>
        <a
          class="select-none"
          title="Toggle Background Scheme"
          @click="toggleBgIndex"
        >
          <div class="i-material-symbols-reset-image-rounded"></div>
        </a>
        <a class="select-none" title="Toggle Color Scheme" @click="toggleDark">
          <div class="i-carbon-sun dark:i-carbon-moon" />
        </a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  padding: 0.5rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
