import {fork} from 'redux-saga/effects';
import searchSagas from './search/sagas';
import userSagas from './user/sagas';

/* istanbul ignore next */
export default function* () {
    yield fork(searchSagas);
    yield fork(userSagas);
}
