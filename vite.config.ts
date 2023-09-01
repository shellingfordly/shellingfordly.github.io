import { resolve } from "node:path";
import fs from "fs";
import matter from "gray-matter";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { bundledLanguages, getHighlighter } from "shikiji";
import LinkAttributes from "markdown-it-link-attributes";
import Markdown from "unplugin-vue-markdown/vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { presetIcons, presetUno } from "unocss";
import SVG from "vite-svg-loader";
import Inspect from "vite-plugin-inspect";
import anchor from "markdown-it-anchor";
import { slugify } from "./scripts/slugify";

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
    UnoCSS({
      shortcuts: [
        {
          "bg-base": "bg-white dark:bg-black",
          "border-base": "border-[#8884]",
        },
      ],
      presets: [
        presetIcons({
          extraProperties: {
            display: "inline-block",
            height: "1.2em",
            width: "1.2em",
            "vertical-align": "text-bottom",
          },
        }),
        presetUno(),
      ],
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),

    Pages({
      extensions: ["vue", "md"],
      dirs: "pages",
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1));
        if (path.endsWith(".md")) {
          const md = fs.readFileSync(path, "utf-8");
          const { data } = matter(md);
          route.meta = Object.assign(route.meta || {}, { frontmatter: data });
        }
        return route;
      },
    }),

    Markdown({
      wrapperClasses: (id, code) => {
        return code.includes("@layout-map")
          ? "map_container"
          : code.includes("@layout-full-width")
          ? ""
          : "prose m-auto slide-enter-content";
      },
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      async markdownItSetup(md) {
        const shiki = await getHighlighter({
          themes: ["vitesse-dark", "vitesse-light"],
          langs: Object.keys(bundledLanguages) as any,
        });

        md.use((markdown) => {
          markdown.options.highlight = (code, lang) => {
            return shiki.codeToHtml(code, {
              lang,
              themes: {
                light: "vitesse-light",
                dark: "vitesse-dark",
              },
              cssVariablePrefix: "--s-",
            });
          };
        });

        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: "#",
            renderAttrs: () => ({ "aria-hidden": "true" }),
          }),
        });

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        });
      },
    }),

    AutoImport({
      imports: ["vue","vue-router","@vueuse/core"],
    }),

    Components({
      extensions: ["vue", "md"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: "",
        }),
      ],
    }),

    Icons({
      autoInstall: true,
      defaultClass: "inline",
      defaultStyle: "vertical-align: sub;",
    }),

    SVG({
      svgo: false,
      defaultImport: "url",
    }),

    Inspect(),
  ],
});
