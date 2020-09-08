import {
    takeLatest, select, all, put,
} from 'redux-saga/effects';
import {push} from 'redux-first-router';
import url from 'url';
import {omit} from 'lodash';

import {actionTypes} from './actions';

import objectiveActions from '../routes/objective/actions';
import datasetActions from '../routes/dataset/actions';
import algoActions from '../routes/algo/actions';
import modelActions from '../routes/model/actions';

function* setFilters(request) {
    const state = yield select();

    const {
        objective, dataset, algo, model, location,
    } = state;

    const {filters, item, toUpdate} = state.search;

    const l = filters.length;

    if (toUpdate) {
        const search = filters.map((o, i) => {
            let filter = encodeURIComponent(o);
            // check if precedent is not Logic and add `,`
            if (i > 0 && !(filters[i - 1] === '-OR-' || o === '-OR-')) {
                filter = `,${filter}`;
            }
            else if (i === l - 1 && o === '-OR-') { // remove last -OR- if present
                filter = '';
            }

            return filter;
        }).join('');

        const newUrl = url.format({
            pathname: location.pathname,
            query: {
                ...(search ? {search} : {}), // add new search
                ...omit(location.query, ['search']), // keep all get parameters except search
            },
        });
        push(newUrl);

        // fetch list
        const type = location.type.toLowerCase();

        if (['home', 'objective'].includes(type)) {
            yield put(objectiveActions.list.request());
        }
        else if (type === 'dataset') {
            yield put(datasetActions.list.request());
        }
        else if (type === 'algorithm') {
            yield put(algoActions.list.request());
        }
        else if (type === 'model') {
            yield put(modelActions.list.request());
        }
    }
    else {
        // fetch related data if not already done
        if (item === 'objective' && !objective.persistent.init && !objective.persistent.loading) {
            yield put(objectiveActions.persistent.request());
        }
        else if (item === 'dataset' && !dataset.persistent.init && !dataset.persistent.loading) {
            yield put(datasetActions.persistent.request());
        }
        else if (['algo', 'composite_algo', 'aggregate_algo'].includes(item) && !algo.persistent.init && !algo.persistent.loading) {
            yield put(algoActions.persistent.request());
        }
        else if (item === 'model' && !model.persistent.init && !model.persistent.loading) {
            yield put(modelActions.persistent.request());
        }
    }
}

export default function* () {
    yield all([
        takeLatest(actionTypes.state.SET, setFilters),
    ]);
}
