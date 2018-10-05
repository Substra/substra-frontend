import {call, put} from 'redux-saga/effects';


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

export default {
    fetchListSaga,
    fetchPersistentSaga,
    fetchItemSaga,
};
