import React from 'react';
import {
    createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import {Provider} from 'react-redux';
import {connectRoutes} from 'redux-first-router';
import createHistory from 'history/createMemoryHistory';
import queryString from 'query-string';
import {render, fireEvent} from '@testing-library/react';
import ReduxTop from './redux';

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

test('It keeps the query string when redirecting home', () => {
    const store = setupStore();
    const {getByTestId} = render(<Provider store={store}><ReduxTop /></Provider>);
    const homeLink = getByTestId('homelink');

    expect(store.getState().location).toMatchObject({
        type: 'DUMMY',
        pathname: '/dummy',
        search: 'dummy=dummy',
    });
    expect(store.getState().location.query).toEqual({dummy: 'dummy'});

    fireEvent.click(homeLink);

    expect(store.getState().location).toMatchObject({
        type: 'HOME',
        pathname: '/',
        search: 'dummy=dummy',
    });
    expect(store.getState().location.query).toEqual({dummy: 'dummy'});
});
