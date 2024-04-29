import type {
  ShikiTransformer,
  ShikiTransformerContextMeta,
  ThemedToken,
} from "@shikijs/core";
import type { ElementContent } from "hast";
import { toUnocss } from "transform-to-unocss-core";
export interface NodeItem {
  line: number;
  start: number;
  end: number;
  text: string;
  nodeStart: number;
  nodeEnd: number;
  nativeValue: string;
}

const cssLangs = ["less", "scss", "css"];
const htmlLangs = ["html", "vue"];

export function transformerToUnocss(): ShikiTransformer {
  const map = new WeakMap<ShikiTransformerContextMeta, { nodes: NodeItem[] }>();

  return {
    preprocess(code) {
      const unocss: { nodes: NodeItem[] } = { nodes: [] };

      unocss.nodes = code
        .split("\n")
        .flatMap((lineText, index) => {
          const regex = new RegExp(/(\w+:\s?\w+);?/g);
          let match;
          let items: NodeItem[] = [];

          while ((match = regex.exec(lineText)) !== null) {
            if (match) {
              const item = {
                line: index + 1,
                start: match.index,
                end: match.index + match[1].length,
                text: toUnocss(match[1]),
                nativeValue: match[1],
                nodeStart: 0,
                nodeEnd: 0,
              };
              items.push(item);
            }
          }

          return items;
        })
        .filter(Boolean) as NodeItem[];

      map.set(this.meta, unocss);
    },
    pre(pre) {
      const uno = map.get(this.meta);
      if (!uno) return;
      this.addClassToHast(pre, "twoslash lsp");
    },
    tokens(tokens) {
      const lang = this.options.lang;

      const extractPreSpace = (token: ThemedToken[]) => {
        return token.flatMap((item) => {
          if (/^\s+\w/.test(item.content)) {
            let preSpaceItem = { ...item };
            const match = preSpaceItem.content.match(/^\s+/g);
            if (match && match[0]) {
              item.content = preSpaceItem.content.slice(match[0].length);
              preSpaceItem.content = match[0];
              return [preSpaceItem, item];
            }
          }
          return item;
        });
      };

      if (cssLangs.includes(lang)) {
        return tokens.map(extractPreSpace);
      } else if (htmlLangs.includes(lang)) {
        return tokens.map((token) => {
          token = extractPreSpace(token);

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

          mergeNode.children.push(...lineStyleToUnocss(item));
          node.children.splice(startIndex, mergeSpans.length, mergeNode);
        }
      }
    },
    span(node, line, col) {
      const unocss = map.get(this.meta);
      if (!unocss) return;

      const items = unocss.nodes.filter((n) => n.line === line);
      items.forEach((item) => {
        if (item && item.start <= col && col < item.end) {
          if (node.type === "element" && node.children) {
            const child = node.children[0];
            if (child.type === "text") {
              if (item.nativeValue === child.value) {
                node.properties.class = "twoslash-hover";
                node.children.push(...lineStyleToUnocss(item!));
              } else {
                node.properties.class = `merge_span_${item.start}_${item.end}`;
              }
            }
          }
        }
      });
    },
  };
}

export function lineStyleToUnocss(tag: NodeItem): ElementContent[] {
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
