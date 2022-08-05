import React, { PureComponent } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { createNodeStyle } from "./CytoStyles";
import expandCollapse from "cytoscape-expand-collapse";
import dagre from "cytoscape-dagre";
import cola from "cytoscape-cola";
import cytoscape from "cytoscape";

const compoundOptions = {
  layoutBy: false, // to rearrange after expand/collapse. It's just layout options or whole layout function. Choose your side!
  // recommended usage: use cose-bilkent layout with randomize: false to preserve mental map upon expand/collapse
  //fisheye: true, // whether to perform fisheye view after expand/collapse you can specify a function too
  animate: false, // whether to animate on drawing changes you can specify a function too
  animationDuration: 1000, // when animate is true, the duration in milliseconds of the animation
  ready: function () {}, // callback when expand/collapse initialized
  undoable: true, // and if undoRedoExtension exists,

  cueEnabled: false, // Whether cues are enabled
  expandCollapseCuePosition: "top-left", // default cue position is top left you can specify a function per node too
  expandCollapseCueSize: 12, // size of expand-collapse cue
  expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
  expandCueImage: undefined, // image of expand icon if undefined draw regular expand cue
  collapseCueImage: undefined, // image of collapse icon if undefined draw regular collapse cue
  expandCollapseCueSensitivity: 1, // sensitivity of expand-collapse cues
  edgeTypeInfo: "edgeType", // the name of the field that has the edge type, retrieved from edge.data(), can be a function, if reading the field returns undefined the collapsed edge type will be "unknown"
  groupEdgesOfSameTypeOnCollapse: true, // if true, the edges to be collapsed will be grouped according to their types, and the created collapsed edges will have same type as their group. if false the collapased edge will have "unknown" type.
  allowNestedEdgeCollapse: false, // when you want to collapse a compound edge (edge which contains other edges) and normal edge, should it collapse without expanding the compound first
  zIndex: 1, // z-index value of the canvas in which cue ımages are drawn
};

function convertGraphJSONtoCytoFormat(grapJsonObj) {
  let elements = [];
  grapJsonObj.vertices.forEach((node) => {
    elements.push({
      group: "nodes",
      classes: node.labels,
      position: { x: node.id * 100, y: node.id * 100 },
      data: {
        id: "node" + node.id,
        parent: `compond${node.id % 3}`,
        label: node.labels,
      },
    });
  });
  const compounds = [0, 1, 2];
  compounds.forEach((compound) => {
    elements.push({
      group: "nodes",
      classes: ["compound"],
      data: {
        id: `compond${compound}`,
        label: "compond" + compound,
      },
    });
  });

  grapJsonObj.edges.forEach((edge) => {
    elements.push({
      group: "edges",
      data: {
        id: "edge" + edge.id,
        source: "node" + edge.sourceNode, // Integer
        target: "node" + edge.destinationNode, // Integer
      },
    });
  });
  return elements;
}

class CytoFunc extends PureComponent {
  constructor(props) {
    super(props);
    this.compoundsApi = null;
    this.state = {
      //parse data into cyto format
      data: CytoscapeComponent.normalizeElements(
        convertGraphJSONtoCytoFormat(this.props.jsonGraph)
      ),
      nodeStylesheet: createNodeStyle(this.props.jsonGraph.vertices),
      cy: null,
    };
    this.initCyto = this.initCyto.bind(this);
    if (typeof cytoscape("core", "expandCollapse") == "undefined") {
      cytoscape.use(expandCollapse);
    }
    //define layout

    cytoscape.use(dagre);
    cytoscape.use(cola); // register extension
    this.cytoScene = (
      <CytoscapeComponent
        cy={(cy) => {
          this.initCyto(cy, this.props);
        }}
        elements={this.state.data}
        style={{ width: this.props.width, height: this.props.height }}
        layout={{
          name: this.props.layout,
        }}
        stylesheet={this.state.nodeStylesheet.style}
        minZoom={0.2}
        maxZoom={2}
        hideEdgesOnViewport={true}
      />
    );
  }

  componentDidUpdate(prevProps) {
    //knwn bug for stargene layout bahavoir thaht graph expands after expand
    //https://github.com/iVis-at-Bilkent/cytoscape.js-expand-collapse/issues/67
    if (this.props.clusterNodes !== prevProps.clusterNodes) {
      console.log(
        `useEffect() called with change of clusterNodes which is now: ${this.props.clusterNodes}`
      );

      if (this.props.clusterNodes) {
        this.compoundsApi.collapseAll(compoundOptions);
        this.compoundsApi.collapseAllEdges();
      } else {
        this.compoundsApi.expandAllEdges();
        this.compoundsApi.expandAll(compoundOptions);
      }
      console.log(this.state.cy.elements());
    }
    //state of display edges changed
    if (this.props.displayEdges !== prevProps.displayEdges) {
      console.log(
        `useEffect() called with change of displayEdges which is now: ${this.props.displayEdges}`
      );

      if (this.props.displayEdges) {
        //didplay all edges
        this.state.cy.edges().hide();
      } else {
        //hide all edges
        this.state.cy.edges().show();
      }
      console.log(this.state.cy.elements());
    }
  }
  initCyto(cytoRef, props) {
    cytoRef.removeAllListeners();
    cytoRef.elements().removeAllListeners();
    // if (this.props.layout === "preset") {
    //   cytoRef.layout(customLayout);
    // }
    this.compoundsApi = cytoRef.expandCollapse(compoundOptions);
    cytoRef.on("select", "node", function (e) {
      cytoRef
        .elements()
        .not(e.target)
        .forEach((elem) => {
          elem.unselect();
          elem.unlock();
        });

      const selectedElement = e.target;
      selectedElement.select();
      console.log(`doubletap on: `);
      console.log(selectedElement);
      selectedElement.outgoers("edge").lock();
      selectedElement.incomers("edge").select();
      //console.log(selectedElement.connectedEdges());
      const origID = parseInt(selectedElement[0].data().id.match(/(\d+)/)[0]);
      props.onEntitySelect(origID);
    });
    cytoRef.on("unselect", "node, edge", function (e) {
      cytoRef.elements().forEach((elem) => {
        elem.unselect();
        elem.unlock();
      });
      props.onEntityDeselect();
    });
    // cytoRef.on(
    //   "cxttap",
    //   "node:parent",
    //   function (e) {
    //     console.log(".on call in node:parent selector to collapse");
    //     const selectedElement = e.target;
    //     this.compoundsApi.collapse(selectedElement);
    //     //console.log(selectedElement);
    //   }.bind(this)
    // );
    cytoRef.on(
      "cxttap",
      "node.cy-expand-collapse-collapsed-node",
      function (e) {
        console.log(
          ".on call in node.cy-expand-collapse-collapsed-node selector to expand"
        );
        const selectedElement = e.target;
        //needs to be done this way beacause of know bugs when combining node and edge expand collapse methods:
        //https://github.com/iVis-at-Bilkent/cytoscape.js-expand-collapse/issues/100
        selectedElement
          .neighborhood("node")
          .forEach((neighbor) =>
            this.compoundsApi.expandEdgesBetweenNodes([
              selectedElement,
              neighbor,
            ])
          );
        this.compoundsApi.expand(selectedElement, compoundOptions);
        console.log("selectedElement.children(): ");
        console.log(selectedElement.children());
      }.bind(this)
    );
    this.setState({ cy: cytoRef });
  }

  render() {
    return this.cytoScene;
  }
}
export default CytoFunc;
