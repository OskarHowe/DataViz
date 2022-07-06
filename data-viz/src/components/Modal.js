import React from "react";
import "./Modal.css";
import BlueButton from "./BlueButton";
import SelectSimple from "./SelectSimple";
import CloseButton from "./CloseButton";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteEntities: props.remoteEntities,
      layouts: props.layouts,
      selectedGraph: null,
      selectedLayout: null,
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleLayoutSelectChange = this.handleLayoutSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSelectChange(selectedOption) {
    this.setState({ selectedGraph: selectedOption });
  }
  handleLayoutSelectChange(selectedOption) {
    this.setState({ selectedLayout: selectedOption });
  }
  handleSubmit() {
    this.props.onSubmit(this.state.selectedGraph, this.state.selectedLayout);
  }
  render() {
    return (
      <div className="ModalWrapper">
        <div className="Modal">
          <CloseButton onClick={this.props.toggle} />
          <h3>Display your Digital Twin Entity</h3>
          <hr />
          <div className="settingsElement">
            <div className="settingsElement-text">
              <h4>Choose a Graph Entity from our Database</h4>
            </div>
            <SelectSimple
              options={this.state.remoteEntities}
              onChange={this.handleSelectChange}
            />
            <div className="settingsElement-text">
              <h4>Choose a Layout</h4>
            </div>
            <SelectSimple
              options={this.state.layouts}
              onChange={this.handleLayoutSelectChange}
            />
            <div></div>
            <BlueButton
              id="visualizeBtn"
              text="Visualize"
              onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
