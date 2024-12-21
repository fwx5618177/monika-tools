// @ts-nocheck

import { extensions } from "@pixi/extensions";
import { TickerPlugin } from "@pixi/ticker";
import { AppLoaderPlugin, IAddOptions } from "@pixi/loaders";
import { loadBitmapFont } from "@pixi/text-bitmap";
import { Renderer, BatchRenderer } from "@pixi/core";
import { InteractionManager } from "@pixi/interaction";
import { Container } from "@pixi/display";
import { Point, IPointData, Rectangle } from "@pixi/math";
import { Viewport } from "pixi-viewport";
import { Cull } from "@pixi-essentials/cull";
import { AbstractGraph } from "graphology-types";
import { TypedEmitter } from "tiny-typed-emitter";
import { LINE_SCALE_MODE, settings } from "@pixi/graphics-smooth";
import { Application } from "@pixi/app";
import {
  BaseNodeAttributes,
  BaseEdgeAttributes,
} from "./interfaces/lib.interface";
import { TextureCache } from "./texture-cache";
import PixiNode from "./lib/PixiNode";
import PixiEdge from "./lib/PixiEdge";
import { resolveStyleDefinitions } from "./styling/style";
import {
  GraphOptions,
  GraphStyleDefinition,
  PixiGraphEvents,
} from "./interfaces/graph.interface";
import { Node_Config_Name } from "./config/config";
import { DEFAULT_STYLE } from "./config/defaultValue";

class PixiGraph<
  NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes,
  EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes
> extends TypedEmitter<PixiGraphEvents> {
  private static isPluginsRegistered = false;

  container: HTMLElement;
  graph: AbstractGraph<NodeAttributes, EdgeAttributes>;

  style: GraphStyleDefinition<NodeAttributes, EdgeAttributes>;
  hoverStyle: GraphStyleDefinition<NodeAttributes, EdgeAttributes>;

  resources?: IAddOptions[];

  private app: Application;
  private textureCache: TextureCache;
  private viewport: Viewport;
  private cull: Cull;
  private resizeObserver: ResizeObserver;

  private edgeLayer: Container;
  private frontEdgeLayer: Container;

  private nodeLayer: Container;
  private nodeLabelLayer: Container;
  private frontNodeLayer: Container;
  private frontNodeLabelLayer: Container;

  private nodeKeyToNodeObject = new Map<string, PixiNode>();
  private edgeKeyToEdgeObject = new Map<string, PixiEdge>();

  private mousedownNodeKey: string;
  private mousedownEdgeKey: string;

  private onGraphNodeAddedBound = this.onGraphNodeAdded.bind(this);
  private onGraphEdgeAddedBound = this.onGraphEdgeAdded.bind(this);
  private onGraphNodeDroppedBound = this.onGraphNodeDropped.bind(this);
  private onGraphEdgeDroppedBound = this.onGraphEdgeDropped.bind(this);
  private onGraphClearedBound = this.onGraphCleared.bind(this);
  private onGraphEdgesClearedBound = this.onGraphEdgesCleared.bind(this);
  private onGraphNodeAttributesUpdatedBound =
    this.onGraphNodeAttributesUpdated.bind(this);
  private onGraphEdgeAttributesUpdatedBound =
    this.onGraphEdgeAttributesUpdated.bind(this);
  private onGraphEachNodeAttributesUpdatedBound =
    this.onGraphEachNodeAttributesUpdated.bind(this);
  private onGraphEachEdgeAttributesUpdatedBound =
    this.onGraphEachEdgeAttributesUpdated.bind(this);
  private onDocumentMouseMoveBound = this.onDocumentMouseMove.bind(this);
  private onDocumentMouseUpBound = this.onDocumentMouseUp.bind(this);

  constructor(options: GraphOptions<NodeAttributes, EdgeAttributes>) {
    super();

    if (!PixiGraph.isPluginsRegistered) {
      extensions.add(TickerPlugin);
      extensions.add(AppLoaderPlugin);
      extensions.add(loadBitmapFont);
      extensions.add("batch", BatchRenderer);
      extensions.add("interaction", InteractionManager);

      PixiGraph.isPluginsRegistered = true;
    }

    this.container = options.container;
    this.graph = options.graph;

    this.style = options.style;
    this.hoverStyle = options.hoverStyle;

    this.resources = options.resources;

    this.isHTMLElement(this.container);
    this.settingsInitial();

    this.app = new Application({
      resizeTo: this.container,
      resolution: window.devicePixelRatio,
      antialias: true,
      autoDensity: true,
      backgroundAlpha: 0,
    });

    this.container.appendChild(this.app.view as HTMLCanvasElement);
    this.app.renderer.plugins.interaction.moveWhenInside = true;

    this.app.view.addEventListener("wheel", (event) => event.preventDefault());

    this.textureCache = new TextureCache(this.app.renderer as Renderer);

    this.initializeViewPort();
    this.initializeResizeObserver();
    this.initializeLoadResource();
  }

  public isHTMLElement(container: any): asserts container is HTMLElement {
    if (!(container instanceof HTMLElement)) {
      throw new Error("container must be HTMLElement");
    }
  }

  public settingsInitial() {
    settings.LINE_SCALE_MODE = LINE_SCALE_MODE.NORMAL;
  }

  public initializeViewPort() {
    this.viewport = new Viewport({
      screenWidth: this.container.clientWidth,
      screenHeight: this.container.clientHeight,
      events: this.app.renderer.plugins.interaction,
      worldHeight: 1000,
      worldWidth: 1000,
    })
      .drag()
      .pinch()
      .wheel()
      .decelerate()
      .clampZoom({
        maxScale: 1,
        minScale: 0.1,
      })
      .clamp({
        left: -Infinity,
        right: Infinity,
        top: -Infinity,
        bottom: Infinity,
      });

    this.app.stage.addChild(this.viewport as any);

    // create layers
    this.edgeLayer = new Container();
    this.frontEdgeLayer = new Container();

    this.nodeLayer = new Container();
    this.nodeLabelLayer = new Container();

    this.frontNodeLayer = new Container();
    this.frontNodeLabelLayer = new Container();

    this.viewport.addChild<any>(this.edgeLayer);
    this.viewport.addChild<any>(this.frontEdgeLayer);

    this.viewport.addChild<any>(this.nodeLayer);
    this.viewport.addChild<any>(this.nodeLabelLayer);

    this.viewport.addChild<any>(this.frontNodeLayer);
    this.viewport.addChild<any>(this.frontNodeLabelLayer);
  }

  public initializeResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.app.resize();
      this.viewport.resize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.updateGraphVisibility();
    });
  }

  public initializeLoadResource() {
    if (this.resources) {
      this.app.loader.add(this.resources);
    }

    this.app.loader.load(() => {
      this.viewport.on("frame-end", () => {
        if (this.viewport.dirty) {
          this.updateGraphVisibility();
          this.viewport.dirty = false;
        }
      });

      this.resizeObserver.observe(this.container);

      // listen to graph changes
      this.graph.on("nodeAdded", this.onGraphNodeAddedBound);
      this.graph.on("edgeAdded", this.onGraphEdgeAddedBound);
      this.graph.on("nodeDropped", this.onGraphNodeDroppedBound);
      this.graph.on("edgeDropped", this.onGraphEdgeDroppedBound);
      this.graph.on("cleared", this.onGraphClearedBound);
      this.graph.on("edgesCleared", this.onGraphEdgesClearedBound);
      this.graph.on(
        "nodeAttributesUpdated",
        this.onGraphNodeAttributesUpdatedBound
      );
      this.graph.on(
        "edgeAttributesUpdated",
        this.onGraphEdgeAttributesUpdatedBound
      );
      this.graph.on(
        "eachNodeAttributesUpdated",
        this.onGraphEachNodeAttributesUpdatedBound
      );
      this.graph.on(
        "eachEdgeAttributesUpdated",
        this.onGraphEachEdgeAttributesUpdatedBound
      );

      // initial draw
      this.createGraph();
      this.resetView();
    });
  }

  private createGraph() {
    this.graph.forEachNode(this.createNode.bind(this));
    this.graph.forEachEdge(this.createEdge.bind(this));
  }

  resetView() {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    this.graph.nodes().forEach((nodeKey) => {
      const x = this.graph.getNodeAttribute(nodeKey, "x");
      const y = this.graph.getNodeAttribute(nodeKey, "y");
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    const graphWidth = Math.abs(maxX - minX);
    const graphHeight = Math.abs(maxY - minY);
    const graphCenter = new Point(
      minX + graphWidth / 2,
      minY + graphHeight / 2
    );

    this.updateWorldSize(graphWidth, graphHeight);
    this.viewport.setZoom(1);
    this.viewport.center = graphCenter;
    this.viewport.fit(true);
  }

  updateWorldSize(graphWidth: number, graphHeight: number) {
    const worldWidth = graphWidth + Node_Config_Name.WORLD_PADDING * 2;
    const worldHeight = graphHeight + Node_Config_Name.WORLD_PADDING * 2;

    this.viewport.resize(
      this.container.clientWidth,
      this.container.clientHeight,
      worldWidth,
      worldHeight
    );
  }

  private get zoomStep() {
    return Math.min(this.viewport.worldWidth, this.viewport.worldHeight) / 10;
  }

  zoomIn() {
    this.viewport.zoom(-this.zoomStep, true);
  }

  zoomOut() {
    this.viewport.zoom(this.zoomStep, true);
  }

  destroy() {
    this.graph.off("nodeAdded", this.onGraphNodeAddedBound);
    this.graph.off("edgeAdded", this.onGraphEdgeAddedBound);
    this.graph.off("nodeDropped", this.onGraphNodeDroppedBound);
    this.graph.off("edgeDropped", this.onGraphEdgeDroppedBound);
    this.graph.off("cleared", this.onGraphClearedBound);
    this.graph.off("edgesCleared", this.onGraphEdgesClearedBound);
    this.graph.off(
      "nodeAttributesUpdated",
      this.onGraphNodeAttributesUpdatedBound
    );
    this.graph.off(
      "edgeAttributesUpdated",
      this.onGraphEdgeAttributesUpdatedBound
    );
    this.graph.off(
      "eachNodeAttributesUpdated",
      this.onGraphEachNodeAttributesUpdatedBound
    );
    this.graph.off(
      "eachEdgeAttributesUpdated",
      this.onGraphEachEdgeAttributesUpdatedBound
    );

    this.resizeObserver.disconnect();
    this.resizeObserver = undefined!;

    this.textureCache.destroy();
    this.textureCache = undefined!;

    this.app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true,
    });
    this.app = undefined!;
  }

  private updateGraphVisibility() {
    const cull = new Cull();

    cull.addAll(
      (this.viewport.children as unknown as Container[])
        .map((layer) => layer.children)
        .flat()
    );
    cull.cull(this.app.renderer.screen as unknown as Rectangle, true);

    // levels of detail
    const zoom = this.viewport.scale.x;
    const zoomSteps = [0.1, 0.2, 0.4, Infinity];
    const zoomStep = zoomSteps.findIndex((zoomStep) => zoom <= zoomStep);

    this.graph.forEachNode((nodeKey) => {
      const node = this.nodeKeyToNodeObject.get(nodeKey)!;
      node.updateVisibility(zoomStep);
    });

    this.graph.forEachEdge((edgeKey) => {
      const edge = this.edgeKeyToEdgeObject.get(edgeKey)!;
      edge.updateEdgeVisibility(zoomStep);
    });
  }

  private onGraphNodeAdded(data: { key: string; attributes: NodeAttributes }) {
    const nodeKey = data.key;
    const nodeAttributes = data.attributes;
    this.createNode(nodeKey, nodeAttributes);
  }

  private onGraphEdgeAdded(data: {
    key: string;
    attributes: EdgeAttributes;
    source: string;
    target: string;
  }) {
    const edgeKey = data.key;
    const edgeAttributes = data.attributes;
    const sourceNodeKey = data.source;
    const targetNodeKey = data.target;
    const sourceNodeAttributes = this.graph.getNodeAttributes(sourceNodeKey);
    const targetNodeAttributes = this.graph.getNodeAttributes(targetNodeKey);
    this.createEdge(
      edgeKey,
      edgeAttributes,
      sourceNodeKey,
      targetNodeKey,
      sourceNodeAttributes,
      targetNodeAttributes
    );
  }

  private onGraphNodeDropped(data: { key: string }) {
    const nodeKey = data.key;
    this.dropNode(nodeKey);
  }

  private onGraphEdgeDropped(data: { key: string }) {
    const edgeKey = data.key;
    this.dropEdge(edgeKey);
  }

  private onGraphCleared() {
    Array.from(this.edgeKeyToEdgeObject.keys()).forEach(
      this.dropEdge.bind(this)
    );
    Array.from(this.nodeKeyToNodeObject.keys()).forEach(
      this.dropNode.bind(this)
    );
  }

  private onGraphEdgesCleared() {
    Array.from(this.edgeKeyToEdgeObject.keys()).forEach(
      this.dropEdge.bind(this)
    );
  }

  private onGraphNodeAttributesUpdated(data: { key: string }) {
    const nodeKey = data.key;
    this.updateNodeStyleByKey(nodeKey);

    // 标准化节点位置
    this.normalizeNodePosition(nodeKey);
  }

  private normalizeNodePosition(nodeKey: string) {
    let x = this.graph.getNodeAttribute(nodeKey, "x");
    let y = this.graph.getNodeAttribute(nodeKey, "y");

    // 假设 minX, maxX, minY, maxY 是节点位置的边界
    const minX = 0;
    const maxX = this.container.clientWidth; // 例如，使用容器的宽度作为最大 X
    const minY = 0;
    const maxY = this.container.clientHeight; // 使用容器的高度作为最大 Y

    // 调整位置，确保它在边界内
    x = Math.min(Math.max(x, minX), maxX);
    y = Math.min(Math.max(y, minY), maxY);

    // 如果需要，更新节点位置
    if (
      this.graph.getNodeAttribute(nodeKey, "x") !== x ||
      this.graph.getNodeAttribute(nodeKey, "y") !== y
    ) {
      this.graph.setNodeAttribute(nodeKey, "x", x);
      this.graph.setNodeAttribute(nodeKey, "y", y);
    }
  }

  private onGraphEdgeAttributesUpdated(data: { key: string }) {
    const edgeKey = data.key;
    this.updateEdgeStyleByKey(edgeKey);
  }

  private onGraphEachNodeAttributesUpdated() {
    this.graph.forEachNode(this.updateNodeStyle.bind(this));
  }

  private onGraphEachEdgeAttributesUpdated() {
    this.graph.forEachEdge(this.updateEdgeStyle.bind(this));
  }

  private updateNodeStyleByKey(nodeKey: string) {
    const nodeAttributes = this.graph.getNodeAttributes(nodeKey);
    this.updateNodeStyle(nodeKey, nodeAttributes);
  }

  private updateEdgeStyleByKey(edgeKey: string) {
    const edgeAttributes = this.graph.getEdgeAttributes(edgeKey);
    const sourceNodeKey = this.graph.source(edgeKey);
    const targetNodeKey = this.graph.target(edgeKey);
    const sourceNodeAttributes = this.graph.getNodeAttributes(sourceNodeKey);
    const targetNodeAttributes = this.graph.getNodeAttributes(targetNodeKey);
    this.updateEdgeStyle(
      edgeKey,
      edgeAttributes,
      sourceNodeKey,
      targetNodeKey,
      sourceNodeAttributes,
      targetNodeAttributes
    );
  }

  private updateNodeStyle(nodeKey: string, nodeAttributes: NodeAttributes) {
    const node = this.nodeKeyToNodeObject.get(nodeKey)!;

    const nodePosition = { x: nodeAttributes.x, y: nodeAttributes.y };
    node.updatePosition(nodePosition);

    const nodeStyleDefinitions = [
      DEFAULT_STYLE.node,
      this.style.node,
      node.hovered ? this.hoverStyle.node : undefined,
    ];
    const nodeStyle = resolveStyleDefinitions(
      nodeStyleDefinitions,
      nodeAttributes
    );
    node.updateStyle(nodeStyle, this.textureCache);
  }

  private updateEdgeStyle(
    edgeKey: string,
    edgeAttributes: EdgeAttributes,
    _sourceNodeKey: string,
    _targetNodeKey: string,
    sourceNodeAttributes: NodeAttributes,
    targetNodeAttributes: NodeAttributes
  ) {
    const edge = this.edgeKeyToEdgeObject.get(edgeKey)!;

    const sourceNodePosition = {
      x: sourceNodeAttributes.x,
      y: sourceNodeAttributes.y,
    };
    const targetNodePosition = {
      x: targetNodeAttributes.x,
      y: targetNodeAttributes.y,
    };
    edge.updateEdgePosition(sourceNodePosition, targetNodePosition);

    const edgeStyleDefinitions = [
      DEFAULT_STYLE.edge,
      this.style.edge,
      edge.hovered ? this.hoverStyle.edge : undefined,
    ];
    const edgeStyle = resolveStyleDefinitions(
      edgeStyleDefinitions,
      edgeAttributes
    );
    edge.updateEdgeStyle(edgeStyle, this.textureCache);
  }

  private createNode(nodeKey: string, nodeAttributes: NodeAttributes) {
    const node = new PixiNode();
    node.on("mousemove", (event: MouseEvent) => {
      this.emit("nodeMousemove", event, nodeKey);
    });
    node.on("mouseover", (event: MouseEvent) => {
      if (!this.mousedownNodeKey) {
        this.hoverNode(nodeKey);
      }
      this.emit("nodeMouseover", event, nodeKey);
    });
    node.on("mouseout", (event: MouseEvent) => {
      if (!this.mousedownNodeKey) {
        this.unhoverNode(nodeKey);
      }
      this.emit("nodeMouseout", event, nodeKey);
    });
    node.on("mousedown", (event: MouseEvent) => {
      this.mousedownNodeKey = nodeKey;
      this.enableNodeDragging();
      this.emit("nodeMousedown", event, nodeKey);
    });
    node.on("mouseup", (event: MouseEvent) => {
      this.emit("nodeMouseup", event, nodeKey);
      // why native click event doesn't work?
      if (this.mousedownNodeKey === nodeKey) {
        this.emit("nodeClick", event, nodeKey);
      }
    });
    this.nodeLayer.addChild(node.nodeGfx);
    this.nodeLabelLayer.addChild(node.nodeLabelGfx);
    this.frontNodeLayer.addChild(node.nodePlaceholderGfx);
    this.frontNodeLabelLayer.addChild(node.nodeLabelPlaceholderGfx);
    this.nodeKeyToNodeObject.set(nodeKey, node);

    this.updateNodeStyle(nodeKey, nodeAttributes);
  }

  private createEdge(
    edgeKey: string,
    edgeAttributes: EdgeAttributes,
    sourceNodeKey: string,
    targetNodeKey: string,
    sourceNodeAttributes: NodeAttributes,
    targetNodeAttributes: NodeAttributes
  ) {
    const edge = new PixiEdge();
    edge.on("mousemove", (event: MouseEvent) => {
      this.emit("edgeMousemove", event, edgeKey);
    });
    edge.on("mouseover", (event: MouseEvent) => {
      this.hoverEdge(edgeKey);
      this.emit("edgeMouseover", event, edgeKey);
    });
    edge.on("mouseout", (event: MouseEvent) => {
      this.unHoverEdge(edgeKey);
      this.emit("edgeMouseout", event, edgeKey);
    });
    edge.on("mousedown", (event: MouseEvent) => {
      this.mousedownEdgeKey = edgeKey;
      this.emit("edgeMousedown", event, edgeKey);
    });
    edge.on("mouseup", (event: MouseEvent) => {
      this.emit("edgeMouseup", event, edgeKey);
      // why native click event doesn't work?
      if (this.mousedownEdgeKey === edgeKey) {
        this.emit("edgeClick", event, edgeKey);
      }
    });
    this.edgeLayer.addChild(edge.edgeGfx);
    this.frontEdgeLayer.addChild(edge.edgePlaceholderGfx);
    this.edgeKeyToEdgeObject.set(edgeKey, edge);

    this.updateEdgeStyle(
      edgeKey,
      edgeAttributes,
      sourceNodeKey,
      targetNodeKey,
      sourceNodeAttributes,
      targetNodeAttributes
    );
  }

  private dropNode(nodeKey: string) {
    const node = this.nodeKeyToNodeObject.get(nodeKey)!;

    this.nodeLayer.removeChild(node.nodeGfx);
    this.nodeLabelLayer.removeChild(node.nodeLabelGfx);
    this.frontNodeLayer.removeChild(node.nodePlaceholderGfx);
    this.frontNodeLabelLayer.removeChild(node.nodeLabelPlaceholderGfx);
    this.nodeKeyToNodeObject.delete(nodeKey);
  }

  private dropEdge(edgeKey: string) {
    const edge = this.edgeKeyToEdgeObject.get(edgeKey)!;

    this.edgeLayer.removeChild(edge.edgeGfx);
    this.frontEdgeLayer.removeChild(edge.edgePlaceholderGfx);
    this.edgeKeyToEdgeObject.delete(edgeKey);
  }

  private hoverNode(nodeKey: string) {
    const node = this.nodeKeyToNodeObject.get(nodeKey)!;
    if (node.hovered) {
      return;
    }

    // update style
    node.hovered = true;
    this.updateNodeStyleByKey(nodeKey);

    // move to front
    const nodeIndex = this.nodeLayer.getChildIndex(node.nodeGfx);
    this.nodeLayer.removeChildAt(nodeIndex);
    this.nodeLabelLayer.removeChildAt(nodeIndex);
    this.frontNodeLayer.removeChildAt(nodeIndex);
    this.frontNodeLabelLayer.removeChildAt(nodeIndex);
    this.nodeLayer.addChild(node.nodePlaceholderGfx);
    this.nodeLabelLayer.addChild(node.nodeLabelPlaceholderGfx);
    this.frontNodeLayer.addChild(node.nodeGfx);
    this.frontNodeLabelLayer.addChild(node.nodeLabelGfx);
  }

  private unhoverNode(nodeKey: string) {
    const node = this.nodeKeyToNodeObject.get(nodeKey)!;
    if (!node.hovered) {
      return;
    }

    // update style
    node.hovered = false;
    this.updateNodeStyleByKey(nodeKey);

    // move to front
    const nodeIndex = this.frontNodeLayer.getChildIndex(node.nodeGfx);
    this.nodeLayer.removeChildAt(nodeIndex);
    this.nodeLabelLayer.removeChildAt(nodeIndex);
    this.frontNodeLayer.removeChildAt(nodeIndex);
    this.frontNodeLabelLayer.removeChildAt(nodeIndex);
    this.nodeLayer.addChild(node.nodeGfx);
    this.nodeLabelLayer.addChild(node.nodeLabelGfx);
    this.frontNodeLayer.addChild(node.nodePlaceholderGfx);
    this.frontNodeLabelLayer.addChild(node.nodeLabelPlaceholderGfx);
  }

  private hoverEdge(edgeKey: string) {
    const edge = this.edgeKeyToEdgeObject.get(edgeKey)!;
    if (edge.hovered) {
      return;
    }

    // update style
    edge.hovered = true;
    this.updateEdgeStyleByKey(edgeKey);

    // move to front
    const edgeIndex = this.edgeLayer.getChildIndex(edge.edgeGfx);
    this.edgeLayer.removeChildAt(edgeIndex);
    this.frontEdgeLayer.removeChildAt(edgeIndex);
    this.edgeLayer.addChild(edge.edgePlaceholderGfx);
    this.frontEdgeLayer.addChild(edge.edgeGfx);
  }

  private unHoverEdge(edgeKey: string) {
    const edge = this.edgeKeyToEdgeObject.get(edgeKey)!;
    if (!edge.hovered) {
      return;
    }

    // update style
    edge.hovered = false;
    this.updateEdgeStyleByKey(edgeKey);

    // move back
    const edgeIndex = this.frontEdgeLayer.getChildIndex(edge.edgeGfx);
    this.edgeLayer.removeChildAt(edgeIndex);
    this.frontEdgeLayer.removeChildAt(edgeIndex);
    this.edgeLayer.addChild(edge.edgeGfx);
    this.frontEdgeLayer.addChild(edge.edgePlaceholderGfx);
  }

  private moveNode(nodeKey: string, point: IPointData) {
    this.graph.setNodeAttribute(nodeKey, "x", point.x);
    this.graph.setNodeAttribute(nodeKey, "y", point.y);

    // update style
    this.updateNodeStyleByKey(nodeKey);
    this.graph.edges(nodeKey).forEach(this.updateEdgeStyleByKey.bind(this));
  }

  private enableNodeDragging() {
    this.viewport.pause = true; // disable viewport dragging

    document.addEventListener("mousemove", this.onDocumentMouseMoveBound);
    document.addEventListener("mouseup", this.onDocumentMouseUpBound, {
      once: true,
    });
  }

  private onDocumentMouseMove(event: MouseEvent) {
    const eventPosition = new Point(event.offsetX, event.offsetY);
    const worldPosition = this.viewport.toWorld(eventPosition);

    if (this.mousedownNodeKey) {
      this.moveNode(this.mousedownNodeKey, worldPosition);
    }
  }

  private onDocumentMouseUp() {
    this.viewport.pause = false; // enable viewport dragging

    document.removeEventListener("mousemove", this.onDocumentMouseMoveBound);

    this.mousedownNodeKey = null;
    this.mousedownEdgeKey = null;
  }
}

export { PixiGraph };
