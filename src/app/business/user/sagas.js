import {replace} from 'redux-first-router';
import {
    call, put, takeLatest, all,
} from 'redux-saga/effects';

import {
    signIn as signInActions,
    signOut as signOutActions,
    actionTypes,
} from './actions';

import {
    fetchSignIn as fetchSignInApi,
    fetchSignOut as fetchSignOutApi,
} from './api';

export const signIn = fetchSignIn => function* signInSaga({payload: {username, password, previousRoute}}) {
        const {error, res} = yield call(fetchSignIn, username, password);

        if (error) {
            console.error(error);
            yield put(signInActions.failure(error));
        }
        else {
            yield put(signInActions.success(res));

            // redirect
            const route = previousRoute;
            if (route.pathname === '') {
                route.pathname = '/';
            }
            replace(route);
        }
    };

export const signOut = fetchSignOut => function* signOutSaga() {
        const {error} = yield call(fetchSignOut);
        if (error) {
            console.error(error);
            yield put(signInActions.failure(error));
        }
        else {
            yield put(signOutActions.success());
            replace('/login');
        }
    };

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.signIn.REQUEST, signIn(fetchSignInApi)),
        takeLatest(actionTypes.signOut.REQUEST, signOut(fetchSignOutApi)),
    ]);
};

export default sagas;
