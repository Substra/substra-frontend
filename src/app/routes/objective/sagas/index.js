import {
    takeLatest, takeEvery, all, select, put,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {
    setOrderSaga,
    fetchItemDescriptionSagaFactory, fetchListSagaFactory, fetchItemSagaFactory, downloadItemSagaFactory,
} from '../../../common/sagas';
import {getItem} from '../../../common/selector';


function* fetchTabContentSaga({payload: tabIndex}) {
    const state = yield select();
    const item = getItem(state, 'objective');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({key: item.key, url: item.description.storage_address}));
        }
    }
}

function* fetchDetailSaga({payload: {key}}) {
    const state = yield select();

    // fetch current tab content if needed
    yield put(actions.item.tabIndex.set(state.objective.item.tabIndex));

    const exists = state.objective.item.results.find((o) => o.key === key);
    if (!exists) {
        yield put(actions.item.request({key}));
    }
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSagaFactory(actions.list, fetchListApi)),
        takeLatest(actionTypes.list.SELECTED, fetchDetailSaga),
        takeLatest(actionTypes.persistent.REQUEST, fetchListSagaFactory(actions.persistent, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSagaFactory(actions.item, fetchItemApi)),
        takeLatest(actionTypes.item.description.REQUEST, fetchItemDescriptionSagaFactory(actions.item.description)),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSagaFactory(actions.item.download)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
        takeLatest(actionTypes.item.tabIndex.SET, fetchTabContentSaga),
    ]);
};


export default sagas;
