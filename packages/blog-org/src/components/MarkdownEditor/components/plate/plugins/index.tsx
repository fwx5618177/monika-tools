import {
  createPlugins,
  InjectComponentProps,
  KEY_DESERIALIZE_HTML,
  RenderAfterEditable,
} from "@udecode/plate-common";
import {
  createParagraphPlugin,
  ELEMENT_PARAGRAPH,
} from "@udecode/plate-paragraph";
import {
  createHeadingPlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  KEYS_HEADING,
} from "@udecode/plate-heading";
import {
  createBlockquotePlugin,
  ELEMENT_BLOCKQUOTE,
} from "@udecode/plate-block-quote";
import {
  createCodeBlockPlugin,
  ELEMENT_CODE_BLOCK,
} from "@udecode/plate-code-block";
import {
  createHorizontalRulePlugin,
  ELEMENT_HR,
} from "@udecode/plate-horizontal-rule";
import { createLinkPlugin } from "@udecode/plate-link";
import {
  createImagePlugin,
  createMediaEmbedPlugin,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
} from "@udecode/plate-media";
import { createCaptionPlugin } from "@udecode/plate-caption";
import { createMentionPlugin } from "@udecode/plate-mention";
import { createTablePlugin, ELEMENT_TD } from "@udecode/plate-table";
import {
  createTodoListPlugin,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_UL,
} from "@udecode/plate-list";
import {
  createExcalidrawPlugin,
  ELEMENT_EXCALIDRAW,
} from "@udecode/plate-excalidraw";
import {
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createCodePlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
} from "@udecode/plate-basic-marks";
import {
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createFontSizePlugin,
} from "@udecode/plate-font";
import { createHighlightPlugin } from "@udecode/plate-highlight";
import { createKbdPlugin } from "@udecode/plate-kbd";
import { createAlignPlugin } from "@udecode/plate-alignment";
import { createIndentPlugin } from "@udecode/plate-indent";
import { createIndentListPlugin } from "@udecode/plate-indent-list";
import { createLineHeightPlugin } from "@udecode/plate-line-height";
import { createComboboxPlugin } from "@udecode/plate-combobox";
import { createDndPlugin } from "@udecode/plate-dnd";
import { createEmojiPlugin } from "@udecode/plate-emoji";
import {
  createExitBreakPlugin,
  createSoftBreakPlugin,
} from "@udecode/plate-break";
import { createNodeIdPlugin } from "@udecode/plate-node-id";
import { createResetNodePlugin } from "@udecode/plate-reset-node";
import {
  createSelectOnBackspacePlugin,
  createDeletePlugin,
} from "@udecode/plate-select";
import { createTabbablePlugin } from "@udecode/plate-tabbable";
import { createTrailingBlockPlugin } from "@udecode/plate-trailing-block";
import { createCommentsPlugin } from "@udecode/plate-comments";
import { createAutoformatPlugin } from "@udecode/plate-autoformat";
import { createBlockSelectionPlugin } from "@udecode/plate-selection";
import { createDeserializeDocxPlugin } from "@udecode/plate-serializer-docx";
import { createDeserializeCsvPlugin } from "@udecode/plate-serializer-csv";
import { createDeserializeMdPlugin } from "@udecode/plate-serializer-md";
import { createJuicePlugin } from "@udecode/plate-juice";

import { LinkFloatingToolbar } from "@/components/plate-ui/link-floating-toolbar";
import { EmojiCombobox } from "@/components/plate-ui/emoji-combobox";
import { createPlateUI } from "./createPlateUI";
import { createPreviewPlugin } from "../MarkdownPreview/createPreviewPlugin";
import { useMemo } from "react";

export const usePlugins = () => {
  return useMemo(() => {
    return createPlugins(
      [
        createHorizontalRulePlugin(),
        createParagraphPlugin(),
        createBlockquotePlugin(),
        createCodeBlockPlugin(),
        createHeadingPlugin(),
        createBoldPlugin(),
        createItalicPlugin(),
        createUnderlinePlugin(),
        createStrikethroughPlugin(),
        createCodePlugin(),
        createLinkPlugin({
          renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,
        }),
        createImagePlugin(),
        createMediaEmbedPlugin(),
        createCaptionPlugin({
          options: {
            pluginKeys: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED],
          },
        }),
        createMentionPlugin(),
        createTablePlugin(),
        createTodoListPlugin({
          enabled: true,
        }),
        createExcalidrawPlugin({
          enabled: true,
        }),
        createBoldPlugin(),
        createItalicPlugin(),
        createUnderlinePlugin(),
        createStrikethroughPlugin(),
        createCodePlugin(),
        createSubscriptPlugin(),
        createSuperscriptPlugin(),
        createFontColorPlugin(),
        createFontBackgroundColorPlugin(),
        createFontSizePlugin(),
        createHighlightPlugin(),
        createKbdPlugin(),
        createAlignPlugin({
          inject: {
            props: {
              validTypes: [
                ELEMENT_PARAGRAPH,
                ELEMENT_H1,
                ELEMENT_H2,
                ELEMENT_H3,
              ],
            },
          },
        }),
        createIndentPlugin({
          inject: {
            props: {
              validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1],
            },
          },
        }),
        createIndentListPlugin({
          inject: {
            props: {
              validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1],
            },
          },
        }),
        createLineHeightPlugin({
          inject: {
            props: {
              defaultNodeValue: 1.5,
              validNodeValues: [1, 1.2, 1.5, 2, 3],
              validTypes: [
                ELEMENT_PARAGRAPH,
                ELEMENT_H1,
                ELEMENT_H2,
                ELEMENT_H3,
              ],
            },
          },
        }),
        createComboboxPlugin(),
        createDndPlugin({
          options: { enableScroller: true },
        }),
        createEmojiPlugin({
          renderAfterEditable: EmojiCombobox,
        }),
        createExitBreakPlugin({
          options: {
            rules: [
              {
                hotkey: "mod+enter",
              },
              {
                hotkey: "mod+shift+enter",
                before: true,
              },
              {
                hotkey: "enter",
                query: {
                  start: true,
                  end: true,
                  allow: KEYS_HEADING,
                },
                relative: true,
                level: 1,
              },
            ],
          },
        }),
        createNodeIdPlugin(),
        createResetNodePlugin({
          options: {
            rules: [
              // Usage: https://platejs.org/docs/reset-node
            ],
          },
        }),
        createSelectOnBackspacePlugin({
          options: {
            query: {
              allow: [ELEMENT_EXCALIDRAW],
            },
          },
        }),
        createDeletePlugin(),
        createSoftBreakPlugin({
          options: {
            rules: [
              { hotkey: "shift+enter" },
              {
                hotkey: "enter",
                query: {
                  allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
                },
              },
            ],
          },
        }),
        createTabbablePlugin(),
        createTrailingBlockPlugin({
          options: { type: ELEMENT_PARAGRAPH },
        }),
        createCommentsPlugin(),
        createAutoformatPlugin({
          options: {
            rules: [
              // Usage: https://platejs.org/docs/autoformat
            ],
            enableUndoOnDelete: true,
          },
        }),
        createBlockSelectionPlugin({
          options: {
            sizes: {
              top: 0,
              bottom: 0,
            },
          },
        }),
        createPreviewPlugin(),
        createDeserializeDocxPlugin(),
        createDeserializeCsvPlugin(),
        createDeserializeMdPlugin({
          enabled: true,
        }),
        createJuicePlugin(),
      ],
      {
        components: createPlateUI(
          {},
          {
            draggable: true,
            placeholder: true,
          }
        ),
      }
    );
  }, []);
};
