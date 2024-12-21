import { FC, useEffect, useRef } from "react";
import Graph from "graphology";
import { PixiGraph, TextType } from "pixi-graph";
import { mockData, positions } from "./mockData";
import styles from "./index.module.scss";

const colors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

type NodeData = {
  id: string;
  label: string;
};

type EdgeData = {
  source: string;
  target: string;
};

type GraphData = {
  nodes: NodeData[];
  edges: EdgeData[];
};

const CharacterNetwork: FC<{
  data?: GraphData;
}> = ({ data = mockData }) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphRef.current) {
      const graph = new Graph();
      const style = {
        node: {
          size: 15,
          color: (node) => colors[(node.group || 0) % colors.length],
          border: {
            width: 2,
            color: "#000",
          },
          icon: {
            content: "person",
            fontFamily: "Material Icons",
            fontSize: 20,
            color: "#000",
          },
          label: {
            content: (node) => node.id,
            type: TextType.BITMAP_TEXT,
            fontFamily: "HelveticaRegular",
            fontSize: 12,
            color: "#333333",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            padding: 4,
          },
        },
        edge: {
          width: (link) => Math.log((link.value || 0) + 1) + 1,
          color: "#cccccc",
        },
      };

      const hoverStyle = {
        node: {
          border: {
            color: "#000000",
          },
          label: {
            backgroundColor: "rgba(238, 238, 238, 1)",
          },
        },
        edge: {
          color: "#999999",
        },
      };

      const resources = [
        {
          name: "HelveticaRegular",
          url: "https://gist.githubusercontent.com/zakjan/b61c0a26d297edf0c09a066712680f37/raw/8cdda3c21ba3668c3dd022efac6d7f740c9f1e18/HelveticaRegular.fnt",
        },
      ];

      // 添加节点和边
      mockData?.nodes?.forEach((item) => {
        graph.addNode(item.id, item);
      });

      mockData?.links.forEach((link) => {
        graph.addEdge(link.source, link.target, link);
      });

      // layout
      graph.forEachNode((node) => {
        graph.setNodeAttribute(node, "x", Math.random());
        graph.setNodeAttribute(node, "y", Math.random());
      });

      graph.forEachNode((node) => {
        const position = positions[node];
        graph.setNodeAttribute(node, "x", position.x);
        graph.setNodeAttribute(node, "y", position.y);
      });

      const pixiGraph = new PixiGraph({
        container: graphRef.current,
        graph: graph,
        style,
        hoverStyle,
        resources,
      });

      return () => pixiGraph.destroy();
    }
  }, [data]);

  return <div ref={graphRef} className={styles["canvasContainer"]}></div>;
};

export default CharacterNetwork;
