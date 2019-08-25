const APP_PREFIX = 'mvc';

/**
 * A custom attribute which directs the view to observe a particular value of the model
 */
export const MVC_OBSERVES = `${APP_PREFIX}-observes`;

/**
 * A custom attribute which directs the view to update a particular value of the model
 */
export const MVC_CONTROLS = `${APP_PREFIX}-controls`;

/**
 * A custom attribute which ensures that events are triggered properly for radio inputs
 */
export const MVC_RADIO_GROUP = `${APP_PREFIX}-radio-group`;

/**
 * A custom attribute which ensures that events are triggered properly for checkbox inputs
 */
export const MVC_CHECK_GROUP = `${APP_PREFIX}-check-group`;

/**
 * A custom event name for when multiple properties of a model have been modified
 */
export const MVC_MODEL_MODIFIED = `${APP_PREFIX}-model-modified`;

/**
 * A custom event name for when a single property of a model has been modified
 */
export const MVC_PROPERTY_CHANGED = `${APP_PREFIX}-property-changed`;

/**
 * A custom event name for when an input in a View has been updated
 */
export const MVC_INPUT_CHANGED = `${APP_PREFIX}-input-changed`;

/**
 * The name of the custom element defined by MVCView
 * @experimental this may be deprecated in the future
 */
export const MVC_VIEW_ELEMENT = `${APP_PREFIX}-view`;
