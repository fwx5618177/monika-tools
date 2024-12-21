import { FC } from "react";
import {
  Sandpack,
  SandpackPredefinedTemplate,
} from "@codesandbox/sandpack-react";

import { ICodeRenderStrategy } from "./ICodeRenderStrategy";

const SandpackStrategy: FC<ICodeRenderStrategy> = ({
  props,
  children,
  node,
  language,
  className,
}) => {
  const { html, type } = props;
  const isLink = type === "link";
  const blob = new Blob([html], { type: "text/html" });
  const url = isLink ? html : URL.createObjectURL(blob);

  return (
    <div
      style={{
        margin: "2rem 0",
      }}
    >
      <iframe
        style={{
          width: "100%",
          height: 900,
          outline: "1px solid #252525",
          border: 0,
          borderRadius: 8,
          marginBottom: 16,
          zIndex: 100,
        }}
        src={url}
      ></iframe>
    </div>
  );
};

export default SandpackStrategy;
