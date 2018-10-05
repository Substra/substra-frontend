import {takeLatest, all} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi} from '../api';
import {fetchListSaga} from '../../../common/sagas/index';

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchListSaga(actions, fetchListApi)),
    ]);
};


export default sagas;
