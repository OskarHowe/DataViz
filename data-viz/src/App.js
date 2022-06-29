import React from "react";
import logo from "./cosmotechDark.png";
import Modal from "./components/Modal";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "./App.css";
import BlueButton from "./components/BlueButton";

class App extends React.Component {
  // const [graphRedisStrings, setPosts] = useState([]);
  // useEffect(() => {
  //   fetch("http://localhost:25566/graphs") //because fetch returns a promise
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((json) => {
  //       console.log(`List of graph entities in Redis fetched: ${json}`);
  //       setPosts(json);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }
  toggleModal() {
    console.log("toggleModal");
    this.setState({ displayModal: !this.state.displayModal });
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
        {this.state.displayModal ? (
          <Modal
            toggle={this.toggleModal}
            remoteEntities={["hallo", "was", "geht?"]}
          />
        ) : null}
        <main className="graph-node">
          {/* <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              this.toggleModal();
            }}
          >
            <AddIcon />
          </Fab> */}
          <BlueButton id="closeBtn" text="+" onClick={this.toggleModal} />
        </main>
      </div>
    );
  }
}

export default App;
