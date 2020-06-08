import {
    takeLatest, takeEvery, all, select, call, put,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {
    fetchListApi, fetchStandardAlgoApi, fetchCompositeAlgoApi, fetchAggregateAlgoApi,
} from '../api';
import {
    setOrderSaga, fetchItemDescriptionSagaFactory, downloadItemSagaFactory, withJWT,
} from '../../../common/sagas';
import {getItem} from '../../../common/selector';

import {signOut} from '../../../user/actions';

const fetchItemApiByType = {
    composite: fetchCompositeAlgoApi,
    aggregate: fetchAggregateAlgoApi,
    standard: fetchStandardAlgoApi,
};

const withAlgoType = (list, type) => list.map((group) => group.map((algo) => ({...algo, type})));

function* innerFetchItemSaga(jwt, {payload: {key, type}}) {
    const {error, status, item} = yield call(fetchItemApiByType[type], {}, key, jwt);

    if (error) {
        console.error(error, status);
        yield put(actions.item.failure(error));
        if (status === 401) {
            yield put(signOut.success());
        }
    }
    else {
        yield put(actions.item.success(item));
    }

    return item;
}

const fetchItemSaga = withJWT(innerFetchItemSaga, actions.item.failure);

const fetchListSagaFactory = (actions) => {
    function* innerFetchListSaga(jwt) {
        const state = yield select();
        const [resStandardAlgos, resCompositeAlgos, resAggregateAlgos] = yield call(fetchListApi, state.location.query, jwt);
        const {error: errorStandardAlgos, status: statusStandardAlgos, list: listStandardAlgos} = resStandardAlgos;
        const {error: errorCompositeAlgos, status: statusCompositeAlgos, list: listCompositeAlgos} = resCompositeAlgos;
        const {error: errorAggregateAlgos, status: statusAggregateAlgos, list: listAggregateAlgos} = resAggregateAlgos;

        let list;

        if (errorStandardAlgos || errorCompositeAlgos || errorAggregateAlgos) {
            if (errorStandardAlgos) {
                console.error(errorStandardAlgos, statusStandardAlgos);
                yield put(actions.failure(errorStandardAlgos));
                if (statusStandardAlgos === 401) {
                    yield put(signOut.success());
                }
            }
            if (errorCompositeAlgos) {
                console.error(errorCompositeAlgos, statusCompositeAlgos);
                yield put(actions.failure(errorCompositeAlgos));
                if (statusCompositeAlgos === 401) {
                    yield put(signOut.success());
                }
            }
            if (errorAggregateAlgos) {
                console.error(errorAggregateAlgos, statusAggregateAlgos);
                yield put(actions.failure(errorAggregateAlgos));
                if (statusAggregateAlgos === 401) {
                    yield put(signOut.success());
                }
            }
        }
        else {
            list = [].concat(
                withAlgoType(listStandardAlgos, 'standard'),
                withAlgoType(listCompositeAlgos, 'composite'),
                withAlgoType(listAggregateAlgos, 'aggregate'),
            );
            yield put(actions.success(list));
        }

        return list;
    }
    return withJWT(innerFetchListSaga, actions.failure);
};

function* fetchTabContentSaga({payload: tabIndex}) {
    const state = yield select();
    const item = getItem(state, 'algo');

    if (item) {
        if (item.description && !item.description.content && tabIndex === 0) {
            yield put(actions.item.description.request({pkhash: item.key, url: item.description.storageAddress}));
        }
    }
}

function* fetchDetailSaga({payload}) {
    const state = yield select();

    // fetch current tab content if needed
    yield put(actions.item.tabIndex.set(state.algo.item.tabIndex));

    const exists = state.algo.item.results.find((o) => o.pkhash === payload.key);
    if (!exists) {
        yield put(actions.item.request(payload));
    }
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSagaFactory(actions.list)),
        takeLatest(actionTypes.list.SELECTED, fetchDetailSaga),
        takeLatest(actionTypes.persistent.REQUEST, fetchListSagaFactory(actions.persistent)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga),

        takeLatest(actionTypes.item.description.REQUEST, fetchItemDescriptionSagaFactory(actions.item.description)),

        takeEvery(actionTypes.item.download.REQUEST, downloadItemSagaFactory(actions.item.download)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
        takeLatest(actionTypes.item.tabIndex.SET, fetchTabContentSaga),
    ]);
};

export default sagas;
