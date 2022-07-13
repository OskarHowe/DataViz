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
function createNodeStyle(nodes) {
  const colorMap = new Map();
  const nodeTypesSet = new Set();
  //retrieve all existing labels without doubles from the nodes array
  nodes.map((node) => {
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
