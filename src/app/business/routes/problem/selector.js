import {orderBy} from 'lodash';

import createDeepEqualSelector from '../../../utils/selector';

const results = state => state.problem.list.results;
const order = state => state.problem.order;

export const getColumns = createDeepEqualSelector([results],
    results => results && results.length ? Object.keys(results[0]).filter(o => o !== 'docType') : [],
);

export const getOrderedResults = createDeepEqualSelector([results, order],
    (results, order) => results && results.length ? orderBy(results, [order.by], [order.direction]) : [],
);

export default {
    getColumns,
    getOrderedResults
};
