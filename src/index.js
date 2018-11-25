//MVCEventEmitter class slightly modified from
//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#_Simple_implementation_of_EventTarget
class MVCEventEmitter {
  constructor() {
    this.listeners = {};
  }

  addEventListener(type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener(type, callback) {
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

  dispatchEvent(event) {
    if (!(event.type in this.listeners)) {
      return true;
    }
    var stack = this.listeners[event.type].slice();

    for (var i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
    return !event.defaultPrevented;
  }
}

class Model extends MVCEventEmitter {
  constructor(dataModel) {
    super();
    for (let k of Object.keys(dataModel)) {

      Object.defineProperty(this, k, {
        innumerable: true,
        get: () => {
          return dataModel[k];
        },
        set: (val) => {
          dataModel[k] = val;
          let e = new CustomEvent(`mvc-propertychanged`, {
            detail: {
              model: dataModel,
              property: k,
              value: val
            }
          });
          this.dispatchEvent(e);
        }
      });
    }

    //TODO: determine whether access to the model is required
    Object.defineProperty(this, 'model', {
      innumerable: true,
      get: () => {
        return dataModel;
      }
    });

    let modify = (val) => {
      Object.assign(dataModel, val);
      //In some situations, it may be too computationally
      //intensive to make updates to all listeners to model,
      //so providing a list of the properties and values that
      //were changed and the raw val object as "updates" so
      //that only the updates are necessary to process
      let e = new CustomEvent('mvc-modelmodified', {
        detail: {
          updates: val,
          model: dataModel,
          properties: [Object.keys(val)],
          values: [Object.values(val)]
        }
      });

      this.dispatchEvent(e);
    };

    Object.defineProperty(this, 'modify', {
      value: modify
    });
  }

}

class View extends MVCEventEmitter {
  constructor(viewDOM, model) {
    super();

    let observers = viewDOM.querySelectorAll('[mvc-observes]');
    let controls = viewDOM.querySelectorAll('[mvc-controls]');


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

    for (let i = 0; i < controls.length; i++) {
      let controlledValues = controls[i].getAttribute('mvc-controls').split(',');
      for (let val in controlledValues) {
        controls[i].addEventListener('change', (e) => {
          let ce = new CustomEvent(`mvc-inputchanged`, {
            target: e.target,
            detail: {
              property: controlledValues[val],
              value: getControlValue(controls[i])
            }
          });
          model[controlledValues[val]] = getControlValue(controls[i]);
          this.dispatchEvent(ce);
        });
      }
    }

    for (let i = 0; i < observers.length; i++) {
      let observedValues = observers[i].getAttribute('mvc-observes').split(',');
      for (let val in observedValues) {
        model.addEventListener(`mvc-propertychanged`, (e) => {
          if (observedValues[val] === e.detail.property && e.target !== observers[i]) {
            updateObserver(observers[i], e.detail.value);
          }
        });
      }
    }

    model.addEventListener(`mvc-modelmodified`, (e) => {
      for (let i = 0; i < observers.length; i++) {
        let observedValues = observers[i].getAttribute('mvc-observes').split(',');
        for (let val in observedValues) {
          updateObserver(observers[i], e.detail.updates[observedValues[val]]);
        }
      }
    });
  }
}

export {
  Model,
  View
};
