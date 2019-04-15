/* global fetch SUBSTRABAC_AUTH_ENABLED */

import {
    takeLatest, takeEvery, all, put, select, call,
} from 'redux-saga/effects';

import {saveAs} from 'file-saver';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {
fetchListSaga, fetchPersistentSaga, setOrderSaga,
} from '../../../common/sagas';
import {basic} from '../../../../entities/fetchEntities';

function* fetchList(request) {
    const state = yield select();

    const f = () => fetchListApi(state.location.query);

    yield call(fetchListSaga(actions, f), request);
}

function* fetchDetail({payload}) {
    const state = yield select();

    const item = state.model.item.results.find(o => o.traintuple.key === payload.traintuple.key);

    if (!item) {
        yield put(actions.item.success(payload));
    }
}

export const fetchItemSaga = (actions, fetchItemApi) => function* fetchItem({payload}) {
    const {id, get_parameters, jwt} = payload;

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

function* downloadItemSaga({payload: {url}}) {
    let status;
    let filename;

    yield fetch(url, {
        headers: {
            ...(SUBSTRABAC_AUTH_ENABLED ? {Authorization: `Basic ${basic()}`} : {}),
            Accept: 'application/json;version=0.0',
        },
        mode: 'cors',
    }).then((response) => {
        status = response.status;
        if (!response.ok) {
            return response.text().then(result => Promise.reject(new Error(result)));
        }

        filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

        return response.blob();
    }).then((res) => {
        saveAs(res, filename);
    }, error => ({error, status}));
}


/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga(actions, fetchItemApi)),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSaga),

        takeLatest(actionTypes.order.SET, setOrderSaga),
    ]);
};


export default sagas;
