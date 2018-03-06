import React from "react";
import App from "./app";
import { Provider } from "unstated";
import withDevTools from "../src/index";
import { ConsoleLogMonitor } from "../src/monitors/ConsoleLogMonitor";

const ProviderWithDevTools = withDevTools(Provider, ConsoleLogMonitor);

export default function() {
  return (
    <ProviderWithDevTools>
      <App />
    </ProviderWithDevTools>
  );
}
