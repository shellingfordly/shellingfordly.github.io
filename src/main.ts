import "./styles/index.less";
import "uno.css";

import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import NProgress from "nprogress";
import { setupRouterScroller } from "vue-router-better-scroller";
import autoRoutes from "pages-generated";
import VueLazyload from "vue-lazyload";

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
  };
});

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, isClient }) => {
    app.use(VueLazyload, {
      error: "/images/icons/error.svg",
      loading: "/images/icons/loading.svg",
    });

    if (isClient) {
      const html = document.querySelector("html")!;
      setupRouterScroller(router, {
        selectors: {
          html(ctx) {
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
