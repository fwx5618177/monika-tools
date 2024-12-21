import { FC, useState } from "react";
import * as themes from "react-syntax-highlighter/dist/esm/styles/prism";
import SyntaxHighlighter from "react-syntax-highlighter";

import { ICodeRenderStrategy } from "./ICodeRenderStrategy";
import CodeBlock from "@/components/CodeBlock";

const NormalCodeStrategy: FC<ICodeRenderStrategy> = ({
  props,
  children,
  node,
  language,
  className,
}) => {
  // const [currentTheme, setCurrentTheme] = useState("solarizedDarkAtom");
  const text = String(children).replace(/\n$/, "");

  return (
    <CodeBlock
      language={language}
      text={text}
      // setTheme={setCurrentTheme}
    >
      <SyntaxHighlighter
        // style={themes[currentTheme]}
        style={themes["solarizedDarkAtom"]}
        language={language}
        showLineNumbers
        showInlineLineNumbers
        lineNumberStyle={{
          opacity: 0.9,
          fontSize: "0.8em",
          paddingRight: 10,
        }}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </CodeBlock>
  );
};

export default NormalCodeStrategy;
