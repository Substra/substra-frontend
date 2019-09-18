import {fork} from 'redux-saga/effects';
import searchSagas from './business/search/sagas';
import userSagas from './business/user/sagas';

/* istanbul ignore next */
export default function* () {
    yield fork(searchSagas);
    yield fork(userSagas);
}
