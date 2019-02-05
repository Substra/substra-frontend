import {describe, it} from 'mocha';
import chai, {expect} from 'chai';
import React from 'react';
import {
createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {createAction} from 'redux-actions';
import {Provider} from 'react-redux';
import {takeLatest, all} from 'redux-saga/effects';
import {connectRoutes} from 'redux-first-router';
import createHistory from 'history/createMemoryHistory';
import queryString from 'query-string';
import {mount} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {setOrderSaga} from '../../../sagas';
import orderReducer from '../../../reducers/order';

import {Sort, URLSyncedSort, ReduxURLSyncedSort} from './sort';

chai.use(sinonChai);

describe('Sort, URLSyncedSort, ReduxURLSyncedSort', () => {
    const options = [
        {label: 'Label A', value: {by: 'by A', direction: 'direction A'}},
        {label: 'Label B', value: {by: 'by B', direction: 'direction B'}},
    ];

    const setup = () => {
        const setOrder = sinon.spy();
        const wrapper = mount(<Sort options={options} setOrder={setOrder} />);
        return {wrapper, setOrder, options};
    };

    it('calls setOrder with new selected value', () => {
        const {wrapper, setOrder, options} = setup();

        // select exists and has both options
        expect(wrapper.exists('select')).to.be.true;
        const optionWrappers = wrapper.find('option');
        expect(optionWrappers).to.have.lengthOf(2);
        expect(optionWrappers.at(0).text()).to.equal('Label A');
        expect(optionWrappers.at(1).text()).to.equal('Label B');

        // select is passed to setOrder
        const select = wrapper.find('select');
        select.simulate('change', {target: {value: optionWrappers.get(0).props.value}});
        expect(setOrder).to.have.been.calledOnceWith(options[0].value);
    });

    it('selects the default value', () => {
        const {wrapper, options} = setup();

        expect(wrapper.find('select').props().value).to.equal('');

        wrapper.setProps({current: options[0]});
        expect(wrapper.find('select').props().value).to.equal(options[0].label);

        wrapper.setProps({current: options[1]});
        expect(wrapper.find('select').props().value).to.equal(options[1].label);
    });

    it('syncs with the location at mount', () => {
        let setOrder,
location;

        setOrder = sinon.spy();
        location = {query: {by: 'by A', direction: 'direction A'}};
        mount(<URLSyncedSort options={options} setOrder={setOrder} location={location} />);
        expect(setOrder).to.have.been.calledOnceWith({by: 'by A', direction: 'direction A'});

        setOrder = sinon.spy();
        location = {};
        mount(<URLSyncedSort options={options} setOrder={setOrder} location={location} />);
        expect(setOrder).to.have.not.been.called;
    });

    it('updates location with new selected value', () => {
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

        const wrapper = mount(<Provider store={store}><ReduxURLSyncedSort options={options} model="dummyModel" actions={actions} /></Provider>);

        // simulate select new value
        const select = wrapper.find('select');
        const optionWrappers = wrapper.find('option');
        select.simulate('change', {target: {value: optionWrappers.get(1).props.value}});

        // make sure the event has been dispatched
        expect(orderReducerSpy).to.have.been.calledWith({order: {}}, {type: actionTypes.order.SET, payload: options[1].value});

        // make sure the saga has been triggered
        expect(setOrderSagaSpy).to.have.been.calledWith({type: actionTypes.order.SET, payload: options[1].value});

        // make sure the location has been updated
        expect(store.getState().location.query).to.deep.equal({...options[1].value});
    });
});
