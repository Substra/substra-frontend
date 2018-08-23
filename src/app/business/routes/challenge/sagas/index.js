/* global fetch */

import {
    takeLatest, takeEvery, all, select, call, put,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {fetchListSaga, fetchPersistentSaga, fetchItemSaga} from '../../../common/sagas/index';


function* fetchList(request) {
    const state = yield select();

    const f = () => fetchListApi(state.location.query);

    yield call(fetchListSaga(actions, f), request);
}

function* fetchDetail({payload}) {
    const state = yield select();

    if (!state.challenge.item.results.find(o => o.pkhash === payload)) {
        yield put(actions.item.request({id: payload, get_parameters: {}}));
    }
}

const fetchDesc = (url) => {
    let status;

    return fetch(url, {
        mode: 'cors',
    }).then((response) => {
        status = response.status;

        if (!response.ok) {
            return response.text().then(result => Promise.reject(new Error(result)));
        }

        return response.text();
    }).then(res => ({res, status}), error => ({error, status}));
};

function* fetchItemDescriptionSaga({payload: {id, url}}) {
    const {res, status} = yield call(fetchDesc, url);

    if (res && status === 200) {
        yield put(actions.item.description.success({id, desc: res}));
    }
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga(actions, fetchItemApi)),
        takeEvery(actionTypes.item.description.REQUEST, fetchItemDescriptionSaga),
    ]);
};


export default sagas;
