import type {
  ShikiTransformer,
  ShikiTransformerContextMeta,
} from "@shikijs/core";
import { transformUnocss, type NodeItem } from "./transformUnocss";
import type { ElementContent, Element, Text } from "hast";

const cssType = ["less", "sass", "css", "styl"];

export function transformerToUnocss(): ShikiTransformer {
  const map = new WeakMap<
    ShikiTransformerContextMeta,
    ReturnType<typeof transformUnocss>
  >();

  return {
    preprocess(code) {
      const unocss = transformUnocss(code, this.options.lang);
      map.set(this.meta, unocss);
    },
    pre(pre) {
      const uno = map.get(this.meta);
      if (!uno) return;
      this.addClassToHast(pre, "twoslash lsp");
    },
    tokens(tokens) {
      const lang = this.options.lang;
      if (cssType.includes(lang)) {
        return tokens.map((token) => {
          if (token[0]) {
            let token_copy = { ...token[0] };
            if (token_copy.content.startsWith(" ")) {
              const match = token_copy.content.match(/^\s+/g);
              if (match && match[0]) {
                token[0].content = token_copy.content.slice(match[0].length);
                token_copy.content = match[0];
              }
              return [token_copy, ...token];
            }
          }
          return token;
        });
      } else if (lang === "html") {
        // const styleText = line.match(/style="([^"]+)"/);

        return tokens.map((token) => {
          let index: number = -1;
          let tokens_copy: any[] = [];
          token.forEach((item, i) => {
            const match = item.content.match(/(\w+:\s?\w+;)+/g);
            if (match) {
              index = i;
              match.forEach((content) => {
                tokens_copy.push({ ...item, content });
                if (index < token.length - 1)
                  tokens_copy.push({ ...item, content: " " });
              });
            }
          });
          if (index > 0) token.splice(index, 1, ...tokens_copy);

          return token;
        });
      }
    },
    line(node, line) {
      const unocss = map.get(this.meta);
      if (!unocss) return;

      const items = unocss.nodes.filter((n) => n.line === line);

      for (const item of items) {
        let startIndex = -1;

        const mergeSpans = node.children.filter((child, i) => {
          const isMerge =
            child.type === "element" &&
            (child?.properties?.class as string)?.includes(
              `merge_span_${item.start}_${item.end}`
            );

          if (isMerge && startIndex === -1) startIndex = i;

          return isMerge;
        });

        if (mergeSpans.length > 0) {
          const mergeNode: ElementContent = {
            type: "element",
            tagName: "span",
            properties: { class: "twoslash-hover" },
            children: [...mergeSpans],
          };

          mergeNode.children.push(...lineCustomTag(item));
          node.children.splice(startIndex, mergeSpans.length, mergeNode);
        }
      }
    },
    span(node, line, col, lineEl) {
      const unocss = map.get(this.meta);
      if (!unocss) return;

      const items = unocss.nodes.filter((n) => n.line === line);
      items.forEach((item) => {
        if (item && item.start <= col && col <= item.end) {
          if (node.type === "element" && node.children) {
            const child = node.children[0];
            if (child.type === "text" && child.value !== " ") {
              if (item.nativeValue === child.value) {
                node.properties.class = "twoslash-hover";
                node.children.push(...lineCustomTag(item!));
              } else {
                node.properties.class = `merge_span_${item.start}_${item.end}`;
              }
            }
          }
        }
      });
    },
    code(codeEl) {},
  };
}

export function lineCustomTag(tag: NodeItem): ElementContent[] {
  return [
    {
      type: "element",
      tagName: "span",
      properties: {
        class: "twoslash-popup-container",
      },
      children: [
        {
          type: "element",
          tagName: "code",
          properties: { class: "twoslash-popup-code" },
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { class: "line" },
              children: [
                {
                  type: "text",
                  value: "toUnocss",
                },
              ],
            },
            {
              type: "element",
              tagName: "span",
              properties: { class: "line" },
              children: [
                {
                  type: "text",
                  value: "class: " + (tag.text || ""),
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
