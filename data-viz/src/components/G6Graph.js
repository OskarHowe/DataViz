import React from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";

class G6Graph extends React.Component {
  constructor(props) {
    super(props);
    this.status = {
      ref: React.createRef(),
    };
    this.convertGraphJSONtoG6Format(this.props.jsonGraph);
    this.renderGraph();
  }
  convertGraphJSONtoG6Format(grapJsonObj) {
    let g6Graph = {
      nodes: [],
      edges: [],
    };
    let usedAttributesMap = new Map();
    grapJsonObj.vertices.forEach((node) => {
      //   let color = getAttributeCombinationOnTheFly(
      //     graphicsColors,
      //     node.labels,
      //     usedAttributesMap
      //   );
      const g6Vertex = {
        id: "node" + node.id,
        //label: node.labels,
        class: node.labels,
        style: {
          //fill: color,
          //opacity: 0.2,
          //stroke: color,
          strokeOpacity: 0.85,
        },
      };
      g6Graph.nodes.push(g6Vertex);
    });
    grapJsonObj.edges.forEach((edge) => {
      const g6Edge = {
        //label: edge.type, // String[]
        source: "node" + edge.sourceNode, // Integer
        target: "node" + edge.destinationNode, // Integer
        labelCfg: {
          autoRotate: true, // Whether to rotate the label according to the edges
        },
      };
      g6Graph.edges.push(g6Edge);
    });
    console.log(g6Graph.nodes);
    this.setState({ data: g6Graph });
  }
  render(cavasWidth, canvasHeight) {
    const data = this.state.data;
    const graph = new G6.Graph({
      container: ReactDOM.findDOMNode(this.state.ref.current), // String | HTMLElement, required, the id of DOM element or an HTML node
      width: cavasWidth || 1000, // Number, required, the width of the graph
      height: canvasHeight || 1000, // Number, required, the height of the graph
      modes: {
        default: ["drag-canvas", "zoom-canvas", "drag-node"], // Allow users to drag canvas, zoom canvas, and drag nodes
      },
      layout: {
        type: "gForce",
        center: [200, 200], // The center of the graph by default
        linkDistance: 1,
        nodeStrength: 1000,
        edgeStrength: 200,
        nodeSize: 30,
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
    console.log(`canvasWidth: ${cavasWidth}, canvasHeight: ${canvasHeight}`);
    graph.data(data); // Load the data defined in Step 2
    graph.render(); // Render the graph
    return <div ref={this.state.ref}></div>;
  }
}
export default G6Graph;
