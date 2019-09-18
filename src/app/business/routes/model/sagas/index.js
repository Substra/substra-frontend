/* global window */

import {
    takeLatest, takeEvery, all, put, select, call,
} from 'redux-saga/effects';

import cookie from 'cookie-parse';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {
fetchListSaga, fetchPersistentSaga, setOrderSaga,
} from '../../../common/sagas';

function* fetchList(request) {
    const state = yield select();
    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    const f = () => fetchListApi(state.location.query, jwt);

    yield call(fetchListSaga(actions, f), request);
}

function* fetchDetail({payload}) {
    const state = yield select();

    const item = state.model.item.results.find(o => o.traintuple.key === payload.traintuple.key);

    if (!item) {
        yield put(actions.item.success(payload));
    }
}

function* fetchBundleDetail() {
    const state = yield select();

    for (const group of state.model.list.results) {
        const models = group.filter(model => model.traintuple.tag);
        for (const model of models) {
            const modelDetail = state.model.item.results.find(o => o.traintuple.key === model.traintuple.key);
            if (!modelDetail) {
                yield put(actions.item.request({id: model.traintuple.key}));
            }
        }
    }
}

export const fetchItemSaga = (actions, fetchItemApi) => function* fetchItem({payload}) {
    const {id, get_parameters} = payload;

    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    const {error, status, list} = yield call(fetchItemApi, get_parameters, id, jwt);

    if (error) {
        console.error(error, status);
        yield put(actions.item.failure(error));
    }
    else {
        yield put(actions.item.success(list));
    }

    return list;
};

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.list.SUCCESS, fetchBundleDetail),
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga(actions, fetchItemApi)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
    ]);
};


export default sagas;
