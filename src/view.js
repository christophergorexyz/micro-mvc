import {
  MVC_CONTROLS,
  MVC_OBSERVES,
  MVC_RADIO_GROUP,
  MVC_CHECK_GROUP,
  MVC_PROPERTY_CHANGED,
  MVC_MODEL_MODIFIED,
  MVC_INPUT_CHANGED
} from './config';

import MVCEventEmitter from './event-emitter';

export default class View extends MVCEventEmitter {
  constructor(viewDOM, model) {
    super();

    let observers = viewDOM.querySelectorAll(`[${MVC_OBSERVES}]`);
    let controls = viewDOM.querySelectorAll(`[${MVC_CONTROLS}]`);

    let radioGroupObservers = viewDOM.querySelectorAll(`[${MVC_OBSERVES}][${MVC_RADIO_GROUP}]`);
    let radioGroupControls = viewDOM.querySelectorAll(`[${MVC_CONTROLS}][${MVC_RADIO_GROUP}]`);

    let checkGroupObservers = viewDOM.querySelectorAll(`[${MVC_OBSERVES}][${MVC_CHECK_GROUP}]`);
    let checkGroupControls = viewDOM.querySelectorAll(`[${MVC_CONTROLS}][${MVC_CHECK_GROUP}]`);

    radioGroupObservers = Array.prototype.map.call(radioGroupObservers, (o) => o);
    radioGroupControls = Array.prototype.map.call(radioGroupControls, (c) => c);

    checkGroupObservers = Array.prototype.map.call(checkGroupObservers, (o) => o);
    checkGroupControls = Array.prototype.map.call(checkGroupControls, (c) => c);

    function getInputValue(control) {
      let inputType = control.getAttribute('type');

      //most of these can just fall through to default, listing them exhaustively for thoroughness
      switch (inputType) {
        case 'button':
        case 'file': //TODO: figure out if possible to handle file
        case 'image':
        case 'password': //you should never be allowed to control this programmatically
        case 'reset':
        case 'submit':
          throw new TypeError(`Inputs of type ${inputType} cannot observe models`);
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
      let inputType = observer.getAttribute('type');
      switch (inputType) {
        case 'button':
        case 'file': //TODO: figure out if possible to handle file
        case 'image':
        case 'reset':
        case 'submit':
          throw new TypeError(`Inputs of type ${inputType} do not have values`);
          break;
        case 'password': //you should never be allowed to control this programmatically
          throw new TypeError(`Inputs of type ${inputType} may not be modified by controllers`);
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
          if (observer.hasAttribute(MVC_RADIO_GROUP) && !fieldsetOptionsMap.get(observer).includes(value)) {
            throw new RangeError(`The value supplied, ${value}, is not a valid option`);
          } else if (observer.hasAttribute(MVC_CHECK_GROUP) && Object.keys(value).filter(v => !fieldsetOptionsMap.get(observer).includes(v)).length) {
            throw new RangeError(`At least one of the values supplied, ${value}, is not a valid option`);
          }
          fieldsetSetAdapter.get(observer)(value);
          break;
        case 'SELECT':
          if (!selectOptionsMap.get(observer).includes(value)) {
            throw new RangeError(`The value supplied, ${value}, is not a valid option`);
          }
          observer.value = value;
          break;
        default:
          observer.innerHTML = value;
          break;
      }
    }

    let fieldsetGetAdapter = new Map();
    for (let i = 0; i < controls.length; i++) {
      let addEventListeners = (c) => {
        for (let val in controlledValues) {
          c.addEventListener('change', (e) => {
            let ce = new CustomEvent(MVC_INPUT_CHANGED, {
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

      let controlledValues = controls[i].getAttribute(MVC_CONTROLS).split(',');
      if (radioGroupControls.includes(controls[i])) {
        let radioGroupName = controls[i].getAttribute(MVC_RADIO_GROUP);

        let radioForm = controls[i].closest('form');
        let nodeList = radioForm ? radioForm.elements[radioGroupName] : document.getElementsByName(radioGroupName);

        fieldsetGetAdapter.set(controls[i], (radioForm ?
          () => nodeList.value :
          () => controls[i].querySelector(':checked').value
        ));

        nodeList.forEach((n) => {
          addEventListeners(n);
        });
      } else if (checkGroupControls.includes(controls[i])) {
        let nodeList = controls[i].querySelectorAll('[type="checkbox"]');

        fieldsetGetAdapter.set(controls[i], () => {
          let result = {};
          nodeList.forEach((n) => {
            result[n.value] = n.checked;
          });
          return result;
        });

        nodeList.forEach((n) => {
          addEventListeners(n);
        });
      } else {
        addEventListeners(controls[i]);
      }
    }

    let fieldsetOptionsMap = new Map();
    let selectOptionsMap = new Map();
    let fieldsetSetAdapter = new Map();
    for (let i = 0; i < observers.length; i++) {
      if (radioGroupObservers.includes(observers[i])) {
        let radioGroupName = observers[i].getAttribute(MVC_RADIO_GROUP);

        let radioForm = observers[i].closest('form');
        let nodeList = radioForm ? radioForm.elements[radioGroupName] : document.getElementsByName(radioGroupName);
        fieldsetSetAdapter.set(observers[i], (radioForm ?
          (val) => nodeList.value = val :
          (val) => nodeList.forEach((n) => {
            n.checked = false;
            if (n.value === val) {
              n.checked = true;
            }
          })));
        let options = [];
        nodeList.forEach((o) => {
          options.push(o.value);
        });
        fieldsetOptionsMap.set(observers[i], options)
      } else if (checkGroupObservers.includes(observers[i])) {
        let nodeList = observers[i].querySelectorAll('[type="checkbox"]');
        fieldsetSetAdapter.set(observers[i], (val) => {
          nodeList.forEach((n) => {
            n.checked = val[n.value];
          });
        });
        let options = [];
        nodeList.forEach((o) => {
          options.push(o.value);
        });
        fieldsetOptionsMap.set(observers[i], options);
      } else if (observers[i].tagName === 'SELECT') {
        let options = [];
        observers[i].querySelectorAll('option').forEach((o) => {
          options.push(o.value);
        });
        selectOptionsMap.set(observers[i], options);
      }

      let observedValues = observers[i].getAttribute(MVC_OBSERVES).split(',');
      for (let val in observedValues) {
        model.addEventListener(MVC_PROPERTY_CHANGED, (e) => {
          if (observedValues[val] === e.detail.property && e.target !== observers[i]) {
            updateObserver(observers[i], e.detail.value);
          }
        });
      }
    }

    model.addEventListener(MVC_MODEL_MODIFIED, (e) => {
      for (let i = 0; i < observers.length; i++) {
        let observedValues = observers[i].getAttribute(MVC_OBSERVES).split(',');
        for (let val in observedValues) {
          let updatedVal = e.detail.updates[observedValues[val]];
          if (updatedVal) {
            updateObserver(observers[i], updatedVal);
          }
        }
      }
    });
  }
}
