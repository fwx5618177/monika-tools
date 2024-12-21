import { Container, DisplayObject } from "@pixi/display";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { Node_Config_Name } from "../config/config";
import { NodeStyle } from "../interfaces/lib.interface";
import { TextureCache } from "../texture-cache";
import { textToPixi } from "../styling/text";
import { colorToPixi } from "../styling/color";
import { BitmapText } from "@pixi/text-bitmap";
import { Texture } from "@pixi/core";

class NodeLabelRender {
  nodeLabelGfx: Container;
  nodeLabelBackground: Sprite;
  nodeLabelText: Sprite;

  constructor(nodeGfx: Container) {
    this.nodeLabelGfx = nodeGfx;

    this.createNodeLabel();
  }

  createNodeLabel() {
    // nodeGfx -> nodeLabelBackground
    this.nodeLabelBackground = new Sprite();
    this.nodeLabelBackground.anchor.set(0.5);
    this.nodeLabelGfx.addChild(this.nodeLabelBackground);

    // nodeGfx -> nodeLabelText
    this.nodeLabelText = new Sprite();
    this.nodeLabelText.anchor.set(0.5);
    this.nodeLabelGfx.addChild(this.nodeLabelText);
  }

  updateNodeLabelStyle(nodeStyle: NodeStyle, textureCache: TextureCache) {
    const nodeOuterSize = nodeStyle.size + nodeStyle.border.width;

    const nodeLabelTextTextureKey = [
      Node_Config_Name.NODE_LABEL_BACKGROUND,
      nodeStyle.label.fontFamily,
      nodeStyle.label.fontSize,
      nodeStyle.label.content,
    ].join(Node_Config_Name.DELIMETER);

    const nodeLabelTextTexture = textureCache.get(
      nodeLabelTextTextureKey,
      () => {
        const text = textToPixi(nodeStyle.label.type, nodeStyle.label.content, {
          fontFamily: nodeStyle.label.fontFamily,
          fontSize: nodeStyle.label.fontSize,
        });

        return text;
      }
    );

    // nodeLabelGfx -> nodeLabelBackground
    this.nodeLabelBackground.y =
      nodeOuterSize +
      (nodeLabelTextTexture.height + nodeStyle.label.padding * 2) / 2;

    this.nodeLabelBackground.width =
      nodeLabelTextTexture.width + nodeStyle.label.padding * 2;

    this.nodeLabelBackground.height =
      nodeLabelTextTexture.height + nodeStyle.label.padding * 2;

    [this.nodeLabelBackground.tint, this.nodeLabelBackground.alpha] =
      colorToPixi(nodeStyle.label.backgroundColor);

    // nodeLabelGfx -> nodeLabelText
    this.nodeLabelText.texture = nodeLabelTextTexture;
    this.nodeLabelText.y =
      nodeOuterSize +
      (nodeLabelTextTexture.height + nodeStyle.label.padding * 2) / 2;
    [this.nodeLabelText.tint, this.nodeLabelText.alpha] = colorToPixi(
      nodeStyle.label.color
    );
  }

  updateNodeLabelVisibility(zoomStep: number) {
    this.nodeLabelBackground.visible =
      this.nodeLabelBackground.visible && zoomStep >= 3;

    this.nodeLabelText.visible = this.nodeLabelText.visible && zoomStep >= 3;
  }
}

export default NodeLabelRender;
