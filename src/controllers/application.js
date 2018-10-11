import ComplexNumberFormController from './complex-number-form';
import ComplexPlaneController from './complex-plane';

import ApplicationModel from '../models/application';
import ComplexNumberModel from '../models/complex-number';

export default class Application {
  constructor(applicationContainer) {
    this._applicationElement = null;
    if (applicationContainer instanceof Element) {
      this._applicationElement = applicationContainer;
    } else if (typeof applicationContainer === 'string') {
      try {
        this._applicationElement = document.querySelector(applicationContainer);
      }
      catch (err) {
        throw err;
      }
    } else {
      throw new Error("Application container should be either an element or a query selector");
    }

    this._applicationModel = new ApplicationModel();

    this._complexNumberModel = new ComplexNumberModel(0, 0);
    this._complexNumberFromController = new ComplexNumberFormController(this._applicationElement.querySelector('form'), this._complexNumberModel);
    this._complexPlaneController = new ComplexPlaneController(this._applicationElement.querySelector('canvas'), this._complexNumberModel);

    this._applicationNameElement = this._applicationElement.querySelector('.application-name');

    this._applicationModel.subscribe(()=>this.updateData());
    this._applicationModel.notify();
  }

  updateData(){
    this._applicationNameElement.innerHTML = this._applicationModel.name;
  }
}
