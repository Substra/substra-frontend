import {takeLatest, all} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi} from '../api';
import {fetchListSaga, fetchPersistentSaga} from '../../../common/sagas';

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSaga(actions, fetchListApi)),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),
    ]);
};


export default sagas;
