import {flatten, orderBy, uniqBy} from 'lodash';

import createDeepEqualSelector from '../../../utils/selector';

const results = (state, model) => state[model].list.results;
const order = (state, model) => state[model].order;
const isComplex = state => state.search.isComplex;

export const getColumns = createDeepEqualSelector([results],
    // put name in first
    results => results && results.length && results[0].length ? [...Object.keys(results[0][0]).filter(o => !['algo', 'challenge', 'startModel', 'endModel', 'testData', 'trainData'].includes(o))] : [],
);

export const getOrderedResults = createDeepEqualSelector([results, order, isComplex],
    (results, order, isComplex) => {
        const res = results && results.length ? results.map(o => orderBy(o, [order.by], [order.direction])) : [];

        return isComplex ? res : [uniqBy(flatten(res), 'key')];
    },
);

export default {
    getColumns,
    getOrderedResults,
};
