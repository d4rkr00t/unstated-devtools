"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DevToolsSubscribe = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _unstated = require("unstated");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var registerContainer = function registerContainer(api, instance) {
  api.registerContainer({
    container: instance.constructor,
    state: instance.state
  });

  var oldSetState = instance.setState.bind(instance);

  instance.setState = function (change) {
    var oldState = instance.state;

    oldSetState(change);

    api.stateChange({
      container: instance.constructor,
      oldState: oldState,
      change: change,
      newState: instance.state
    });
  };
};

var DevToolsSubscribe = exports.DevToolsSubscribe = function (_Subscribe) {
  _inherits(DevToolsSubscribe, _Subscribe);

  function DevToolsSubscribe(props) {
    _classCallCheck(this, DevToolsSubscribe);

    var _this = _possibleConstructorReturn(this, (DevToolsSubscribe.__proto__ || Object.getPrototypeOf(DevToolsSubscribe)).call(this, props));

    if (!props.inject) return _possibleConstructorReturn(_this);

    props.inject.forEach(function (instance) {
      return registerContainer(props.api, instance);
    });
    return _this;
  }

  _createClass(DevToolsSubscribe, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "_unsubscribe",
    value: function _unsubscribe() {}
  }, {
    key: "_createInstances",
    value: function _createInstances(map) {
      var _this2 = this;

      var oldSet = map.set.bind(map);
      map.set = function (Container, instance) {
        registerContainer(_this2.props.api, instance);
        oldSet(Container, instance);
      };
    }
  }]);

  return DevToolsSubscribe;
}(_unstated.Subscribe);

DevToolsSubscribe.propTypes = {
  children: _propTypes2.default.func.isRequired
};