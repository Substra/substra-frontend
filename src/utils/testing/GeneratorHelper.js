import {cloneableGenerator} from 'redux-saga/utils';


const noop = () => {};

/**
 * An helper to simplify the test of sagas.
 *
 * @example
 * const generator = GeneratorHelper(originalGenerator)({payload});
 */
class GeneratorHelper {
    constructor(generator, input) {
        this.generator = generator;
        this.input = input;
    }

    /**
     * Apply a function to the next value of the generator. The return value of
     * the function will be the input of generator.next next call.
     *
     * @param {function} fn -
     *   Function used to assert a yield value of a generator.
     * @example
     *   const generator = GeneratorHelper(originalGenerator)({payload});
     *   generator.test(results => {
     *       // assert if the generator.next().value === 42
     *       expect(result).toEqual(42);
     *       // 33 will be given as the next input : generator.next(33)
     *       return 33;
     *   })
     */
    test = (fn = noop) => {
        if (this.input instanceof Error) {
            const result = this.generator.throw(this.input);
            this.input = fn(result.value);
        }
        else {
            const result = this.generator.next(this.input);
            this.input = fn(result.value);
        }
    }

    /**
     * Copy the generator at the current execution. Can be used to test the
     * different branches of a generator.
     *
     * @param {any} input -
     *   New input parameter used by the next call of generator.next.
     * @example
     *     cont cloneGenerator = generator.clone()
     */
    clone = (input = this.input) => new GeneratorHelper(
        this.generator.clone(),
        input,
    );
}


export default (originalGenerator, testFunction) => (...args) => {
    const generator = cloneableGenerator(originalGenerator)(...args);
    return new GeneratorHelper(generator, testFunction);
};
