import MVCEventEmitter from './event-emitter';

import {
  MVC_PROPERTY_CHANGED,
  MVC_MODEL_MODIFIED
} from './config';

export default class Model extends MVCEventEmitter {
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
          let e = new CustomEvent(MVC_PROPERTY_CHANGED, {
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
      let e = new CustomEvent(MVC_MODEL_MODIFIED, {
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
