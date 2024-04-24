<script setup lang="ts">
const props = defineProps<{ code: string; html?: string }>();

const domRef = ref<HTMLDivElement>();

const style = computed(() => props.code);

const insertStylesheet = () => {
  let style = document.getElementById("ho79thw");
  if (!style) {
    style = document.createElement("style");
    style.id = "playground_test";
    document.head.appendChild(style);
    style.innerHTML = props.code;
  }
};

watch(
  () => props.code,
  (code) => {
    console.log("code", code);

    if (code) insertStylesheet();
  },
  { immediate: true, deep: true }
);

onMounted(() => {});
</script>

<template>
  <div class="content p10">
    <slot />
  </div>
</template>
