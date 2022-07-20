import React from "react";
import "./InfoModal.css";
import CloseButton from "./CloseButton";
import arrowIn from "../../images/Arrow In.png";
import arrowOut from "../../images/Arrow Out.png";
import Draggable from "react-draggable";

class InfoModal extends React.Component {
  render() {
    return (
      <Draggable>
        <div
          className="InfoModal"
          style={
            this.props.visible
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          <CloseButton onClick={this.props.toggle} />
          <div className="header-infomodal">
            <img src={this.props.iconRef} alt="Logo" />
            <h3>{this.props.title}</h3>
            <div className="edges-info">
              <img className="arrowImg" src={arrowIn} alt="Arrow in Logo"></img>
              <h4>{this.props.inEdges}</h4>
              <img
                className="arrowImg"
                src={arrowOut}
                alt="Arrow out Logo"
              ></img>
              <h4>{this.props.outEdges}</h4>
            </div>
          </div>
          <hr />
          <ul>
            {this.props.attributes &&
              Object.keys(this.props.attributes).map((key) => {
                let value = this.props.attributes[key];

                return (
                  <li key={key}>
                    {key} :<p>{value}</p>
                  </li>
                );
              })}
          </ul>
        </div>
      </Draggable>
    );
  }
}

export default InfoModal;
