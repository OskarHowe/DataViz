import React from "react";
import logo from "./cosmotechDark.png";
import Modal from "./components/Modal";
import "./App.css";
import BlueButton from "./components/statelessComps/BlueButton";
import InfoModal from "./components/statelessComps/InfoModal";
import G6Func from "./components/visualizationComps/G6Func";
import CytoFunc from "./components/visualizationComps/CytoFunc";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
      displayInfoModal: false,
      displayEdges: false,
      clusterNodes: false,
      remoteGraphIDs: null,
      selectedRemoteGraphID: null,
      layout: null,
      visualizationLib: null,
      selectedNode: {
        id: null,
        label: null,
        fromVertices: null,
        toVertices: null,
        params: null,
      },
      visLibs: [
        {
          id: "Cytoscape",
          layouts: ["dagre", "cola", "grid"],
        },
        {
          id: "G6",
          layouts: [
            "gForce",
            "Force_with_Clustering,",
            "Dagre",
            "Fruchterman",
            "Grid",
          ],
        },
      ],
      loadedGrapEntityJSON: null,
      verticesMap: null,
      displayGraph: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleInfoModal = this.toggleInfoModal.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.handleGraphEntityClicked = this.handleGraphEntityClicked.bind(this);
    this.handleGraphEntityDeselect = this.handleGraphEntityDeselect.bind(this);
    this.toggleEdges = this.toggleEdges.bind(this);
    this.toggleClusters = this.toggleClusters.bind(this);
    this.fetchGraphIDs();
  }
  /**
   * Inverts the visibility of the modal
   */
  toggleModal() {
    this.setState({ displayModal: !this.state.displayModal });
  }
  /**
   * Inverts the visibility of the infomodal
   */
  toggleInfoModal() {
    this.setState({ displayInfoModal: !this.state.displayInfoModal });
  }

  toggleEdges() {
    this.setState({ displayEdges: !this.state.displayEdges });
  }
  toggleClusters() {
    this.setState({ clusterNodes: !this.state.clusterNodes });
  }
  /**
   * Gets called by the Graph Component
   * Passes the id of the clicked node and the icon
   *
   * get reference to corresponding node and store it in state
   * get incoming, outgoing edges (from the redisData or the graphical node?)
   * the icon does not need to be loaded from the graphical node, because normally we associate
   * the icon with a nodeproperty outside the G6 class
   * update the state so that the information Modal gets rerendered
   */
  handleGraphEntityClicked(id, icon) {
    const selectedNode = this.state.verticesMap.get(id);
    if (selectedNode) {
      this.setState(
        {
          //prepare props for the InfoModal
          selectedNode: {
            id: selectedNode.id,
            label: selectedNode.labels,
            fromVertices: selectedNode.fromVertices.length,
            toVertices: selectedNode.toVertices.length,
            params: selectedNode.properties,
          },
        },
        () => {
          //open the infomodal
          this.setState({ displayInfoModal: true });
        }
      );
    }
  }

  handleGraphEntityDeselect() {
    this.setState({ displayInfoModal: false });
  }
  /**
   * Entrypoint of the website.
   * Fetches on launch the graph entities from the server to load them into the
   * select node
   */
  fetchGraphIDs() {
    fetch("http://localhost:25566/graphs") //because fetch returns a promise
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log(`List of graph entities in Redis fetched: ${json}`);
        this.setState({ remoteGraphIDs: json });
      })
      .then(() => {
        this.setState({ displayModal: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  /**
   * gets as input the selected graphID from the dropdown menu
   * fetches a graph entity from the server
   * and changes the state to render
   */
  fetchGraphEntity(graphID) {
    let graphId = graphID;
    const startTime = window.performance.now();
    fetch(`http://localhost:25566/graph/${graphId}`) //because fetch returns a promise
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        const endTime = window.performance.now();
        json.measures.push({ nodeFetchDuration: endTime - startTime });
        let verticesMap = new Map();
        json.graph.vertices.forEach((value) => {
          verticesMap.set(value.id, value);
        });
        this.setState({ loadedGrapEntityJSON: json, verticesMap: verticesMap });
      })
      .then(() => {
        this.setState({ displayGraph: true });
      })
      .catch((error) => {
        console.log(`Error when fetching Graphentity: ${error}`);
      });
  }
  /**
   * closes the modal and calls a function to fetch a specific redis graph entity
   * @param {*} graphRedisString
   */
  handleModalSubmit(graphRedisString, choosenLayout, choosenLib) {
    if (
      graphRedisString === this.state.selectedRemoteGraphID &&
      choosenLayout === this.state.layout &&
      choosenLib === this.state.visualizationLib
    ) {
      //nothing changed
      this.setState({
        displayModal: false,
      });
    } else if (graphRedisString === this.state.selectedRemoteGraphID) {
      //the layout and/or lib changed
      this.setState(
        {
          displayModal: false,
          displayInfoModal: false,
          layout: choosenLayout,
          visualizationLib: choosenLib,
          displayGraph: false,
          displayEdges: false,
          clusterNodes: false,
        },
        () => {
          this.setState({ displayGraph: true });
        }
      );
    }
    //the graph entity to dowload and display changed
    //fetch the graph entity
    else {
      this.setState({
        displayModal: false,
        displayInfoModal: false,
        selectedRemoteGraphID: graphRedisString, //is not updated when the function below is called, so i pass the parameter directly
        layout: choosenLayout,
        visualizationLib: choosenLib,
        displayGraph: false,
        displayEdges: false,
        clusterNodes: false,
      });
      this.fetchGraphEntity(graphRedisString);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-description">
            <h1>Dataviz</h1>
            <h2>Digitial Twin Management Solution</h2>
          </div>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {this.state.displayModal && (
          <Modal
            toggle={this.toggleModal}
            remoteEntities={this.state.remoteGraphIDs}
            visLibs={this.state.visLibs}
            onSubmit={this.handleModalSubmit}
          />
        )}
        <main className="graph-node">
          {this.state.displayGraph &&
            ((this.state.visualizationLib === "G6" && (
              <G6Func
                jsonGraph={this.state.loadedGrapEntityJSON.graph}
                width={window.innerWidth}
                height={window.innerHeight - 200}
                layout={this.state.layout}
                displayEdges={this.state.displayEdges}
                clusterNodes={this.state.clusterNodes}
                onEntitySelect={this.handleGraphEntityClicked}
                onEntityDeselect={this.handleGraphEntityDeselect}
              />
            )) ||
              (this.state.visualizationLib === "Cytoscape" && (
                <CytoFunc
                  jsonGraph={this.state.loadedGrapEntityJSON.graph}
                  width={window.innerWidth}
                  height={window.innerHeight}
                  layout={this.state.layout}
                  clusterNodes={this.state.clusterNodes}
                  onEntitySelect={this.handleGraphEntityClicked}
                  onEntityDeselect={this.handleGraphEntityDeselect}
                />
              )))}

          <InfoModal
            title={
              this.state.selectedNode.label +
              " : id: " +
              this.state.selectedNode.id
            }
            visible={this.state.displayInfoModal}
            icon="iconRef"
            inEdges={this.state.selectedNode.fromVertices}
            outEdges={this.state.selectedNode.toVertices}
            attributes={this.state.selectedNode.params}
            toggle={this.toggleInfoModal}
          />

          <button
            id="closeBtn"
            className="BlueButton"
            onClick={() => this.toggleModal()}
          >
            +
          </button>
          {this.state.visualizationLib === "G6" && (
            <button
              id="hideEdgesBtn"
              className="BlueButton"
              onClick={() => this.toggleEdges()}
            >
              Toggle Edges
            </button>
          )}

          <button
            id="clusterBtn"
            className="BlueButton"
            onClick={() => this.toggleClusters()}
          >
            Toggle Clusters
          </button>
        </main>
      </div>
    );
  }
}

export default App;
