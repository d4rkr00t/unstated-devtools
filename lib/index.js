"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withDevTools;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _DevToolsSubscribe = require("./DevToolsSubscribe");

var _api = require("./api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function withDevTools(Provider, Monitor) {
  var api = new _api.DevToolsAPI();

  return function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _react2.default.createElement(
      Provider,
      { inject: props.inject },
      _react2.default.createElement(Monitor, { api: api }),
      _react2.default.createElement(
        _DevToolsSubscribe.DevToolsSubscribe,
        { inject: props.inject, api: api },
        function () {
          return props.children;
        }
      )
    );
  };
}