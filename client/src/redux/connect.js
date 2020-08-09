import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// actions
import { homeActions } from "../home/";

// feel free to map properties in state to diff properties here
const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return Object.assign(
    {},
    {
      homeActions: bindActionCreators(homeActions, dispatch),
    }
  );
};

// export state and actions to be passed as props
const Connect = connect(mapStateToProps, mapDispatchToProps);
export default Connect;
