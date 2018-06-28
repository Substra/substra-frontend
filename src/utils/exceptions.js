// There is problem with babel concerning Error (related to previous versions
// of js). ES6Error allows to define a new error class to be recognize by
// instanceof.
// https://stackoverflow.com/a/32749533
function ES6Error(...args) {
    const instance = new Error(...args);
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
}
ES6Error.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true,
    },
});
Object.setPrototypeOf(ES6Error, Error);


/**
 * Abstract class use to define new error.
 *
 * All the new error must be extended from ExtendableError to be used by
 * `instanceof`.
 */
class ExtendableError extends ES6Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones)
        // to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown
        // (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExtendableError);
        }
    }
}


export default {
    ExtendableError,
};
