import ClipboardJS from "clipboard";
import { FC, useRef } from "react";
import style from "./index.module.scss";
import { ICodeRenderStrategy } from "./ICodeRenderStrategy";

const InlineCodeStrategy: FC<ICodeRenderStrategy> = ({
  props,
  children,
  node,
  language,
  className,
}) => {
  const codeRef = useRef(null);
  const text = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    const clipboard = new ClipboardJS(codeRef.current, {
      text: () => text,
    });

    clipboard.on("success", () => {
      console.log("Text copied: ", text);
      clipboard.destroy();
    });

    clipboard.on("error", () => {
      console.log("Copy failed: ", text);
      clipboard.destroy();
    });
  };

  return (
    <code
      ref={codeRef}
      className={`${style["inline-code"]} ${className ? className : ""}`}
      onClick={handleCopy}
      {...props}
    >
      {children}
    </code>
  );
};

export default InlineCodeStrategy;
