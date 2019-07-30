"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _config = require("./config");

var _eventEmitter = _interopRequireDefault(require("./event-emitter"));

var View =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2["default"])(View, _EventEmitter);

  function View(viewDOM, model) {
    var _this;

    (0, _classCallCheck2["default"])(this, View);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(View).call(this));
    var observers = viewDOM.querySelectorAll("[".concat(_config.MVC_OBSERVES, "]"));
    var controls = viewDOM.querySelectorAll("[".concat(_config.MVC_CONTROLS, "]"));
    var radioGroupObservers = viewDOM.querySelectorAll("[".concat(_config.MVC_OBSERVES, "][").concat(_config.MVC_RADIO_GROUP, "]"));
    var radioGroupControls = viewDOM.querySelectorAll("[".concat(_config.MVC_CONTROLS, "][").concat(_config.MVC_RADIO_GROUP, "]"));
    var checkGroupObservers = viewDOM.querySelectorAll("[".concat(_config.MVC_OBSERVES, "][").concat(_config.MVC_CHECK_GROUP, "]"));
    var checkGroupControls = viewDOM.querySelectorAll("[".concat(_config.MVC_CONTROLS, "][").concat(_config.MVC_CHECK_GROUP, "]"));
    radioGroupObservers = Array.prototype.map.call(radioGroupObservers, function (o) {
      return o;
    });
    radioGroupControls = Array.prototype.map.call(radioGroupControls, function (c) {
      return c;
    });
    checkGroupObservers = Array.prototype.map.call(checkGroupObservers, function (o) {
      return o;
    });
    checkGroupControls = Array.prototype.map.call(checkGroupControls, function (c) {
      return c;
    });

    function getInputValue(control) {
      var inputType = control.getAttribute('type'); //most of these can just fall through to default, listing them exhaustively for thoroughness

      switch (inputType) {
        case 'button':
        case 'file': //TODO: figure out if possible to handle file

        case 'image':
        case 'password': //you should never be allowed to control this programmatically

        case 'reset':
        case 'submit':
          throw new TypeError("Inputs of type ".concat(inputType, " cannot observe models"));
          break;

        case 'checkbox':
          return control.checked;
          break;
        //case 'color': case 'date': case 'datetime-local': case 'email': case 'hidden': case 'month': case 'number': case 'radio': case 'range': case 'search': case 'tel': case 'text': case 'time': case 'url': case 'week':

        default:
          return control.value;
          break;
      }
    }

    function getControlValue(control) {
      switch (control.tagName) {
        case 'INPUT':
          return getInputValue(control);

        case 'FIELDSET':
          return fieldsetGetAdapter.get(control)();

        case 'SELECT':
          return control.value;

        default:
          return control.innerHTML;
      }
    }

    function updateInputValue(observer, value) {
      var inputType = observer.getAttribute('type');

      switch (inputType) {
        case 'button':
        case 'file': //TODO: figure out if possible to handle file

        case 'image':
        case 'reset':
        case 'submit':
          throw new TypeError("Inputs of type ".concat(inputType, " do not have values"));
          break;

        case 'password':
          //you should never be allowed to control this programmatically
          throw new TypeError("Inputs of type ".concat(inputType, " may not be modified by controllers"));

        case 'checkbox':
          observer.checked = value;
          break;
        //TODO: implement errors for cases when types like numbers and ranges have min, max, and step attributes
        //TODO: test dates
        //case 'color': case 'date': case 'datetime-local': case 'email': case 'hidden': case 'month': case 'number': case 'radio': case 'range': case 'search': case 'tel': case 'text': case 'time': case 'url': case 'week':

        default:
          observer.value = value;
          break;
      }
    }

    function updateObserver(observer, value) {
      switch (observer.tagName) {
        case 'INPUT':
          updateInputValue(observer, value);
          break;

        case 'FIELDSET':
          if (observer.hasAttribute(_config.MVC_RADIO_GROUP) && !fieldsetOptionsMap.get(observer).includes(value)) {
            throw new RangeError("The value supplied, ".concat(value, ", is not a valid option"));
          } else if (observer.hasAttribute(_config.MVC_CHECK_GROUP) && Object.keys(value).filter(function (v) {
            return !fieldsetOptionsMap.get(observer).includes(v);
          }).length) {
            throw new RangeError("At least one of the values supplied, ".concat(value, ", is not a valid option"));
          }

          fieldsetSetAdapter.get(observer)(value);
          break;

        case 'SELECT':
          if (!selectOptionsMap.get(observer).includes(value)) {
            throw new RangeError("The value supplied, ".concat(value, ", is not a valid option"));
          }

          observer.value = value;
          break;

        default:
          observer.innerHTML = value;
          break;
      }
    }

    var fieldsetGetAdapter = new Map();

    var _loop = function _loop(i) {
      var addEventListeners = function addEventListeners(c) {
        var _loop3 = function _loop3(val) {
          c.addEventListener('change', function (e) {
            var ce = new CustomEvent(_config.MVC_INPUT_CHANGED, {
              target: e.target,
              detail: {
                property: controlledValues[val],
                value: getControlValue(controls[i])
              }
            });
            model[controlledValues[val]] = getControlValue(controls[i]);

            _this.dispatchEvent(ce);
          });
        };

        for (var val in controlledValues) {
          _loop3(val);
        }
      };

      var controlledValues = controls[i].getAttribute(_config.MVC_CONTROLS).split(',');

      if (radioGroupControls.includes(controls[i])) {
        var radioGroupName = controls[i].getAttribute(_config.MVC_RADIO_GROUP);
        var radioForm = controls[i].closest('form');
        var nodeList = radioForm ? radioForm.elements[radioGroupName] : document.getElementsByName(radioGroupName);
        fieldsetGetAdapter.set(controls[i], radioForm ? function () {
          return nodeList.value;
        } : function () {
          return controls[i].querySelector(':checked').value;
        });
        nodeList.forEach(function (n) {
          addEventListeners(n);
        });
      } else if (checkGroupControls.includes(controls[i])) {
        var _nodeList = controls[i].querySelectorAll('[type="checkbox"]');

        fieldsetGetAdapter.set(controls[i], function () {
          var result = {};

          _nodeList.forEach(function (n) {
            result[n.value] = n.checked;
          });

          return result;
        });

        _nodeList.forEach(function (n) {
          addEventListeners(n);
        });
      } else {
        addEventListeners(controls[i]);
      }
    };

    for (var i = 0; i < controls.length; i++) {
      _loop(i);
    }

    var fieldsetOptionsMap = new Map();
    var selectOptionsMap = new Map();
    var fieldsetSetAdapter = new Map();

    var _loop2 = function _loop2(i) {
      if (radioGroupObservers.includes(observers[i])) {
        var radioGroupName = observers[i].getAttribute(_config.MVC_RADIO_GROUP);
        var radioForm = observers[i].closest('form');
        var nodeList = radioForm ? radioForm.elements[radioGroupName] : document.getElementsByName(radioGroupName);
        fieldsetSetAdapter.set(observers[i], radioForm ? function (val) {
          return nodeList.value = val;
        } : function (val) {
          return nodeList.forEach(function (n) {
            n.checked = false;

            if (n.value === val) {
              n.checked = true;
            }
          });
        });
        var options = [];
        nodeList.forEach(function (o) {
          options.push(o.value);
        });
        fieldsetOptionsMap.set(observers[i], options);
      } else if (checkGroupObservers.includes(observers[i])) {
        var _nodeList2 = observers[i].querySelectorAll('[type="checkbox"]');

        fieldsetSetAdapter.set(observers[i], function (val) {
          _nodeList2.forEach(function (n) {
            n.checked = val[n.value];
          });
        });
        var _options = [];

        _nodeList2.forEach(function (o) {
          _options.push(o.value);
        });

        fieldsetOptionsMap.set(observers[i], _options);
      } else if (observers[i].tagName === 'SELECT') {
        var _options2 = [];
        observers[i].querySelectorAll('option').forEach(function (o) {
          _options2.push(o.value);
        });
        selectOptionsMap.set(observers[i], _options2);
      }

      var observedValues = observers[i].getAttribute(_config.MVC_OBSERVES).split(',');

      var _loop4 = function _loop4(val) {
        model.addEventListener(_config.MVC_PROPERTY_CHANGED, function (e) {
          if (observedValues[val] === e.detail.property && e.target !== observers[i]) {
            updateObserver(observers[i], e.detail.value);
          }
        });
      };

      for (var val in observedValues) {
        _loop4(val);
      }
    };

    for (var i = 0; i < observers.length; i++) {
      _loop2(i);
    }

    model.addEventListener(_config.MVC_MODEL_MODIFIED, function (e) {
      for (var i = 0; i < observers.length; i++) {
        var observedValues = observers[i].getAttribute(_config.MVC_OBSERVES).split(',');

        for (var val in observedValues) {
          var updatedVal = e.detail.updates[observedValues[val]];

          if (updatedVal) {
            updateObserver(observers[i], updatedVal);
          }
        }
      }
    });
    return _this;
  }

  return View;
}(_eventEmitter["default"]);

exports["default"] = View;
//# sourceMappingURL=view.js.map