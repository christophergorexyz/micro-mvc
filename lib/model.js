"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _eventEmitter = _interopRequireDefault(require("./event-emitter"));

var _config = require("./config");

var Model =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2["default"])(Model, _EventEmitter);

  function Model(dataModel) {
    var _this;

    (0, _classCallCheck2["default"])(this, Model);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Model).call(this));

    var _loop = function _loop() {
      var k = _Object$keys[_i];
      Object.defineProperty((0, _assertThisInitialized2["default"])(_this), k, {
        innumerable: true,
        get: function get() {
          return dataModel[k];
        },
        set: function set(val) {
          dataModel[k] = val;
          var e = new CustomEvent(_config.MVC_PROPERTY_CHANGED, {
            detail: {
              model: dataModel,
              property: k,
              value: val
            }
          });

          _this.dispatchEvent(e);
        }
      });
    };

    for (var _i = 0, _Object$keys = Object.keys(dataModel); _i < _Object$keys.length; _i++) {
      _loop();
    } //TODO: determine whether access to the model is required


    Object.defineProperty((0, _assertThisInitialized2["default"])(_this), 'model', {
      innumerable: true,
      get: function get() {
        return dataModel;
      }
    });

    var modify = function modify(val) {
      Object.assign(dataModel, val); //In some situations, it may be too computationally
      //intensive to make updates to all listeners to model,
      //so providing a list of the properties and values that
      //were changed and the raw val object as "updates" so
      //that only the updates are necessary to process

      var e = new CustomEvent(_config.MVC_MODEL_MODIFIED, {
        detail: {
          updates: val,
          model: dataModel,
          properties: [Object.keys(val)],
          values: [Object.values(val)]
        }
      });

      _this.dispatchEvent(e);
    };

    Object.defineProperty((0, _assertThisInitialized2["default"])(_this), 'modify', {
      value: modify
    });
    return _this;
  }

  return Model;
}(_eventEmitter["default"]);

exports["default"] = Model;
//# sourceMappingURL=model.js.map