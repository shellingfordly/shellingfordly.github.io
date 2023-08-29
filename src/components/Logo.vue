<script setup lang="ts">
import { isDark } from "~/logics";

const router = useRouter();

const logSrc = computed(() =>
  isDark.value ? "/icons/logo_black.png" : "/icons/logo.png"
);

function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="logo z-100 sm:w-200px w-150px" @click="goHome">
    <img :src="logSrc" alt="" />
  </div>
</template>
<style lang="less" scoped>
.logo {
  padding: 10px 0;
  margin: 0 20px;
  cursor: pointer;
}
</style>
