import "animate.css";
import "@unocss/reset/tailwind.css";
import "./styles/index.less";
import "ol/ol.css";
import "uno.css";
import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import NProgress from "nprogress";
import { setupRouterScroller } from "vue-router-better-scroller";
import autoRoutes from "pages-generated";

console.log(autoRoutes);

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
  };
});

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
  if (savedPosition) return savedPosition;
  else return { top: 0 };
};

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app, router, isClient }) => {
    if (isClient) {
      const html = document.querySelector("html")!;
      setupRouterScroller(router, {
        selectors: {
          html(ctx) {
            // only do the sliding transition when the scroll position is not 0
            if (ctx.savedPosition?.top) html.classList.add("no-sliding");
            else html.classList.remove("no-sliding");
            return true;
          },
        },
        behavior: "auto",
      });

      router.beforeEach(() => {
        NProgress.start();
      });
      router.afterEach(() => {
        NProgress.done();
      });
    }
  }
);
