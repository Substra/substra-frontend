import {orderBy} from 'lodash';

import {createDeepEqualSelector, deepOrder} from '../utils/selector';

const results = (state, model) => state[model].list.results;
const selected = (state, model) => state[model].list.selected;
const itemResults = (state, model) => state[model].item.results;
const order = (state, model) => state[model].order;

export const getSelectedResult = createDeepEqualSelector([results, selected],
    (results, selected) => results.find((o) => o.key === selected),
);

// if the result referenced by the "selected" selector is not in results anymore, return undefined
export const getSelected = createDeepEqualSelector([getSelectedResult], (result) => result && result.key);

export const getOrderedResults = createDeepEqualSelector([results, order],
    (results, order) => results && results.length ? orderBy(results, [deepOrder(order)], [order.direction]) : [],
);

export const getItem = createDeepEqualSelector([itemResults, getSelectedResult, selected],
    (itemResults, selectedResult, selected) => ({
        ...selectedResult,
        ...itemResults.find((o) => o.key === selected),
    }),
);

export default {
    getOrderedResults,
    getItem,
    getSelected,
};
