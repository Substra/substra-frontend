import {call, put, takeLatest, all} from 'redux-saga/effects';

import actions, {actionTypes} from '../actions';
import {fetchListApi} from '../api';

function* fetchList({payload}) {
    const {error, item} = yield call(fetchListApi, payload);

    if (error) {
        yield put(actions.list.failure(error.body));
    }
    else {
        yield put(actions.list.success(item));
    }

    return item;
}

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
    ]);
};


export default sagas;
