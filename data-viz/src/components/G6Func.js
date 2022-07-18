import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import G6, { Algorithm } from "@antv/g6";
import {
  createg6Vertex,
  createg6Edge,
  gForce,
  forceWithClustering,
  dagre,
  fruchterman,
  grid,
} from "./G6Styles.js";
import "./G6Func.css";
import icons from "../images/iconsBase64";
const { louvain } = Algorithm;
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

export default function G6Func(props) {
  //console.log(convertGraphJSONtoG6Format(props.jsonGraph));
  const ref = React.useRef(null);
  let graph = null;
  let displayEdges = true;
  const clusterBtn = document.getElementById("clusterBtn");
  const hideEdgesBtn = document.getElementById("hideEdgesBtn");
  hideEdgesBtn.addEventListener("click", () => {
    let edges = graph.getEdges();
    displayEdges = !displayEdges;
    edges.forEach((edge) => {
      displayEdges ? graph.showItem(edge, false) : graph.hideItem(edge, false);
    });
  });

  let zommedOutMode = false;
  const layouts = new Map();

  useEffect(() => {
    layouts.set("gForce", gForce(ref));
    layouts.set("Force_with_Clustering", forceWithClustering);
    layouts.set("Dagre", dagre);
    layouts.set("Fruchterman", fruchterman);
    layouts.set("Grid", grid(ref));
    const minimap = new G6.Minimap({
      size: [150, 100],
    });
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: props.width,
        height: props.height,
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
        defaultCombo: {
          style: {
            fill: "#5F95FF",
            opacity: 0.2,
            stroke: "#5F95FF",
            strokeOpacity: 0.85,
          },
        },
        plugins: [minimap],
        layout: layouts.get(props.layout),
        fitCenter: true,
      });
    }
    const clearStates = () => {
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge);
      });
    };

    graph.setMaxZoom(2);
    const data = convertGraphJSONtoG6Format(props.jsonGraph);
    graph.data(data);
    graph.render();
    clusterBtn.addEventListener("click", (e) => {
      const clusteredData = louvain(data, false);

      clusteredData.clusters.forEach((cluster, i) => {
        console.log(cluster);
        const color = graphicsColors[i % graphicsColors.length];
        graph.createHull({
          id: `hull${i}`,
          members: cluster.nodes.map((node) => node.id),
          padding: 10,
          style: {
            fill: color,
            opacity: 0,
            strokeOpacity: 0.85,
            stroke: "white",
          },
        });
      });
      graph.refresh();
    });
    graph.on("viewportchange", (evt) => {
      // some operations
      if (evt.action === "zoom") {
        //console.log(evt);
        //console.log("zoomed");
        //event.matrix.at(0) <- current distance
        //get distance and save last distance
        //treshold = 0.9
        //if current distance > last distance, change render mode, and vice versa
        if (evt.matrix.at(0) >= 0.9 && zommedOutMode) {
          graph.getNodes().forEach((node) => {
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
          zommedOutMode = false;
        } else if (evt.matrix.at(0) < 0.9 && !zommedOutMode) {
          //far but not in right mode so change mode and rendering
          //do not display icons
          graph.getNodes().forEach((node) => {
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
          zommedOutMode = true;
        }
      }
    });
    graph.on("node:mouseenter", (e) => {
      const nodeItem = e.item; // Get the target item
      graph.setItemState(nodeItem, "hover", true); // Set the state 'hover' of the item to be true
    });
    graph.on("canvas:click", (e) => {
      clearStates();
      props.onEntityDeselect();
    });
    graph.on("node:mouseleave", (e) => {
      const nodeItem = e.item; // Get the target item
      graph.setItemState(nodeItem, "hover", false); // Set the state 'hover' of the item to be false
    });
    graph.on("node:click", (e) => {
      clearStates();
      const nodeItem = e.item; // e the clicked item
      graph.setItemState(nodeItem, "click", true); // Set the state 'click' of the item to be true
      const inEdges = nodeItem.getInEdges();
      inEdges.forEach((edge) => {
        graph.setItemState(edge, "selected", true);
      });
      const outEdges = nodeItem.getOutEdges();
      outEdges.forEach((edge) => {
        graph.setItemState(edge, "clicked", true);
      });
      const clickNodes = graph.findAllByState("node", "click");
      graph.focusItem(nodeItem, true, {
        easing: "easeCubic",
        duration: 400,
      });
      console.log(clickNodes[0].getID());
      //retrieve ode from nodeIdString of format: "nodeID"
      const origID = parseInt(clickNodes[0].getID().match(/(\d+)/)[0]);
      props.onEntitySelect(true, origID); //return the entity type (node/edge) the original node ID, and the reference to the selected icon
    });
  }, []);

  return <div ref={ref}></div>;
}
