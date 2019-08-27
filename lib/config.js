"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MVC_VIEW_ELEMENT = exports.MVC_INPUT_CHANGED = exports.MVC_PROPERTY_CHANGED = exports.MVC_MODEL_MODIFIED = exports.MVC_CHECK_GROUP = exports.MVC_RADIO_GROUP = exports.MVC_CONTROLS = exports.MVC_OBSERVES = void 0;

/**
 * A prefix for use for custom event, attribute, and element names
 */
var APP_PREFIX = 'mvc';
/**
 * A custom attribute which directs the view to observe a particular value of the model
 */

var MVC_OBSERVES = "".concat(APP_PREFIX, "-observes");
/**
 * A custom attribute which directs the view to update a particular value of the model
 */

exports.MVC_OBSERVES = MVC_OBSERVES;
var MVC_CONTROLS = "".concat(APP_PREFIX, "-controls");
/**
 * A custom attribute which ensures that events are triggered properly for radio inputs
 */

exports.MVC_CONTROLS = MVC_CONTROLS;
var MVC_RADIO_GROUP = "".concat(APP_PREFIX, "-radio-group");
/**
 * A custom attribute which ensures that events are triggered properly for checkbox inputs
 */

exports.MVC_RADIO_GROUP = MVC_RADIO_GROUP;
var MVC_CHECK_GROUP = "".concat(APP_PREFIX, "-check-group");
/**
 * A custom event name for when multiple properties of a model have been modified
 */

exports.MVC_CHECK_GROUP = MVC_CHECK_GROUP;
var MVC_MODEL_MODIFIED = "".concat(APP_PREFIX, "-model-modified");
/**
 * A custom event name for when a single property of a model has been modified
 */

exports.MVC_MODEL_MODIFIED = MVC_MODEL_MODIFIED;
var MVC_PROPERTY_CHANGED = "".concat(APP_PREFIX, "-property-changed");
/**
 * A custom event name for when an input in a View has been updated
 */

exports.MVC_PROPERTY_CHANGED = MVC_PROPERTY_CHANGED;
var MVC_INPUT_CHANGED = "".concat(APP_PREFIX, "-input-changed");
/**
 * The name of the custom element defined by MVCView
 * @experimental this may be deprecated in the future
 */

exports.MVC_INPUT_CHANGED = MVC_INPUT_CHANGED;
var MVC_VIEW_ELEMENT = "".concat(APP_PREFIX, "-view");
exports.MVC_VIEW_ELEMENT = MVC_VIEW_ELEMENT;
//# sourceMappingURL=config.js.map