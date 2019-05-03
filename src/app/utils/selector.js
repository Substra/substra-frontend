import {createSelectorCreator, defaultMemoize} from 'reselect';
import {isEqual} from 'lodash';

export const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual,
);

// will get deep attribute from object, example if 'testData.perf' is passed as a string, it will get o.testData.perf
export const deepGet = path => o => path.split('.').reduce((p, c) => p ? p[c] : null, o);

export const deepOrder = order => o => order && order.by ? deepGet(order.by)(o) : null;
