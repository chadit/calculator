import React from "react";
import { render } from "react-dom";

// redux
import { Provider } from "react-redux";
import store, { history } from "./redux/store";

// router
import { Route, Switch, Redirect } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";

// worker
import registerServiceWorker from "./registerServiceWorker";

// global styles
import "./site.css";

import Connect from "./redux/connect";
import Home from "./home";

// for each HOC map redux state and actionCreators to props
const HomePage = Connect(Home);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/app" component={HomePage} />
        {/*
            Todo: - instead of redirecting to home on 404 create a 404 page
          */}
        <Redirect from="" to="/app" />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
