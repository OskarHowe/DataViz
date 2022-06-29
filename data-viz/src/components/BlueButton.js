import React from "react";
import "./BlueButton.css";

class BlueButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      text: props.text,
    };
  }
  render() {
    return (
      <button
        id={this.state.id}
        className="BlueButton"
        onClick={this.props.onClick}
      >
        {this.state.text}
      </button>
    );
  }
}

export default BlueButton;
