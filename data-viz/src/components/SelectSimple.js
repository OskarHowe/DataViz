import React from "react";
import "./SelectSimple.css";

class SelectSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options || ["No Option Available"],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({ selectedOption: e.target.key });
  }
  render() {
    return (
      <select className="SelectSimple" onChange={this.handleChange}>
        {this.state.options.map((option) => {
          return (
            <option key={option} value={option}>
              id : {option}
            </option>
          );
        })}
      </select>
    );
  }
}

export default SelectSimple;
