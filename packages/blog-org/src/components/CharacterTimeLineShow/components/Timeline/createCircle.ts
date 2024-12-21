import { NodeStyle } from "@/components/Graph";
import { TextType } from "@/components/Graph/interfaces/lib.interface";
import { TextureCache } from "@/components/Graph/texture-cache";
import { Container } from "@pixi/display";
import PixiNode from "@/components/Graph/lib/PixiNode";

export const createCircle = ({ app }) => {
  const nodeContainer = new Container();

  app.stage.addChild(nodeContainer);

  const nodeStyle: NodeStyle = {
    size: 50,
    color: "#ff0000", // 红色
    border: {
      width: 0.5,
      color: "#000000", // 黑色
    },
    icon: {
      content: "✪",
      type: TextType.TEXT,
      fontFamily: "Arial",
      fontSize: 24,
      color: "#0000ff", // 蓝色
    },
    ripple: {
      rippleColor: "#0000ff", // 蓝色
      rippleFade: 0.01,
      rippleSpeed: 1,

      radius: 400,
      maxRadius: 100,
      alpha: 0.5,
    },
    label: {
      content: "Hello World",
      type: TextType.TEXT,
      fontFamily: "Arial",
      fontSize: 26,
      color: "#000000", // 黑色
      backgroundColor: "#0000ff", // 白色
      padding: 5,
    },
  };

  const node = new PixiNode();
  const texture = new TextureCache(app.renderer);
  nodeContainer.addChild(node.nodeGfx);
  nodeContainer.addChild(node.nodeLabelGfx);

  node.updateStyle(nodeStyle, texture);
  node.updatePosition({ x: 300, y: 300 });

  return nodeContainer;
};
