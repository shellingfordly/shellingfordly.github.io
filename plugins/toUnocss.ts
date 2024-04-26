import type { ShikiTransformer } from "@shikijs/core";
import { toUnocss } from "transform-to-unocss-core";

export function transformerToUnocss(): ShikiTransformer {
  const map = new WeakMap();

  return {
    preprocess(code) {
      const tags = code
        .split("\n")
        .map((line, i) => {
          const match = line.match(/(\w+:\s?\w+;)/g);
          if (match) {
            const node = {
              name: "",
              line: i,
              text: toUnocss(match[0]),
            };
            return node;
          }
        })
        .filter(Boolean);

      map.set(this.meta, tags);
      // 生成 unocss 展示nodes
    },
    code(codeEl) {
      const tags = map.get(this.meta);
      console.log(tags);

      const insertAfterLine = (line: number, nodes: any[]) => {
        if (!nodes.length) return;
        let index: number;
        if (line >= this.lines.length) {
          index = codeEl.children.length;
        } else {
          const lineEl = this.lines[line];
          index = codeEl.children.indexOf(lineEl);
          if (index === -1) {
            return;
          }
        }

        // If there is a newline after this line, remove it because we have the error element take place.
        const nodeAfter = codeEl.children[index + 1];

        console.log("nodeAfter:", nodeAfter);
        if (nodeAfter && nodeAfter.type === "text" && nodeAfter.value === "\n")
          codeEl.children.splice(index + 1, 1);
        codeEl.children.splice(index + 1, 0, ...nodes);
      };

      // 把nodes挂到对应的lineEl

      for (const node of tags) {
        insertAfterLine(node.line, lineCustomTag.call(this, node));
      }
    },
  };
}

export function lineCustomTag(tag: any) {
  return [
    {
      type: "element",
      tagName: "div",
      properties: {
        class: [`twoslash-tag-line twoslash-tag-${tag.name}-line`]
          .filter(Boolean)
          .join(" "),
      },
      children: [
        {
          type: "text",
          value: tag.text || "",
        },
      ],
    },
  ];
}
