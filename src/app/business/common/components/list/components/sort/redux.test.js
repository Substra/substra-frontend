import React from 'react';
import {Provider, connect} from 'react-redux';
import {
    createStore, applyMiddleware, combineReducers, compose, bindActionCreators,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {createAction} from 'redux-actions';
import {takeLatest, all} from 'redux-saga/effects';
import {connectRoutes} from 'redux-first-router';
import {createMemoryHistory as createHistory} from 'history';
import queryString from 'query-string';
import {render, fireEvent} from '@testing-library/react';

import {setOrderSaga} from '../../../../sagas';
import orderReducer from '../../../../reducers/order';

import ReduxSort from './redux';


const options = [
    {label: 'Label A', value: {by: 'by A', direction: 'direction A'}},
    {label: 'Label B', value: {by: 'by B', direction: 'direction B'}},
];

const reduxSetup = () => {
    // setup routes
    const routesMap = {
        DUMMY: '/dummyModel',
    };
    const connectedRoutes = connectRoutes(routesMap, {
        createHistory,
        querySerializer: queryString,
        initialEntries: ['/dummyModel'],
    });

    // setup actions
    const actionTypes = {
        order: {
            SET: 'DUMMY_MODEL_ORDER',
        },
    };

    const actions = {
        order: {set: createAction(actionTypes.order.SET)},
    };

    const orderReducerSpy = jest.fn(orderReducer(actionTypes));

    // setup sagas

    const setOrderSagaSpy = jest.fn(setOrderSaga);
    const sagas = function* sagas() {
        yield all([
            takeLatest(actionTypes.order.SET, setOrderSagaSpy),
        ]);
    };
    const sagaMiddleWare = createSagaMiddleware();

    // setup store
    const defaultState = {
        dummyModel: {
            order: {},
        },
    };
    const rootReducer = combineReducers({
        dummyModel: orderReducerSpy,
        location: connectedRoutes.reducer,
    });
    const middlewares = applyMiddleware(
        connectedRoutes.middleware,
        sagaMiddleWare,
    );
    const store = createStore(rootReducer, defaultState, compose(connectedRoutes.enhancer, middlewares));
    sagaMiddleWare.run(sagas);

    // mount component

    const mapDispatchToProps = dispatch => bindActionCreators({
        setOrder: actions.order.set,
    }, dispatch);

    const Wrapper = connect(null, mapDispatchToProps)(({setOrder}) => (
        <ReduxSort
            options={options}
            model="dummyModel"
            setOrder={setOrder}
        />
));

    const {container, getByText} = render(<Provider store={store}>
        <Wrapper />
    </Provider>);

    return {
        container, getByText, orderReducerSpy, setOrderSagaSpy, store, actionTypes,
    };
};

test('It updates location with new selected value', () => {
    const {
        container, getByText, orderReducerSpy, setOrderSagaSpy, store, actionTypes,
    } = reduxSetup();

    // simulate select new value
    const select = container.querySelector('select');
    expect(getByText('Label B')).toBeInTheDocument();
    fireEvent.change(select, {target: {value: options[1].label}});

    // make sure the event has been dispatched
    expect(orderReducerSpy).toHaveBeenCalledWith(
        {order: {}},
        {
            type: actionTypes.order.SET,
            payload: options[1].value,
        },
    );

    // make sure the saga has been triggered
    expect(setOrderSagaSpy).toHaveBeenCalledWith({type: actionTypes.order.SET, payload: options[1].value});

    // make sure the location has been updated
    expect(store.getState().location.query).toEqual({...options[1].value});
});
