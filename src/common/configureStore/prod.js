/* global window */
import {connectRoutes} from 'redux-first-router';
import {applyMiddleware, compose} from 'redux';
import {createInjectSagasStore, sagaMiddleware} from 'redux-sagas-injector';
import createRavenMiddleware from 'raven-for-redux';

import options from './options';
import rootReducer from '../../app/reducer';
import rootSaga from '../../app/sagas';
import routes from '../../app/routesMap';

const configureStore = (initialState, initialEntries, opts) => {
    const {
        reducer, middleware, enhancer, thunk, initialDispatch,
    } = connectRoutes(routes, {
        initialDispatch: false,
        ...options,
        initialEntries,
        ...opts,
    }); // yes, 5 redux aspects

    const middlewares = [
        sagaMiddleware,
        middleware,
    ];

    if (typeof window !== 'undefined' && window.Raven) {
        middlewares.push(createRavenMiddleware(window.Raven));
    }

    const enhancers = [
        // create the saga middleware
        applyMiddleware(...middlewares),
    ];

    const reducers = {...rootReducer, location: reducer};
    const store = createInjectSagasStore({rootSaga}, reducers, initialState, compose(enhancer, ...enhancers));
    initialDispatch();

    return {store, thunk};
};

export default configureStore;
