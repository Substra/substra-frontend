import {
    takeLatest, select, all, put,
} from 'redux-saga/effects';
import {push} from 'redux-first-router';
import url from 'url';

import {actionTypes} from './actions';

import challengeActions from '../routes/challenge/actions';
import datasetActions from '../routes/dataset/actions';
import algoActions from '../routes/algorithm/actions';
import modelActions from '../routes/model/actions';

function* setFilters() {
    const state = yield select();

    const newUrl = url.format({
        pathname: state.location.pathname,
        query: state.search.filters,
    });
    yield push(newUrl);
}

function* setItem({payload}) {
    const state = yield select();

    const {
        challenge, dataset, algo, model,
    } = state;

    // fetch related data if not already done
    // TODO use persistent not filtered list
    // TODO maybe use a generic fetchList(item)
    if (payload === 'challenge' && !challenge.list.init && !challenge.list.loading) {
        yield put(challengeActions.list.request());
    }
    else if (payload === 'dataset' && !dataset.list.init && !dataset.list.loading) {
        yield put(datasetActions.list.request());
    }
    else if (payload === 'algo' && !algo.list.init && !algo.list.loading) {
        yield put(algoActions.list.request());
    }
    else if (payload === 'model' && !model.list.init && !model.list.loading) {
        yield put(modelActions.list.request());
    }
}

export default function* () {
    yield all([
        takeLatest(actionTypes.filters.SET, setFilters),
        takeLatest(actionTypes.item.SET, setItem),
    ]);
}
