import {
    takeLatest, takeEvery, all, put, select, call,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {
    fetchListSaga, fetchPersistentSaga, getJWTFromCookie, setOrderSaga, tryRefreshToken,
} from '../../../common/sagas';

import {listResults, itemResults} from '../selector';
import {signOut} from '../../../user/actions';

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

function* fetchDetail({payload}) {
    const modelDetailList = yield select(itemResults, 'model');

    const item = modelDetailList.find((o) => o.traintuple.key === payload.traintuple.key);

    if (!item) {
        yield put(actions.item.success(payload));
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

function* fetchBundleDetail() {
    const modelGroups = yield select(listResults, 'model');
    const modelDetailList = yield select(itemResults, 'model');

    for (const group of modelGroups) {
        const models = group.filter((model) => model.traintuple && model.traintuple.tag);
        for (const model of models) {
            const modelDetail = modelDetailList.find((o) => o.traintuple.key === model.traintuple.key);
            if (!modelDetail) {
                yield put(actions.item.request({id: model.traintuple.key}));
            }
        }
    }
}

export const fetchItemSaga = (actions, fetchItemApi) => function* fetchItem({payload}) {
    const {id, get_parameters} = payload;

    let jwt = getJWTFromCookie();
    if (!jwt) {
        jwt = yield tryRefreshToken(actions.item.failure);
    }

    if (jwt) {
        const {error, status, list} = yield call(fetchItemApi, get_parameters, id, jwt);

        if (error) {
            console.error(error, status);
            yield put(actions.item.failure(error));
            if (status === 401) {
                yield put(signOut.success());
            }
        }
        else {
            yield put(actions.item.success(list));
        }

        return list;
    }
};

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.list.SUCCESS, fetchBundleDetail),
        takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistent),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga(actions, fetchItemApi)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
    ]);
};

export default sagas;
