export default class ComplexNumberForm {
  constructor(complexNumberForm, model) {
    this._complexNumberFormElement = null;
    if (complexNumberForm instanceof Element) {
      this._complexNumberFormElement = complexNumberForm;
    } else if (typeof complexNumberForm === 'string') {
      try {
        this._complexNumberFormElement = document.querySelector(complexNumberForm);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("Conplex number container should be either an element or a query selector");
    }

    let inputs = this._complexNumberFormElement.querySelectorAll('[data-observable]');

    let inputInteractionHandler = (e) => {
      console.log('model: form init model update');
      model[e.target.getAttribute('name')] = Number(e.target.value);
    };

    for (let i = 0; i < inputs.length; i++) {
      model.subscribe((m) => {
        if (Number(inputs[i].value) !== m[inputs[i].getAttribute('name')]) {
          console.log('view: form respond to model update');
          inputs[i].value = m[inputs[i].getAttribute('name')];
        }
      });

      inputs[i].addEventListener('change', inputInteractionHandler);
    }
  }
}
