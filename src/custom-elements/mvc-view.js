import View from '../view';
import Model from '../model';

/**
 * This class is a custom HTMLElement that provides some syntactic sugar for setting up Views and Models
 * @experimental This class is an experimental featue, and may not be valid in the future
 */
export default class MVCView extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * Adds a form around the content slot
     */
    connectedCallback() {
        /**
         * @type {object}
         */
        this._shadow = this.attachShadow({
            mode: 'open'
        });
        let formNode = document.createElement('form');
        let slot = document.createElement('slot');
        formNode.append(slot);
        this._shadow.appendChild(formNode);
    }

    /**
     * Return the model for the view. May be null if model has not been supplied yet.
     * @type {object}
     */
    get model() {
        return this._model;
    }

    /**
     * Set the model the view will observe and modify.
     * @param {object} model An object to be turned into an MVC Model
     */
    set model(model) {
        if (this._model) {
            throw new Error('The model may only be set once.');
        }

        /**
         * The Model instance encapsulated by this element
         * @type {object}
         */
        this._model = new Model(model);

        /**
         * The View instance encapsulated by this element
         * @type {object}
         */
        this._view = new View(this, this._model);
    }
}
