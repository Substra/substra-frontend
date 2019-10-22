/* globals fetch window */

import {
    all, call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';

import {saveAs} from 'file-saver';
import cookie from 'cookie-parse';

import actions, {actionTypes} from '../actions';
import {fetchItemApi, fetchListApi} from '../api';
import {
    fetchItemSaga, fetchListSaga, fetchPersistentSaga, setOrderSaga,
} from '../../../common/sagas';
import {fetchRaw} from '../../../../entities/fetchEntities';
import {getItem} from '../../../common/selector';

// user
import {refresh as refreshActions, signOut} from '../../../user/actions';
import {fetchRefresh} from '../../../user/api';

function* fetchList(request) {
    const state = yield select();
    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    if (!jwt) {
        // try to refresh token
        const {res, error} = yield call(fetchRefresh);

        // refresh token does not exist
        if (error) { // redirect to login page
            yield put(refreshActions.failure(error));
            yield put(actions.list.failure());
            yield put(signOut.success());
        }
        else {
            yield put(refreshActions.success(res));

            if (typeof window !== 'undefined') {
                const cookies = cookie.parse(window.document.cookie);
                if (cookies['header.payload']) {
                    jwt = cookies['header.payload'];
                }
            }

            if (!jwt) {
                yield put(actions.list.failure());
                yield put(signOut.success());
            }
            else {
                const f = () => fetchListApi(state.location.query, jwt);
                yield call(fetchListSaga(actions, f), request);
            }
        }
    }
    else {
        const f = () => fetchListApi(state.location.query, jwt);
        yield call(fetchListSaga(actions, f), request);
    }
}

function* manageTabs(tabIndex) {
    const state = yield select();
    const item = getItem(state, 'dataset');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({pkhash: item.key, url: item.description.storageAddress}));
        }
        else if (item.opener && !item.opener.content && tabIndex === 1) {
            yield put(actions.item.opener.request({pkhash: item.key, url: item.opener.storageAddress}));
        }
    }
}

function* fetchItem({payload}) {
    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    if (!jwt) {
        // try to refresh token
        const {res, error} = yield call(fetchRefresh);

        // refresh token does not exist
        if (error) { // redirect to login page
            yield put(refreshActions.failure(error));
            yield put(actions.item.failure());
            yield put(signOut.success());
        }
        else {
            yield put(refreshActions.success(res));

            if (typeof window !== 'undefined') {
                const cookies = cookie.parse(window.document.cookie);
                if (cookies['header.payload']) {
                    jwt = cookies['header.payload'];
                }
            }

            if (!jwt) {
                yield put(actions.item.failure());
                yield put(signOut.success());
            }
            else {
                yield call(fetchItemSaga(actions, fetchItemApi), {
                    payload: {
                        id: payload.key,
                        get_parameters: {},
                        jwt,
                    },
                });
            }
        }
    }
    else {
        yield call(fetchItemSaga(actions, fetchItemApi), {
            payload: {
                id: payload.key,
                get_parameters: {},
                jwt,
            },
        });
    }
}

function* fetchDetail(request) {
    const state = yield select();

    // fetch current tab content if needed
    yield manageTabs(state.dataset.item.tabIndex);

    const exists = state.dataset.item.results.find(o => o.pkhash === request.payload.key);
    if (!exists) {
        yield put(actions.item.request(request.payload));
    }
}

function* setTabIndexSaga({payload}) {
    yield manageTabs(payload);
}

function* fetchItemDescriptionSaga({payload: {pkhash, url}}) {
    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    if (!jwt) {
        // try to refresh token
        const {res, error} = yield call(fetchRefresh);

        // refresh token does not exist
        if (error) { // redirect to login page
            yield put(refreshActions.failure(error));
            yield put(actions.item.description.failure());
            yield put(signOut.success());
        }
        else {
            yield put(refreshActions.success(res));

            if (typeof window !== 'undefined') {
                const cookies = cookie.parse(window.document.cookie);
                if (cookies['header.payload']) {
                    jwt = cookies['header.payload'];
                }
            }

            if (!jwt) {
                yield put(actions.item.description.failure());
                yield put(signOut.success());
            }
            else {
                const {res, status} = yield call(fetchRaw, url, jwt);

                if (res && status === 200) {
                    yield put(actions.item.description.success({pkhash, desc: res}));
                }
            }
        }
    }
    else {
        const {res, status} = yield call(fetchRaw, url, jwt);
        if (res && status === 200) {
            yield put(actions.item.description.success({pkhash, desc: res}));
        }
    }
}

function* fetchItemOpenerSaga({payload: {pkhash, url}}) {
    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    if (!jwt) {
        // try to refresh token
        const {res, error} = yield call(fetchRefresh);

        // refresh token does not exist
        if (error) { // redirect to login page
            yield put(refreshActions.failure(error));
            yield put(actions.item.opener.failure());
            yield put(signOut.success());
        }
        else {
            yield put(refreshActions.success(res));

            if (typeof window !== 'undefined') {
                const cookies = cookie.parse(window.document.cookie);
                if (cookies['header.payload']) {
                    jwt = cookies['header.payload'];
                }
            }

            if (!jwt) {
                yield put(actions.item.opener.failure());
                yield put(signOut.success());
            }
            else {
                const {res, status} = yield call(fetchRaw, url, jwt);
                if (res && status === 200) {
                    yield put(actions.item.opener.success({pkhash, openerContent: res}));
                }
            }
        }
    }
    else {
        const {res, status} = yield call(fetchRaw, url, jwt);
        if (res && status === 200) {
            yield put(actions.item.opener.success({pkhash, openerContent: res}));
        }
    }
}

function* downloadItemSaga({payload: {url}}) {
    let status;
    let filename;

    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    if (!jwt) {
        const {res, error} = yield call(fetchRefresh);

        // refresh token does not exist
        if (error) { // redirect to login page
            yield put(refreshActions.failure(error));
            yield put(actions.item.download.failure());
            yield put(signOut.success());
        }
        else {
            yield put(refreshActions.success(res));

            if (typeof window !== 'undefined') {
                const cookies = cookie.parse(window.document.cookie);
                if (cookies['header.payload']) {
                    jwt = cookies['header.payload'];
                }
            }

            if (!jwt) {
                yield put(actions.item.download.failure());
                yield put(signOut.success());
            }
            else {
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
                        return response.text().then(result => Promise.reject(new Error(result)));
                    }

                    filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

                    return response.blob();
                }).then((res) => {
                    saveAs(res, filename);
                }, error => ({error, status}));
            }
        }
    }
    else {
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
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

            return response.blob();
        }).then((res) => {
            saveAs(res, filename);
        }, error => ({error, status}));
    }
}


/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItem),

        takeLatest(actionTypes.item.description.REQUEST, fetchItemDescriptionSaga),
        takeLatest(actionTypes.item.opener.REQUEST, fetchItemOpenerSaga),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSaga),

        takeLatest(actionTypes.order.SET, setOrderSaga),
        takeLatest(actionTypes.item.tabIndex.SET, setTabIndexSaga),
    ]);
};


export default sagas;
