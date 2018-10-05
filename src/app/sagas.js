import {fork} from 'redux-saga/effects';
import searchSagas from './business/search/sagas';

/* istanbul ignore next */
export default function* () {
    yield fork(searchSagas);
}
