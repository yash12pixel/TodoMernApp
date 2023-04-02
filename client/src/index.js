import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import "./index.css";
import configureStore from "./reducers/store";

const store = configureStore(window.__PRELOADED_STATE__);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
