import type MarkdownIt from "markdown-it";
import type {
  BuiltinTheme,
  CodeOptionsMeta,
  CodeOptionsThemes,
  CodeToHastOptions,
  HighlighterGeneric,
  ShikiTransformer,
  TransformerOptions,
  BuiltinLanguage,
  LanguageInput,
} from "shiki";
import { bundledLanguages, getHighlighter } from "shiki";

import type {
  MarkdownItShikiSetupOptions,
  MarkdownItShikiOptions,
} from "@shikijs/markdown-it";
import { parsePlayground } from "./playground";

export function setupMarkdownIt(
  markdown: MarkdownIt,
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownItShikiSetupOptions
) {
  const { parseMetaString, trimEndingNewline = true } = options;

  markdown.options.highlight = (code, lang = "text", attrs) => {
    const meta = parseMetaString?.(attrs, code, lang) || {};
    const codeOptions: CodeToHastOptions = {
      ...options,
      lang,
      meta: {
        ...options.meta,
        ...meta,
        __raw: attrs,
      },
    };

    const builtInTransformer: ShikiTransformer[] = [];

    builtInTransformer.push({
      name: "@shikijs/markdown-it:block-class",
      code(node) {
        node.properties.class = `language-${lang}`;
      },
    });

    if (trimEndingNewline) {
      if (code.endsWith("\n")) code = code.slice(0, -1);
    }

    const { isPlayground, html, code: newCode } = parsePlayground(code);

    const codeHtml = highlighter.codeToHtml(newCode, {
      ...codeOptions,
      transformers: [
        ...builtInTransformer,
        ...(codeOptions.transformers || []),
      ],
    });

    if (isPlayground)
      return `<div class="playground">${codeHtml}<div class="content">${
        html || ""
      }</div></div>`;
    return codeHtml;
  };
}

export default async function markdownItShiki(options: MarkdownItShikiOptions) {
  const themeNames = ("themes" in options
    ? Object.values(options.themes)
    : [options.theme]
  ).filter(Boolean) as BuiltinTheme[];
  const highlighter = await getHighlighter({
    themes: themeNames,
    langs:
      options.langs || (Object.keys(bundledLanguages) as BuiltinLanguage[]),
  });

  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options);
  };
}
