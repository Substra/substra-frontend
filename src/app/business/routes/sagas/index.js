import {
    takeLatest, all, select, put, fork,
} from 'redux-saga/effects';

import objectiveActions from '../objective/actions';
import datasetActions from '../dataset/actions';
import algoActions from '../algo/actions';
import modelActions from '../model/actions';

const assetActions = {
    objective: objectiveActions,
    dataset: datasetActions,
    algo: algoActions,
    model: modelActions,
};

const getRouteAsset = (route) => {
    if (route === 'ALGORITHM') {
        return 'algo';
    }
    return route.toLowerCase();
};

const fetchList = route => function* fetchAssetList() {
    const asset = getRouteAsset(route);
    const actions = assetActions[asset];
    const state = yield select();
    if (!state[asset].list.loading) {
        yield put(actions.list.request());
    }
};

function* fetchInitialList() {
    const state = yield select();
    const route = state.location.type;
    const asset = getRouteAsset(route);
    const actions = assetActions[asset];
    yield put(actions.list.request());
}


// TODO: loglist

const sagas = function* sagas() {
    yield all([
        takeLatest('OBJECTIVE', fetchList('OBJECTIVE')),
        takeLatest('DATASET', fetchList('DATASET')),
        takeLatest('ALGORITHM', fetchList('ALGORITHM')),
        takeLatest('MODEL', fetchList('MODEL')),

    ]);

    yield fork(fetchInitialList);
};

export default sagas;
