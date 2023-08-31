import "animate.css";
import "@unocss/reset/tailwind.css";
import "./styles/index.less";
import "ol/ol.css";
import "uno.css";
import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import autoRoutes from "pages-generated";
import NProgress from "nprogress";


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
      router.beforeEach(() => {
        NProgress.start();
      });
      router.afterEach((to) => {
        if (to.path !== "/") {
          document.body.scrollTo(0, 0);
        }
        NProgress.done();
      });
    }
  }
);
