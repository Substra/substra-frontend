import {reloadSaga} from 'redux-sagas-injector';
import {reloadReducer} from 'redux-reducers-injector';

import Component from './components';

export sagas from './sagas';
export reducer from './reducers';

// Configure hot module replacement for the reducer
if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
        module.hot.accept('./reducers/index', () => {
            reloadReducer('model', require('./reducers/index').default);
        });
        module.hot.accept('./sagas/index', () => {
            reloadSaga('model', require('./sagas/index').default);
        });
    }
}

export default Component;
