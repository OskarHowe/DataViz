import React from "react";
import "./CloseButton.css";

class CloseButton extends React.Component {
  render() {
    return (
      <button className="CloseButton" onClick={() => this.props.onClick()}>
        +
      </button>
    );
  }
}

export default CloseButton;
