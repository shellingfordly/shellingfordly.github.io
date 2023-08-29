import 'animate.css';
import "@unocss/reset/tailwind.css";
import "./styles/index.less";
import "ol/ol.css";
import 'uno.css'

import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import routes from "pages-generated";

export const createApp = ViteSSG(App, { routes });
