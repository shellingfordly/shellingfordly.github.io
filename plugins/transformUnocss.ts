import { toUnocss } from "transform-to-unocss-core";
import type { ElementContent, Element } from "hast";

export interface NodeItem {
  line: number;
  start: number;
  end: number;
  text: string;
  nodeStart: number;
  nodeEnd: number;
  nativeValue: string;
}

const cssType = ["less", "sass", "css", "styl"];

export function transformUnocss(code: string, lang: string) {
  const unocss: { nodes: NodeItem[] } = { nodes: [] };

  if (cssType.includes(lang)) {
    const nodes = code
      .split("\n")
      .flatMap((lineText, index) => {
        const regex = new RegExp(/(\w+:\s?\w+;)/g);
        const match = regex.exec(lineText);

        if (match) {
          return {
            line: index + 1,
            start: match.index,
            end: match.index + match[0].length,
            text: toUnocss(match[0]),
            nativeValue: match[0],
            nodeStart: 0,
            nodeEnd: 0,
          };
        }
      })
      .filter(Boolean) as NodeItem[];

    unocss.nodes = nodes;
  } else if (lang === "html") {
    const nodes = code
      .split("\n")
      .flatMap((lineText, index) => {
        const regex = new RegExp(/\s?(\w+:\s?\w+;)+/g);
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

        // console.log(lineText);
        // while ((match = regex.exec(lineText)) !== null) {
        // console.log("match", match[0]);

        // }
        // const styleText = line.match(/style="([^"]+)"/);
        // const classText = line.match(/class="([^"]+)"/);
        // const tagText = line.match("");

        // const style = line.match(/^(\w+:\s?\w+;)$/g);

        // if (style && style[0]) return { line: i, text: toUnocss(style[0]) };
      })
      .filter(Boolean) as NodeItem[];
    unocss.nodes = nodes;
  }

  return unocss;
}
