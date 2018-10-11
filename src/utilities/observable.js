export default class observable {
    constructor() {
        this._observers = [];
    }

    subscribe(observer) {
        this._observers.push(observer);
    }

    unsubscribe(observer) {
        this._observers = this._observers.filter(o => o !== observer);
    }

    notify(data){
        this._observers.forEach(observer => observer(data));
    }
}
