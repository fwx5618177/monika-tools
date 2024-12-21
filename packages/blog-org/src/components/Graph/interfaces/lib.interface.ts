import AbstractGraph, { Attributes } from "graphology-types";
import { IAddOptions } from "@pixi/loaders";
import { GraphStyle } from "./graph.interface";

export type BaseAttributes = Attributes;
export type BaseNodeAttributes = BaseAttributes & { x: number; y: number };
export type BaseEdgeAttributes = BaseAttributes;

export interface PixiNodeEvents {
  mousemove: (event: MouseEvent) => void;
  mouseover: (event: MouseEvent) => void;
  mouseout: (event: MouseEvent) => void;
  mousedown: (event: MouseEvent) => void;
  mouseup: (event: MouseEvent) => void;
}

export interface PixiEdgeEvents {
  mousemove: (event: MouseEvent) => void;
  mouseover: (event: MouseEvent) => void;
  mouseout: (event: MouseEvent) => void;
  mousedown: (event: MouseEvent) => void;
  mouseup: (event: MouseEvent) => void;
}

export enum TextType {
  TEXT = "TEXT",
  BITMAP_TEXT = "BITMAP_TEXT",
  SDF_TEXT = "SDF_TEXT",
}

export type NodeStyle = GraphStyle["node"];
export type EdgeStyle = GraphStyle["edge"];

export type StyleDefinition<Style, Attributes> =
  | ((attributes: Attributes) => Style)
  | { [Key in keyof Style]?: StyleDefinition<Style[Key], Attributes> }
  | Style;

export type NodeStyleDefinition<
  NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes
> = StyleDefinition<NodeStyle, NodeAttributes>;
export type EdgeStyleDefinition<
  EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes
> = StyleDefinition<EdgeStyle, EdgeAttributes>;
