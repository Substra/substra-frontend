import React from 'react';
import PropTypes from 'prop-types';
import universal from 'react-universal-component';
import {injectReducer} from 'redux-reducers-injector';
import {injectSaga} from 'redux-sagas-injector';

import {PulseLoader} from 'react-spinners';

import {coolBlue} from '../../../../../assets/css/variables/index';

// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const Universal = ({model}) => {
    const U = universal(import(`../../routes/${model}/preload/index`), {
        loading: <PulseLoader size={6} color={coolBlue} />,
        onLoad: (module, info, props, context) => {
            injectSaga(model, module.sagas, false, context.store);
            injectReducer(model, module.reducer, false, context.store);
        },
        ignoreBabelRename: true,
    });

    return <U model={model} />;
};

Universal.defaultProps = {
    model: '',
};

Universal.propTypes = {
    model: PropTypes.string,
};

export default Universal;
