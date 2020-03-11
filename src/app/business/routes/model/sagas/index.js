import {
    takeLatest, takeEvery, all, put, select,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {
    setOrderSaga, fetchItemSagaFactory, fetchListSagaFactory,
} from '../../../common/sagas';

import {listResults, itemResults} from '../selector';


function* fetchDetailSaga({payload}) {
    const modelDetailList = yield select(itemResults, 'model');

    const item = modelDetailList.find((o) => o.traintuple.key === payload.traintuple.key);

    if (!item) {
        yield put(actions.item.success(payload));
    }
}

function* fetchBundleDetailSaga() {
    const modelGroups = yield select(listResults, 'model');
    const modelDetailList = yield select(itemResults, 'model');

    for (const group of modelGroups) {
        const models = group.filter((model) => model.traintuple && model.traintuple.tag);
        for (const model of models) {
            const modelDetail = modelDetailList.find((o) => o.traintuple.key === model.traintuple.key);
            if (!modelDetail) {
                yield put(actions.item.request({key: model.traintuple.key}));
            }
        }
    }
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSagaFactory(actions.list, fetchListApi)),
        takeLatest(actionTypes.list.SUCCESS, fetchBundleDetailSaga),
        takeLatest(actionTypes.list.SELECTED, fetchDetailSaga),
        takeLatest(actionTypes.persistent.REQUEST, fetchListSagaFactory(actions.persistent, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSagaFactory(actions.item, fetchItemApi)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
    ]);
};

export default sagas;
