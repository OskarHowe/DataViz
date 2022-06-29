import React from "react";
import logo from "./cosmotechDark.png";
import Modal from "./components/Modal";
import "./App.css";
import BlueButton from "./components/BlueButton";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
      graphRedisStrings: null,
      currentGraphEntity: null,
      loading: true,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.fetchGraphIDs();
  }
  toggleModal() {
    this.setState({ displayModal: !this.state.displayModal });
  }
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
        const startTimeDisplayGraph = window.performance.now();
        //displayGraph();
        const endTimeDisplayGraph = window.performance.now();
        json.measures.push({
          graphDisplayDuration: endTimeDisplayGraph - startTimeDisplayGraph,
        });
        console.log(json);
      })
      .catch((error) => {
        console.log(`Error when fetching Graphentity: ${error}`);
      });
  }
  handleModalSubmit(graphRedisString) {
    this.setState({
      displayModal: false,
      currentGraphEntity: graphRedisString, //is not updated when the function below is called, so i pass the parameter directly
    });
    this.fetchGraphEntity(graphRedisString);
  }
  visualizeGraph() {}
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
          <BlueButton id="closeBtn" text="+" onClick={this.toggleModal} />
        </main>
      </div>
    );
  }
}

export default App;
