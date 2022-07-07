import React from "react";
import logo from "./cosmotechDark.png";
import Modal from "./components/Modal";
import "./App.css";
import BlueButton from "./components/BlueButton";
import InfoModal from "./components/InfoModal";
import G6Func from "./components/G6Func";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
      displayInfoModal: false,
      graphRedisStrings: null,
      selectedRedisGraphString: null,
      layout: null,
      selectedNode: {
        id: null,
        label: null,
        fromVertices: null,
        toVertices: null,
        params: null,
      },
      loadedGrapEntityJSON: null,
      loading: true,
      verticesMap: null,
      displayG6Graph: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleInfoModal = this.toggleInfoModal.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.handleGraphEntityClicked = this.handleGraphEntityClicked.bind(this);
    this.handleGraphEntityDeselect = this.handleGraphEntityDeselect.bind(this);
    this.fetchGraphIDs();
  }
  /**
   * Inverts the visibility of the modal
   */
  toggleModal() {
    this.setState({ displayModal: !this.state.displayModal });
  }
  toggleInfoModal() {
    this.setState({ displayInfoModal: !this.state.displayInfoModal });
  }
  handleGraphEntityClicked(isNode, id, icon) {
    //get reference to corresponding node and store it in state
    //get incoming, outgoing edges (from the redisData or the graphical node?)
    //the icon does not need to be loaded from the graphical node, because normally we associate
    //the icon with a nodeproperty outside the G6 class
    //update the state so that the information Modal gets rerendered
    if (isNode) {
      const selectedNode = this.state.verticesMap.get(id);
      console.log("slectedNode: ");
      console.log(selectedNode);
      if (selectedNode) {
        this.setState(
          {
            selectedNode: {
              id: selectedNode.id,
              label: selectedNode.labels,
              fromVertices: selectedNode.fromVertices.length,
              toVertices: selectedNode.toVertices.length,
              params: selectedNode.properties,
            },
          },
          () => {
            console.log("slectedNodeState: ");
            console.log(this.state.selectedNode);
            this.setState({ displayInfoModal: true });
          }
        );
      }
    }

    //this.setState({ displayInfoModal: !this.state.displayInfoModal });
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
        this.setState({ graphRedisStrings: json });
      })
      .then(() => {
        this.setState({ loading: false });
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
    //logString(`Selected ${graphId} to download`);
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
        //console.log(`Fetched ${graphId} from server`);
        //console.log(json);
        let verticesMap = new Map();
        json.graph.vertices.map((value) => {
          verticesMap.set(value.id, value);
        });
        this.setState({ loadedGrapEntityJSON: json });
        this.setState({ verticesMap: verticesMap });
      })
      .then(() => {
        this.setState({ displayG6Graph: true });
      })
      .catch((error) => {
        console.log(`Error when fetching Graphentity: ${error}`);
      });
  }
  /**
   * closes the modal and calls a function to fetch a specific redis graph entity
   *
   * @param {*} graphRedisString
   */
  handleModalSubmit(graphRedisString, choosenLayout) {
    if (
      graphRedisString === this.state.selectedRedisGraphString &&
      choosenLayout === this.state.layout
    ) {
      //console.log("graph and layout same");
      //everything stayed the same
      this.setState({
        displayModal: false,
      });
      return;
    } else if (graphRedisString === this.state.selectedRedisGraphString) {
      //just the layout changed
      //console.log("graph same and layout changed");

      this.setState(
        {
          displayModal: false,
          displayInfoModal: false,
          layout: choosenLayout,
          displayG6Graph: false,
        },
        () => {
          this.setState({ displayG6Graph: true });
        }
      );
      return;
    }
    //console.log("graph changed");
    //fetch an other graph entity
    this.setState({
      displayModal: false,
      displayInfoModal: false,
      selectedRedisGraphString: graphRedisString, //is not updated when the function below is called, so i pass the parameter directly
      layout: choosenLayout,
      displayG6Graph: false,
    });
    this.fetchGraphEntity(graphRedisString);
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
        {this.state.displayModal && !this.loading ? (
          <Modal
            toggle={this.toggleModal}
            remoteEntities={this.state.graphRedisStrings}
            layouts={[
              "gForce",
              "Force_with_Clustering,",
              "Dagre",
              "Fruchterman",
              "Grid",
            ]}
            onSubmit={this.handleModalSubmit}
          />
        ) : null}
        <main className="graph-node">
          {this.state.displayG6Graph ? (
            <G6Func
              jsonGraph={this.state.loadedGrapEntityJSON.graph}
              width={window.innerWidth}
              height={window.innerHeight - 200}
              layout={this.state.layout}
              onEntitySelect={this.handleGraphEntityClicked}
              onEntityDeselect={this.handleGraphEntityDeselect}
            />
          ) : null}

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

          <BlueButton id="closeBtn" text="+" onClick={this.toggleModal} />
          <BlueButton
            id="hideEdgesBtn"
            text="Toggle Edges"
            onClick={() => {
              console.log("Toggle Edges!");
            }}
          />
        </main>
      </div>
    );
  }
}

export default App;
