import { Container, DisplayObject } from "@pixi/display";
import { Circle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { SmoothGraphics } from "@pixi/graphics-smooth";
import { Node_Config_Name } from "../config/config";
import { TextureCache } from "../texture-cache";
import { NodeStyle } from "../interfaces/lib.interface";
import { textToPixi } from "../styling/text";
import { colorToPixi } from "../styling/color";

class NodeRender {
  nodeGfx: Container;
  nodeCircle: Sprite;
  nodeCircleBorder: Sprite;
  nodeIcon: Sprite;

  constructor(nodeGfx: Container) {
    this.nodeGfx = nodeGfx;

    this.createNode();
  }

  createNode() {
    // nodeGfx
    this.nodeGfx.hitArea = new Circle(0, 0);

    // nodeGfx -> nodeCircle
    this.nodeCircle = new Sprite();
    this.nodeCircle.anchor.set(0.5);
    this.nodeGfx.addChild(this.nodeCircle);

    // nodeGfx -> nodeCircleBorder
    this.nodeCircleBorder = new Sprite();
    this.nodeCircleBorder.anchor.set(0.5);
    this.nodeGfx.addChild(this.nodeCircleBorder);

    // nodeGfx -> nodeIcon
    this.nodeIcon = new Sprite();
    this.nodeIcon.anchor.set(0.5);
    this.nodeGfx.addChild(this.nodeIcon);
  }

  updateStyle(nodeStyle: NodeStyle, textureCache: TextureCache) {
    // 计算节点的外部尺寸
    const nodeOuterSize = nodeStyle.size + nodeStyle.border.width;

    // 创建纹理
    const nodeCircleTextureKey = [
      Node_Config_Name.NODE_CIRCLE,
      nodeStyle.size,
    ].join(Node_Config_Name.DELIMETER);
    const nodeCircle = textureCache.get(nodeCircleTextureKey, () => {
      // 绘制一个圆形纹理
      const graphics = new SmoothGraphics();
      graphics.beginFill(nodeStyle.color, 1.0, true);
      graphics.drawCircle(nodeStyle.size, nodeStyle.size, nodeStyle.size);
      graphics.endFill();

      return graphics;
    });

    // 创建border纹理
    const nodeCircleBorderTextureKey = [
      Node_Config_Name.NODE_CIRCLE_BORDER,
      nodeStyle.size,
      nodeStyle.border.width,
    ].join(Node_Config_Name.DELIMETER);
    const nodeCircleBorderTexture = textureCache.get(
      nodeCircleBorderTextureKey,
      () => {
        const graphics = new SmoothGraphics();
        graphics.lineStyle(nodeStyle.border.width, Node_Config_Name.COLOR);
        graphics.drawCircle(nodeOuterSize, nodeOuterSize, nodeStyle.size);

        return graphics as any;
      }
    );

    // 创建icon纹理
    const nodeIconTextureKey = [
      Node_Config_Name.NODE_ICON,
      nodeStyle.icon.fontFamily,
      nodeStyle.icon.fontSize,
      nodeStyle.icon.content,
    ].join(Node_Config_Name.DELIMETER);
    const nodeIconTexture = textureCache.get(nodeIconTextureKey, () => {
      const text = textToPixi(nodeStyle.icon.type, nodeStyle.icon.content, {
        fontFamily: nodeStyle.icon.fontFamily,
        fontSize: nodeStyle.icon.fontSize,
      });

      return text;
    });

    // nodeGfx
    (this.nodeGfx.hitArea as Circle).radius = nodeOuterSize;

    this.nodeCircle.texture = nodeCircle;
    [this.nodeCircle.tint, this.nodeCircle.alpha] = colorToPixi(
      nodeStyle.color
    );

    this.nodeCircleBorder.texture = nodeCircleBorderTexture;
    [this.nodeCircleBorder.tint, this.nodeCircleBorder.alpha] = colorToPixi(
      nodeStyle.border.color
    );

    this.nodeIcon.texture = nodeIconTexture;
    [this.nodeIcon.tint, this.nodeIcon.alpha] = colorToPixi(
      nodeStyle.icon.color
    );
    this.nodeGfx.addChild(this.nodeIcon);
  }

  updateNodeVisibility(zoomStep: number) {
    this.nodeCircleBorder.visible =
      this.nodeCircleBorder.visible && zoomStep >= 1;
    this.nodeIcon.visible = this.nodeIcon.visible && zoomStep >= 2;
  }
}

export default NodeRender;
