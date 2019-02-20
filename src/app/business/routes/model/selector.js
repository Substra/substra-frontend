import {
orderBy, isArray, flatten, uniqBy, isEmpty,
} from 'lodash';

import createDeepEqualSelector from '../../../utils/selector';

const addAll = (set, xs) => xs.reduce((s, x) => s.add(x), set);

export const flattenUniq = xs => Array.from(xs.reduce(
    (s, x) => addAll(s, isArray(x) ? flattenUniq(x) : [x]),
    new Set(),
));

const results = (state, model) => state[model].list.results;
const selected = (state, model) => state[model].list.selected;
const itemResults = (state, model) => state[model].item.results;
const order = (state, model) => state[model].order;
const isComplex = state => state.search.isComplex;

const enhancedResults = createDeepEqualSelector([results],
    results => results.map(o => o.map(o => ({...o, key: o.traintuple.key}))),
);

export const getSelectedResult = createDeepEqualSelector([enhancedResults, selected],
    (results, selected) => uniqBy(flatten(results), o => o.traintuple.key).find(o => o.traintuple.key === selected),
);

// if the result referenced by the "selected" selector is not in results anymore, return undefined
export const getSelected = createDeepEqualSelector([getSelectedResult], result => result && result.traintuple.key);

// will get deep attribute from object, example if 'testtuple.data.perf' is passed as a string, it will get o.testtuple.data.perf
const deepOrder = order => o => order && order.by ? order.by.split('.').reduce((p, c) => p ? p[c] : null, o) : null;

export const getOrderedResults = createDeepEqualSelector([enhancedResults, order, isComplex],
    (results, order, isComplex) => {
        const res = results && results.length ? results.map(o => !isEmpty(o) ? orderBy(o, [deepOrder(order)], [order.direction]) : o) : [];

        return isComplex ? res : [uniqBy(flatten(res), o => o.traintuple.key)];
    },
);

export const getItem = createDeepEqualSelector([itemResults, getSelectedResult, selected],
    (itemResults, selectedResult, selected) => ({
        ...selectedResult,
        ...itemResults.find(o => o.traintuple.key === selected),
    }),
);

export default {
    getOrderedResults,
    getItem,
    getSelected,
};
