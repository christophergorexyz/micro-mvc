import Model from './model';
import View from './view';
import MVCView from './custom-elements/mvc-view';

import {MVC_VIEW_ELEMENT} from './config';
window.customElements.define(MVC_VIEW_ELEMENT, MVCView);

export {
  Model,
  View
};
