<script setup lang="ts">
import { isDark } from "~/utils";

const logSrc = computed(() =>
  isDark.value ? "/images/icons/logo_black.png" : "/images/icons/logo.png"
);

const router = useRouter();
function goHome() {
  router.push("/");
}
</script>

<template>
  <div
    class="flex items-center ml-5 cursor-pointer z-100 sm:w-200px w-150px bg-contain bg-no-repeat bg-center"
    @click="goHome"
    :style="{ backgroundImage: `url(${logSrc})` }"
  />
</template>
