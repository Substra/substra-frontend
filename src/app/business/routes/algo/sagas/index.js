/* globals fetch window */

import {
    takeLatest, takeEvery, all, select, call, put,
} from 'redux-saga/effects';

import {saveAs} from 'file-saver';
import cookie from 'cookie-parse';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchStandardAlgoApi, fetchCompositeAlgoApi} from '../api';
import {
fetchPersistentSaga, fetchItemSaga, setOrderSaga,
} from '../../../common/sagas';
import {fetchRaw} from '../../../../entities/fetchEntities';
import {getItem} from '../../../common/selector';
import {signOut} from '../../../user/actions';

const withAlgoType = (list, type) => list.map(group => group.map(algo => ({...algo, type})));


const fetchListSaga = (actions, fetchListApi) => function* fetchList({payload}) {
    const [resStandardAlgos, resCompositeAlgos] = yield call(fetchListApi, payload);
    const {error: errorStandardAlgos, status: statusStandardAlgos, list: listStandardAlgos} = resStandardAlgos;
    const {error: errorCompositeAlgos, status: statusCompositeAlgos, list: listCompositeAlgos} = resCompositeAlgos;

    let list;

    if (errorStandardAlgos) {
        console.error(errorStandardAlgos, statusStandardAlgos);
        yield put(actions.list.failure(errorStandardAlgos));
    }
    else if (errorCompositeAlgos) {
        console.error(errorCompositeAlgos, statusCompositeAlgos);
        yield put(actions.list.failure(errorCompositeAlgos));
    }
    else {
        list = [].concat(
            withAlgoType(listStandardAlgos, 'standard'),
            withAlgoType(listCompositeAlgos, 'composite'),
        );
        yield put(actions.list.success(list));
    }

    return list;
};


function* fetchList(request) {
    const state = yield select();
    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    if (!jwt) { // redirect to login page
        yield put(actions.list.failure());
        yield put(signOut.success());
    }
    else {
        const f = () => fetchListApi(state.location.query, jwt);
        yield call(fetchListSaga(actions, f), request);
    }
}

function* manageTabs(tabIndex) {
    const state = yield select();
    const item = getItem(state, 'algo');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({pkhash: item.key, url: item.description.storageAddress}));
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
    if (!jwt) { // redirect to login page
        yield put(actions.item.failure());
        yield put(signOut.success());
    }
    else {
        const fetchItemApi = payload.type === 'composite' ? fetchCompositeAlgoApi : fetchStandardAlgoApi;
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
    let jwt;

    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }

    if (!jwt) { // redirect to login page
        yield put(actions.persistent.failure());
        yield put(signOut.success());
    }
    else {
        const f = () => fetchListApi(state.location.query, jwt);
        yield call(fetchPersistentSaga(actions, f), request);
    }
}


function* fetchDetail(request) {
    const state = yield select();

    // fetch current tab content if needed
    yield manageTabs(state.algo.item.tabIndex);

    const exists = state.algo.item.results.find(o => o.pkhash === request.payload.key);
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

    if (!jwt) { // redirect to login page
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

    if (!jwt) { // redirect to login page
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
