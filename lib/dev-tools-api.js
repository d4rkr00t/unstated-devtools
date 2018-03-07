"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevToolsAPI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _justDiff = require("just-diff");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DevToolsAPI = exports.DevToolsAPI = function () {
  function DevToolsAPI() {
    _classCallCheck(this, DevToolsAPI);

    this.containers = new Map();
    this.listeners = {
      registerContainer: [],
      stateChange: []
    };
  }

  _createClass(DevToolsAPI, [{
    key: "on",
    value: function on(event, cb) {
      this.listeners[event].push(cb);
    }
  }, {
    key: "off",
    value: function off(event, cb) {
      this.listeners[event] = this.listeners[event].filter(function (c) {
        return c !== cb;
      });
    }
  }, {
    key: "registerContainer",
    value: function registerContainer(_ref) {
      var container = _ref.container,
          state = _ref.state;

      if (this.containers.has(container)) return;

      var meta = {
        name: container.name,
        state: state,
        history: []
      };

      this.containers.set(container, meta);
      this.onRegisterContainer({ container: meta, timestamp: Date.now() });
    }

    // TODO: State history

  }, {
    key: "stateChange",
    value: function stateChange(_ref2) {
      var container = _ref2.container,
          oldState = _ref2.oldState,
          change = _ref2.change,
          newState = _ref2.newState;

      var meta = this.containers.get(container);
      var timestamp = Date.now();
      var newMeta = Object.assign({}, meta, { state: newState });

      var diff = null;
      try {
        diff = (0, _justDiff.diff)(oldState, newState);
      } catch (e) {}

      this.containers.set(container, newMeta);

      this.onStateChange({
        container: newMeta,
        timestamp: timestamp,

        oldState: oldState,
        change: change,
        newState: newState,
        diff: diff
      });
    }
  }, {
    key: "onRegisterContainer",
    value: function onRegisterContainer(meta) {
      this.listeners.registerContainer.forEach(function (cb) {
        return cb(meta);
      });
    }
  }, {
    key: "onStateChange",
    value: function onStateChange(meta) {
      this.listeners.stateChange.forEach(function (cb) {
        return cb(meta);
      });
    }
  }]);

  return DevToolsAPI;
}();