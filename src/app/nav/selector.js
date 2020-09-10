import {NOT_FOUND} from 'redux-first-router';

import {createDeepEqualSelector} from '../utils/selector';

const location = (state) => state.location;
const objectiveOrder = (state) => state.objective ? state.objective.order : null;
const datasetOrder = (state) => state.dataset ? state.dataset.order : null;
const algoOrder = (state) => state.algo ? state.algo.order : null;
const modelOrder = (state) => state.model ? state.model.order : null;

export const getRoutes = createDeepEqualSelector([location],
    // put name in first
    (location) => Object.keys(location.routesMap).filter((o) => ![NOT_FOUND, 'HOME', 'LOGIN'].includes(o)),
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
