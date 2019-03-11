import {describe, it} from 'mocha';
import chai, {expect} from 'chai';
import React from 'react';
import {Provider, connect} from 'react-redux';
import {
    createStore, applyMiddleware, combineReducers, compose, bindActionCreators,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {createAction} from 'redux-actions';
import {takeLatest, all} from 'redux-saga/effects';
import {connectRoutes} from 'redux-first-router';
import createHistory from 'history/createMemoryHistory';
import queryString from 'query-string';
import {mount} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {setOrderSaga} from '../../../../sagas';
import orderReducer from '../../../../reducers/order';

import ReduxSort from './redux';

chai.use(sinonChai);

describe('ReduxSort', () => {
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

        const orderReducerSpy = sinon.spy(orderReducer(actionTypes));

        // setup sagas

        const setOrderSagaSpy = sinon.spy(setOrderSaga);
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

        const Wrapper = connect(null, mapDispatchToProps)(({setOrder}) => <ReduxSort options={options} model="dummyModel" setOrder={setOrder} />);

        const wrapper = mount(<Provider store={store}>
            <Wrapper />
        </Provider>);

        return {
            wrapper, orderReducerSpy, setOrderSagaSpy, store, actionTypes,
        };
    };

    it('updates location with new selected value', () => {
        const {
            wrapper, orderReducerSpy, setOrderSagaSpy, store, actionTypes,
        } = reduxSetup();

        // simulate select new value
        const select = wrapper.find('select');
        const optionWrappers = wrapper.find('option');
        select.simulate('change', {target: {value: optionWrappers.get(1).props.value}});

        // make sure the event has been dispatched
        expect(orderReducerSpy).to.have.been.calledWith({order: {}}, {
            type: actionTypes.order.SET,
            payload: options[1].value,
        });

        // make sure the saga has been triggered
        expect(setOrderSagaSpy).to.have.been.calledWith({type: actionTypes.order.SET, payload: options[1].value});

        // make sure the location has been updated
        expect(store.getState().location.query).to.deep.equal({...options[1].value});
    });
});
