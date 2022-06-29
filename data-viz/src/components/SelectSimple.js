import { RampRightSharp } from "@mui/icons-material";
import React from "react";
import "./SelectSimple.css";

class SelectSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options || ["No Option Available"],
    };
    if (props.options) {
      this.props.onChange(this.state.options[0]);
    }
  }
  render() {
    return (
      <select
        className="SelectSimple"
        onChange={(event) => {
          event.target.value !== "No Option Available"
            ? this.props.onChange(event.target.value)
            : console.log("do nothing");
        }}
      >
        {this.state.options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    );
  }
}

export default SelectSimple;
