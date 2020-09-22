import {
    takeLatest, takeEvery, all, select, put, call,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi, fetchItemLeaderboardApi} from '../api';
import {
    setOrderSaga,
    fetchItemDescriptionSagaFactory, fetchListSagaFactory, fetchItemSagaFactory, downloadItemSagaFactory, withJWT,
} from '../../../common/sagas';
import {getItem} from '../../../common/selector';


function* fetchTabContentSaga({payload: tabIndex}) {
    const state = yield select();
    const item = getItem(state, 'objective');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({key: item.key, url: item.description.storage_address}));
        }
        if (!item.leaderboard && tabIndex === 3) {
            yield put(actions.item.leaderboard.request({key: item.key}));
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

function* innerFetchItemLeaderboardSaga(jwt, {payload: {key}}) {
    const {res, error, status} = yield call(fetchItemLeaderboardApi, key, jwt);
    if (res && status === 200) {
        yield put(actions.item.leaderboard.success({key, leaderboard: res.testtuples}));
    }
    else {
        console.error(error, status);
        yield put(actions.item.leaderboard.failure({key, status}));
    }
}

const fetchItemLeaderboardSaga = withJWT(innerFetchItemLeaderboardSaga, actions.item.leaderboard.failure);

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSagaFactory(actions.list, fetchListApi)),
        takeLatest(actionTypes.list.SELECTED, fetchDetailSaga),
        takeLatest(actionTypes.persistent.REQUEST, fetchListSagaFactory(actions.persistent, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSagaFactory(actions.item, fetchItemApi)),
        takeLatest(actionTypes.item.description.REQUEST, fetchItemDescriptionSagaFactory(actions.item.description)),

        takeLatest(actionTypes.item.leaderboard.REQUEST, fetchItemLeaderboardSaga),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSagaFactory(actions.item.download)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
        takeLatest(actionTypes.item.tabIndex.SET, fetchTabContentSaga),
    ]);
};


export default sagas;
