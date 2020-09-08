import {
    orderBy, isArray, flatten, uniqBy, isEmpty,
} from 'lodash';

import {createDeepEqualSelector, deepOrder} from '../../utils/selector';

const addAll = (set, xs) => xs.reduce((s, x) => s.add(x), set);

export const flattenUniq = (xs) => Array.from(xs.reduce(
    (s, x) => addAll(s, isArray(x) ? flattenUniq(x) : [x]),
    new Set(),
));


const buildTypedTraintuple = (model) => {
    let traintuple,
        type;
    if (model.compositeTraintuple) {
        traintuple = model.compositeTraintuple;
        type = 'composite';
    }
    else if (model.aggregatetuple) {
        traintuple = model.aggregatetuple;
        type = 'aggregate';
    }
    // it's necessary to put the "if (model.traintuple)" clause in last position
    else if (model.traintuple) {
        traintuple = model.traintuple;
        type = 'standard';
    }

    return {
        ...model,
        traintuple: {
            ...traintuple,
            type,
        },
    };
};

const buildTesttuples = (model) => {
    const testtuples = [
        // The API returns an empty testtuple if there is no "certified" testtuple.
        // We therefore have to check for a key to know if there is an actual testtuple.
        ...(model.testtuple && model.testtuple.key ? [model.testtuple] : []),
        ...(model.nonCertifiedTesttuples ? model.nonCertifiedTesttuples : []),
    ];
    return {
        ...model,
        testtuples,
    };
};


const rawListResults = (state, model) => state[model].list.results;
const selected = (state, model) => state[model].list.selected;
const rawItemResults = (state, model) => state[model].item.results;
const order = (state, model) => state[model].order;
const isComplex = (state) => state.search.isComplex;

export const listResults = createDeepEqualSelector([rawListResults],
    (results) => results.map((models) => models.map(buildTypedTraintuple).map(buildTesttuples)),
);

export const itemResults = createDeepEqualSelector([rawItemResults],
    (models) => models.map(buildTypedTraintuple).map(buildTesttuples),
);

const results = createDeepEqualSelector([listResults],
    (results) => results.map((o) => o.map((o) => ({...o, key: o.traintuple.key}))),
);

export const getSelectedResult = createDeepEqualSelector([results, selected],
    (results, selected) => uniqBy(flatten(results), (o) => o.traintuple.key).find((o) => o.traintuple.key === selected),
);

// if the result referenced by the "selected" selector is not in results anymore, return undefined
export const getSelected = createDeepEqualSelector([getSelectedResult], (result) => result && result.traintuple.key);

const scoreByStatus = {
    failed: -5,
    canceled: -4,
    waiting: -3,
    todo: -2,
    doing: -1,
    done: deepOrder('traintuple.algo.name'),
};

const modelOrder = (order) => (o) => {
    if (order.by === 'traintuple.status') {
        const score = scoreByStatus[o.traintuple.status];
        if (typeof score === 'function') {
            return score(o);
        }
        return score;
    }
    return deepOrder(order)(o);
};

export const getOrderedResults = createDeepEqualSelector([results, order, isComplex],
    (results, order, isComplex) => {
        const res = results && results.length ? results.map((o) => !isEmpty(o) ? orderBy(o, [modelOrder(order)], [order.direction]) : o) : [];

        return isComplex ? res : [uniqBy(flatten(res), (o) => o.traintuple.key)];
    },
);

export const getItem = createDeepEqualSelector([itemResults, getSelectedResult, selected],
    (itemResults, selectedResult, selected) => ({
        ...selectedResult,
        ...itemResults.find((o) => o.traintuple.key === selected),
    }),
);

export default {
    getOrderedResults,
    getItem,
    getSelected,
};
