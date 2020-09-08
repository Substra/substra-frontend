/* globals fetch, window */

import {call, put, select} from 'redux-saga/effects';
import url from 'url';
import {replace} from 'redux-first-router';
import {omit} from 'lodash';
import {saveAs} from 'file-saver';
import cookie from 'cookie-parse';

import {fetchRaw} from '../../../entities/fetchEntities';
import {fetchRefresh} from '../../user/api';
import {refresh as refreshActions, signOut} from '../../user/actions';

const getJWTFromCookie = () => {
    let jwt;
    if (typeof window !== 'undefined') {
        const cookies = cookie.parse(window.document.cookie);
        if (cookies['header.payload']) {
            jwt = cookies['header.payload'];
        }
    }
    return jwt;
};


const tryRefreshToken = function* tryRefreshToken(action_error) {
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


export function withJWT(f, onErrorAction) {
    function* wrapper(...args) {
        let jwt = getJWTFromCookie();
        if (!jwt) {
            jwt = yield tryRefreshToken(onErrorAction);
        }

        if (jwt) {
            yield f(jwt, ...args);
        }
    }

    return wrapper;
}

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

export const fetchItemDescriptionSagaFactory = (actions) => {
    function* fetchItemDescriptionSaga(jwt, {payload: {key, url}}) {
        const {res, error, status} = yield call(fetchRaw, url, jwt);
        if (res && status === 200) {
            yield put(actions.success({key, desc: res}));
        }
        else {
            console.error(error, status);
            yield put(actions.failure({key, status}));
        }
    }

    return withJWT(fetchItemDescriptionSaga, actions.failure);
};

export const fetchItemSagaFactory = (actions, fetchItemApi) => {
    function* fetchItemSaga(jwt, {payload: {key}}) {
        const {error, status, item} = yield call(fetchItemApi, {}, key, jwt);

        if (error) {
            console.error(error, status);
            yield put(actions.failure(error));
            if (status === 401) {
                yield put(signOut.success());
            }
        }
        else {
            yield put(actions.success(item));
        }

        return item;
    }

    return withJWT(fetchItemSaga, actions.failure);
};

export const downloadItemSagaFactory = (actions) => {
    function* downloadItemSaga(jwt, {payload: {url}}) {
        let status;
        let filename;

        yield fetch(url, {
            headers: {
                Accept: 'application/json;version=0.0',
                ...(jwt ? {Authorization: `JWT ${jwt}`} : {}),
            },
            credentials: 'include',
            mode: 'cors',
        }).then((response) => {
            status = response.status;
            if (!response.ok) {
                return response.text().then((result) => Promise.reject(new Error(result)));
            }

            filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

            return response.blob();
        }).then((res) => {
            saveAs(res, filename);
        }, (error) => ({error, status}));
    }
    return withJWT(downloadItemSaga, actions.failure);
};

export const fetchListSagaFactory = (actions, fetchListApi) => {
    function* fetchListSaga(jwt) {
        const state = yield select();
        const {error, status, list} = yield call(fetchListApi, state.location.query, jwt);

        if (error) {
            console.error(error, status);
            yield put(actions.failure(error));
            if (status === 401) {
                yield put(signOut.success());
            }
        }
        else {
            yield put(actions.success(list));
        }
    }

    return withJWT(fetchListSaga, actions.failure);
};
