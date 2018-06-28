/**
 * This file is defined only to solve the React rAF problem
 * https://github.com/facebook/jest/issues/4545
 */
global.requestAnimationFrame = function raf(callback) {
    setTimeout(callback, 0);
};
