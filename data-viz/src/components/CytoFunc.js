import React from "react";
//import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import dagre from "cytoscape-dagre";
import cytoscape from "cytoscape";

function convertGraphJSONtoCytoFormat(grapJsonObj) {
  let elements = [];
  grapJsonObj.vertices.forEach((node) => {
    elements.push({
      group: "nodes",
      classes: node.type,
      data: { id: "node" + node.id, label: node.labels },
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
  cytoscape.use(dagre);
  const graphData = CytoscapeComponent.normalizeElements(
    convertGraphJSONtoCytoFormat(props.jsonGraph)
  );
  return (
    <CytoscapeComponent
      elements={graphData}
      style={{ width: props.width, height: props.height }}
      layout={{
        name: "dagre",
      }}
    />
  );
};
export default CytoFunc;
