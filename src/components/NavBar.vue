<template>
  <nav class="nav">
    <toggle-theme />
  </nav>
</template>

<style scoped>
.nav {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  padding: 0.5rem;
  width: 100%;
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
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
</style>
