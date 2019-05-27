import {NOT_FOUND} from 'redux-first-router';

import {createDeepEqualSelector} from '../../utils/selector';

const location = state => state.location;
const objectiveOrder = state => state.objective.order;
const datasetOrder = state => state.dataset.order;
const algoOrder = state => state.algo.order;
const modelOrder = state => state.model.order;

export const getRoutes = createDeepEqualSelector([location],
    // put name in first
    location => Object.keys(location.routesMap).filter(o => ![NOT_FOUND, 'HOME'].includes(o)),
);


export const getOrders = createDeepEqualSelector([objectiveOrder, datasetOrder, algoOrder, modelOrder],
    // put name in first
    (objectiveOrder, datasetOrder, algoOrder, modelOrder) => ({
        objective: objectiveOrder,
        dataset: datasetOrder,
        algorithm: algoOrder,
        model: modelOrder,
    }),
);

export default {
    getRoutes,
};
