import "animate.css";
import "@unocss/reset/tailwind.css";
import "./styles/index.less";
import "ol/ol.css";
import "uno.css";
import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import NProgress from "nprogress";
import { routes } from "./routes";

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
