import React, { PureComponent } from 'react';

class ResultComponent extends PureComponent {


    render() {
        let { result } = this.props;
        return (
            <div className="result">
                <p>{result}</p>
            </div>
        )
            ;
    }
}


export default ResultComponent;