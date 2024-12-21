// @ts-nocheck
import { Container } from "@pixi/display";
import { IPointData } from "@pixi/math";
import { TypedEmitter } from "tiny-typed-emitter";
import { EdgeStyle, PixiEdgeEvents } from "../interfaces/lib.interface";
import EdgeRender from "../render/edge";
import { TextureCache } from "../texture-cache";

class PixiEdge extends TypedEmitter<PixiEdgeEvents> {
  edgeGfx: Container;
  edgePlaceholderGfx: Container = new Container();
  edgeRender: EdgeRender;
  hovered: boolean = false;

  constructor() {
    super();

    this.createEdge();
  }

  createEdge() {
    const edgeGfx = new Container();

    edgeGfx.interactive = true;
    edgeGfx.buttonMode = true;

    edgeGfx.on("mousemove", (event) =>
      this.emit("mousemove", event.data.originalEvent as unknown as MouseEvent)
    );

    edgeGfx.on("mouseover", (event) =>
      this.emit("mouseover", event.data.originalEvent as unknown as MouseEvent)
    );

    edgeGfx.on("mouseout", (event) =>
      this.emit("mouseout", event.data.originalEvent as unknown as MouseEvent)
    );

    edgeGfx.on("mousedown", (event) =>
      this.emit("mousedown", event.data.originalEvent as unknown as MouseEvent)
    );

    edgeGfx.on("mouseup", (event) =>
      this.emit("mouseup", event.data.originalEvent as unknown as MouseEvent)
    );

    this.edgeRender = new EdgeRender(edgeGfx);
    this.edgeGfx = edgeGfx;
  }

  updateEdgePosition(
    sourceNodePosition: IPointData,
    targetNodePosition: IPointData
  ) {
    const position = {
      x: (sourceNodePosition.x + targetNodePosition.x) / 2,
      y: (sourceNodePosition.y + targetNodePosition.y) / 2,
    };
    const rotation = -Math.atan2(
      targetNodePosition.x - sourceNodePosition.x,
      targetNodePosition.y - sourceNodePosition.y
    );
    const length = Math.hypot(
      targetNodePosition.x - sourceNodePosition.x,
      targetNodePosition.y - sourceNodePosition.y
    );

    this.edgeGfx.position.copyFrom(position);
    this.edgeGfx.rotation = rotation;
    this.edgeGfx.height = length;
  }

  updateEdgeStyle(edgeStyle: EdgeStyle, textureCache: TextureCache) {
    this.edgeRender.updateEdgeStyle(edgeStyle, textureCache);
  }

  updateEdgeVisibility(zoomStep: number) {
    this.edgeRender.updateEdgeVisibility(zoomStep);
  }
}

export default PixiEdge;
