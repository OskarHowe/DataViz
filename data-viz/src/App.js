import React from "react";
import logo from "./cosmotechDark.png";
import Modal from "./components/Modal";
import "./App.css";

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
      modalToggle: false,
    };
  }
  // modalHanler(e) {
  //   e.preventDefault();
  //   this.setState({
  //     modalToggle: true,
  //   });
  // }
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
        <Modal></Modal>
        <main className="graph-node"></main>
      </div>
    );
  }
}

export default App;
