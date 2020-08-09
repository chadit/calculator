import React, { PureComponent } from "react";
//import ReactDOM from "react-dom";
import ResultComponent from "./ResultComponent";
import KeyPadComponent from "./KeyPadComponent";
import CalculatorHistory from "../CalculatorHistory/CalculatorHistory";
import "./Calculator.css";
import { connect, sendMsg } from "./ws.js";

class Calculator extends PureComponent {
  constructor() {
    super();

    this.state = {
      result: "",
      sendData: "",
      calculatorHistory: [],
    };
  }

  componentDidMount() {
    connect((msg) => {
      console.log("New Message -->");
      console.log(msg);
      console.log("message type");
      console.log(typeof msg);
      console.log("<-- New Message");

      this.setState((prevState) => ({
        calculatorHistory: [...prevState.calculatorHistory, msg],
      }));
    });
  }

  onClick = (button) => {
    console.log(button);
    if (button === "=") {
      this.calculate();
    } else if (button === "C") {
      this.reset();
    } else if (button === "CE") {
      this.backspace();
    } else {
      this.setState({
        result: this.state.result + button,
      });
    }
  };

  calculate = () => {
    var checkResult = "";
    if (this.state.result.includes("--")) {
      checkResult = this.state.result.replace("--", "+");
    } else {
      checkResult = this.state.result;
    }

    console.log(checkResult);

    try {
      let result = (eval(checkResult) || "") + "";
      let persistedData = checkResult + "=" + result;
      console.log(persistedData);
      this.setState({
        sendData: persistedData,
      }, () => {
        console.log("calculate and send:" + this.state.sendData);
        if (this.state.sendData !== "") {
          sendMsg(this.state.sendData);
        }
      });

      this.setState({
        result: result,
      });
    } catch (e) {
      console.log("error: " + e)
      this.setState({
        sendData: "",
      });
    }

    console.log("sendData:" + this.state.sendData);
    console.log("end");
  };

  reset = () => {
    this.setState({
      result: "",
    });
  };

  backspace = () => {
    this.setState({
      result: this.state.result.slice(0, -1),
    });
  };

  render() {
    return (
      <div className="Calculator">
        <div class="grid-container">
          <div class="grid-item">
          <div id="history"></div>
            <CalculatorHistory
              calculatorHistory={this.state.calculatorHistory}
            />
          </div>
          <div class="grid-item">
            <ResultComponent result={this.state.result} />
            <KeyPadComponent onClick={this.onClick} />
          </div>
        </div>
      </div>
    );
  }
}

//ReactDOM.render(<CalculatorHistory calculatorHistory={this.state.calculatorHistory} />, document.getElementById("history"));

export default Calculator;
