import React from "react";

import CodeRenderFactory from "./CodeRenderer/CodeRenderFactory";

const CodeBlock = ({ node, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "unknown";
  const CodeRenderer = CodeRenderFactory(!className ? "inline" : "code");

  return (
    <CodeRenderer
      language={language}
      node={node}
      props={props}
      className={className}
    >
      {children}
    </CodeRenderer>
  );
};

export default CodeBlock;
