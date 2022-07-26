import React, { PureComponent } from "react";
import G6, { Algorithm } from "@antv/g6";
import {
  createg6Vertex,
  createg6Edge,
  gForce,
  forceWithClustering,
  dagre,
  fruchterman,
  grid,
  createCombo,
} from "./G6Styles.js";
import "./G6Func.css";
import icons from "../../images/iconsBase64";
import {
  graphicsColors,
  getAttributeCombinationOnTheFly,
} from "./sharedStyles";
const { louvain } = Algorithm;

function convertGraphJSONtoG6Format(grapJsonObj) {
  let g6Graph = {
    nodes: [],
    edges: [],
    combos: [],
  };
  let usedAttributesMap = new Map();
  let usedIconsMap = new Map();
  grapJsonObj.vertices.forEach((node) => {
    let color = getAttributeCombinationOnTheFly(
      graphicsColors,
      node.labels,
      usedAttributesMap
    );
    let icon = getAttributeCombinationOnTheFly(
      icons,
      node.labels,
      usedIconsMap
    );
    const g6Vertex = createg6Vertex(node, color, icon);
    g6Graph.nodes.push(g6Vertex);
  });
  grapJsonObj.edges.forEach((edge) => {
    const g6Edge = createg6Edge(edge);
    g6Graph.edges.push(g6Edge);
  });
  return g6Graph;
}

export default class G6Func extends PureComponent {
  constructor(props) {
    super(props);
    this.g6Ref = null;
    this.layouts = new Map();
    this.state = {
      clusteredData: null,
      zommedOutMode: false,
      data: null,
    };
    this.addEventListeners = this.addEventListeners.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.clearStates = this.clearStates.bind(this);
    this.comboNodes = this.comboNodes.bind(this);
  }
  comboNodes() {
    this.state.clusteredData.clusters.forEach((cluster, i) => {
      console.log(cluster);
      const color = graphicsColors[i % graphicsColors.length];
      const childNodes = cluster.nodes.map((node) => node.id);

      this.g6Ref.createCombo(
        createCombo(i, color, childNodes.length),
        childNodes
      );
    });
    this.g6Ref.getCombos().map((combo) => this.g6Ref.collapseCombo(combo));
    this.g6Ref.refresh();
    //this.g6Ref.render();
  }
  addEventListeners() {}
  bindEvents() {
    this.g6Ref.on("viewportchange", (evt) => {
      // some operations
      if (evt.action === "zoom") {
        //console.log(evt);
        //console.log("zoomed");
        //event.matrix.at(0) <- current distance
        //get distance and save last distance
        //treshold = 0.9
        //if current distance > last distance, change render mode, and vice versa
        if (evt.matrix.at(0) >= 0.9 && this.statezommedOutMode) {
          this.g6Ref.getNodes().forEach((node) => {
            //console.log(node);
            const model = {
              icon: {
                show: true,
                width: node._cfg.model.icon.width,
                height: node._cfg.model.icon.height,
                img: node._cfg.model.icon.img,
              },
            };
            node.update(model);
          });
          //near but not in mode so change mode and rendering
          //display icons
          this.setState({ zommedOutMode: false });
        } else if (evt.matrix.at(0) < 0.9 && !this.state.zommedOutMode) {
          //far but not in right mode so change mode and rendering
          //do not display icons
          this.g6Ref.getNodes().forEach((node) => {
            //console.log(node);

            const model = {
              icon: {
                show: false,
                width: node._cfg.model.icon.width,
                height: node._cfg.model.icon.height,
                img: node._cfg.model.icon.img,
              },
            };
            node.update(model);
          });
          this.setState({ zommedOutMode: true });
        }
      }
    });
    this.g6Ref.on("node:mouseenter", (e) => {
      const nodeItem = e.item; // Get the target item
      this.g6Ref.setItemState(nodeItem, "hover", true); // Set the state 'hover' of the item to be true
    });
    this.g6Ref.on("canvas:click", (e) => {
      this.clearStates();
      this.props.onEntityDeselect();
    });
    this.g6Ref.on("node:mouseleave", (e) => {
      const nodeItem = e.item; // Get the target item
      this.g6Ref.setItemState(nodeItem, "hover", false); // Set the state 'hover' of the item to be false
    });
    this.g6Ref.on("node:dblclick", (e) => {
      this.clearStates();
      const nodeItem = e.item; // e the clicked item
      this.g6Ref.setItemState(nodeItem, "click", true); // Set the state 'click' of the item to be true
      const inEdges = nodeItem.getInEdges();
      inEdges.forEach((edge) => {
        this.g6Ref.setItemState(edge, "selected", true);
      });
      const outEdges = nodeItem.getOutEdges();
      outEdges.forEach((edge) => {
        this.g6Ref.setItemState(edge, "clicked", true);
      });
      const clickNodes = this.g6Ref.findAllByState("node", "click");
      this.g6Ref.focusItem(nodeItem, true, {
        easing: "easeCubic",
        duration: 400,
      });
      console.log(clickNodes[0].getID());
      //retrieve ode from nodeIdString of format: "nodeID"
      const origID = parseInt(clickNodes[0].getID().match(/(\d+)/)[0]);
      this.props.onEntitySelect(origID); //return the entity type (node/edge) the original node ID, and the reference to the selected icon
    });
  }
  clearStates() {
    this.g6Ref.getNodes().forEach((node) => {
      this.g6Ref.clearItemStates(node);
    });
    this.g6Ref.getEdges().forEach((edge) => {
      this.g6Ref.clearItemStates(edge);
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.displayEdges !== this.props.displayEdges) {
      let edges = this.g6Ref.getEdges();
      edges.forEach((edge) => {
        this.props.displayEdges
          ? this.g6Ref.showItem(edge, false)
          : this.g6Ref.hideItem(edge, false);
      });
    }
    if (prevProps.clusterNodes !== this.props.clusterNodes) {
      if (this.props.clusterNodes) {
        //create combos
        if (this.state.clusteredData === null) {
          this.setState(
            { clusteredData: louvain(this.state.data, false) },
            () => {
              this.comboNodes();
            }
          );
        } else {
          this.comboNodes();
        }
      } else {
        //decombo
        //lower functions would be better but uncombo removes the nodes if the parent combo of the
        this.g6Ref.getCombos().forEach((combo) => this.g6Ref.uncombo(combo));
        //this.g6Ref.refresh();
        // this.g6Ref.data(this.state.data);
        this.g6Ref.render();
      }
    }
  }
  componentDidMount() {
    this.layouts.set("gForce", gForce(this.props.width, this.props.height));
    this.layouts.set("Force_with_Clustering", forceWithClustering);
    this.layouts.set("Dagre", dagre);
    this.layouts.set("Fruchterman", fruchterman);
    this.layouts.set("Grid", grid(this.props.width, this.props.height));
    const minimap = new G6.Minimap({
      size: [150, 100],
    });
    this.g6Ref = new G6.Graph({
      container: "g6-react",
      width: this.props.width,
      height: this.props.height,
      modes: {
        default: [
          "drag-node",
          "drag-combo",
          "collapse-expand-combo",
          {
            type: "drag-canvas",
            enableOptimize: true, // enable the optimize to hide the shapes beside nodes' keyShape
          },
          {
            type: "zoom-canvas",
            enableOptimize: true, // enable the optimize to hide the shapes beside nodes' keyShape
          },
        ],
      },
      groupByTypes: false,
      plugins: [minimap],
      layout: this.layouts.get(this.props.layout),
      fitCenter: true,
    });
    this.g6Ref.setMaxZoom(2);
    let data = convertGraphJSONtoG6Format(this.props.jsonGraph);
    this.setState({ data: data });
    this.g6Ref.data(data);
    this.addEventListeners();
    this.bindEvents();
    this.g6Ref.render();
  }
  componentWillUnmount() {
    this.g6Ref.destroy();
  }
  render() {
    return <div id="g6-react"></div>;
  }
}
