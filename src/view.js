import * as config from './config';

import EventEmitter from './event-emitter';

/**
 * The View class is an EventEmitter that searches the children of the provided DOM object for custom attributes
 * which direct it to observe and/or update properties of the provided model object
 * @extends {EventEmitter}
 * @todo Write detailed comments
 */
export default class View extends EventEmitter {
    /**
     * The constructor searches the DOM object and attaches events to the model and the view
     * @param {object} viewDOM A DOM object with children that observe or control the values of the model
     * @param {object} model A model object of type Model to be observed and updated by the View
     */
    constructor(viewDOM, model) {
        super();

        let observers = viewDOM.querySelectorAll(`[${config.MVC_OBSERVES}]`);
        let controls = viewDOM.querySelectorAll(`[${config.MVC_CONTROLS}]`);

        let radioGroupObservers = viewDOM.querySelectorAll(`[${config.MVC_OBSERVES}][${config.MVC_RADIO_GROUP}]`);
        let radioGroupControls = viewDOM.querySelectorAll(`[${config.MVC_CONTROLS}][${config.MVC_RADIO_GROUP}]`);

        let checkGroupObservers = viewDOM.querySelectorAll(`[${config.MVC_OBSERVES}][${config.MVC_CHECK_GROUP}]`);
        let checkGroupControls = viewDOM.querySelectorAll(`[${config.MVC_CONTROLS}][${config.MVC_CHECK_GROUP}]`);

        radioGroupObservers = Array.prototype.map.call(radioGroupObservers, (o) => o);
        radioGroupControls = Array.prototype.map.call(radioGroupControls, (c) => c);

        checkGroupObservers = Array.prototype.map.call(checkGroupObservers, (o) => o);
        checkGroupControls = Array.prototype.map.call(checkGroupControls, (c) => c);

        let fieldsetGetAdapter = new Map();
        let fieldsetOptionsMap = new Map();
        let selectOptionsMap = new Map();
        let fieldsetSetAdapter = new Map();

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
                case 'checkbox':
                    return control.checked;
                    //case 'color': case 'date': case 'datetime-local': case 'email': case 'hidden': case 'month': case 'number': case 'radio': case 'range': case 'search': case 'tel': case 'text': case 'time': case 'url': case 'week':
                default:
                    return control.value;
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
                    if (observer.hasAttribute(config.MVC_RADIO_GROUP) && !fieldsetOptionsMap.get(observer).includes(value)) {
                        throw new RangeError(`The value supplied, ${value}, is not a valid option`);
                    } else if (observer.hasAttribute(config.MVC_CHECK_GROUP) && Object.keys(value).filter(v => !fieldsetOptionsMap.get(observer).includes(v)).length) {
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

        for (let i = 0; i < controls.length; i++) {
            let controlledValues = controls[i].getAttribute(config.MVC_CONTROLS).split(',');
            let addEventListeners = (c) => {
                for (let val in controlledValues) {
                    c.addEventListener('change', (e) => {
                        let ce = new CustomEvent(config.MVC_INPUT_CHANGED, {
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
            };

            if (radioGroupControls.includes(controls[i])) {
                let radioGroupName = controls[i].getAttribute(config.MVC_RADIO_GROUP);

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

        for (let i = 0; i < observers.length; i++) {
            if (radioGroupObservers.includes(observers[i])) {
                let radioGroupName = observers[i].getAttribute(config.MVC_RADIO_GROUP);

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
                fieldsetOptionsMap.set(observers[i], options);
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

            let observedValues = observers[i].getAttribute(config.MVC_OBSERVES).split(',');
            for (let val in observedValues) {
                model.addEventListener(config.MVC_PROPERTY_CHANGED, (e) => {
                    if (observedValues[val] === e.detail.property && e.target !== observers[i]) {
                        updateObserver(observers[i], e.detail.value);
                    }
                });
            }
        }

        model.addEventListener(config.MVC_MODEL_MODIFIED, (e) => {
            for (let i = 0; i < observers.length; i++) {
                let observedValues = observers[i].getAttribute(config.MVC_OBSERVES).split(',');
                for (let val in observedValues) {
                    let updatedVal = e.detail.updates[observedValues[val]];
                    if (updatedVal) {
                        updateObserver(observers[i], updatedVal);
                    }
                }
            }
        });

        //Assume that view DOM object is empty, and trigger a model update to ensure data is injected properly
        model.modify(model.dataModel);
    }
}
