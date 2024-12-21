import { TDescendant, TElement, getPluginType } from "@udecode/plate-common";
import {
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_UL,
} from "@udecode/plate-list";
import { ELEMENT_IMAGE } from "@udecode/plate-media";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import {
  MdastNode,
  remarkTransformElementChildren,
} from "@udecode/plate-serializer-md";

export const RULES: {
  deserialize: {
    [key: string]: {
      transform: (node: MdastNode, options) => TElement | TElement[];
    };
  };
  serialize: {
    [key: string]: {
      transform: (node: TElement) => string;
    };
  };
} = {
  deserialize: {
    list: {
      transform: (node: MdastNode, options) => {
        if (options.indentList) {
          const listStyleType = node.ordered ? "decimal" : "disc";

          const parseListItems = (
            node: MdastNode,
            listItems: TElement[] = [],
            indent = 1
          ) => {
            node?.children?.forEach((listItem, index) => {
              const parentOffset = node?.position?.start?.offset;
              const nowOffset = listItem?.position?.start?.offset;
              const defaultOffset = listItem["offset"] || 1;
              listItem["offset"] =
                parentOffset + nowOffset > 100
                  ? defaultOffset + 1
                  : defaultOffset;

              const [paragraph, ...subLists] = listItem?.children || [];

              const hasCheckbox = paragraph?.children?.some(
                (child) => child.type === "text" && child.value.includes("[ ]")
              );

              const type = hasCheckbox
                ? getPluginType(options.editor, "action_item")
                : getPluginType(options.editor, ELEMENT_PARAGRAPH);

              // 检查并处理paragraph的子节点
              paragraph?.children?.forEach((child) => {
                if (child.type === "text") {
                  // 检查是否包含 "[ ]"
                  const hasCheckbox = child.value.includes("[ ]");
                  if (hasCheckbox) {
                    // 替换或去除 "[ ]"
                    child.value = child.value.replace("[ ]", ""); // 可以替换为其他内容或完全去除
                  }
                }
              });

              console.log({
                offset: listItem["offset"],
              });

              const newItem = {
                type,
                listStyleType: hasCheckbox ? "none" : listStyleType,
                indent: listItem["offset"] || indent,
                listStart: index + 1,
                children: remarkTransformElementChildren(
                  paragraph || ([] as MdastNode),
                  options
                ),
              };

              listItems.push(newItem);

              subLists.forEach((subList) => {
                parseListItems(subList, listItems, indent + 1);
              });
            });

            return listItems;
          };

          return parseListItems(node);
        } else {
          return {
            type: getPluginType(
              options.editor,
              node.ordered ? ELEMENT_OL : ELEMENT_UL
            ),
            children: remarkTransformElementChildren(node, options),
          };
        }
      },
    },
    listItem: {
      transform: (node, options) => {
        console.log({
          listItem: node,
        });
        return {
          type: getPluginType(options.editor, ELEMENT_LI),
          children: remarkTransformElementChildren(node, options).map(
            (child) =>
              ({
                ...child,
                type:
                  child.type ===
                  getPluginType(options.editor, ELEMENT_PARAGRAPH)
                    ? getPluginType(options.editor, ELEMENT_LIC)
                    : child.type,
              } as TDescendant)
          ),
        };
      },
    },
    paragraph: {
      transform: (node, options) => {
        const children = remarkTransformElementChildren(node, options);

        const paragraphType = getPluginType(options.editor, ELEMENT_PARAGRAPH);
        const splitBlockTypes = new Set([
          getPluginType(options.editor, ELEMENT_IMAGE),
        ]);

        const elements: TElement[] = [];
        let inlineNodes: TDescendant[] = [];

        const flushInlineNodes = () => {
          if (inlineNodes.length > 0) {
            elements.push({
              type: paragraphType,
              children: inlineNodes,
            });

            inlineNodes = [];
          }
        };

        children.forEach((child) => {
          const { type } = child;

          if (type && splitBlockTypes.has(type as string)) {
            flushInlineNodes();
            elements.push(child as TElement);
          } else {
            inlineNodes.push(child);
          }
        });

        flushInlineNodes();

        return elements;
      },
    },
  },
  serialize: {
    h1: {
      transform: (node) => {
        return `# ${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    h2: {
      transform: (node) => {
        return `## ${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    h3: {
      transform: (node) => {
        return `### ${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    h4: {
      transform: (node) => {
        return `#### ${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    h5: {
      transform: (node) => {
        return `##### ${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    h6: {
      transform: (node) => {
        return `###### ${node.children
          .map((child) => child.text)
          .join("")}\n\n`;
      },
    },
    p: {
      transform: (node) => {
        if (node.listStyleType === "decimal") {
          return `${node.listStart || 1}. ${node.children
            .map((child) => child.text)
            .join("")}\n`;
        } else if (node.listStyleType === "disc") {
          return `- ${node.children.map((child) => child.text).join("")}\n`;
        } else {
          return `${node.children.map((child) => child.text).join("")}\n\n`;
        }
      },
    },
    li: {
      transform: (node) => {
        return `- ${node.children.map((child) => child.text).join("")}\n`;
      },
    },
    lic: {
      transform: (node) => {
        return `${node.children.map((child) => child.text).join("")}\n`;
      },
    },
    ul: {
      transform: (node) => {
        return `${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    ol: {
      transform: (node) => {
        return `${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    image: {
      transform: (node) => {
        return `![${node.alt}](${node.url})\n\n`;
      },
    },
    link: {
      transform: (node) => {
        return `[${node.children.map((child) => child.text).join("")}](${
          node.url
        })`;
      },
    },
    em: {
      transform: (node) => {
        return `*${node.children.map((child) => child.text).join("")}*`;
      },
    },
    strong: {
      transform: (node) => {
        return `**${node.children.map((child) => child.text).join("")}**`;
      },
    },
    code: {
      transform: (node) => {
        return `\`${node.children.map((child) => child.text).join("")}\``;
      },
    },
    code_block: {
      transform: (node) => {
        const codeLines = node.children
          .map((line: TDescendant) => {
            return (line.children as TDescendant[])
              .map((child) => child.text)
              .join("");
          })
          .join("\n");
        return `\`\`\`${node.lang}\n${codeLines}\n\`\`\`\n\n`;
      },
    },
    blockquote: {
      transform: (node) => {
        return `> ${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    hr: {
      transform: () => {
        return `---\n\n`;
      },
    },
    excalidraw: {
      transform: (node) => {
        return `![Excalidraw](https://excalidraw.com/#json=${encodeURIComponent(
          JSON.stringify(node)
        )})\n\n`;
      },
    },
    media_embed: {
      transform: (node) => {
        return `${node.children.map((child) => child.text).join("")}\n\n`;
      },
    },
    mention: {
      transform: (node) => {
        return `@${node.children.map((child) => child.text).join("")}`;
      },
    },
    action_item: {
      transform: (node) => {
        return `- [ ] ${node.children.map((child) => child.text).join("")}\n`;
      },
    },
  },
};
