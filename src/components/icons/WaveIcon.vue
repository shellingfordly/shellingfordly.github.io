<template>
  <svg
    class="preview-waves"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 150 28"
    preserveAspectRatio="none"
    shape-rendering="auto"
  >
    <defs>
      <path
        id="gentle-wave"
        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
      />
    </defs>
    <g class="preview-parallax">
      <use
        xlink:href="#gentle-wave"
        x="48"
        y="0"
        fill="var(--c-bg)"
        fill-opacity="0.7"
      ></use>
      <use
        xlink:href="#gentle-wave"
        x="48"
        y="3"
        fill="var(--c-bg)"
        fill-opacity="0.5"
      ></use>
      <use
        xlink:href="#gentle-wave"
        x="48"
        y="5"
        fill="var(--c-bg)"
        fill-opacity="0.3"
      ></use>
      <use xlink:href="#gentle-wave" x="48" y="7" fill="var(--c-bg)"></use>
    </g>
  </svg>
</template>
<style lang="less" scoped>
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

.preview-waves {
  position: relative;
  width: 100%;
  height: 8rem;
  margin-bottom: -7px;
  min-height: 100px;
  max-height: 150px;

  @media (max-width: 768px) {
    height: 40px;
    min-height: 40px;
  }

  .preview-parallax {
    & > use {
      animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
    }
    & > use:nth-child(1) {
      animation-delay: -2s;
      animation-duration: 7s;
    }
    & > use:nth-child(2) {
      animation-delay: -3s;
      animation-duration: 10s;
    }
    & > use:nth-child(3) {
      animation-delay: -4s;
      animation-duration: 13s;
    }
    & > use:nth-child(4) {
      animation-delay: -5s;
      animation-duration: 20s;
    }
  }
}
</style>
