import { FC } from "react";
import { ICodeRenderStrategy } from "./ICodeRenderStrategy";
import style from "./index.module.scss";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeBlock from "@/components/CodeBlock";

const BashCodeStrategy: FC<ICodeRenderStrategy> = ({
  props,
  children,
  node,
  language,
  className,
}) => {
  const text = String(children).replace(/\n$/, "");
  return (
    <CodeBlock language={language} text={text}>
      <SyntaxHighlighter
        language={language}
        style={themes["vscDarkPlus"]}
        showLineNumbers
        wrapLines
        lineNumberStyle={{ minWidth: 30 }}
        lineProps={{
          style: {
            display: "block",
            paddingLeft: 10,
          },
          className: "bash-line",
        }}
      >
        {text}
      </SyntaxHighlighter>
    </CodeBlock>
  );
};

export default BashCodeStrategy;
