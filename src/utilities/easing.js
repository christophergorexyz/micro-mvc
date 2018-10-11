/*
    this file has been slightly modified for integration
    purposes from https://gist.github.com/gre/1650294
    comments and math left intact
*/

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
export default {
    // no easing, no acceleration
    'linear': t => t,

    // accelerating from zero velocity
    'ease-in-quad': t => t * t,

    // decelerating to zero velocity
    'ease-out-quad': t => t * (2 - t),

    // acceleration until halfway, then deceleration
    'ease-in-out-quad': t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    // accelerating from zero velocity
    'ease-in-cubic': t => t * t * t,

    // decelerating to zero velocity
    'ease-out-cubic': t => (--t) * t * t + 1,

    // acceleration until halfway, then deceleration
    'ease-in-out-cubic': t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    // accelerating from zero velocity
    'ease-in-quart': t => t * t * t * t,

    // decelerating to zero velocity
    'ease-out-quart': t => 1 - (--t) * t * t * t,

    // acceleration until halfway, then deceleration
    'ease-in-out-quart': t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

    // accelerating from zero velocity
    'ease-in-quint': t => t * t * t * t * t,

    // decelerating to zero velocity
    'ease-out-quint': t => 1 + (--t) * t * t * t * t,

    // acceleration until halfway, then deceleration
    'ease-in-out-quint': t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
};
