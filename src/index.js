import App from "./app";
import React from "react";
import ReactDOM from "react-dom";

const root = document.getElementById("root");
ReactDOM.render(
  <React.unstable_ConcurrentMode>
    <App />
  </React.unstable_ConcurrentMode>,
  root
);
