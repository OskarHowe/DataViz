import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";

function convertGraphJSONtoG6Format(grapJsonObj) {
  let g6Graph = {
    nodes: [],
    edges: [],
  };
  let usedAttributesMap = new Map();
  grapJsonObj.vertices.forEach((node) => {
    //   let color = getAttributeCombinationOnTheFly(
    //     graphicsColors,
    //     node.labels,
    //     usedAttributesMap
    //   );
    const g6Vertex = {
      id: "node" + node.id,
      //label: node.labels,
      class: node.labels,
      style: {
        //fill: color,
        //opacity: 0.2,
        //stroke: color,
        strokeOpacity: 0.85,
      },
    };
    g6Graph.nodes.push(g6Vertex);
  });
  grapJsonObj.edges.forEach((edge) => {
    const g6Edge = {
      //label: edge.type, // String[]
      source: "node" + edge.sourceNode, // Integer
      target: "node" + edge.destinationNode, // Integer
      labelCfg: {
        autoRotate: true, // Whether to rotate the label according to the edges
      },
    };
    g6Graph.edges.push(g6Edge);
  });
  return g6Graph;
}

export default function G6Func(props) {
  console.log(`In G6Func:`);
  console.log(props);
  console.log(props.jsonGraph);
  console.log(convertGraphJSONtoG6Format(props.jsonGraph));
  const ref = React.useRef(null);
  let graph = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: props.width,
        height: props.height,
        modes: {
          default: ["drag-canvas", "zoom-canvas", "drag-node"], // Allow users to drag canvas, zoom canvas, and drag nodes
        },
        layout: {
          type: "gForce",
          center: [200, 200], // The center of the graph by default
          linkDistance: 1,
          nodeStrength: 1000,
          edgeStrength: 200,
          nodeSize: 30,
          onTick: () => {
            console.log("ticking");
          },
          onLayoutEnd: () => {
            console.log("force layout done");
          },
          workerEnabled: true, // Whether to activate web-worker
          gpuEnabled: true, // Whether to enable the GPU parallel computing, supported by G6 4.0
          // more options are shown below
        },
      });
    }
    graph.data(convertGraphJSONtoG6Format(props.jsonGraph));
    graph.render();
  }, []);

  return <div ref={ref}></div>;
}
