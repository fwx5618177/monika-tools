import { GraphStyle } from "../interfaces/graph.interface";
import { TextType } from "../interfaces/lib.interface";

export const DEFAULT_STYLE: GraphStyle = {
  node: {
    size: 15,
    color: "#000000",
    border: {
      width: 2,
      color: "#ffffff",
    },
    icon: {
      type: TextType.TEXT,
      fontFamily: "Arial",
      fontSize: 20,
      color: "#ffffff",
      content: "",
    },
    label: {
      type: TextType.TEXT,
      fontFamily: "Arial",
      fontSize: 12,
      content: "",
      color: "#333333",
      backgroundColor: "rgba(0, 0, 0, 0)",
      padding: 4,
    },
  },
  edge: {
    width: 1,
    color: "#cccccc",
  },
};
