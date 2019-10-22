/* globals window */

import {replace} from 'redux-first-router';
import {
    call, put, takeLatest, all,
} from 'redux-saga/effects';

import {
    signIn as signInActions,
    refresh as refreshActions,
    signOut as signOutActions,
    actionTypes,
} from './actions';

import {
    fetchSignIn as fetchSignInApi,
    fetchRefresh as fetchRefreshApi,
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

export const refresh = fetchRefresh => function* signInSaga() {
    if (typeof window !== 'undefined') {
        const {error, res} = yield call(fetchRefresh);

        if (error) {
            console.error(error);
            yield put(refreshActions.failure(error));
        }
        else {
            yield put(refreshActions.success(res));
        }
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
        takeLatest(actionTypes.refresh.REQUEST, refresh(fetchRefreshApi)),
        takeLatest(actionTypes.signOut.REQUEST, signOut(fetchSignOutApi)),
    ]);
};

export default sagas;
