"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _eventEmitter = _interopRequireDefault(require("./event-emitter"));

var config = _interopRequireWildcard(require("./config"));

/**
 * This class encapsulates a basic Object and dispatches events when they are changed
 * @extends {EventEmitter}
 */
var Model =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2["default"])(Model, _EventEmitter);

  /**
   * Create a Model which can observe and be observed by supplying a raw data object and encapsulating it
   * @param {object} dataModel The raw data object to be encapsulated by the instance
   */
  function Model(dataModel) {
    var _this;

    (0, _classCallCheck2["default"])(this, Model);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Model).call(this));
    /**
     * the raw data object which is encapsulated by the event emitter
     * @type {object}
     */

    _this._dataModel = dataModel;

    var _loop = function _loop() {
      var k = _Object$keys[_i];
      Object.defineProperty((0, _assertThisInitialized2["default"])(_this), k, {
        innumerable: true,
        get: function get() {
          return _this._dataModel[k];
        },
        set: function set(val) {
          dataModel[k] = val;
          var e = new CustomEvent(config.MVC_PROPERTY_CHANGED, {
            detail: {
              model: _this._dataModel,
              property: k,
              value: val
            }
          });

          _this.dispatchEvent(e);
        }
      });
    };

    for (var _i = 0, _Object$keys = Object.keys(_this._dataModel); _i < _Object$keys.length; _i++) {
      _loop();
    }

    return _this;
  }
  /**
   * return the underlying _dataModel in its current state
   * @type {object}
   * @deprecated Use `dataModel` instead
   */


  (0, _createClass2["default"])(Model, [{
    key: "modify",

    /**
     * assign multiple values to the dataModel, and dispatch an event.
     * @param {object} val An object containing the values to be updated
     * @experimental This may be deprecated in the future to preserve the object's namespace
     */
    value: function modify(val) {
      Object.assign(this._dataModel, val); //In some situations, it may be too computationally
      //intensive to make updates to all listeners to model,
      //so providing a list of the properties and values that
      //were changed and the raw val object as "updates" so
      //that only the updates are necessary to process

      var e = new CustomEvent(config.MVC_MODEL_MODIFIED, {
        detail: {
          updates: val,
          model: this._dataModel,
          properties: [Object.keys(val)],
          values: [Object.values(val)]
        }
      });
      this.dispatchEvent(e);
    }
  }, {
    key: "model",
    get: function get() {
      return this._dataModel;
    }
    /**
     * return the underlying _dataModel in its current state
     * @type {object}
     * @experimental This may be deprecated in the future to preserve the object's namespace
     */

  }, {
    key: "dataModel",
    get: function get() {
      return this._dataModel;
    }
  }]);
  return Model;
}(_eventEmitter["default"]);

exports["default"] = Model;
//# sourceMappingURL=model.js.map