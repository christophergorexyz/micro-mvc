"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _view = _interopRequireDefault(require("../view"));

var _model = _interopRequireDefault(require("../model"));

var MVCView =
/*#__PURE__*/
function (_HTMLElement) {
  (0, _inherits2["default"])(MVCView, _HTMLElement);

  function MVCView() {
    (0, _classCallCheck2["default"])(this, MVCView);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MVCView).call(this));
  }

  (0, _createClass2["default"])(MVCView, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._shadow = this.attachShadow({
        mode: 'open'
      });
      var formNode = document.createElement('form');
      var slot = document.createElement('slot');
      formNode.append(slot);

      this._shadow.appendChild(formNode);
    }
  }, {
    key: "model",
    get: function get() {
      return this._model;
    },
    set: function set(model) {
      if (this._model) {
        throw new Error('The model may only be set once.');
      }

      this._model = new _model["default"](model);
      this._view = new _view["default"](this, this._model);
    }
  }]);
  return MVCView;
}((0, _wrapNativeSuper2["default"])(HTMLElement));

exports["default"] = MVCView;
//# sourceMappingURL=mvc-view.js.map