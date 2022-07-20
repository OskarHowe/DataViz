import {
  getAttributeCombinationOnTheFly,
  graphicsColors,
} from "./sharedStyles";

function createNodeStyle(nodes) {
  const colorMap = new Map();
  const nodeTypesSet = new Set();
  //retrieve all existing labels without doubles from the nodes array
  nodes.forEach((node) => {
    nodeTypesSet.add(node.labels);
  });
  let style = [];
  nodeTypesSet.forEach((nodeClass) => {
    let color = getAttributeCombinationOnTheFly(
      graphicsColors,
      nodeClass,
      colorMap
    );
    style.push({
      selector: `node.${nodeClass}`,
      style: {
        color: "#fff",
        "background-color": color,
        "background-opacity": 0.2,
        // "border-style": solid,
        "border-width": 3,
        "border-color": color,
        "border-opacity": 0.85,
        width: 40,
        height: 40,
        label: "data(label)",
      },
    });
  });
  //get a color for each label in nodes
  return {
    style,
  };
}

const edgeStyle = {
  selector: "edge",
  style: {
    width: 6,
    opacity: 0.3, // The opacity of edges
    "target-arrow-shape": "triangle",
    "curve-style": "bezier",
  },
};

export { createNodeStyle, edgeStyle };
