import React from "react";
import "./SelectSimple.css";

class SelectSimple extends React.Component {
  constructor(props) {
    super(props);
    if (props.options) {
      this.props.onChange(this.props.options[0]);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.options[0] !== prevProps.options[0]) {
      this.props.onChange(this.props.options[0]);
    }
  }
  render() {
    return (
      <select
        className="SelectSimple"
        onChange={(event) => {
          event.target.value !== "default"
            ? this.props.onChange(event.target.value)
            : console.log("do nothing");
        }}
      >
        {this.props.options ? (
          // this.props.onChange(this.state.options[0]);
          this.props.options.map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })
        ) : (
          <option key={"default"} value={"default"}>
            {"No Option Available"}
          </option>
        )}
      </select>
    );
  }
}

export default SelectSimple;
