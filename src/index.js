import React from "react";
import { DevToolsSubscribe } from "./DevToolsSubscribe";
import { DevToolsAPI } from "./api";

export default function withDevTools(Provider, Monitor) {
  const api = new DevToolsAPI();

  return (props = {}) => (
    <Provider inject={props.inject}>
      <Monitor api={api} />
      <DevToolsSubscribe inject={props.inject} api={api}>
        {() => props.children}
      </DevToolsSubscribe>
    </Provider>
  );
}
