import Observable from '../utilities/observable';

export default class ComplexNumber extends Observable {
  constructor(x, yi) {
    super();
    this._x = x;
    this._yi = yi;
  }

  get x(){
    return this._x;
  }

  set x(val){
    this._x = val;
    this.notify(this);
  }

  get yi(){
    return this._yi;
  }

  set yi(val){
    this._yi = val;
    this.notify(this);
  }

  set xyi(val){
    this._x = val.x;
    this._yi = val.yi;
    this.notify(this);
  }
}
