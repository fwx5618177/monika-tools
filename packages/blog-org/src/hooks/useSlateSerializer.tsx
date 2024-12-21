import { RULES } from "@/lib/SlateRules";
import escapeHtml from "escape-html";
import { Text, Descendant, Element as SlateElement } from "slate";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { serialize } from "remark-slate";
import { unified } from "unified";
import { Value } from "@udecode/plate-common";
import {
  remarkDefaultElementRules,
  remarkDefaultTextRules,
  remarkPlugin,
} from "@udecode/plate-serializer-md";

export const useHtmlSerializer = () => {
  const serializeSlate2Markdown = (node): string => {
    console.log({
      node,
    });

    return node
      ?.map((item) => {
        const rule: {
          transform?: (node: SlateElement) => string;
        } = RULES.serialize[item?.type];
        const result = rule ? rule.transform(item) : " ";

        return result;
      })
      .join("")
      .trim();
  };

  const convert2htmlString = (html: string) => {
    const file = unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(html);

    return String(file);
  };

  const deserializeMarkdown2Slate = (html: string): Value => {
    const file = unified()
      .use(remarkParse)
      .use(remarkPlugin, {
        elementRules: {
          ...remarkDefaultElementRules,
          ...RULES.deserialize,
        },
        textRules: remarkDefaultTextRules,
        indentList: true,
        editor: null,
      })
      .processSync(html);

    const tree = file.result as Value;

    return tree;
  };

  return {
    // serialize: serialize,
    serializeSlate2Markdown,
    deserializeMarkdown2Slate,
    convert2htmlString,
  };
};
