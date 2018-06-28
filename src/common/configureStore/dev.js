import {connectRoutes} from 'redux-first-router';
import {applyMiddleware, compose} from 'redux';
import {pick} from 'lodash';

import {createInjectSagasStore, sagaMiddleware, reloadSaga} from 'redux-sagas-injector';
import {combineReducersRecurse} from 'redux-reducers-injector';

import options from './options';
import rootSaga from '../../app/sagas';
import rootReducer from '../../app/reducer';
import DevTools from '../DevTools';
import routes from '../../app/routesMap';

const configureStore = (history, initialState) => {
    const {
        reducer, middleware, enhancer, thunk, initialDispatch,
    } = connectRoutes(history, routes, {
        initialDispatch: false,
        ...options,
    }); // yes, 5 redux aspects

    const enhancers = [
        // create the saga middleware
        applyMiddleware(sagaMiddleware, middleware),
        DevTools.instrument(),
    ];

    const reducers = {...rootReducer, location: reducer};
    // create an hmr initialState, when refreshing page, we do not want the injected reducers
    const hmrInitialState = pick(initialState, Object.keys(reducers));
    const store = createInjectSagasStore({rootSaga}, reducers, hmrInitialState, compose(enhancer, ...enhancers));
    initialDispatch();

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot) {
        module.hot.accept('../../app/reducer', () => {
            const nextRootReducer = require('../../app/reducer').default;
            const replacedReducers = {...store.injectedReducers, ...nextRootReducer, location: reducer};
            store.replaceReducer(combineReducersRecurse(replacedReducers));
        });

        module.hot.accept('../../app/sagas', () => {
            reloadSaga('rootSaga', require('../../app/sagas').default);
        });
    }

    return {store, thunk};
};

export default configureStore;
