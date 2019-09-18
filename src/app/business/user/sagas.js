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
    removeLocalUser as removeLocalUserApi,
    storeLocalUser as storeLocalUserApi,
} from './api';

export const signIn = (fetchSignIn, storeLocalUser) => function* signInSaga({payload: {username, password, previousRoute}}) {
        const {error, res} = yield call(fetchSignIn, username, password);

        if (error) {
            console.error(error);
            yield put(signInActions.failure(error));
        }
        else {
            yield call(storeLocalUser, res);
            yield put(signInActions.success(res));

            const route = previousRoute;
            if (route.pathname === '') {
                route.pathname = '/';
            }

            // redirect
            replace(route);
        }
    };

export const signOut = (fetchSignOut, removeLocalUser) => function* signOutSaga() {
        const {error} = yield call(fetchSignOut);
        if (error) {
            console.error(error);
            yield put(signInActions.failure(error));
        }
        else {
            yield call(removeLocalUser);
            yield put(signOutActions.success());
            replace({type: 'HOME'});
        }
    };

/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.signIn.REQUEST, signIn(fetchSignInApi, storeLocalUserApi)),
        takeLatest(actionTypes.signOut.REQUEST, signOut(fetchSignOutApi, removeLocalUserApi)),
    ]);
};


export default sagas;
