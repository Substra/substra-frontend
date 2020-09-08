import {
    all, call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchItemApi, fetchListApi} from '../api';
import {
    setOrderSaga, fetchItemDescriptionSagaFactory, fetchListSagaFactory,
    fetchItemSagaFactory, downloadItemSagaFactory, withJWT,
} from '../../../common/sagas';
import {fetchRaw} from '../../../../entities/fetchEntities';
import {getItem} from '../../../common/selector';


function* fetchTabContentSaga({payload: tabIndex}) {
    const state = yield select();
    const item = getItem(state, 'dataset');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({key: item.key, url: item.description.storageAddress}));
        }
        else if (item.opener && !item.opener.content && tabIndex === 1) {
            yield put(actions.item.opener.request({key: item.key, url: item.opener.storageAddress}));
        }
    }
}

function* fetchDetailSaga({payload}) {
    const state = yield select();

    // fetch current tab content if needed
    yield put(actions.item.tabIndex.set(state.dataset.item.tabIndex));

    const exists = state.dataset.item.results.find((o) => o.key === payload.key);
    if (!exists) {
        yield put(actions.item.request(payload));
    }
}

function* innerFetchItemOpenerSaga(jwt, {payload: {key, url}}) {
    const {res, error, status} = yield call(fetchRaw, url, jwt);
    if (res && status === 200) {
        yield put(actions.item.opener.success({key, openerContent: res}));
    }
    else {
        console.error(error, status);
        yield put(actions.item.opener.failure({key, status}));
    }
}

const fetchItemOpenerSaga = withJWT(innerFetchItemOpenerSaga, actions.item.opener.failure);


/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSagaFactory(actions.list, fetchListApi)),
        takeLatest(actionTypes.list.SELECTED, fetchDetailSaga),
        takeLatest(actionTypes.persistent.REQUEST, fetchListSagaFactory(actions.persistent, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSagaFactory(actions.item, fetchItemApi)),

        takeLatest(actionTypes.item.description.REQUEST, fetchItemDescriptionSagaFactory(actions.item.description)),
        takeLatest(actionTypes.item.opener.REQUEST, fetchItemOpenerSaga),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSagaFactory(actions.item.download)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
        takeLatest(actionTypes.item.tabIndex.SET, fetchTabContentSaga),
    ]);
};


export default sagas;
