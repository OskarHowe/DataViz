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

const gForce = (ref) => ({
  type: "gForce",
  center: [
    ref.current.parentElement.offsetWidth / 2,
    ref.current.parentElement.offsetHeight / 2,
  ], // The center of the graph by default
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
const grid = (ref) => ({
  type: "grid",
  begin: [20, 20],
  width: ref.current.parentElement.offsetWidth - 20,
  height: ref.current.parentElement.offsetHeight - 20,
});
export {
  createg6Vertex,
  createg6Edge,
  gForce,
  forceWithClustering,
  dagre,
  fruchterman,
  grid,
};
