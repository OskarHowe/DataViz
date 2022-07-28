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
    style.push({
      selector: `node.${nodeClass}:selected`,
      style: {
        color: "#fff",
        "background-color": color,
        "background-opacity": 0.5,
        // "border-style": solid,
        "border-width": 3,
        "border-color": "#fff",
        "border-opacity": 0.85,
        width: 45,
        height: 45,
        label: "data(label)",
      },
    });
    style.push({
      selector: `node.compound`,
      style: {
        color: "#fff",
        "background-opacity": 0,
        "border-style": "dashed",
        "border-width": 3,
        "border-color": color,
        "border-opacity": 0.85,
        //label: "data(label)",
      },
    });
  });
  //get a color for each label in nodes
  style.push({
    selector: "edge",
    style: {
      "line-color": "#fff",
      "target-arrow-color": "#fff",
      width: 4,
      opacity: 0.3, // The opacity of edges
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  });
  style.push({
    selector: "edge:selected",
    style: {
      "line-color": "#fff",
      "target-arrow-color": "#fff",
      width: 6,
      opacity: 0.8, // The opacity of edges
      "line-style": "dashed",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  });
  style.push({
    selector: "edge:locked",
    style: {
      "line-color": "#fff",
      "target-arrow-color": "#fff",
      width: 6,
      opacity: 0.8, // The opacity of edges
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  });
  return {
    style,
  };
}

export { createNodeStyle };
