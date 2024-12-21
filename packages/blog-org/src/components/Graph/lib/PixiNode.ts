import { Container } from "@pixi/display";
import { InteractionEvent } from "@pixi/interaction";
import { IPointData } from "@pixi/math";
import { TypedEmitter } from "tiny-typed-emitter";
import type { NodeStyle, PixiNodeEvents } from "../interfaces/lib.interface";
import NodeRender from "../render/node";
import NodeLabelRender from "../render/node-label";
import { TextureCache } from "../texture-cache";

class PixiNode extends TypedEmitter<PixiNodeEvents> {
  nodeGfx: Container;
  nodeLabelGfx: Container;
  nodePlaceholderGfx: Container;
  nodeLabelPlaceholderGfx: Container;

  nodeRender: NodeRender;
  nodeLabelRender: NodeLabelRender;

  hovered: boolean = false;

  constructor() {
    super();

    this.createNode();
    this.createNodeLabel();

    this.nodePlaceholderGfx = new Container();
    this.nodeLabelPlaceholderGfx = new Container();
  }

  private createNode() {
    const nodeGfx = new Container();

    nodeGfx.interactive = true;
    nodeGfx.buttonMode = true;

    // @ts-ignore
    nodeGfx.on("mousemove", (event: InteractionEvent) =>
      this.emit("mousemove", event.data.originalEvent as MouseEvent)
    );

    // @ts-ignore
    nodeGfx.on("mouseover", (event: InteractionEvent) =>
      this.emit("mouseover", event.data.originalEvent as MouseEvent)
    );

    // @ts-ignore
    nodeGfx.on("mouseout", (event: InteractionEvent) =>
      this.emit("mouseout", event.data.originalEvent as MouseEvent)
    );

    // @ts-ignore
    nodeGfx.on("mousedown", (event: InteractionEvent) =>
      this.emit("mousedown", event.data.originalEvent as MouseEvent)
    );

    // @ts-ignore
    nodeGfx.on("mouseup", (event: InteractionEvent) =>
      this.emit("mouseup", event.data.originalEvent as MouseEvent)
    );

    this.nodeRender = new NodeRender(nodeGfx);

    this.nodeGfx = nodeGfx;
  }

  private createNodeLabel() {
    const nodeLabelGfx = new Container();

    nodeLabelGfx.interactive = true;
    nodeLabelGfx.buttonMode = true;

    // @ts-ignore
    nodeLabelGfx.on("mousemove", (event: InteractionEvent) =>
      this.emit("mousemove", event.data.originalEvent as MouseEvent)
    );
    // @ts-ignore
    nodeLabelGfx.on("mouseover", (event: InteractionEvent) =>
      this.emit("mouseover", event.data.originalEvent as MouseEvent)
    );
    // @ts-ignore
    nodeLabelGfx.on("mouseout", (event: InteractionEvent) =>
      this.emit("mouseout", event.data.originalEvent as MouseEvent)
    );
    // @ts-ignore
    nodeLabelGfx.on("mousedown", (event: InteractionEvent) =>
      this.emit("mousedown", event.data.originalEvent as MouseEvent)
    );
    // @ts-ignore
    nodeLabelGfx.on("mouseup", (event: InteractionEvent) =>
      this.emit("mouseup", event.data.originalEvent as MouseEvent)
    );

    this.nodeLabelRender = new NodeLabelRender(nodeLabelGfx);

    this.nodeLabelGfx = nodeLabelGfx;
  }

  updatePosition(position: IPointData) {
    this.nodeGfx.position.copyFrom(position);
    this.nodeLabelGfx.position.copyFrom(position);
  }

  updateStyle(nodeStyle: NodeStyle, textureCache: TextureCache) {
    this.nodeRender.updateStyle(nodeStyle, textureCache);
    this.nodeLabelRender.updateNodeLabelStyle(nodeStyle, textureCache);
  }

  updateVisibility(zoomStep: number) {
    this.nodeRender.updateNodeVisibility(zoomStep);
    this.nodeLabelRender.updateNodeLabelVisibility(zoomStep);
  }
}

export default PixiNode;
