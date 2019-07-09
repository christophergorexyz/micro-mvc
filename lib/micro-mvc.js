"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = exports.Model = void 0;

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

//MVCEventEmitter class slightly modified from
//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#_Simple_implementation_of_EventTarget
var MVCEventEmitter =
/*#__PURE__*/
function () {
  function MVCEventEmitter() {
    (0, _classCallCheck2["default"])(this, MVCEventEmitter);
    this.listeners = {};
  }

  (0, _createClass2["default"])(MVCEventEmitter, [{
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      if (!(type in this.listeners)) {
        this.listeners[type] = [];
      }

      this.listeners[type].push(callback);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, callback) {
      if (!(type in this.listeners)) {
        return;
      }

      var stack = this.listeners[type];

      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback) {
          stack.splice(i, 1);
          return;
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      if (!(event.type in this.listeners)) {
        return true;
      }

      var stack = this.listeners[event.type].slice();

      for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event);
      }

      return !event.defaultPrevented;
    }
  }]);
  return MVCEventEmitter;
}();

var Model =
/*#__PURE__*/
function (_MVCEventEmitter) {
  (0, _inherits2["default"])(Model, _MVCEventEmitter);

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
          var e = new CustomEvent("mvc-propertychanged", {
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

      var e = new CustomEvent('mvc-modelmodified', {
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
}(MVCEventEmitter);

exports.Model = Model;

var View =
/*#__PURE__*/
function (_MVCEventEmitter2) {
  (0, _inherits2["default"])(View, _MVCEventEmitter2);

  function View(viewDOM, model) {
    var _this2;

    (0, _classCallCheck2["default"])(this, View);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(View).call(this));
    var observers = viewDOM.querySelectorAll('[mvc-observes]');
    var controls = viewDOM.querySelectorAll('[mvc-controls]');

    function getControlValue(control) {
      switch (control.tagName) {
        case "INPUT":
          return control.value;
        //case "TEXTAREA":
        //return control.innerHTML;

        default:
          return control.innerHTML;
      }
    }

    function updateObserver(observer, value) {
      switch (observer.tagName) {
        //TODO: write adapter for each observer
        //TODO: implement custom handlers
        case "INPUT":
          observer.value = value;
          break;
        //case "SELECT":

        default:
          observer.innerHTML = value;
          break;
      }
    }

    var _loop2 = function _loop2(i) {
      var controlledValues = controls[i].getAttribute('mvc-controls').split(',');

      var _loop4 = function _loop4(val) {
        controls[i].addEventListener('change', function (e) {
          var ce = new CustomEvent("mvc-inputchanged", {
            target: e.target,
            detail: {
              property: controlledValues[val],
              value: getControlValue(controls[i])
            }
          });
          model[controlledValues[val]] = getControlValue(controls[i]);

          _this2.dispatchEvent(ce);
        });
      };

      for (var val in controlledValues) {
        _loop4(val);
      }
    };

    for (var i = 0; i < controls.length; i++) {
      _loop2(i);
    }

    var _loop3 = function _loop3(i) {
      var observedValues = observers[i].getAttribute('mvc-observes').split(',');

      var _loop5 = function _loop5(val) {
        model.addEventListener("mvc-propertychanged", function (e) {
          if (observedValues[val] === e.detail.property && e.target !== observers[i]) {
            updateObserver(observers[i], e.detail.value);
          }
        });
      };

      for (var val in observedValues) {
        _loop5(val);
      }
    };

    for (var i = 0; i < observers.length; i++) {
      _loop3(i);
    }

    model.addEventListener("mvc-modelmodified", function (e) {
      for (var i = 0; i < observers.length; i++) {
        var observedValues = observers[i].getAttribute('mvc-observes').split(',');

        for (var val in observedValues) {
          updateObserver(observers[i], e.detail.updates[observedValues[val]]);
        }
      }
    });
    return _this2;
  }

  return View;
}(MVCEventEmitter);

exports.View = View;

//# sourceMappingURL=micro-mvc.js.map