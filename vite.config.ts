import { resolve } from "node:path";
import { defineConfig } from "vite";
import Markdown from "vite-plugin-md";
import Pages from "vite-plugin-pages";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  server: {
    port: 4000,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: [{ find: "~/", replacement: `${resolve(__dirname, "src")}/` }],
  },
  plugins: [
    VueRouter(),
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),
    Markdown(),
    Pages({
      extensions: ["vue", "md"],
      dirs: "src/views",
    }),
    AutoImport({
      imports: ["vue"],
    }),
  ],
});
