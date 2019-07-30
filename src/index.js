import Model from './model';
import View from './view';
import EventEmitter from './event-emitter';
import ViewElement from './custom-elements/mvc-view';

import {
    MVC_VIEW_ELEMENT
} from './config';
window.customElements.define(MVC_VIEW_ELEMENT, ViewElement);

export {
    Model,
    View,
    EventEmitter
};
