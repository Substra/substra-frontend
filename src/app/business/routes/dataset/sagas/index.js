import {
takeLatest, all, select, call,
} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi} from '../api';
import {fetchListSaga, fetchPersistentSaga} from '../../../common/sagas';

function* fetchList(request) {
    const state = yield select();

    console.log('fetch dataset');

    const f = () => fetchListApi(state.location.query);

    yield call(fetchListSaga(actions, f), request);
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),
    ]);
};


export default sagas;
