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

    const search = state.search.filters.map((o, i) => {
        let filter = encodeURIComponent(o);
        // check if precedent is not Logic and add `,`
        if (i > 0 && !(state.search.filters[i - 1] === '_OR_' || o === '_OR_')) {
            filter = `,${filter}`;
        }

        return filter;
    }).join('');


    const newUrl = url.format({
        pathname: state.location.pathname,
        query: {
            search,
        },
    });
    yield push(newUrl);
}

function* setItem({payload}) {
    const state = yield select();

    const {
        challenge, dataset, algo, model,
    } = state;

    // fetch related data if not already done
    // TODO maybe use a generic fetchList(item)
    if (payload === 'challenge' && !challenge.persistent.init && !challenge.persistent.loading) {
        yield put(challengeActions.persistent.request());
    }
    else if (payload === 'dataset' && !dataset.persistent.init && !dataset.persistent.loading) {
        yield put(datasetActions.persistent.request());
    }
    else if (payload === 'algo' && !algo.persistent.init && !algo.persistent.loading) {
        yield put(algoActions.persistent.request());
    }
    else if (payload === 'model' && !model.persistent.init && !model.persistent.loading) {
        yield put(modelActions.persistent.request());
    }
}

export default function* () {
    yield all([
        takeLatest(actionTypes.filters.SET, setFilters),
        takeLatest(actionTypes.item.SET, setItem),
    ]);
}
