import {orderBy} from 'lodash';

import createDeepEqualSelector from '../../utils/selector';

const results = (state, model) => state[model].list.results;
const order = (state, model) => state[model].order;

export const getColumns = createDeepEqualSelector([results],
    // put name in first
    results => results && results.length ? ['name', ...Object.keys(results[0]).filter(o => !['name', 'key', 'descriptionStorageAddress', 'metricsHash', 'metricsStorageAddress', 'owner', 'testDataKeys'].includes(o))] : [],
);

export const getOrderedResults = createDeepEqualSelector([results, order],
    (results, order) => results && results.length ? orderBy(results, [order.by], [order.direction]) : [],
);

export default {
    getColumns,
    getOrderedResults,
};
