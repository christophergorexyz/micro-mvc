import View from '../view';
import Model from '../model';

export default class MVCView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._shadow = this.attachShadow({
      mode: 'open'
    });
    let formNode = document.createElement('form');
    let slot = document.createElement('slot');
    formNode.append(slot);
    this._shadow.appendChild(formNode);
  }

  get model() {
    return this._model;
  }

  set model(model) {
    if (this._model) {
      throw new Error('The model may only be set once.');
    }
    this._model = new Model(model);
    this._view = new View(this, this._model);
  }
}
