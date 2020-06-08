import {
    takeLatest, takeEvery, all, put, select,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {
    setOrderSaga, fetchItemSagaFactory, fetchListSagaFactory,
} from '../../../common/sagas';

import {itemResults} from '../selector';


function* fetchDetailSaga({payload}) {
    const modelDetailList = yield select(itemResults, 'model');

    const exists = modelDetailList.find((o) => o.traintuple.key === payload.traintuple.key);

    if (!exists) {
        yield put(actions.item.request({key: payload.traintuple.key}));
    }
}


/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSagaFactory(actions.list, fetchListApi)),
        takeLatest(actionTypes.list.SELECTED, fetchDetailSaga),
        takeLatest(actionTypes.persistent.REQUEST, fetchListSagaFactory(actions.persistent, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSagaFactory(actions.item, fetchItemApi)),

        takeLatest(actionTypes.order.SET, setOrderSaga),
    ]);
};

export default sagas;
