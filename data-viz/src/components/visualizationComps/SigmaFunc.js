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
    const amountNodes = props.jsonGraph.vertices.length || 0;
    props.jsonGraph.vertices.forEach((node) => {
      let color = getAttributeCombinationOnTheFly(
        graphicsColors,
        node.labels,
        colorMap
      );
      graph.addNode("node" + node.id, {
        y: Math.random() * props.height - props.height / 2,
        x: Math.random() * props.width - props.width / 2,
        size: Math.max((1 / amountNodes) * 400, 5),
        label: node.labels,
        color: color,
      });
    });
    props.jsonGraph.edges.forEach((edge) => {
      graph.addDirectedEdgeWithKey(
        "edge" + edge.id,
        "node" + edge.sourceNode,
        "node" + edge.destinationNode,
        { size: Math.max((1 / amountNodes) * 100, 2) }
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
      }}
      initialSettings={{
        defaultEdgeType: "arrow",
        labelColor: { color: "#FFF" },
        labelSize: 20,
      }}
    >
      <LoadGraph
        jsonGraph={props.jsonGraph}
        height={props.height}
        width={props.width}
      />
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
