"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Model", {
  enumerable: true,
  get: function get() {
    return _model["default"];
  }
});
Object.defineProperty(exports, "View", {
  enumerable: true,
  get: function get() {
    return _view["default"];
  }
});
Object.defineProperty(exports, "EventEmitter", {
  enumerable: true,
  get: function get() {
    return _eventEmitter["default"];
  }
});

var _model = _interopRequireDefault(require("./model"));

var _view = _interopRequireDefault(require("./view"));

var _eventEmitter = _interopRequireDefault(require("./event-emitter"));

var _mvcView = _interopRequireDefault(require("./custom-elements/mvc-view"));

var _config = require("./config");

window.customElements.define(_config.MVC_VIEW_ELEMENT, _mvcView["default"]);
//# sourceMappingURL=index.js.map