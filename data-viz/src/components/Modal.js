import React from "react";
import "./Modal.css";
import BlueButton from "./statelessComps/BlueButton";
import SelectSimple from "./statelessComps/SelectSimple";
import CloseButton from "./statelessComps/CloseButton";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteEntities: props.remoteEntities,
      layouts: null,
      selectedGraph: null,
      selectedLayout: null,
      selectedLib: null,
      visLibs: props.visLibs,
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleLayoutSelectChange = this.handleLayoutSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLibSelectChange = this.handleLibSelectChange.bind(this);
  }
  handleSelectChange(selectedOption) {
    this.setState({ selectedGraph: selectedOption });
  }
  handleLayoutSelectChange(selectedOption) {
    this.setState({ selectedLayout: selectedOption });
  }
  handleLibSelectChange(selectedOption) {
    const lib = this.state.visLibs.find((lib) => lib.id === selectedOption);
    console.log(lib);
    this.setState({
      selectedLib: selectedOption,
      layouts: lib.layouts,
      //load layout array from Object  with id = selected option into state.layouts
    });
  }
  handleSubmit() {
    this.props.onSubmit(
      this.state.selectedGraph,
      this.state.selectedLayout,
      this.state.selectedLib
    );
  }
  render() {
    const libs = this.state.visLibs.map((lib) => lib.id);
    return (
      <div className="ModalWrapper">
        <div className="Modal">
          <CloseButton onClick={this.props.toggle} />
          <h3>Display your Digital Twin Entity</h3>
          <hr />
          <div className="settingsElement">
            <div className="settingsElement-text">
              <h4>Graph entity to download from our database</h4>
              <p>
                All graph entities which are stored on the local redis server
                are listed and can be fetched
              </p>
            </div>
            <SelectSimple
              options={this.state.remoteEntities}
              onChange={this.handleSelectChange}
            />
            <div className="settingsElement-text">
              <h4>Choose the visualization Library</h4>
              <p>To compare different libaries directly</p>
            </div>
            <SelectSimple
              options={libs}
              onChange={this.handleLibSelectChange}
            />
            <div className="settingsElement-text">
              <h4>Apply a Layout</h4>
              <p>
                The layout can have a drastic impact on the performance. Try to
                choose an layout that fits the structure of the graph.
              </p>
            </div>
            {this.state.layouts && (
              <SelectSimple
                options={this.state.layouts}
                onChange={this.handleLayoutSelectChange}
              />
            )}
            <div></div>
            <div></div>
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
