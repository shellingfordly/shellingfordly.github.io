<template>
  <div class="h-40% flex items-center logo">
    <h1 class="m-a sm:font-size-20 font-size-10">CodingStartup</h1>
  </div>
  <div class="h-60%">
    <a href="">
      <h1 class="sm:font-size-10 font-size-5">travel map</h1>
    </a>
    <a href="">
      <h1 class="sm:font-size-10 font-size-5">travel map</h1>
    </a>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
div {
  a {
    text-align: center;
  }
}
.logo {
  background: url('/bg.svg') no-repeat 100% 100%;
  
  h1 {
    padding: 0;
    font-family: monospace;
    overflow: hidden;
    /* animation: name duration timing-function delay iteration-count direction fill-mode; */
    animation: 1s text-in forwards steps(13, jump-none);

    &:hover {
      animation: 1s text-in forwards steps(13, jump-none);
    }
  }
}

@keyframes text-in {
  from {
    width: 1ch;
  }
  to {
    width: 13ch;
  }
}
</style>
