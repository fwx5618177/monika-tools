import React, { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import data from "./data.json";
import styles from "./index.module.scss";

const SigmaComponent = () => {
  const containerRef = useRef(null);
  const logsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph();
    graph.import(data);

    const logEvent = (event, itemType, item) => {
      const div = document.createElement("div");
      let message = `Event "${event}"`;

      if (item && itemType) {
        if (itemType === "positions") {
          item = item;
          message += `, x ${item.x}, y ${item.y}`;
        } else {
          const label =
            itemType === "node"
              ? graph.getNodeAttribute(item, "label")
              : graph.getEdgeAttribute(item, "label");

          message += `, ${itemType} ${label || "with no label"} (id "${item}")`;

          if (itemType === "edge") {
            message += `, source ${graph.getSourceAttribute(
              item,
              "label"
            )}, target: ${graph.getTargetAttribute(item, "label")}`;
          }
        }
      }
      div.innerHTML = `<span>${message}</span>`;
      logsRef.current.appendChild(div);
      logsRef.current.scrollTo({ top: logsRef.current.scrollHeight });

      if (logsRef.current.children.length > 50)
        logsRef.current.children[0].remove();
    };

    let hoveredEdge = null;
    const renderer = new Sigma(graph, containerRef.current, {
      edgeReducer(edge, data) {
        const res = { ...data };
        if (edge === hoveredEdge) res.color = "#cc0000";
        return res;
      },
    });

    const nodeEvents = [
      "enterNode",
      "leaveNode",
      "downNode",
      "clickNode",
      "rightClickNode",
      "doubleClickNode",
      "wheelNode",
    ] as const;
    const edgeEvents = [
      "downEdge",
      "clickEdge",
      "rightClickEdge",
      "doubleClickEdge",
      "wheelEdge",
    ] as const;
    const stageEvents = [
      "downStage",
      "clickStage",
      "doubleClickStage",
      "wheelStage",
    ] as const;

    nodeEvents.forEach((eventType) =>
      renderer.on(eventType, ({ node }) => logEvent(eventType, "node", node))
    );
    edgeEvents.forEach((eventType) =>
      renderer.on(eventType, ({ edge }) => logEvent(eventType, "edge", edge))
    );

    renderer.on("enterEdge", ({ edge }) => {
      logEvent("enterEdge", "edge", edge);
      hoveredEdge = edge;
      renderer.refresh();
    });
    renderer.on("leaveEdge", ({ edge }) => {
      logEvent("leaveEdge", "edge", edge);
      hoveredEdge = null;
      renderer.refresh();
    });

    stageEvents.forEach((eventType) => {
      renderer.on(eventType, ({ event }) => {
        logEvent(eventType, "positions", event);
      });
    });
  }, []);

  return (
    <div>
      <div ref={containerRef} className={styles["canvasContainer"]} />
      <div ref={logsRef} className={styles["canvasContainer"]} />
    </div>
  );
};

export default SigmaComponent;
