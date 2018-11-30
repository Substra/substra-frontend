import React from 'react';
import PropTypes from 'prop-types';

import {reloadSaga, reloadReducer} from 'redux-sagas-injector';

import Component from '../components/index';

export sagas from '../sagas/index';
export reducer from '../reducers/index';

export const C = ({model}) => {
    // Configure hot module replacement
    if (module.hot) {
        module.hot.accept('../reducers/index', () => {
            reloadReducer(model, require('../reducers/index').default);
        });
        module.hot.accept('../sagas/index', () => {
            reloadSaga(model, require('../sagas/index').default);
        });
    }

    return <Component />;
};

C.defaultProps = {
    model: '',
};

C.propTypes = {
    model: PropTypes.string,
};

export default C;
