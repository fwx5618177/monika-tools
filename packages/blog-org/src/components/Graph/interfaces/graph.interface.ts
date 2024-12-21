import AbstractGraph, { Attributes } from "graphology-types";
import { IAddOptions } from "@pixi/loaders";
import {
  BaseEdgeAttributes,
  BaseNodeAttributes,
  EdgeStyleDefinition,
  NodeStyleDefinition,
  TextType,
} from "./lib.interface";
import { Container, DisplayObject } from "@pixi/display";

export interface GraphStyle {
  node: {
    size: number;
    color: string;
    border: {
      width: number;
      color: string;
    };
    icon: {
      content: string;
      type: TextType;
      fontFamily: string;
      fontSize: number;
      color: string;
    };
    label: {
      content: string;
      type: TextType;
      fontFamily: string;
      fontSize: number;
      color: string;
      backgroundColor: string;
      padding: number;
    };
    ripple?: {
      rippleColor: string;
      rippleFade: number;
      rippleSpeed: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    };
  };
  edge: {
    width: number;
    color: string;
  };
}

export interface GraphStyleDefinition<
  NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes,
  EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes
> {
  node?: NodeStyleDefinition<NodeAttributes>;
  edge?: EdgeStyleDefinition<EdgeAttributes>;
}

export interface GraphOptions<
  NodeAttributes extends BaseNodeAttributes = BaseNodeAttributes,
  EdgeAttributes extends BaseEdgeAttributes = BaseEdgeAttributes
> {
  container: HTMLElement;
  graph: AbstractGraph<NodeAttributes, EdgeAttributes>;
  style: GraphStyleDefinition<NodeAttributes, EdgeAttributes>;
  hoverStyle: GraphStyleDefinition<NodeAttributes, EdgeAttributes>;
  resources?: IAddOptions[];
}

export interface PixiGraphEvents {
  nodeClick: (event: MouseEvent, nodeKey: string) => void;
  nodeMousemove: (event: MouseEvent, nodeKey: string) => void;
  nodeMouseover: (event: MouseEvent, nodeKey: string) => void;
  nodeMouseout: (event: MouseEvent, nodeKey: string) => void;
  nodeMousedown: (event: MouseEvent, nodeKey: string) => void;
  nodeMouseup: (event: MouseEvent, nodeKey: string) => void;
  edgeClick: (event: MouseEvent, edgeKey: string) => void;
  edgeMousemove: (event: MouseEvent, edgeKey: string) => void;
  edgeMouseover: (event: MouseEvent, edgeKey: string) => void;
  edgeMouseout: (event: MouseEvent, edgeKey: string) => void;
  edgeMousedown: (event: MouseEvent, edgeKey: string) => void;
  edgeMouseup: (event: MouseEvent, edgeKey: string) => void;
}
