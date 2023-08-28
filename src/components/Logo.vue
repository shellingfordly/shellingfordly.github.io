<script setup lang="ts">
const router = useRouter();
function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="logo">
    <div class="i-carbon-home" @click="goHome"></div>
  </div>
</template>
<style scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  line-height: 40px;
  cursor: pointer;
}
</style>
