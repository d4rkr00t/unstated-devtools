"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleLogMonitor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function pad(num) {
  return ("00" + num).slice(-2);
}

function pad3(num) {
  return ("000" + num).slice(-3);
}

var formatTimestamp = function formatTimestamp(timestamp) {
  var date = new Date(timestamp);
  return [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()), pad3(date.getMilliseconds())].join(":");
};

var stringToColour = function stringToColour(str) {
  var hash = 0;
  for (var _i = 0; _i < str.length; _i++) {
    hash = str.charCodeAt(_i) + ((hash << 5) - hash);
  }
  var color = "#";
  for (var i = 0; i < 3; i++) {
    var value = hash >> i * 8 & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

var badgeStyles = function badgeStyles(_ref) {
  var bg = _ref.bg,
      text = _ref.text,
      strikeThrough = _ref.strikeThrough;

  return strikeThrough ? "background: " + bg + "; text-decoration: line-through " + strikeThrough + "; color: " + text + "; padding: 1px 6px; border-radius: 2px;" : "background: " + bg + "; color: " + text + "; padding: 1px 6px; border-radius: 2px;";
};

var formatDiffEdit = function formatDiffEdit(diff) {
  return {
    content: "%c" + diff.path.join(".") + ": %c" + diff.oldValue + "%c \u2192 %c" + diff.value,
    style: ["color: #757575; font-weight: lighter;", badgeStyles({ bg: "#fff59d", text: "#e53935", strikeThrough: "#b71c1c" }), "color: #757575;", badgeStyles({ bg: "#fff59d", text: "#00897b" })]
  };
};

var formatDiffDelete = function formatDiffDelete(diff) {
  return {
    content: "%c" + diff.path.join("."),
    style: [badgeStyles({ bg: "#fff59d", text: "#e53935", strikeThrough: "#b71c1c" })]
  };
};

var formatDiffAdd = function formatDiffAdd(diff) {
  return {
    content: "%c" + diff.path.join(".") + ": %c\u2190%c %O",
    style: ["color: #757575; font-weight: lighter;", badgeStyles({ bg: "#c5e1a5", text: "#455A64" }), "background: inherit; color: inherit; padding: 0;", diff.value]
  };
};

var formatDiffError = function formatDiffError(diff) {
  return {
    content: "%cERROR%c " + diff.message,
    style: [badgeStyles({ bg: "#EF5350", text: "#fff" }), "background: inherit; color: inherit; padding: 0;"]
  };
};

var formatDiffItem = function formatDiffItem(diff) {
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

var printByLine = function printByLine(messages) {
  messages.forEach(function (msg) {
    if (!msg) return;
    console.log.apply(console, [msg.content].concat(msg.style));
  });
};

var ConsoleLogMonitor = exports.ConsoleLogMonitor = function (_React$Component) {
  _inherits(ConsoleLogMonitor, _React$Component);

  function ConsoleLogMonitor(props) {
    _classCallCheck(this, ConsoleLogMonitor);

    var _this = _possibleConstructorReturn(this, (ConsoleLogMonitor.__proto__ || Object.getPrototypeOf(ConsoleLogMonitor)).call(this, props));

    _this.onRegisterContainer = function (_ref2) {
      var container = _ref2.container,
          timestamp = _ref2.timestamp;

      var groupTitle = "%c[registred] %c" + container.name + " %c@ " + formatTimestamp(timestamp);
      console.groupCollapsed(groupTitle, "color: #757575; font-weight: lighter;", "color: " + stringToColour(container.name) + ";", "color: #757575; font-weight: lighter;");
      console.log("%cstate: ", "color: #03A9F4; font-weight: lighter;", container.state);
      console.groupEnd(groupTitle);
    };

    _this.onStateChange = function (_ref3) {
      var container = _ref3.container,
          timestamp = _ref3.timestamp,
          oldState = _ref3.oldState,
          change = _ref3.change,
          newState = _ref3.newState,
          diff = _ref3.diff;

      var groupTitle = "%c[updated] %c" + container.name + " %c@ " + formatTimestamp(timestamp);
      console.groupCollapsed(groupTitle, "color: gray; font-weight: lighter;", "color: " + stringToColour(container.name) + ";", "color: gray; font-weight: lighter;");
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

    props.api.on("registerContainer", _this.onRegisterContainer);
    props.api.on("stateChange", _this.onStateChange);
    return _this;
  }

  _createClass(ConsoleLogMonitor, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.api.off("registerContainer", this.onRegisterContainer);
      this.props.api.off("stateChange", this.onStateChange);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return ConsoleLogMonitor;
}(_react2.default.Component);