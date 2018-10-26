import {
orderBy, isArray, flatten, uniqBy, isEmpty,
} from 'lodash';

import createDeepEqualSelector from '../../utils/selector';

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

export const getColumns = createDeepEqualSelector([results],
    // put name in first
    results => results && results.length && results[0].length ? ['name', ...Object.keys(results[0][0]).filter(o => !['name', 'key', 'description', 'descriptionStorageAddress', 'metrics', 'owner', 'testDataKeys'].includes(o))] : [],
);

export const getOrderedResults = createDeepEqualSelector([results, order, isComplex],
    (results, order, isComplex) => {
        const res = results && results.length ? results.map(o => !isEmpty(o) ? orderBy(o, [order.by], [order.direction]) : o) : [];

        return isComplex ? res : [uniqBy(flatten(res), 'key')];
    },
);

export const getItem = createDeepEqualSelector([itemResults, results, selected],
    (itemResults, results, selected) => ({
        ...uniqBy(flatten(results), 'key').find(o => o.key === selected),
        ...itemResults.find(o => o.pkhash === selected),
    }),
);

export default {
    getColumns,
    getOrderedResults,
    getItem,
};
