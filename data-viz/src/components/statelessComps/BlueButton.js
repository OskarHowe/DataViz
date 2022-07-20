import React from "react";
import "./BlueButton.css";

class BlueButton extends React.Component {
  render() {
    return (
      <button
        id={this.props.id}
        className="BlueButton"
        onClick={() => this.props.onClick()}
      >
        {this.props.text}
      </button>
    );
  }
}

export default BlueButton;
