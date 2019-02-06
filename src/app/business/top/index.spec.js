import React from 'react';
import {mount} from 'enzyme';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {
createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import {Provider} from 'react-redux';
import {connectRoutes} from 'redux-first-router';
import createHistory from 'history/createMemoryHistory';
import queryString from 'query-string';
import ReduxTop from './redux';

describe('Top', () => {
    const setupStore = () => {
        const routesMap = {
            HOME: '/',
            DUMMY: '/dummy',
        };
        const {reducer, middleware, enhancer} = connectRoutes(routesMap, {
            createHistory,
            querySerializer: queryString,
            initialEntries: ['/dummy?dummy=dummy'],
        });
        return createStore(combineReducers({location: reducer}), {}, compose(enhancer, applyMiddleware(middleware)));
    };

    it('keeps the query string when redirecting home', () => {
        const store = setupStore();
        const wrapper = mount(<Provider store={store}><ReduxTop /></Provider>);
        const homeLink = wrapper.find('a').first();

        expect(store.getState().location).include({
            type: 'DUMMY',
            pathname: '/dummy',
            search: 'dummy=dummy',
        });
        expect(store.getState().location.query).to.deep.equal({dummy: 'dummy'});

        // for some reason, homeLink.simulate('click') doesn't work
        // we have to use the onClick prop with the following event (found in the tests of react-first-router-link
        // without button: 0, the event doesn't work
        const event = {
            preventDefault: () => undefined,
            button: 0,
        };
        homeLink.props().onClick(event);

        expect(store.getState().location).to.include({
            type: 'HOME',
            pathname: '/',
            search: 'dummy=dummy',
        });
        expect(store.getState().location.query).to.deep.equal({dummy: 'dummy'});
    });
});
