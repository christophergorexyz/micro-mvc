export default class ComplexNumberForm {
  constructor(canvas, model) {
    this._canvas = null;
    if (canvas instanceof Element) {
      this._canvas = canvas;
    } else if (typeof canvas === 'string') {
      try {
        this._canvas = document.querySelector(canvas);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("Conplex number container should be either an element or a query selector");
    }

    this._context = canvas.getContext('2d');

    this._lastX = 0;
    this._lastYi = 0;

    model.subscribe((m) => {
      console.log('view: canvas respond to model update');
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._context.fillStyle = 'rgb(0,0,0)';
      this._context.fillRect(m.x, m.yi, 10, 10);
      this._lastX = m.x;
      this._lastYi = m.yi;
    });

    this._canvas.addEventListener('mouseup', (e) => {
      console.log('model: click init model update');
      model.xyi = {
        x: e.clientX - this._canvas.offsetLeft,
        yi: e.clientY - this._canvas.offsetTop
      };
    });
  }
}
