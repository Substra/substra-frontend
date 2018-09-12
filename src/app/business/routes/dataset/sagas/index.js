/* globals window document Blob fetch */

import {
takeLatest, takeEvery, all, select, call, put,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {fetchListSaga, fetchPersistentSaga, fetchItemSaga} from '../../../common/sagas/index';
import {fetchRaw} from '../../../../entities/fetchEntities';

function* fetchList(request) {
    const state = yield select();

    const f = () => fetchListApi(state.location.query);

    yield call(fetchListSaga(actions, f), request);
}

function* fetchDetail({payload}) {
    const state = yield select();

    if (!state.dataset.item.results.find(o => o.pkhash === payload.key)) {
        yield put(actions.item.request({id: payload.key, get_parameters: {}}));
    }

    // load description every time, should we cache it?
    yield put(actions.item.description.request({id: payload.key, url: payload.description.storageAddress}));
}

function* fetchItemDescriptionSaga({payload: {id, url}}) {
    const {res, status} = yield call(fetchRaw, url);

    if (res && status === 200) {
        yield put(actions.item.description.success({id, desc: res}));
    }
}

function* fetchItemFileSaga({payload: {url, filename}}) {

    let status;

    yield fetch(url, {
        headers: {
            Accept: 'text/html;version=0.0',
            'Content-Type': 'application/json;',
        },
        mode: 'cors',
    }).then((response) => {
        status = response.status;
        if (!response.ok) {
            return response.text().then(result => Promise.reject(new Error(result)));
        }

        return response.text();
    }).then((res) => {
        const mime_type = 'text/plain';
        const blob = new Blob([res], {type: mime_type});

        const dlink = document.createElement('a');
        dlink.download = filename;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = () => {
            // revokeObjectURL needs a delay to work properly
            setTimeout(() => window.URL.revokeObjectURL(this.href), 1500);
        };
        dlink.click();
        dlink.remove();
    }, error => ({error, status}));
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga(actions, fetchItemApi)),

        takeEvery(actionTypes.item.description.REQUEST, fetchItemDescriptionSaga),

        takeEvery(actionTypes.item.file.REQUEST, fetchItemFileSaga),
    ]);
};


export default sagas;
