import {call, put, select} from 'redux-saga/effects';
import url from 'url';
import {replace} from 'redux-first-router';
import {omit} from 'lodash';


export const fetchListSaga = (actions, fetchListApi) => function* fetchList({payload}) {
    const {error, status, list} = yield call(fetchListApi, payload);

    if (error) {
        console.error(error, status);
        yield put(actions.list.failure(error));
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
};
