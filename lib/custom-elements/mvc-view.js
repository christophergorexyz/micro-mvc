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

/**
 * This class is a custom HTMLElement that provides some syntactic sugar for setting up Views and Models
 * @experimental This class is an experimental featue, and may not be valid in the future
 */
var MVCView =
/*#__PURE__*/
function (_HTMLElement) {
  (0, _inherits2["default"])(MVCView, _HTMLElement);

  function MVCView() {
    (0, _classCallCheck2["default"])(this, MVCView);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MVCView).call(this));
  }
  /**
   * Adds a form around the content slot
   */


  (0, _createClass2["default"])(MVCView, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      /**
       * @type {object}
       */
      this._shadow = this.attachShadow({
        mode: 'open'
      });
      var formNode = document.createElement('form');
      var slot = document.createElement('slot');
      formNode.append(slot);

      this._shadow.appendChild(formNode);
    }
    /**
     * Return the model for the view. May be null if model has not been supplied yet.
     * @type {object}
     */

  }, {
    key: "model",
    get: function get() {
      return this._model;
    }
    /**
     * Set the model the view will observe and modify.
     * @param {object} model An object to be turned into an MVC Model
     */
    ,
    set: function set(model) {
      if (this._model) {
        throw new Error('The model may only be set once.');
      }
      /**
       * The Model instance encapsulated by this element
       * @type {object}
       */


      this._model = new _model["default"](model);
      /**
       * The View instance encapsulated by this element
       * @type {object}
       */

      this._view = new _view["default"](this, this._model);
    }
  }]);
  return MVCView;
}((0, _wrapNativeSuper2["default"])(HTMLElement));

exports["default"] = MVCView;
//# sourceMappingURL=mvc-view.js.map