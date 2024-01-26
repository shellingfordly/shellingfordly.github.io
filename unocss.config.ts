import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
} from "unocss";

export default defineConfig({
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
    presetAttributify(),
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: "Inter:400,600,800",
        mono: "DM Mono:400,600",
      },
    }),
  ],
  transformers: [transformerDirectives()],
  safelist: ["i-ri-menu-2-fill"],
});
