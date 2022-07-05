import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";
import icons from "../images/iconsBase64";
const graphicsColors = [
  "#5F95FF", // blue
  "#61DDAA", //green
  "#ffb039", //cosmogold
  "#F08BB4", //pink
  "#F6BD16", //orange
  "#7262FD", //blue
  "#78D3F8", //azure
  "#9661BC", //purple
  "#F6903D", //orange
];
function getAttributeCombinationOnTheFly(
  attributeArray,
  elementClass,
  usedAttributesMap
) {
  if (!usedAttributesMap.has(elementClass)) {
    const usedAttributesArray = Array.from(usedAttributesMap.values());
    let freeAttributes = attributeArray.filter(
      (val) => !usedAttributesArray.includes(val)
    );
    if (freeAttributes.length > 0) {
      usedAttributesMap.set(elementClass, freeAttributes[0]);
    } else {
      usedAttributesMap.set(elementClass, attributeArray[0]); //bad default case...
      console.log(
        `The amount of elemet classes is bigger then the possible attributes so attributes will be used multiple times`
      );
    }
  }
  return usedAttributesMap.get(elementClass);
}

function convertGraphJSONtoG6Format(grapJsonObj) {
  let g6Graph = {
    nodes: [],
    edges: [],
  };
  let usedAttributesMap = new Map();
  let usedIconsMap = new Map();
  grapJsonObj.vertices.forEach((node) => {
    let color = getAttributeCombinationOnTheFly(
      graphicsColors,
      node.labels,
      usedAttributesMap
    );
    let icon = getAttributeCombinationOnTheFly(
      icons,
      node.labels,
      usedIconsMap
    );
    const g6Vertex = {
      id: "node" + node.id,
      label: node.labels,
      labelCfg: {
        position: "bottom",
        offset: 5,
        style: {
          fill: "#ebebeb",
          // fontFamily: ["Source Sans Pro", "sans-serif"],
        },
      },
      class: node.labels,
      size: 40,
      style: {
        fill: color,
        opacity: 0.2,
        stroke: color,
        strokeOpacity: 0.85,
      },
      icon: {
        show: true,
        width: 30,
        height: 30,
        img: icon,
      },
      stateStyles: {
        // The node style when the state 'hover' is true
        hover: {
          opacity: 0.4,
        },
        // The node style when the state 'click' is true
        click: {
          stroke: "#000",
          lineWidth: 3,
        },
      },
    };
    g6Graph.nodes.push(g6Vertex);
  });
  grapJsonObj.edges.forEach((edge) => {
    const g6Edge = {
      //label: edge.type, // String[]
      source: "node" + edge.sourceNode, // Integer
      target: "node" + edge.destinationNode, // Integer
      type: "quadratic",
      style: {
        opacity: 0.3, // The opacity of edges
        stroke: "#4c4f52", // The color of the edges
        endArrow: true,
        lineWidth: 6,
      },
      labelCfg: {
        autoRotate: true, // Whether to rotate the label according to the edges
      },
    };
    g6Graph.edges.push(g6Edge);
  });
  return g6Graph;
}

export default function G6Func(props) {
  console.log(convertGraphJSONtoG6Format(props.jsonGraph));
  const ref = React.useRef(null);
  let graph = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: ref.current.parentElement.offsetWidth,
        height: ref.current.parentElement.offsetHeight,
        modes: {
          default: ["drag-canvas", "zoom-canvas", "drag-node"], // Allow users to drag canvas, zoom canvas, and drag nodes
        },
        layout: {
          type: "gForce",
          center: [
            ref.current.parentElement.offsetWidth / 2,
            ref.current.parentElement.offsetHeight / 2,
          ], // The center of the graph by default
          linkDistance: 1,
          nodeStrength: 1000,
          edgeStrength: 200,
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
    const clearStates = () => {
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge);
      });
    };

    graph.data(convertGraphJSONtoG6Format(props.jsonGraph));
    graph.render();
    // Mouse enter a node
    graph.on("node:mouseenter", (e) => {
      const nodeItem = e.item; // Get the target item
      graph.setItemState(nodeItem, "hover", true); // Set the state 'hover' of the item to be true
    });
    graph.on("canvas:click", (e) => {
      clearStates();
      props.onEntityDeselect();
    });

    // Mouse leave a node
    graph.on("node:mouseleave", (e) => {
      const nodeItem = e.item; // Get the target item
      graph.setItemState(nodeItem, "hover", false); // Set the state 'hover' of the item to be false
    });
    // Click a node
    graph.on("node:click", (e) => {
      clearStates();
      const nodeItem = e.item; // e the clicked item
      graph.setItemState(nodeItem, "click", true); // Set the state 'click' of the item to be true

      const clickNodes = graph.findAllByState("node", "click");
      console.log(clickNodes[0].getID());
      //retrieve ode from nodeIdString of format: "nodeID"
      const origID = parseInt(clickNodes[0].getID().match(/(\d+)/)[0]);
      props.onEntitySelect(true, origID); //return the entity type (node/edge) the original node ID, and the reference to the selected icon
    });
  }, []);

  return <div ref={ref}></div>;
}
