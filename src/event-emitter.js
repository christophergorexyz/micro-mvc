/**
 * The EventEmitter class is modified from a snippet by MDN Contributers at 
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#_Simple_implementation_of_EventTarget 
 * Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/ 
 *
 * This enables custom classes to dispatch events, and is used by micro-mvc to establish observers
 * and fulfill the Model-View-Controller design pattern
 */

export default class EventEmitter {
    /**
     * This class is intended to be extended or composed into other classes.
     */
    constructor() {
        /**
         * Listeners for each event type
         * @type {object}
         */
        this.listeners = {};
    }

    /**
     * Add an event listener
     * @param {string} type The name of the event
     * @param {function} callback The function to execute upon occurence of the event
     */
    addEventListener(type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    }

    /**
     * Remove an even listner
     * @param {string} type The name of the event
     * @param {function} callback The function to stop executing upon occurence of the event
     */
    removeEventListener(type, callback) {
        if (!(type in this.listeners)) {
            return;
        }
        var stack = this.listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Dispatch an event. Upon dispatching an event, all listeners are called
     * @param {object} event The `Event` that needs to be dispatched.
     * @return {boolean} returns the inverse of `event.defaultPrevented`
     */
    dispatchEvent(event) {
        if (!(event.type in this.listeners)) {
            return true;
        }
        var stack = this.listeners[event.type].slice();

        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, event);
        }
        return !event.defaultPrevented;
    }

    /**
     * Check whether the instance has listeners for the provided event type
     * @return {boolean} true if there is a listener for this event type, otherwise false
     * @param {string} type The type of event to check for
     */
    listensFor(type) {
        return !!this.listeners[type];
    }

    /**
     * Check whether the instance has a specific listener for the provided event type
     * @return {boolean} true if the callback exists for this event type, otherwise false
     * @param {string} type The type of event to check for
     * @param {function} callback The specific callback to check for
     */
    hasListener(type, callback) {
        return !!this.listeners[type] ? this.listeners[type].indexOf(callback) >= 0 : false;
    }
}
