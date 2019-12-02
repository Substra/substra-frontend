import {
    orderBy, isArray, flatten, uniqBy, isEmpty,
} from 'lodash';

import bundleByTag from './bundleByTag';
import {createDeepEqualSelector, deepOrder} from '../../../utils/selector';

const addAll = (set, xs) => xs.reduce((s, x) => s.add(x), set);

export const flattenUniq = xs => Array.from(xs.reduce(
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


const rawListResults = (state, model) => state[model].list.results;
const selected = (state, model) => state[model].list.selected;
const rawItemResults = (state, model) => state[model].item.results;
const order = (state, model) => state[model].order;
const isComplex = state => state.search.isComplex;

export const listResults = createDeepEqualSelector([rawListResults],
    results => results.map(models => models.map(buildTypedTraintuple)),
);

export const itemResults = createDeepEqualSelector([rawItemResults],
    models => models.map(buildTypedTraintuple),
);

const itemResultsByKey = createDeepEqualSelector([itemResults],
    results => results.reduce((resultsByKey, result) => ({
            ...resultsByKey,
            [result.traintuple.key]: result,
        }), {}),
);

const results = createDeepEqualSelector([listResults, itemResultsByKey],
    (listResults, itemResultsByKey) => bundleByTag(listResults, itemResultsByKey),
);

const enhancedResults = createDeepEqualSelector([results],
    results => results.map(o => o.map(o => ({...o, key: o.traintuple.key}))),
);

export const getSelectedResult = createDeepEqualSelector([enhancedResults, selected],
    (results, selected) => uniqBy(flatten(results), o => o.traintuple.key).find(o => o.traintuple.key === selected),
);

// if the result referenced by the "selected" selector is not in results anymore, return undefined
export const getSelected = createDeepEqualSelector([getSelectedResult], result => result && result.traintuple.key);

const modelOrder = order => (o) => {
    /*
        We want to order by highest/lowest score on the testtuple score if available.
        For getting a testtuple score, we need a traintuple with done status.

        Rules can be divided in two groupe:
        - If traintuple status is set to done:
            - we have a testtutple, order by its status:
                1. done
                2. doing
                3. todo
                4. failed
            - we do not have a testtutple:
                5. null
         - else traintuple status:
                6. doing
                7. todo
                8. waiting
                9. failed
    */

    const scoreByStatus = {
        failed: {null: -8},
        waiting: {null: -7},
        todo: {null: -6},
        doing: {null: -5},
        done: {
            null: -4,
            failed: -3,
            todo: -2,
            doing: -1,
            done: deepOrder(order),
        },
    };
    const score = scoreByStatus[o.traintuple.status][o.traintuple.status === 'done' && o.testtuple ? o.testtuple.status : 'null'];

    if (typeof score === 'function') {
        return score(o);
    }
    return score;
};

export const getOrderedResults = createDeepEqualSelector([enhancedResults, order, isComplex],
    (results, order, isComplex) => {
        const res = results && results.length ? results.map(o => !isEmpty(o) ? orderBy(o, [modelOrder(order)], [order.direction]) : o) : [];

        return isComplex ? res : [uniqBy(flatten(res), o => o.traintuple.key)];
    },
);

export const getItem = createDeepEqualSelector([itemResults, getSelectedResult, selected],
    (itemResults, selectedResult, selected) => ({
        ...selectedResult,
        ...(selected && selectedResult && selectedResult.tag ? {} : itemResults.find(o => o.traintuple.key === selected)),
    }),
);

export default {
    getOrderedResults,
    getItem,
    getSelected,
};
