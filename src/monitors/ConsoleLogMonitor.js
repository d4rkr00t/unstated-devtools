import React from "react";

function pad(num) {
  return ("00" + num).slice(-2);
}

function pad3(num) {
  return ("000" + num).slice(-3);
}

const formatTimestamp = timestamp => {
  const date = new Date(timestamp);
  return [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
    pad3(date.getMilliseconds())
  ].join(":");
};

const stringToColour = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (var i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const badgeStyles = ({ bg, text, strikeThrough }) => {
  return strikeThrough
    ? `background: ${bg}; text-decoration: line-through ${strikeThrough}; color: ${text}; padding: 1px 6px; border-radius: 2px;`
    : `background: ${bg}; color: ${text}; padding: 1px 6px; border-radius: 2px;`;
};

const formatDiffEdit = diff => ({
  content: `%c${diff.path.join(".")}: %c${diff.oldValue}%c → %c${diff.value}`,
  style: [
    "color: #757575; font-weight: lighter;",
    badgeStyles({ bg: "#fff59d", text: "#e53935", strikeThrough: "#b71c1c" }),
    "color: #757575;",
    badgeStyles({ bg: "#fff59d", text: "#00897b" })
  ]
});

const formatDiffDelete = diff => ({
  content: `%c${diff.path.join(".")}`,
  style: [
    badgeStyles({ bg: "#fff59d", text: "#e53935", strikeThrough: "#b71c1c" })
  ]
});

const formatDiffAdd = diff => {
  return {
    content: `%c${diff.path.join(".")}: %c←%c %O`,
    style: [
      "color: #757575; font-weight: lighter;",
      badgeStyles({ bg: "#c5e1a5", text: "#455A64" }),
      "background: inherit; color: inherit; padding: 0;",
      diff.value
    ]
  };
};

const formatDiffError = diff => {
  return {
    content: `%cERROR%c ${diff.message}`,
    style: [
      badgeStyles({ bg: "#EF5350", text: "#fff" }),
      "background: inherit; color: inherit; padding: 0;"
    ]
  };
};

const formatDiffItem = diff => {
  switch (diff.op) {
    case "replace":
      return formatDiffEdit(diff);
    case "add":
      return formatDiffAdd(diff);
    case "remove":
      return formatDiffDelete(diff);
    case "error":
      return formatDiffError(diff);
    default:
      return null;
  }
};

const printByLine = messages => {
  messages.forEach(msg => {
    if (!msg) return;
    console.log.apply(console, [msg.content].concat(msg.style));
  });
};

export class ConsoleLogMonitor extends React.Component {
  constructor(props) {
    super(props);
    props.api.on("registerContainer", this.onRegisterContainer);
    props.api.on("stateChange", this.onStateChange);
  }

  onRegisterContainer = ({ container, timestamp }) => {
    const groupTitle = `%c[registred] %c${container.name} %c@ ${formatTimestamp(
      timestamp
    )}`;
    console.groupCollapsed(
      groupTitle,
      "color: #757575; font-weight: lighter;",
      `color: ${stringToColour(container.name)};`,
      "color: #757575; font-weight: lighter;"
    );
    console.log(
      "%cstate: ",
      "color: #03A9F4; font-weight: lighter;",
      container.state
    );
    console.groupEnd(groupTitle);
  };

  onStateChange = ({
    container,
    timestamp,

    oldState,
    change,
    newState,
    diff
  }) => {
    const groupTitle = `%c[updated] %c${container.name} %c@ ${formatTimestamp(
      timestamp
    )}`;
    console.groupCollapsed(
      groupTitle,
      "color: gray; font-weight: lighter;",
      `color: ${stringToColour(container.name)};`,
      "color: gray; font-weight: lighter;"
    );
    console.log("%cprev state:", "color: #757575;", oldState);
    console.log("%cchange:    ", "color: #8e24aa;", change);
    console.log("%cnew state: ", "color: #2e7d32;", newState);

    if (diff) {
      console.groupCollapsed("diff");
      printByLine(diff.map(formatDiffItem));
      console.groupEnd("diff");
    }

    console.groupEnd(groupTitle);
  };

  componentWillUnmount() {
    this.props.api.off("registerContainer", this.onRegisterContainer);
    this.props.api.off("stateChange", this.onStateChange);
  }

  render() {
    return null;
  }
}
