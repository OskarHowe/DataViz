import React from "react";
import "./InfoModal.css";
import CloseButton from "./CloseButton";
import icons from "./iconsBase64";
import opLogo from "./settings-gears.svg";

class InfoModal extends React.Component {
  render() {
    return (
      <div className="InfoModal">
        <CloseButton onClick={this.props.toggle} />
        <div className="header-infomodal">
          <img src={opLogo} alt="Logo" />
          <h3> title{this.props.title}</h3>
          <div className="edges-info">
            <p>{"-->"} 1</p>
            <p>{"<--"} 0</p>
          </div>
        </div>
        <hr />
        <ul>
          <li>hallo</li>
          <li>was</li>
          <li>geht/</li>
        </ul>
      </div>
    );
  }
}

export default InfoModal;
