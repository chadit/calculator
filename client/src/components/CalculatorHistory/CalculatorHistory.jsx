import React, { PureComponent } from "react";
import "./CalculatorHistory.css";

class ResultsList extends PureComponent {
  constructor(props) {
    super(props);
    this.setState({
      messages: this.props.calculatorHistory,
    });
  };

  render() {
    return (
      <div id="history">
        {Object.keys(this.props.listItems).map((index) => {
          console.log("CalculatorHistory -->");
          console.log(this.props.listItems[index].data);
          console.log(this.props.listItems[index].data.body);
          let temp = JSON.parse(this.props.listItems[index].data);
          console.log(temp);
          console.log("<-- CalculatorHistory");

          let messages = [];
          for (let i = 0; i < temp.length; i++) {
            messages.push(<div className="Message">{temp[i].body}</div>);
          }
          return messages;
        })}
      </div>
    );
  }
}

class CalculatorHistory extends PureComponent {
  render() {
        return <ResultsList listItems={this.props.calculatorHistory} />;
  }
}

export default CalculatorHistory;