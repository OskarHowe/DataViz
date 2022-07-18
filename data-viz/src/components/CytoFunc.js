import React from "react";
//import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import { createNodeStyle, edgeStyle } from "./CytoStyles";
import dagre from "cytoscape-dagre";
import cola from "cytoscape-cola";
import cytoscape from "cytoscape";

function convertGraphJSONtoCytoFormat(grapJsonObj) {
  let elements = [];
  grapJsonObj.vertices.forEach((node) => {
    elements.push({
      group: "nodes",
      classes: node.labels,
      data: {
        id: "node" + node.id,
        label: node.labels,
      },
    });
  });
  grapJsonObj.edges.forEach((edge) => {
    elements.push({
      groupe: "edges",
      data: {
        id: "edge" + edge.id,
        source: "node" + edge.sourceNode, // Integer
        target: "node" + edge.destinationNode, // Integer
      },
    });
  });
  return elements;
}

const CytoFunc = (props) => {
  switch (props.layout) {
    case "dagre":
      cytoscape.use(dagre);
      break;
    case "cola":
      cytoscape.use(cola); // register extension
      break;
    default:
      cytoscape.use(dagre);
      props.layout = "dagre";
      break;
  }

  const graphData = CytoscapeComponent.normalizeElements(
    convertGraphJSONtoCytoFormat(props.jsonGraph)
  );
  let nodeStylesheet = createNodeStyle(props.jsonGraph.vertices);
  nodeStylesheet.style.push(edgeStyle);
  console.log(nodeStylesheet);
  return (
    <CytoscapeComponent
      elements={graphData}
      style={{ width: props.width, height: props.height }}
      layout={{
        name: props.layout,
      }}
      stylesheet={nodeStylesheet.style}
      minZoom={0.2}
      maxZoom={2}
    />
  );
};
export default CytoFunc;
