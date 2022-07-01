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
      displayInfoModal: true,
      graphRedisStrings: null,
      selectedRedisGraphString: null,
      loadedGrapEntityJSON: null,
      loading: true,
      renderG6GRaph: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleInfoModal = this.toggleInfoModal.bind(this);

    this.handleModalSubmit = this.handleModalSubmit.bind(this);
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
        console.log(`Fetched ${graphId} from server`);
        console.log(json);
        this.setState({ loadedGrapEntityJSON: json });
      })
      .then(() => {
        this.setState({ renderG6GRaph: true });
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
  handleModalSubmit(graphRedisString) {
    if (graphRedisString === this.state.selectedRedisGraphString) {
      this.setState({
        displayModal: false,
      });
      return;
    }
    this.setState({
      displayModal: false,
      selectedRedisGraphString: graphRedisString, //is not updated when the function below is called, so i pass the parameter directly
      renderG6GRaph: false,
    });
    this.setState({ renderG6GRaph: false });
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
            onSubmit={this.handleModalSubmit}
          />
        ) : null}
        <main className="graph-node">
          {this.state.renderG6GRaph ? (
            <G6Func
              jsonGraph={this.state.loadedGrapEntityJSON.graph}
              width={window.innerWidth}
              height={window.innerHeight - 80}
            />
          ) : null}
          <InfoModal
            title="Operation : Slice"
            inEdges="100"
            outEdges="2"
            attributes={[
              { id: "slice23" },
              {
                name: "Thisis he longes fucking ever name to test the scroll behaviour of the ul which will be fucing ennozing",
              },
            ]}
            toggle={this.toggleInfoModal}
          />
          <BlueButton id="closeBtn" text="+" onClick={this.toggleModal} />
        </main>
      </div>
    );
  }
}

export default App;
