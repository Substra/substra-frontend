import {NOT_FOUND} from 'redux-first-router';

import createDeepEqualSelector from '../../utils/selector';

const location = state => state.location;
const challengeOrder = state => state.challenge.order;
const datasetOrder = state => state.dataset.order;
const algoOrder = state => state.algo.order;
const modelOrder = state => state.model.order;

export const getRoutes = createDeepEqualSelector([location],
    // put name in first
    location => Object.keys(location.routesMap).filter(o => ![NOT_FOUND, 'HOME'].includes(o)),
);


export const getOrders = createDeepEqualSelector([challengeOrder, datasetOrder, algoOrder, modelOrder],
    // put name in first
    (challengeOrder, datasetOrder, algoOrder, modelOrder) => ({
        challenge: challengeOrder,
        dataset: datasetOrder,
        algorithm: algoOrder,
        model: modelOrder,
    }),
);

export default {
    getRoutes,
};
