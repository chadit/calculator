import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { homeReducer } from "../home";

const rootReducer = combineReducers({
  router: routerReducer,
  home: homeReducer,
});

export default rootReducer;
