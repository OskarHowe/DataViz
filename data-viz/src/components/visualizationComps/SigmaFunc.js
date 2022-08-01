import { useEffect } from "react";
import Graph from "graphology";
import {
  getAttributeCombinationOnTheFly,
  graphicsColors,
} from "./sharedStyles";
import {
  SigmaContainer,
  ControlsContainer,
  useLoadGraph,
  ZoomControl,
  FullScreenControl,
} from "@react-sigma/core";
import SigmaEventHandler from "./SigmaEventHandler";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import "@react-sigma/core/lib/react-sigma.min.css";
import "./SigmaFunc.css";
export const LoadGraph = (props) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph({
      multi: false,
      allowSelfLoops: false,
      type: "directed",
    });
    const colorMap = new Map();
    props.jsonGraph.vertices.forEach((node) => {
      let color = getAttributeCombinationOnTheFly(
        graphicsColors,
        node.labels,
        colorMap
      );
      graph.addNode("node" + node.id, {
        x: Math.random() * 1920 - 960,
        y: Math.random() * 1080 - 540,
        size: 40,
        label: node.labels,
        color: color,
      });
    });
    props.jsonGraph.edges.forEach((edge) => {
      graph.addDirectedEdgeWithKey(
        "edge" + edge.id,
        "node" + edge.sourceNode,
        "node" + edge.destinationNode,
        { size: 5 }
      );
    });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const DisplayGraph = (props) => {
  return (
    <SigmaContainer
      style={{
        height: props.height,
        width: props.width,
        labelColor: { color: "#000000" },
      }}
      initialSettings={{
        defaultEdgeType: "arrow",
        labelColor: { color: "#000000" },
        labelSize: 100,
      }}
    >
      <LoadGraph jsonGraph={props.jsonGraph} />
      <SigmaEventHandler
        onEntitySelect={props.onEntitySelect}
        onEntityDeselect={props.onEntityDeselect}
      />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <FullScreenControl />

        <LayoutForceAtlas2Control />
      </ControlsContainer>
    </SigmaContainer>
  );
};
