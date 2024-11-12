<script setup lang="ts">
const route = useRoute();
const imageModel = ref<HTMLImageElement>();

useEventListener("click", async (e) => {
  const path = Array.from(e.composedPath());
  const first = path[0];
  if (!(first instanceof HTMLElement)) return;
  if (first.tagName !== "IMG") return;
  if (
    path.some(
      (el) => el instanceof HTMLElement && ["A", "BUTTON"].includes(el.tagName)
    )
  )
    return;
  if (
    !path.some(
      (el) => el instanceof HTMLElement && el.classList.contains("prose")
    )
  )
    return;

  const pos = first.getBoundingClientRect();
  await new Promise((resolve) => setTimeout(resolve, 50));
  const newPos = first.getBoundingClientRect();
  if (pos.left !== newPos.left || pos.top !== newPos.top) return;

  imageModel.value = first as HTMLImageElement;
});

onKeyStroke("Escape", (e) => {
  if (imageModel.value) {
    imageModel.value = undefined;
    e.preventDefault();
  }
});
</script>

<template>
  <nav-bar />
  <main class="pt-[70px] w-full relative of-x-hidden">
    <Header />
    <router-view />
    <Footer v-if="route.path != '/travel'" />
  </main>
  <Transition name="fade">
    <div
      v-if="imageModel"
      class="fixed top-0 left-0 right-0 bottom-0 z-500 backdrop-blur-7"
      @click="imageModel = undefined"
    >
      <div class="absolute top-0 left-0 right-0 bottom-0 bg-black:30 z--1" />
      <img
        :src="imageModel.src"
        :alt="imageModel.alt"
        class="w-full h-full object-contain"
      />
    </div>
  </Transition>
</template>
