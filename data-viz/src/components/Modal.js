import React from "react";
import "./Modal.css";
import Select from "react-select";

class Modal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="Modal">
        <button
          className="close-button"
          onClick={() => alert("close the modal!")}
        >
          +
        </button>
        <h3>Display your Digital Twin Entity</h3>
        <hr />
        <div className="settingsElement">
          <div className="settingsElement-text">
            <h4>Choose a Graph Entity from our Database</h4>
          </div>
          <select id="graph-select" name="graph-select">
            <option>No Option Available</option>
          </select>
          <div className="settingsElement-text">
            <h4>Select an attribute to group the nodes </h4>
            <p>
              All nodes which hold the same value for the specified attribute
              will be displayed as a compound node. The attribute can contain
              numerical, categorical, or ordinal values
            </p>
          </div>
          <select id="attribute-select" name="attribute-select">
            <option>No Option Available</option>
          </select>
          <hr className="hr-paragraph" />

          <div className="settingsElement-text">
            <h4>Activate Algorithms to pre-group the graph</h4>
          </div>

          <div></div>
          <p>Group sub trees in compounds</p>

          <div></div>
          <p>Group cliques and communities in compounds</p>
          <div></div>
          <div></div>
          <button
            className="blue-button"
            onClick={() => alert("button clicked!")}
          >
            Visualize
          </button>
        </div>
      </div>
    );
  }
}

export default Modal;
