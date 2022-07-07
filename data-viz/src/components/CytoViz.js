import React, { Fragment, useEffect, useRef } from "react";
import cytoscape from "cytoscape";

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
  const graphRef = useRef(null);

  const drawGraph = () => {
    const elements = convertGraphJSONtoCytoFormat(props.jsonGraph);
    const cy = cytoscape({
      container: graphRef.current,
      elements: elements,
    });
  };

  useEffect(() => {
    drawGraph();
  }, []);

  return (
    <Fragment>
      <div ref={graphRef} style={{ width: "100%", height: "80vh" }}></div>
    </Fragment>
  );
};
export default CytoViz;
