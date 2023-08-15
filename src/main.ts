import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "./styles/index.less";
import "ol/ol.css";
import routes from "pages-generated";

export const createApp = ViteSSG(App, { routes });
