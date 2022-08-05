const createg6Vertex = (node, color, icon) => ({
  id: "node" + node.id,
  //comboId: node.labels === theLabel ? "comboC" : "", // node1 belongs to comboA
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
      stroke: "#fff",
      lineWidth: 3,
    },
  },
});
const createg6Edge = (edge) => ({
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
  stateStyles: {
    // The node style when the state 'click' is true
    selected: {
      opacity: 0.8, // The opacity of edges
      stroke: "#ffffff", // The color of the edges
      endArrow: true,
      lineWidth: 7,
    },
    clicked: {
      opacity: 0.8, // The opacity of edges
      stroke: "#ffffff", // The color of the edges
      endArrow: true,
      lineWidth: 7,
      lineDash: [10],
    },
  },
});

const createCombo = (i, color, childrenAmount) => ({
  id: `combo1${i}`,
  type: "circle",
  //size: Math.sqrt(childrenAmount * Math.pow(40, 2)), //so that the volume of the compound is the added volume of the childnodes
  size: [60], //so that the volume of the compound is the added volume of the childnodes
  label: childrenAmount,
  labelCfg: {
    position: "center",
    style: {
      fontSize: 25,
      opacity: 0.85,
      fill: "#4c4f52",
      stroke: "#4c4f52",
    },
    // fontFamily: ["Source Sans Pro", "sans-serif"],
  },
  style: {
    fill: color,
    opacity: 0,
    strokeOpacity: 0.85,
    lineDash: [5, 5],
    stroke: color,
    lineWidth: 5,
  },
});
const gForce = (width, height) => ({
  type: "gForce",
  center: [width / 2, height / 2], // The center of the graph by default
  linkDistance: 1,
  nodeStrength: 1000,
  preventOverlap: true,

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
});
const forceWithClustering = {
  type: "force",
  clustering: true,
  clusterNodeStrength: -5,
  clusterEdgeDistance: 200,
  clusterNodeSize: 20,
  clusterFociStrength: 1.2,
  nodeSpacing: 5,
  workerEnabled: true, // Whether to activate web-worker
  gpuEnabled: true, // Whether to enable the GPU parallel computing, supported by G6 4.0
  preventOverlap: true,
};
const dagre = {
  type: "dagre",
  nodesepFunc: (d) => {
    if (d.id === "3") {
      return 500;
    }
    return 50;
  },
  ranksep: 70,
  preventOverlap: true,
  controlPoints: true,
  workerEnabled: true, // Whether to activate web-worker
  gpuEnabled: true, // Whether to enable the GPU parallel computing, supported by G6 4.0
};
const fruchterman = {
  type: "fruchterman",
  maxIteration: 8000,
  gravity: 1,
  preventOverlap: true,

  workerEnabled: true, // Whether to activate web-worker
  gpuEnabled: true, // Whether to enable the GPU parallel computing, supported by G6 4.0
};
const grid = (width, height) => ({
  type: "grid",
  begin: [20, 20],
  width: width - 20,
  height: height - 20,
});
export {
  createg6Vertex,
  createg6Edge,
  gForce,
  forceWithClustering,
  dagre,
  fruchterman,
  grid,
  createCombo,
};
