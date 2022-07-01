import React from "react";
import "./InfoModal.css";
import CloseButton from "./CloseButton";
import gearsIcon from "../images/Gears_White.png";
import arrowIn from "../images/Arrow In.png";
import arrowOut from "../images/Arrow Out.png";

class InfoModal extends React.Component {
  render() {
    return (
      <div className="InfoModal">
        <CloseButton onClick={this.props.toggle} />
        <div className="header-infomodal">
          <img src={gearsIcon} alt="Logo" />
          <h3>{this.props.title}</h3>
          <div className="edges-info">
            <img className="arrowImg" src={arrowIn} alt="Arrow in Logo"></img>
            <h4>{this.props.inEdges}</h4>
            <img className="arrowImg" src={arrowOut} alt="Arrow out Logo"></img>
            <h4>{this.props.outEdges}</h4>
          </div>
        </div>
        <hr />
        <ul>
          {this.props.attributes.map((attribute) => {
            let key = Object.keys(attribute).at(0);
            let value = attribute[key];

            return (
              <li key={key}>
                {key} :<p>{value}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default InfoModal;
