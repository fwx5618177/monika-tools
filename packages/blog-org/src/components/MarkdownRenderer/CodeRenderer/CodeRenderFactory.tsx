import InlineCodeStrategy from "./InlineCodeStrategy";
import NormalCodeFactory from "./NormalCodeFactory";

const CodeRenderFactory = (type: string) => {
  switch (type) {
    case "inline":
      return InlineCodeStrategy;
    case "code":
    default:
      return NormalCodeFactory;
  }
};

export default CodeRenderFactory;
