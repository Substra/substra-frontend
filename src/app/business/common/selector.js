import {orderBy, flatten, uniq} from 'lodash';

import createDeepEqualSelector from '../../utils/selector';

const results = (state, model) => state[model].list.results;
const selected = (state, model) => state[model].list.selected;
const itemResults = (state, model) => state[model].item.results;
const order = (state, model) => state[model].order;

export const getColumns = createDeepEqualSelector([results],
    // put name in first
    results => results && results.length && results[0].length ? ['name', ...Object.keys(results[0][0]).filter(o => !['name', 'key', 'description', 'descriptionStorageAddress', 'metrics', 'owner', 'testDataKeys'].includes(o))] : [],
);

export const getOrderedResults = createDeepEqualSelector([results, order],
    (results, order) => results && results.length ? results.map(o => orderBy(o, [order.by], [order.direction])) : [],
);

export const getItem = createDeepEqualSelector([itemResults, results, selected],
    (itemResults, results, selected) => itemResults.length ? {
        ...uniq(flatten(results)).find(o => o.key === selected),
        ...itemResults.find(o => o.pkhash === selected),
    } : null,
);

export default {
    getColumns,
    getOrderedResults,
    getItem,
};
