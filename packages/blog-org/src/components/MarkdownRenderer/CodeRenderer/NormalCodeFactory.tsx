import { FC } from "react";
import { ICodeRenderStrategy } from "./ICodeRenderStrategy";
import NormalCodeStrategy from "./NormalCodeStrategy";
import BashCodeStrategy from "./BashCodeStrategy";
import SandpackStrategy from "./SandpackStrategy";

const NormalCodeFactory: FC<ICodeRenderStrategy> = (props) => {
  const { language, props: hProperties } = props;

  switch (hProperties.mode) {
    case "sandpack":
      return <SandpackStrategy {...props} />;
    default:
      break;
  }

  switch (language) {
    case "bash":
      return <BashCodeStrategy {...props} />;
    case "react":
    default:
      return <NormalCodeStrategy {...props} />;
  }
};

export default NormalCodeFactory;
