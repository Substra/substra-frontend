/* globals window */

import {call, put, select} from 'redux-saga/effects';
import url from 'url';
import {replace} from 'redux-first-router';
import {omit} from 'lodash';
import cookie from 'cookie-parse';

import {fetchRefresh} from '../../user/api';
import {refresh as refreshActions, signOut} from '../../user/actions';

export const getJWTFromCookie = () => {
    let jwt;
    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }
    return jwt;
};


export const tryRefreshToken = function* tryRefreshToken(action_error) {
    // try to refresh token
    const {res, error} = yield call(fetchRefresh);

    // refresh token does not exist
    if (error) { // redirect to login page
        yield put(refreshActions.failure(error));
        yield put(action_error(error));
        yield put(signOut.success());
    }
    else {
        yield put(refreshActions.success(res));

        const jwt = getJWTFromCookie();

        if (!jwt) {
            yield put(action_error(error));
            yield put(signOut.success());
        }

        return jwt;
    }
};

export const fetchListSaga = (actions, fetchListApi) => function* fetchList({payload}) {
    const {error, status, list} = yield call(fetchListApi, payload);

    if (error) {
        console.error(error, status);
        yield put(actions.list.failure(error));
        if (status === 401) {
            yield put(signOut.success());
        }
    }
    else {
        yield put(actions.list.success(list));
    }

    return list;
};

export const fetchPersistentSaga = (actions, fetchPersistentApi) => function* fetchPersistent({payload}) {
    const {error, status, list} = yield call(fetchPersistentApi, payload);

    if (error) {
        console.error(error, status);
        yield put(actions.persistent.failure(error));
        if (status === 401) {
            yield put(signOut.success());
        }
    }
    else {
        yield put(actions.persistent.success(list));
    }

    return list;
};

export const fetchItemSaga = (actions, fetchItemApi) => function* fetchItem({payload}) {
    const {id, get_parameters, jwt} = payload;

    const {error, status, item} = yield call(fetchItemApi, get_parameters, id, jwt);

    if (error) {
        console.error(error, status);
        yield put(actions.item.failure(error));
        if (status === 401) {
            yield put(signOut.success());
        }
    }
    else {
        yield put(actions.item.success(item));
    }

    return item;
};

export const setOrderSaga = function* setOrderSaga({payload}) {
    const state = yield select();

    const {location} = state;

    const newUrl = url.format({
        pathname: location.pathname,
        query: {
            ...location.query,
            ...omit(payload, ['pristine']),
        },
    });

    replace(newUrl);
};

export default {
    fetchListSaga,
    fetchPersistentSaga,
    fetchItemSaga,
    setOrderSaga,
    getJWTFromCookie,
    tryRefreshToken,
};
