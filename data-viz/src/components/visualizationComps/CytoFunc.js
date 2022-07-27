import React, { PureComponent } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { createNodeStyle, edgeStyle } from "./CytoStyles";
import expandCollapse from "cytoscape-expand-collapse";
import dagre from "cytoscape-dagre";
import cola from "cytoscape-cola";
import cytoscape from "cytoscape";

const compoundOptions = {
  layoutBy: null, // to rearrange after expand/collapse. It's just layout options or whole layout function. Choose your side!
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
      groupe: "edges",
      data: {
        id: "edge" + edge.id,
        source: "node" + edge.sourceNode, // Integer
        target: "node" + edge.destinationNode, // Integer
      },
    });
  });
  return elements;
}
function createStyleSheet(jsonGraph) {
  const nodeStylesheet = createNodeStyle(jsonGraph.vertices);
  nodeStylesheet.style.push(edgeStyle);
  return nodeStylesheet;
}

class CytoFunc extends PureComponent {
  constructor(props) {
    super(props);
    this.cy = null;
    this.compoundsApi = null;
    this.state = {
      //parse data into cyto format
      data: CytoscapeComponent.normalizeElements(
        convertGraphJSONtoCytoFormat(this.props.jsonGraph)
      ),
      nodeStylesheet: createStyleSheet(this.props.jsonGraph),
    };
    if (typeof cytoscape("core", "expandCollapse") == "undefined") {
      cytoscape.use(expandCollapse);
    }
    //define layout
    switch (this.props.layout) {
      case "dagre":
        cytoscape.use(dagre);
        break;
      case "cola":
        cytoscape.use(cola); // register extension
        break;
      case "grid":
        break;
      default:
        cytoscape.use(dagre);
        this.props.layout = "dagre";
        break;
    }
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
      />
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.clusterNodes !== prevProps.clusterNodes) {
      console.log(
        `useEffect() called with change of clusterNodes which is now: ${this.props.clusterNodes}`
      );
      if (this.props.clusterNodes) {
        this.compoundsApi.collapseAll(compoundOptions);
        //this.compoundsApi.collapseAllEdges();
      } else {
        this.compoundsApi.expandAll(compoundOptions);
        //this.compoundsApi.expandAllEdges(compoundOptions);
      }
    }
  }
  initCyto(cytoRef, props) {
    cytoRef.removeAllListeners();
    this.compoundsApi = cytoRef.expandCollapse(compoundOptions);
    cytoRef.on("dbltap", "node", function (e) {
      cytoRef.elements().not(e.target).unselect();
      const selectedElement = e.target;
      //console.log(`doubletap on ${selectedElement}`);

      const origID = parseInt(selectedElement[0].data().id.match(/(\d+)/)[0]);
      props.onEntitySelect(origID);
    });
    this.cy = cytoRef;
  }

  render() {
    return this.cytoScene;
  }
}
export default CytoFunc;
