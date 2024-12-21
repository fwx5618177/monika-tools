import { NodeStyle } from "@/components/Graph/interfaces/lib.interface";
import PixiNode from "@/components/Graph/lib/PixiNode";
import { TextureCache } from "@/components/Graph/texture-cache";
import { Renderer } from "@pixi/core";
import { Container } from "@pixi/display";
import { IPointData } from "@pixi/math";

class CircleNode {
  container: Container;
  pixiNode: PixiNode;
  textureCache: TextureCache;

  constructor(container: Container, renderer: Renderer) {
    this.pixiNode = new PixiNode();
    this.textureCache = new TextureCache(renderer);

    this.container = container;

    container.addChild(this.pixiNode.nodeGfx);
  }

  addNew(nodeStyle: NodeStyle) {
    this.pixiNode.updateStyle(nodeStyle, this.textureCache);
  }

  updatePosition(position: IPointData) {
    this.pixiNode.updatePosition(position);
  }
}

export default CircleNode;
