import React from "react";
import { DevToolsSubscribe } from "./DevToolsSubscribe";
import { DevToolsAPI } from "./dev-tools-api";

export default function withDevTools(Provider, Monitor) {
  const api = new DevToolsAPI();

  return props => (
    <Provider>
      <Monitor api={api} />
      <DevToolsSubscribe api={api}>{() => props.children}</DevToolsSubscribe>
    </Provider>
  );
}
