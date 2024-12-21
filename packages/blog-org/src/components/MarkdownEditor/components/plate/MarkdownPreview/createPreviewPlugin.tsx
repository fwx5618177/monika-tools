import { createPluginFactory } from "@udecode/plate-common";
import { decoratePreview } from "./decoratePreview";

export const createPreviewPlugin = createPluginFactory({
  key: "preview-md",
  decorate: decoratePreview,
});
