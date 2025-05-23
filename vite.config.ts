import { resolve } from "node:path";
import fs from "fs";
import matter from "gray-matter";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import LinkAttributes from "markdown-it-link-attributes";
import Markdown from "unplugin-vue-markdown/vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import SVG from "vite-svg-loader";
import Inspect from "vite-plugin-inspect";
import anchor from "markdown-it-anchor";
import { slugify } from "./scripts/slugify";
import MarkdownItShiki from "@shikijs/markdown-it";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import GitHubAlerts from "markdown-it-github-alerts";
import { transformerToUnocss } from "shiki-unocss-transformer";
import { SpanRed } from "./scripts/span-red"

// @ts-expect-error missing types
import TOC from "markdown-it-table-of-contents";

export default defineConfig({
  server: {
    port: 4000,
    warmup: {
      clientFiles: ["pages/**/*.md"],
    }
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: [{ find: "~/", replacement: `${resolve(__dirname, "src")}/` }],
  },
  plugins: [
    UnoCSS(),
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
      wrapperClasses: (_, code) => {
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
        md.use(
          await MarkdownItShiki({
            themes: {
              dark: "vitesse-dark",
              light: "vitesse-light",
            },
            defaultColor: false,
            cssVariablePrefix: "--s-",
            transformers: [
              transformerTwoslash({
                explicitTrigger: true,
                renderer: rendererRich(),
              }),
              transformerToUnocss({
                explicitTrigger: true,
              }) as any,
            ],
          }) as any
        );

        md.use(anchor as any, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: "#",
            renderAttrs: () => ({ "aria-hidden": "true" }),
          }),
        });

        md.use(LinkAttributes as any, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        });

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          slugify,
          containerHeaderHtml:
            '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill" /></div>',
        });

		md.use(SpanRed as any);

        md.use(GitHubAlerts as any);
      },
    }),

    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core"],
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
