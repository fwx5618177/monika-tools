import { Container, DisplayObject } from "@pixi/display";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { Node_Config_Name } from "../config/config";
import { TextureCache } from "../texture-cache";
import { EdgeStyle } from "../interfaces/lib.interface";
import { colorToPixi } from "../styling/color";

class EdgeRender {
  edgeGfx: Container<DisplayObject>;
  edgeLine: Sprite;

  constructor(edgeGfx: Container) {
    this.edgeGfx = edgeGfx;

    this.createEdge();
  }

  createEdge() {
    // edgeGfx -> edgeLine
    this.edgeLine = new Sprite(Texture.WHITE);
    this.edgeLine.pluginName = Node_Config_Name.EDGE_LINE;
    this.edgeLine.anchor.set(0.5);
    this.edgeGfx.addChild(this.edgeLine);
  }

  updateEdgeStyle(edgeStyle: EdgeStyle, textureCache: TextureCache) {
    this.edgeLine.width = edgeStyle.width;
    [this.edgeLine.tint, this.edgeLine.alpha] = colorToPixi(edgeStyle.color);
  }

  updateEdgeVisibility(zoomStep) {
    this.edgeLine.visible = this.edgeLine.visible && zoomStep >= 1;
  }
}

export default EdgeRender;
