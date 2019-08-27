import EventEmitter from './event-emitter';

import * as config from './config';

/**
 * This class encapsulates a basic Object and dispatches events when they are changed
 * @extends {EventEmitter}
 */
export default class Model extends EventEmitter {
    /**
     * Create a Model which can observe and be observed by supplying a raw data object and encapsulating it
     * @param {object} dataModel The raw data object to be encapsulated by the instance
     */
    constructor(dataModel) {
        super();

        /**
         * the raw data object which is encapsulated by the event emitter
         * @type {object}
         */
        this._dataModel = dataModel;

        for (let k of Object.keys(this._dataModel)) {

            Object.defineProperty(this, k, {
                innumerable: true,
                get: () => {
                    return this._dataModel[k];
                },
                set: (val) => {
                    dataModel[k] = val;
                    let e = new CustomEvent(config.MVC_PROPERTY_CHANGED, {
                        detail: {
                            model: this._dataModel,
                            property: k,
                            value: val
                        }
                    });
                    this.dispatchEvent(e);
                }
            });
        }
    }

    /**
     * return the underlying _dataModel in its current state
     * @type {object}
     * @deprecated Use `dataModel` instead
     */
    get model() {
        return this._dataModel;
    }

    /**
     * return the underlying _dataModel in its current state
     * @type {object}
     * @experimental This may be deprecated in the future to preserve the object's namespace
     */
    get dataModel() {
        return this._dataModel;
    }

    /**
     * assign multiple values to the dataModel, and dispatch an event.
     * @param {object} val An object containing the values to be updated
     * @experimental This may be deprecated in the future to preserve the object's namespace
     */
    modify(val) {
        Object.assign(this._dataModel, val);
        //In some situations, it may be too computationally
        //intensive to make updates to all listeners to model,
        //so providing a list of the properties and values that
        //were changed and the raw val object as "updates" so
        //that only the updates are necessary to process
        let e = new CustomEvent(config.MVC_MODEL_MODIFIED, {
            detail: {
                updates: val,
                model: this._dataModel,
                properties: [Object.keys(val)],
                values: [Object.values(val)]
            }
        });

        this.dispatchEvent(e);
    }
}
