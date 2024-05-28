<script setup lang="ts">
const router = useRouter();
function goHome() {
  router.push("/");
}
</script>

<template>
  <div
    class="flex items-center ml-5 cursor-pointer z-100 sm:w-[200px] w-[150px] bg-contain bg-no-repeat bg-center"
    @click="goHome"
  >
    <LogoIcon w-full />
  </div>
</template>
