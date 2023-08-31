<script setup lang="ts">
import { isDark } from "~/utils";

const router = useRouter();

const logSrc = computed(() =>
  isDark.value ? "/icons/logo_black.png" : "/icons/logo.png"
);

function goHome() {
  router.push("/");
}
</script>

<template>
  <div
    class="flex items-center ml-5 cursor-pointer z-100 sm:w-200px w-150px"
    @click="goHome"
  >
    <img :src="logSrc" alt="" />
  </div>
</template>
