import Markdown from "vite-plugin-md";
import Pages from "vite-plugin-pages";

export default {
  server: {
    port: 4000,
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    Markdown(),
    Pages({
      dirs: "/pages",
      extensions: ["md"],
    }),
  ],
};
