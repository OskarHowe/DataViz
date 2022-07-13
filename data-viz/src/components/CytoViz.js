import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscape";

function convertGraphJSONtoCytoFormat(grapJsonObj) {
  let elements = {
    nodes: [],
    edges: [],
  };
  grapJsonObj.vertices.forEach((node) => {
    const data = {
      id: "node" + node.id,
    };
    elements.nodes.push(data);
  });
  grapJsonObj.edges.forEach((edge) => {
    const data = {
      id: "edge" + edge.id,
      source: "node" + edge.sourceNode, // Integer
      target: "node" + edge.destinationNode, // Integer
    };
    elements.edges.push(data);
  });
  console.log(elements);
  return elements;
}
const CytoViz = (props) => {
  const graphData = convertGraphJSONtoCytoFormat(props.jsonGraph);

  return (
    <CytoscapeComponent
      elements={CytoscapeComponent.normalizeElements(graphData)}
      style={{ width: "1080px", height: "1800px" }}
      zoomingEnabled={true}
      maxZoom={3}
      minZoom={0.1}
      //autounselectify={false}
      //boxSelectionEnabled={true}
      //layout={layout}
      //stylesheet={styleSheet}
      cy={(cy) => {
        myCyRef = cy;

        // cy.on("tap", "node", (evt) => {
        //   var node = evt.target;
        //   console.log("EVT", evt);
        //   console.log("TARGET", node.data());
        //   console.log("TARGET TYPE", typeof node[0]);
        // });
      }}
      abc={console.log("myCyRef", myCyRef)}
    />
  );
};
export default CytoViz;
