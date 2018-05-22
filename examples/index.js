import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { Provider } from "unstated";
import withDevTools from "../src/index";
import { ConsoleLogMonitor } from "../src/monitors/ConsoleLogMonitor";

const ProviderWithDevTools = withDevTools(Provider, ConsoleLogMonitor);

ReactDOM.render(
  <ProviderWithDevTools>
    <App />
  </ProviderWithDevTools>,
  document.getElementById("app")
);
