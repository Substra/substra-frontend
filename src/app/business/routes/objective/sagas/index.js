/* globals fetch */

import {
    takeLatest, takeEvery, all, select, call, put,
} from 'redux-saga/effects';

import {saveAs} from 'file-saver';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {
    fetchListSaga, fetchPersistentSaga, fetchItemSaga, setOrderSaga, getJWTFromCookie, tryRefreshToken,
} from '../../../common/sagas';
import {fetchRaw} from '../../../../entities/fetchEntities';
import {getItem} from '../../../common/selector';

function* fetchList(request) {
    const state = yield select();
    let jwt = getJWTFromCookie();
    if (!jwt) {
        jwt = yield tryRefreshToken(actions.list.failure);
    }

    if (jwt) {
        const f = () => fetchListApi(state.location.query, jwt);
        yield call(fetchListSaga(actions, f), request);
    }
}

function* manageTabs(tabIndex) {
    const state = yield select();
    const item = getItem(state, 'objective');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({pkhash: item.key, url: item.description.storageAddress}));
        }
    }
}

function* fetchItem({payload}) {
    let jwt = getJWTFromCookie();
    if (!jwt) {
        jwt = yield tryRefreshToken(actions.item.failure);
    }

    if (jwt) {
        yield call(fetchItemSaga(actions, fetchItemApi), {
            payload: {
                id: payload.key,
                get_parameters: {},
                jwt,
            },
        });
    }
}

function* fetchPersistent(request) {
    const state = yield select();
    let jwt = getJWTFromCookie();
    if (!jwt) {
        jwt = yield tryRefreshToken(actions.persistent.failure);
    }

    if (jwt) {
        const f = () => fetchListApi(state.location.query, jwt);
        yield call(fetchPersistentSaga(actions, f), request);
    }
}

function* fetchDetail(request) {
    const state = yield select();

    // fetch current tab content if needed
    yield manageTabs(state.objective.item.tabIndex);

    const exists = state.objective.item.results.find((o) => o.pkhash === request.payload.key);
    if (!exists) {
        yield put(actions.item.request(request.payload));
    }
}

function* setTabIndexSaga({payload}) {
    yield manageTabs(payload);
}

function* fetchItemDescriptionSaga({payload: {pkhash, url}}) {
    let jwt = getJWTFromCookie();
    if (!jwt) {
        jwt = yield tryRefreshToken(actions.description.failure);
    }
    if (jwt) {
        const {res, status} = yield call(fetchRaw, url, jwt);
        if (res && status === 200) {
            yield put(actions.item.description.success({pkhash, desc: res}));
        }
    }
}

function* downloadItemSaga({payload: {url}}) {
    let status;
    let filename;

    let jwt = getJWTFromCookie();
    if (!jwt) {
        jwt = yield tryRefreshToken(actions.description.failure);
    }
    if (jwt) {
        yield fetch(url, {
            headers: {
                Accept: 'application/json;version=0.0',
                ...(jwt ? {Authorization: `JWT ${jwt}`} : {}),
            },
            credentials: 'include',
            mode: 'cors',
        }).then((response) => {
            status = response.status;
            if (!response.ok) {
                return response.text().then((result) => Promise.reject(new Error(result)));
            }

            filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

            return response.blob();
        }).then((res) => {
            saveAs(res, filename);
        }, (error) => ({error, status}));
    }
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistent),

        takeEvery(actionTypes.item.REQUEST, fetchItem),
        takeLatest(actionTypes.item.description.REQUEST, fetchItemDescriptionSaga),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSaga),

        takeLatest(actionTypes.order.SET, setOrderSaga),
        takeLatest(actionTypes.item.tabIndex.SET, setTabIndexSaga),
    ]);
};


export default sagas;
