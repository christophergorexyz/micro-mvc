import Observable from '../utilities/observable';

export default class Application extends Observable {
  constructor() {
    super();
    this._name='Observability Tester';
    this._version='0.0.1';
  }

  get name(){
    return this._name;
  }

  set name(val){
    this._name = val;
    this.notify();
  }
}
